const Transaction = require("../models/Transaction");
const User = require("../models/UserModels");
const bcrypt = require("bcryptjs");

const sendMoney = async (req, res) => {
  try {
    const { phone, amount, mpin } = req.body;
    const senderId = req.user._id;
    if (!mpin) {
      return res.status(400).json({ message: "Please enter mpin" });
    }
    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be greater than zero" });
    }
    const sender = await User.findById(senderId);
    // if(!sender){
    //     return res.status(404).json({ message: "Sender not found" });
    // }
    if (!sender.mpin) {
      return res
        .status(400)
        .json({ message: "Please set mpin before sending money" });
    }
    const isMpinValid = await bcrypt.compare(mpin, sender.mpin);
    if (!isMpinValid) {
      return res.status(401).json({ message: "Invalid mpin" });
    }
    const receiver = await User.findOne({
      $or: [{ phone: phone }, { upiId: phone }],
    });
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }
    if (senderId.toString() === receiver._id.toString()) {
      return res.status(400).json({ message: "Cannot send money to yourself" });
    }
    if (sender.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();
    // Create transaction record
    const transaction = await Transaction.create({
      sender: senderId,
      receiver: receiver._id,
      type: "TRANSFER",
      amount,
      status: "SUCCESS",
    });
    res.status(201).json({
      message: "Money sent successfully",
      transaction,
      newBalance: sender.balance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error("Error sending money:", error);
  }
};
const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name email phone")
      .populate("receiver", "name email phone")
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMoney, getTransactionHistory };
