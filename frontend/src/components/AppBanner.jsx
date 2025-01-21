import { Link } from "react-router-dom";

const AppBanner = () => {
  return (
    <div
      style={{
        background: "rgba(0, 0, 0, 0.3)",
        textAlign: "center",
        height: "25px",
      }}
    >
      <p style={{ fontSize: "small" }}>
        Open everyday, from 9am to 11pm. Closed on Tuesdays.
        {/* <Link to="/info">
          <span style={{ color: "blue" }}>See here</span>
        </Link> */}
      </p>
    </div>
  );
};

export default AppBanner;
