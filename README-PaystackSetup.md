<!-- # THESE ARE 2 METHODS FOR INTEGRATING PAYSTACK PAYMENT -->

## METHOD 1 - THROUGH FRONTEND USING INTERNALLY GENERATED REFERENCE

1.  Pass the necessary details to the to the newTransaction() as seen below:

        const payWithPaystackHandler = (event) => {

            const popup = new PaystackPop();

            popup.newTransaction({
            key: "pk_test_a3f15c2486d2df46cec9d5fdb6a46152eb792cc7",
            reference: order.reference,
            channels: ["card", "mobile_money"],
            currency: "GHS",
            amount: Math.trunc(order.totalPrice * 100),
            name: order.user.name,
            email: order.user.email,
            phone: order.shippingAddress.phoneNumber,
            });
        };

    NOTE: The reference is generated when the order is created (placed) by the addOrderItems action creator

2.  We receive the charge event data from paystack through our webhook route, in orderRoutes.js, and fire our webhook function (addWebhook)

3.  We verify transaction transaction to see if it was successful, and if right amount was paid.

## METHOD 2 -THROUGH BACKEND

1. Turn on all code with "FOR BACKEND PAYSTACK" label
