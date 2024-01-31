import React from "react";
import { Container, Spinner } from "react-bootstrap";

function LoadingSpinner() {
  return (
    <>
      <Container className="d-flex justify-content-center align-items-center vh-100 vw-100">
        <Spinner animation="border" variant="dark" />
      </Container>
    </>
  );
}

export default LoadingSpinner;
