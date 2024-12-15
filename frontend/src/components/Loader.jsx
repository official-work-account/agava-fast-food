import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        // width: "100px",
        // height: "100px",
        margin: "auto",
        display: "in-line",
        // position: "absolute",
        // top: "50%",
        // right: "50%",
      }}
    />
  );
};

export default Loader;
