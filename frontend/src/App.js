import React from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import AppBanner from "./components/AppBanner";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header />
      <AppBanner />
      <main className="py-3 body-colour">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer position="bottom-center" theme="dark" autoClose={8000} />
    </>
  );
}

export default App;
