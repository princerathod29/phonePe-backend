const User = require("../models/UserModels");
const Transaction = require("../models/Transaction");
const bcrypt = require("bcryptjs");

const addMoney = async (req, res) => {
    try{
        const { amount } = req.body;    
        const userId = req.user._id;
        if(amount <= 0){
            return res.status(400).json({ message: "Amount should be valid" });
        }
        const user = await User.findById(userId);
        user.balance += amount;
        await user.save();
        //  log addition as a transaction
        const transaction = await Transaction.create({
            sender: userId,
            type: "ADD_MONEY",
            amount,
            status: "SUCCESS",
        });
        res.status(200).json({ message: "Money added successfully", transaction });
    } catch (error) {
        res.status(500).json({ message: "Error adding money", error });
    }
};

const payBill = async (req, res) => {
    try{
        const { billerName, amount , mpin} = req.body;
        const userId = req.user._id;
        if(!mpin){
            return res.status(400).json({ message: "mpin is required"});
        }
        const user = await User.findById(userId);
        // verify mpin 
        if(!user.mpin) {
            return res.status(400).json({ message: "please setup mpin first" });
        }
        const isMpinValid = await bcrypt.compare(mpin.toString(), user.mpin);
        if(!isMpinValid){
            return res.status(401).json({ message: "in correct mpin" });
        }
        if(user.balance < amount){
            return res.status(400).json({ message: "insufficient balance" });
        }

        // deduct amount from user balance
        user.balance -= amount;
        await user.save();
        // log bill payment as a transaction
        const transaction = await Transaction.create({
            sender: userId,
            type: "BILL_PAY",
            amount,
            status: "SUCCESS",
        });
        res.status(200).json({ message: "Bill payment successful", transaction });
    } catch (error) {
        res.status(500).json({ message: "Error paying bill", error });
        console.error("Error paying bill:", error);
    }
};

module.exports = {
    addMoney,
    payBill,
};