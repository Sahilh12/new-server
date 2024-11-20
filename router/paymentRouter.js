const express = require('express');
const Razorpay = require('razorpay')
const crypto = require('crypto')
const Payment = require('../models/payment')
const router = express.Router();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

router.post('/order', (req, res) => {
    const { amount } = req.body;
    try {
        const options = {
            amount: Number(Math.round(amount)),
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        }

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) { 
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.status(200).json({ data: order });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" }); 
    }
})

router.get('/get-payment', (req, res) => {
    res.json("Payment Details");
})

router.post('/verify', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex");

        const isAuthentic = expectedSign === razorpay_signature;

        if (isAuthentic) {
            const payment = new Payment({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            });

            // Save Payment 
            await payment.save();

            // Send Message 
            res.json({
                message: "Payement Successfully"
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" }); 
    }
})


module.exports = router