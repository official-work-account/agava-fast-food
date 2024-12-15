import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
// import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import { calcPrices } from "../utils/calcPrices.js";
import { verifyPayPalPayment, checkIfNewTransaction } from "../utils/paypal.js";
import paystackApi from "paystack-api";
import chargeSuccess from "../helpers/webhookHelper.js";
// import { nanoid } from "nanoid";

// const reference = nanoid(15);

// const paystackSecretKey = process.env.PAYSTACK_TEST_SECRET_KEY; // For test mode
const paystackSecretKey = process.env.PAYSTACK_LIVE_SECRET_KEY; // For live mode
const paystack = paystackApi(paystackSecretKey);

// NOTE:
// @desc            Create new order
// @route           POST /api/orders
// @access          Private
// asyncHandler:    allows us to avoid using try/catch block for async functions (async functions returns a promise).
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    // get the ordered items from our database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // map over the order items and use the price from our items from database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    // calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      // reference: nanoid(15),
    });

    // console.log("Transaction reference: " + reference);
    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// NOTE:
// @desc            Get logged in user order
// @route           GET /api/orders/myorders
// @access          Private
const getMyOrders = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Order.countDocuments({ user: req.user._id });

  const orders = await Order.find({ user: req.user._id })
    .sort({
      createdAt: "desc",
    })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.status(200).json({ orders, page, pages: Math.ceil(count / pageSize) });
});

// NOTE:
// @desc            Get order by ID
// @route           GET /api/orders/:id
// @access          Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// NOTE:
// @desc            Update order to paid for live PayPal button
// @route           PUT /api/orders/:id/pay
// @access          Private
// const updateOrderToPaid = asyncHandler(async (req, res) => {
//   const { verified, value } = await verifyPayPalPayment(req.body.id);
//   if (!verified) throw new Error("Payment not verified");

//   // check if this transaction has been used before
//   const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
//   if (!isNewTransaction) throw new Error("Transaction has been used before");

//   const order = await Order.findById(req.params.id);

//   if (order) {
//     // check the correct amount was paid
//     const paidCorrectAmount = order.totalPrice.toString() === value;
//     if (!paidCorrectAmount) throw new Error("Incorrect amount paid");

//     order.isPaid = true;
//     order.paidAt = Date.now();
//     order.paymentResult = {
//       id: req.body.id,
//       status: req.body.status,
//       update_time: req.body.update_time,
//       email_address: req.body.payer.email_address,
//     };

//     const updatedOrder = await order.save();

//     res.json(updatedOrder);
//   } else {
//     res.status(404);
//     throw new Error("Order not found");
//   }
// });

// NOTE:
// @desc            Update order to paid for "Test Pay Now" button
// @route           PUT /api/orders/:id/pay
// @access          Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// NOTE:
// @desc            Update order to delivered
// @route           PUT /api/orders/:id/delivered
// @access          Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updateOrder = await order.save();

    res.status(200).json(updateOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// NOTE:
// @desc            Get all orders
// @route           GET /api/orders/
// @access          Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Order.countDocuments();
  // const pages = Math.ceil(count / pageSize);

  const orders = await Order.find({})
    .sort({ createdAt: "desc" })
    .populate("user", "id name")
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // console.log({ pageSize: pageSize, count: count, pages: pages });
  res.status(200).json({ orders, page, pages: Math.ceil(count / pageSize) });
});

// NOTE:
// @desc            Get Paystack access code
// @route           GET /api/orders/:id/getcode
// @access          Private
const getAccessCode = asyncHandler(async (req, res) => {
  let orderId = req.params.id; // Note: 2nd way to get id: let { id } = req.params;

  const order = await Order.findById(orderId);

  res.status(200).json(order.paystack_access_code);
});

// NOTE:
// @desc            Find reference code
// @route           GET /api/orders/:id/getreference
// @access          Private/Admin
const getReferenceCode = asyncHandler(async (req, res) => {
  let orderId = req.params.id; // Note: 2nd way to get id: let { id } = req.params;

  const order = await Order.findById(orderId);
  const orderReference = order.reference;

  const result = await Order.find({ reference: orderReference });
  const numberOfOrdersFound = result.length;

  res.status(200).json({ numbeOfOrdersFound: result.length, result });
});

// NOTE:
// @desc            Initiate Paystack Payment
// @route           GET /api/orders/:id/initiateTransaction
// @access          Private
const initializeTrans = asyncHandler(async function (req, res) {
  // Note: get ordedId
  let orderId = req.params.id; // Note: 2nd way to get id: let { id } = req.params;

  // Note: find order using orderId
  const order = await Order.findById(orderId).populate("user", "name email");

  if (order) {
    const email = order.user.email;
    const amount = Math.trunc(order.totalPrice * 100); // passes amount to paystack initialize function without decimals, if any
    const callback_url = "https://agavafastfood.onrender.com/thankyou";

    const channels = ["card", "mobile_money"];

    // console.log("order amount: " + amount);

    const response = await paystack.transaction.initialize({
      email,
      amount,
      channels,
      callback_url,
    });

    order.reference = response.data.reference;
    order.paystack_access_code = response.data.access_code;

    const updatedOrder = await order.save();

    res.status(200).json(response);
  } else {
    res.status(404);
    throw new Error("Order not found. Can't initialize payment.");
  }

  // const data = {
  //   paystack_ref: response.data.reference,
  //   access_code: response.data.access_code,
  // };
});

// NOTE:
// @desc            Verify Paystack Payment to see is payment details & whether payment was successful
// @route           GET /api/orders/verifyTransaction/:id
// @access          Private
const verifyTrans = async function (req, res) {
  try {
    let { id } = req.params;

    const userOrder = await Order.findById(id);
    // console.log(userOrder);

    // Handles a situation where the transaction has already been verified
    if (userOrder.paystack_transaction_status == "success") {
      return res.status(401).send({
        data: {},
        message: "Transaction has been verified",
        status: 1,
      });
    }

    const response = await paystack.transaction.verify({
      reference: userOrder.paystack_ref,
    });

    if (response.data.status == "success") {
      const data = {
        paystack_transaction_status: response.data.status,
        amountDonated: response.data.amount / 100,
      };

      // console.log(data);

      await Order.findByIdAndUpdate(id, data);

      return res.status(200).send({
        data: response.data,
        message: response.message,
        status: response.status,
      });
    } else {
      return res.send({
        message: response.message,
        status: response.status,
      });
    }
  } catch (err) {
    res.status(400).send({ data: {}, error: `${err.message}`, status: 1 });
  }
};

// NOTE:
// @desc1           Code useful for all events, where subscription to listen for other events
// @desc2           Webhook function triggered when our app gets notice of an event on paystack.
// @desc2           Webhook event is sent to our webhook route.
// @route           GET /api/orders/paystackWebhook
// @access          Private
// WEBHOOK EXPLAINED: A webhook is similar to an API. It allows communication between software programs. Unlike an API, request for data are not sent. Rather, when an activity happens on an application, it communicates the activity to the awaiting app
// const addWebHook = async function (req, res) {
//   try {
//     let data = req.body;

//     // Switch statements
//     switch (data) {
//       case data.event == "invoice.payment_failed":
//         await paystackTriggeredCancellation(data);
//         console.log("Invoice charge failed");
//         break;
//       case data.event == "invoice.create":
//         console.log("Invoice created. User to be charged in 3 days time.");
//         break;
//       // invoice update is sent after a charge attempt, and indicates whether or not the charge was successful
//       case data.event == "invoice.update":
//         data.data.status = "success"
//           ? await subscriptionChargeSuccess(data)
//           : await paystackTriggeredCancellation(data);
//         console.log("Charge attempt unsuccessful");
//         break;
//       case data.event == "subscription.not_renewed":
//         console.log("Subscription not renewed");
//         break;
//       case data.event == "subscription.disabled":
//         console.log("Subscription cancelled");
//         break;
//       case data.event == "transfer.success":
//         console.log("Transfer successful");
//         break;
//       case data.event == "transfer.failed":
//         console.log("Transfer failed");
//         break;
//       case data.event == "transfer.reversed":
//         console.log("Transfer reversed");
//         break;

//       default:
//         // successful charge
//         const obj = data.data.plan;
//         console.log("Processing in progress...");

//         // object comparison verifying if its a normal payment or a subscription payment for a plan
//         Object.keys(obj).length === 0 && obj.constructor === Object
//           ? await chargeSuccess(data) // normal payment
//           : await subscriptionChargeSuccess(data); // subscription payment
//         console.log("Charge or Subscription Successful");
//         break;
//     }
//   } catch (err) {
//     res.status(400).send({ data: {}, error: `${err.message}`, status: 1 });
//   }
// };

const addWebHook = async function (req, res) {
  try {
    let data = req.body;

    // console.log(data);

    const reference = data.data.reference;

    if (data.event == "charge.success") {
      const response = await chargeSuccess(data);

      // res.send(response)
      console.log(response);
    } else {
      console.log("Payment not successful");
    }
  } catch (error) {
    // res.status(400).send({ data: {}, error: `${err.message}`, status: 1 });
    console.log(error.message);
  }
};

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  addWebHook,
  initializeTrans,
  verifyTrans,
  getAccessCode,
  getReferenceCode,
};
