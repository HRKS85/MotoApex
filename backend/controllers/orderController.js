const Order = require('../models/Order');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Payment Intent (Cards + UPI / QR)
exports.createPaymentIntent = async (req, res) => {
  const { amount } = req.body; // In INR (or local currency)
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to paise/cents
      currency: 'inr',
      automatic_payment_methods: { enabled: true }, // enables UPI, Cards, NetBanking via Stripe Elements
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create New Order (COD or Paid via Stripe)
exports.createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, paymentResult, totalAmount } = req.body;

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    paymentResult: paymentMethod === 'Stripe' ? paymentResult : { status: 'COD Pending' },
    totalAmount,
    isPaid: paymentMethod === 'Stripe',
    paidAt: paymentMethod === 'Stripe' ? Date.now() : null,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
};