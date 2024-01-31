import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { Container, Form, Row, Col, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import LoadingSpinner from "../LoadingSpinner";

function AdminLogin() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const adminLoginHandler = async () => {
    try {
      if (email === "" || password === "") {
        setError(true);
        setErrorMessage("Fill all the Fields");
      } else {
        setLoader(true);
        setError(false);
        console.log("EMAIL===>", email);
        console.log("PASSWORD===>", password);
        const response = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const uuid = response.user.uid;
        console.log("adminLoginHandler RESPONSE===>", response.user);
        const q = query(collection(db, "users"), where("role", "==", "admin"));
        const querySnapshot = await getDocs(q);
        const usersArr = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log("users===>", doc.data());
          usersArr.push(doc.data());
        });
        console.log("usersArr===>", usersArr);
        setUsers(usersArr);
        console.log("users STATE===>", users);
        const isFound = usersArr.find((e) => {
          if (e.user_id === uuid) {
            return true;
          }
          return false;
        });
        console.log("isFound Says ===>", isFound);
        if (isFound !== undefined) {
          sessionStorage.setItem("admin_id", response.user.uid);
          sessionStorage.setItem("admin_email", response.user.email);
          // sessionStorage.setItem("user_name", response.user.displayName);
          navigate("/currentpackages");
        } else {
          setError(true);
          setErrorMessage("Invalid Credentials");
        }
        setEmail("");
        setPassword("");
        setLoader(false);
      }
    } catch (error) {
      setLoader(true);
      setError(true);
      // const modifiedMessage = error.code.split("/")[1];
      // console.log(modifiedMessage);
      setErrorMessage(error.code);
      console.log("ERROR in Login Handler ===>", error);
      setLoader(false);
    }
  };

  return (
    <>
      {loader ? (
        <LoadingSpinner />
      ) : (
        <Container>
          <h1 className="shadow mt-5 p-3 text-center rounded bg-dark text-white">
            ADMIN LOGIN
          </h1>
          <Row className="mt-3">
            <Col
              lg={5}
              md={6}
              sm={12}
              className="p-5 m-auto shadow rounded mt-5"
            >
              {error ? (
                <Alert variant="danger">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span className="ms-2 text-capitalize fw-bold">
                    {errorMessage}
                  </span>
                </Alert>
              ) : null}

              <Form.Group className="mt-2">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="text"
                  className="shadow-none border-dark rounded-0"
                  placeholder="username"
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  className="shadow-none border-dark rounded-0"
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <div className="d-grid gap-2 mt-3">
                <Button
                  style={{ background: "black", border: "1px solid #000" }}
                  className="rounded-0 shadow-none"
                  size="lg"
                  onClick={() => adminLoginHandler()}
                >
                  Login
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default AdminLogin;
