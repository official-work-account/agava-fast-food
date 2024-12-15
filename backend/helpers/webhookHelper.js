import Order from "../models/orderModel.js";
import colors from "colors";
import paystackApi from "paystack-api";

// const paystackSecretKey = process.env.PAYSTACK_TEST_SECRET_KEY; // For test mode
const paystackSecretKey = process.env.PAYSTACK_LIVE_SECRET_KEY; // For live mode
const paystack = paystackApi(paystackSecretKey);

// const chargeSuccess = async function (data) {
//   try {
//     const paystackData = data.data;
//     const reference = paystackData.reference;

//     const userOrder = await Order.findOne({ paystack_ref: reference });
//     const orderId = userOrder._id;
//     const orderTotal = userOrder.totalPrice;

//     console.log("Updating charge status...");

//     if (userOrder.paystack_transaction_status == "success") {
//       return {
//         data: {},
//         message: "Transaction already verified",
//         status: 1,
//       };
//     }

//     const verificationResponse = await paystack.transaction.verify({
//       reference: reference,
//     });

//     const amountPaid = verificationResponse.data.amount / 100;
//     // console.log("Amount paid: " + amountPaid);

//     if (amountPaid === orderTotal) {
//       if (verificationResponse.data.status == "success") {
//         const data = {
//           paystack_transaction_status: verificationResponse.data.status,
//           isPaid: true,
//           paidAt: Date.now(),
//         };

//         await Order.findByIdAndUpdate(orderId, data);

//         const updatedOrder = await Order.findById(orderId);

//         return {
//           // data: { updatedOrder },
//           message: "Charge Successful",
//           status: 0,
//         };
//       } else {
//         console.log("Charge not successful");
//       }
//     } else {
//       return {
//         amountPaid: amountPaid,
//         message: "Wrong Amount Paid",
//         status: 1,
//       };
//     }
//   } catch (err) {
//     console.log({ data: {}, error: `${err.message}`, status: 1 });
//   }
// };

const chargeSuccess = async function (data) {
  try {
    const paystackData = data.data;
    const reference = paystackData.reference;

    const order = await Order.findOne({ reference: reference });

    // console.log({ message: "order from chargeSuccess", order: order });

    const orderId = order._id;
    const orderTotal = order.totalPrice;

    console.log("Checking charge status...");

    if (order.paystack_transaction_status == "success") {
      return {
        data: {},
        message: "Transaction already verified",
        status: 1,
      };
    }

    const verificationResponse = await paystack.transaction.verify({
      reference: reference,
    });
    // console.log({ verificationResponse: verificationResponse });

    const amountPaid = verificationResponse.data.amount / 100;
    // console.log("Amount paid: " + amountPaid);

    if (amountPaid === orderTotal) {
      if (verificationResponse.data.status == "success") {
        const data = {};

        const foundOrder = await Order.findById(orderId);

        foundOrder.paystack_transaction_status =
          verificationResponse.data.status;
        foundOrder.isPaid = true;
        foundOrder.paidAt = Date.now();

        const updatedOrder = await foundOrder.save();

        return {
          data: { updatedOrder },
          message: "Charge Successful",
          status: 0,
        };
      } else {
        console.log("Charge not successful");
      }
    } else {
      return {
        amountPaid: amountPaid,
        message: "Wrong Amount Paid",
        status: 1,
      };
    }
  } catch (err) {
    console.log({ data: {}, error: `${err.message}`, status: 1 });
  }
};

export default chargeSuccess;
