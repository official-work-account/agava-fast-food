import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import PaystackPop from "@paystack/inline-js";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useGetOrderDetailsQuery,
  // usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useDeliverOrderMutation,
  useInitiateTransMutation, // NOTE: FOR BACKEND PAYSTACK
} from "../slices/ordersApiSlice";

const OrderScreen = () => {
  const { id: orderId } = useParams();
  // console.log(orderId);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  // console.log(order.user.name, order.reference);

  // NOTE: FOR BACKEND PAYSTACK
  // const {
  //   data: access_code,
  //   refetch: refetchingAccessCode,
  //   // isLoading: loadingCode,
  //   // error: loadingErrorCode,
  // } = useGetAccessCodeQuery(orderId);

  // console.log("reference: " + order.reference);

  // const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  // NOTE: FOR BACKEND PAYSTACK
  const [initiateTrans] = useInitiateTransMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  // function onApprove(data, actions) {
  //   return actions.order.capture().then(async function (details) {
  //     try {
  //       await payOrder({ orderId, details }).unwrap();
  //       refetch();
  //       toast.success("Payment Successful!");
  //     } catch (err) {
  //       toast.error(err?.data?.message || err.message);
  //     }
  //   });
  // }

  // async function onApproveTest() {
  //   await payOrder({ orderId, details: { payer: {} } }).unwrap();
  //   refetch();
  //   toast.success("Payment Successful!");
  // }

  // function onError(err) {
  //   toast.error(err.message);
  // }

  // function createOrder(data, actions) {
  //   return actions.order
  //     .create({
  //       purchase_units: [
  //         {
  //           amount: {
  //             value: order.totalPrice,
  //           },
  //         },
  //       ],
  //     })
  //     .then((orderId) => {
  //       return orderId;
  //     });
  // }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  // NOTE: PAYSTACK PAYMENT SCREEN - FRONTEND UI ONLY
  // const payWithPaystackHandler = async (event) => {
  //   // event.preventDefault();

  //   const popup = new PaystackPop();
  //   popup.newTransaction({
  //     // key: "pk_live_bb34bea4fa5fdcad7a0386a6e5228c02edd2f34c",
  //     key: "pk_test_a3f15c2486d2df46cec9d5fdb6a46152eb792cc7",
  //     reference: order.reference,
  //     channels: ["card", "mobile_money"],
  //     currency: "GHS",
  //     amount: Math.trunc(order.totalPrice * 100),
  //     name: order.user.name,
  //     email: order.user.email,
  //     phone: order.shippingAddress.phoneNumber,
  //   });
  // };

  // NOTE: METHOD 1 - FOR BACKEND PAYSTACK - INITIATING TRANSACTION THROUGH BACKEND
  async function payWithPaystackHandler() {
    const response = await initiateTrans(orderId);

    const access_code = response.data.data.access_code; // access code derived from backend response

    if (response.data.status === true) {
      const popup = new PaystackPop();

      popup.resumeTransaction(access_code); // access code derived from backend response. Method 2 is to retrieve access code from useGetAccessCodeQuery()
    } else {
      console.log("Transaction could not be started");
    }
    // console.log("The order (from orderScreen): " + order);
    // console.log("The access code (from orderScreen): " + accessCode);

    // console.log(popup);

    // refetch();
  }
  // PAYSTACK PAYMENT SCREEN END

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <>
      {/* <h1>Order: {order._id}</h1> */}
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Order ID: {order._id}</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Shipping/Delivery</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                {order.user.email}
              </p>
              <p>
                <strong>Phone Number: </strong>
                {order.shippingAddress.phoneNumber}
              </p>
              <p>
                <strong>Address:</strong> {order.shippingAddress.address},{" "}
                {order.shippingAddress.area}, {order.shippingAddress.city},
                {order.shippingAddress.State},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on: {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
                {/* {order.paymentMethod} */}
              </p>
              {/* {order.isPaid ? (
                <Message variant="success">Paid on: {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )} */}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Item(s)</h2>
              {order.orderItems.map((orderItem, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col xs={3} sm={2}>
                      <Image
                        src={orderItem.image}
                        alt={orderItem.name}
                        fluid
                        rounded
                        className="fitObject"
                      />
                    </Col>

                    {/* <Col xs={5} sm={6} md={7} className="product-title">
                      <Link to={`/product/${orderItem.product}`}>
                        {orderItem.name}
                      </Link>
                    </Col> */}

                    <Col xs={5} sm={6} className="product-title">
                      {orderItem.name}
                    </Col>

                    <Col xs={4} sm={4}>
                      {orderItem.qty} x ₵{orderItem.price} = ₵
                      {orderItem.qty * orderItem.price}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Order Item(s)</Col>
                  <Col>₵{order.itemsPrice}</Col>
                </Row>

                <Row>
                  <Col>Shipping/Delivery</Col>
                  <Col>₵{order.shippingPrice}</Col>
                </Row>

                <Row>
                  <Col>Tax</Col>
                  <Col>₵{order.taxPrice}</Col>
                </Row>

                <Row>
                  <Col>
                    <strong>Total</strong>
                  </Col>
                  <Col>₵{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <p
                  style={{
                    fontSize: "x-small",
                    textAlign: "center",
                    marginTop: "10px",
                    fontWeight: "bold",
                    color: "red",
                    // textTransform: "uppercase",
                  }}
                >
                  Please note that price does not include delivery fee
                </p>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {/* {loadingPay && <Loader />} */}

                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* <div>
                        <Button
                          variant="outline-primary"
                          onClick={onApproveTest}
                          style={{ marginBottom: "10px" }}
                        >
                          <strong>Test Pay</strong>
                        </Button>
                      </div> */}

                      <Button
                        variant="primary"
                        onClick={payWithPaystackHandler}
                        style={{ marginBottom: "10px" }}
                      >
                        Pay Now
                      </Button>

                      {/* <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div> */}
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverOrderHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
