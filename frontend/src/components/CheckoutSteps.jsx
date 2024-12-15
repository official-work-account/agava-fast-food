import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

// step1, step2, step3, step4

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className="justify-content-center mb-4">
      <Nav.Item>
        {step1 ? (
          <LinkContainer to="/login">
            <Nav.Link className="checkOutStepsFont">Sign In</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link className="checkOutStepsFont" disabled>
            Sign In
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <LinkContainer to="/shipping">
            <Nav.Link className="checkOutStepsFont">Shipping/Delivery</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link className="checkOutStepsFont" disabled>
            Shipping/Delivery
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <LinkContainer to="/payment">
            <Nav.Link className="checkOutStepsFont">Payment</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link className="checkOutStepsFont" disabled>
            Payment
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <LinkContainer to="/placeorder">
            <Nav.Link className="checkOutStepsFont">Place Order</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link className="checkOutStepsFont" disabled>
            Place Order
          </Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
