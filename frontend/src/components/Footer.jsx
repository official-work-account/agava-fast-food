import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">
            <p>Agava Fast Food &copy; {currentYear}</p>
            <p style={{ color: "", fontSize: "small" }}>
              Developed by{" "}
              <a href="https://innosoltechgh.com">Innosol Technologies</a>{" "}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
export default Footer;
