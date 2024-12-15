import { Link } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";

const InfoScreen = () => {
  return (
    <>
      <Link className="btn btn-secondary my-3" to={"/"}>
        View Proshopper
      </Link>
      <Row>
        <Col md={6}>
          <Card className="p-4 m-3">
            <h2>Proshopper Video Demo</h2>
            <p>
              Watch a live recorded video demo of how proshopper works.
              <br />{" "}
              <span style={{ marginLeft: "15px" }}>
                <a href="https://drive.google.com/file/d/1b2c-tiFIhsJIxi4kPwplUeNdYU7cwz5N/view?usp=drivesdk">
                  Video demo 1
                </a>
              </span>
            </p>

            <br />

            <h2>Why Proshopper?</h2>
            <p>
              Proshopper is a fully customizable ecommerce application for food,
              clothing & product vendors looking to have their own ecommerce
              platform:
            </p>
            <p>
              <span style={{}}>
                <strong>1.</strong> Allows customers to order & pay with mobile
                money or card, from anywhere, or select a cash-on-delivery
                payment option.
              </span>
              <br />
              <span style={{}}>
                <strong>2.</strong> Secured by{" "}
                <a href="https://paystack.com" target="__blank">
                  Paystack
                </a>
                , one of Africa's leading fintech and a subsidiary of{" "}
                <a href="https://stripe.com" target="__blank">
                  Stripe
                </a>{" "}
                (a leading Global fintech used by Amazon, Google, WhatsApp,
                Marriot & more).
              </span>
              <br />
              <span style={{}}>
                <strong>3.</strong> You get notified in real time when payment
                is made.
              </span>
              <br />
              <span style={{}}>
                <strong>4.</strong> Easy to use & accessible on mobile & PC.
              </span>
              <br />
              <span style={{}}>
                <strong>5.</strong> Can be installed & used as a desktop or
                mobile app.
              </span>
            </p>

            <br />
            <h5>If you are a small business owner</h5>
            <p>
              Proshopper saves you time, and allows you to focus on other
              things, whiles still selling. On Proshopper, every product has the
              relevant product info. Proshopper itself, guides the user through
              each stage of the order process. As a result, there is minimal
              interaction between you and the customer, before or during the
              order process, allowing you some free time to engage in other
              things.
            </p>

            <br />

            <h5>Testing & Exploring Proshopper</h5>
            <p>
              Use any of the credentials below to sign in & explore how the
              system works, where sign-in is required.
              <br />
              <strong>Ordinary user:</strong>
              <br />
              <span style={{ marginLeft: "15px" }}>- jane@email.com</span>{" "}
              <br />{" "}
              <span style={{ marginLeft: "15px" }}> - john@email.com</span>
              <br />
              <span style={{ marginLeft: "15px" }}>
                {" "}
                - jbrown@email.com
              </span>{" "}
              <br />
              <strong>Admin user:</strong>
              <br />
              <span style={{ marginLeft: "15px" }}>- admin@email.com</span>{" "}
              <br />{" "}
              <span style={{ marginLeft: "15px" }}> - myadmin@email.com</span>
              <br />
              <strong>Password: </strong>testuser123
              <br />
            </p>
          </Card>
        </Col>

        {/* <Col md={6}>
          <Card className="p-4 m-3">
            <h2>How to take part in the promo challenge</h2>
            <p>
              To stand a chance to get Proshopper customized & deployed for you,
              for free, you would need to:
            </p>
            <p>1. Like "Innosol Technologies" Facebook page</p>
            <p>
              2. Share the flyer post that has "Proshopper" boldly written on
              it, to your page
            </p>
            <p>
              3. In the comment section:
              <br />
              <span style={{ marginLeft: "15px" }}>
                - State what you would be using the online store to sell
              </span>{" "}
              <br />{" "}
              <span style={{ marginLeft: "15px" }}>
                {" "}
                - Tag your social media business page (if you have one)
              </span>
              <br />{" "}
              <span style={{ marginLeft: "15px" }}>
                {" "}
                - Tag 5 friends you think might need an online store.
              </span>
              <br />
              <span style={{ marginLeft: "15px" }}>
                {" "}
                - Add the last 4 digits of your phone number
              </span>
              <br />
            </p>
            <p>
              <strong>Note:</strong> On the 15th of each month, beginning
              September, for the next 3 months, up to 10 people would be
              selected, and their 4 digit number would be placed in a
              computerized random selector, in a live recorded video session.
              The person with the number selected, gets an online store for
              free!
            </p>
          </Card>
        </Col> */}

        <Col md={6}>
          <Card className="p-4 m-3">
            <h2>Price (GHS)</h2>
            <p>
              {/* <span style={{ }}>- Monthly payment: 225</span>
              <br /> */}
              <span style={{}}>- 1 year: 3,000</span>
              <br />
              <span style={{}}>- 2 years: 5,500</span>
              <br />
              <span style={{}}>- 3 years: 7,562</span>
              <br />
              <span style={{}}>- 4 years: 9,242</span>
              <br />
              <span style={{}}>- 5 years: 10,589</span>
            </p>
            <p>
              <strong>Bonus:</strong>
              <br />
              <span style={{}}>- Free domain name</span>
              <br />
              <span style={{}}>
                - 50% discount on digital marketing service for your first
                month, to help drive traffic from across the web to your
                website. See{" "}
                <a href="https://innosoltechgh.com/pricing" target="__blank">
                  digital marketing rates
                </a>
                . See some digital marketing video demos:
              </span>
              <br />
              <span style={{ marginLeft: "15px" }}>
                <a href="https://www.facebook.com/www.innosoltechnologies.com.gh/videos/503106595999036/?mibextid=a5VnDUpeP1iQ3q3p">
                  Video demo 1
                </a>
              </span>
              <br />
              <span style={{ marginLeft: "15px" }}>
                <a href="https://drive.google.com/file/d/1AGgxAPEo4-ep1u9mofcJBwAJLxRo9goo/view?usp=drivesdk">
                  Video demo 2
                </a>
              </span>
            </p>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default InfoScreen;
