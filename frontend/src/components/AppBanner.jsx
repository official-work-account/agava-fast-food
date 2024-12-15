import { Link } from "react-router-dom";

const AppBanner = () => {
  return (
    <div
      style={{
        background: "rgba(0, 0, 255, 0.3)",
        textAlign: "center",
        height: "25px",
      }}
    >
      <p style={{ fontSize: "small" }}>
        Want to learn more about Agava?{" "}
        <Link to="/info">
          <span style={{ color: "blue" }}>See here</span>
        </Link>
      </p>
    </div>
  );
};

export default AppBanner;
