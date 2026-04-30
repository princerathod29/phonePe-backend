const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,    
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    type:{
        type: String,
        enum: ['TRANSFER', 'ADD_MONEY', 'WITHDRAW', 'BILL_PAY'],
        default: 'TRANSFER',
    },
    billerName: {
        type: String,

    },
    amount:{
        type: Number,
        required: true,
    },
    status:{
        type: String,
        enum: ['SUCCESS', 'FAILED', 'PENDING'],
        default: 'SUCCESS',
    },

}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;