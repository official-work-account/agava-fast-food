import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
  // const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [paymentMethod, setPaymentMethod] = useState("");
  console.log({ paymentMethod: paymentMethod });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  function submitHandler(event) {
    event.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="Card / Mobile Money"
              id="card-or-momo"
              name="paymentMethod"
              value="Card / Mobile Money"
              // checked
              required
              onChange={(event) => {
                setPaymentMethod(event.target.value);
              }}
            ></Form.Check>
          </Col>

          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="Cash On Delivery"
              id="cash-on-delivery"
              name="paymentMethod"
              value="Cash On Delivery"
              onChange={(event) => setPaymentMethod(event.target.value)}
            ></Form.Check>
          </Col>

          {/* <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="PayPal or Credit/Debit Card"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked
              onChange={(event) => setPaymentMethod(event.target.value)}
            ></Form.Check>
          </Col> */}
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
