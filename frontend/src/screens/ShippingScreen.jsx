import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import { saveShippingAddress } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [area, setArea] = useState(shippingAddress?.area || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [state, setState] = useState(shippingAddress?.state || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress?.country || "");
  const [phoneNumber, setPhoneNumber] = useState(
    shippingAddress?.phoneNumber || ""
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = function (event) {
    event.preventDefault();
    dispatch(
      saveShippingAddress({
        address,
        area,
        city,
        state,
        postalCode,
        country,
        phoneNumber,
      })
    );
    navigate("/payment");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping/Delivery Address</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address" className="my-3">
          <Form.Label>Delivery Address or Closest Landmark</Form.Label>
          <Form.Control
            type="text"
            placeholder="Type your address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="area" className="my-3">
          <Form.Label>Area (example: Osu, Dansoman)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your location"
            value={area}
            onChange={(event) => setArea(event.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city" className="my-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your City"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="state" className="my-3">
          <Form.Label>State/Region</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your Region or State"
            value={state}
            onChange={(event) => setState(event.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode" className="my-3">
          <Form.Label>Postal Code (optional)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Postal Code"
            value={postalCode}
            onChange={(event) => setPostalCode(event.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="country" className="my-3">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your Country"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="phoneNumber" className="my-3">
          <Form.Label>Phone Number (10 digit)</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Your phone number"
            value={phoneNumber}
            maxLength="10"
            onChange={(event) => setPhoneNumber(event.target.value)}
            required
          ></Form.Control>
          <p style={{ color: "red", fontSize: "small" }}>
            <strong>Example: 0272000000</strong>
          </p>
          {/* <p style={{ color: "red", fontSize: "small" }}>
            <strong>
              Include country code if living outside Ghana - e.g. +234 xx xxxx
              xxx
            </strong>
          </p> */}
        </Form.Group>

        <Button type="submit" variant="primary" className="my-2">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
