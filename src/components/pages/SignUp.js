import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../firebase";
import styles from "./Signup.module.css";
import { Button, InputGroup, Form } from "react-bootstrap";
import ErrorAlert from "../ErrorAlert";
import LoadingSpinner from "../LoadingSpinner";

function SignUp() {
  const userID = sessionStorage.getItem("user_id");
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    contact: "",
    pass: "",
    confirmPass: "",
  });
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  let passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^_&|*])[a-zA-Z0-9!@#$%^_&*]{7,15}$/;

  // if (!email.includes("@") || !email.includes("."))
  const handleSubmission = () => {
    if (
      !values.name ||
      !values.email ||
      !values.pass ||
      !values.contact ||
      !values.confirmPass
    ) {
      setError(true);
      setErrorMsg("Fill all fields");
      return;
    } else if (!values.email.includes("@") || !values.email.includes(".")) {
      setError(true);
      setErrorMsg("Invalid Email Address");
    } else if (values.contact.length !== 11) {
      setError(true);
      setErrorMsg("Phone Number must be 11 digits");
      return;
    } else if (!values.pass.match(passwordRegex)) {
      setError(true);
      setErrorMsg(
        `Password should be atleast 8-15 characters long and should contain letters numbers and special character`
      );
      return;
    } else if (values.pass !== values.confirmPass) {
      setError(true);
      setErrorMsg("Password and Confirm Password does not match.");
    } else {
      setError(false);
      setErrorMsg("");
      console.log("Signup Email====>", values.email);
      console.log("Signup Password====>", values.pass);
      setLoader(true);
      createUserWithEmailAndPassword(auth, values.email, values.pass)
        .then(async (res) => {
          setLoader(true);
          const user = res.user;
          console.log("SIGNUP USER===>", user);
          await addDoc(collection(db, "users"), {
            user_id: user.uid,
            user_name: values.name,
            user_email: user.email,
            user_contact: values.contact,
            role: "user",
          });
          await updateProfile(user, {
            displayName: values.name,
          });
          sessionStorage.setItem("user_id", user.uid);
          sessionStorage.setItem("user_email", user.email);
          sessionStorage.setItem("user_name", user.displayName);
          sessionStorage.setItem("user_contact", values.contact);
          sessionStorage.setItem(
            "user_message",
            "Please wait one of our agent will reply you shortly."
          );
          navigate("/");
          // navigate("/login");
          setLoader(false);
        })
        .catch((err) => {
          setLoader(true);
          setError(true);
          setErrorMsg(err.message);
          console.log(err);
          setLoader(false);
        });
      setLoader(false);
    }
  };
  const postUserData = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };
  useEffect(() => {
    if (userID) {
      navigate("/");
    }
  }, [userID, navigate]);

  // console.log("CHECKED====>", isCheck)

  return (
    <>
      {loader ? (
        <LoadingSpinner />
      ) : (
        <div className="container col-xl-10 col-xxl-8 px-4 py-5 mt-3 vh-100">
          <div className="row align-items-center g-lg-5 py-5">
            <div className="col-lg-7 text-center text-lg-start">
              <h1 className="display-4 fw-bold lh-1 mb-3 text-primary">
                Signup Here
              </h1>
              <p className="col-lg-10 fs-4">
                Get the best and Competitive Packages only at Great Expedition.
              </p>
            </div>
            <div className="col-md-12 mx-auto col-lg-5">
              <div className="p-4 p-md-5 border rounded-3 bg-light">
                {error && <ErrorAlert errorMessage={errorMsg} />}
                <InputGroup className="mb-3">
                  <Form.Control
                    type="text"
                    className="shadow-none"
                    placeholder="Full Name"
                    value={values.name}
                    onChange={(e) =>
                      postUserData("name", e.target.value.toLowerCase())
                    }
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <Form.Control
                    type="email"
                    className="shadow-none"
                    placeholder="Email Address"
                    value={values.email}
                    onChange={(e) =>
                      postUserData("email", e.target.value.toLowerCase())
                    }
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <Form.Control
                    type="text"
                    className="shadow-none"
                    placeholder="Contact No."
                    value={values.contact}
                    onChange={(e) =>
                      postUserData("contact", e.target.value.replace(/\D/g, ""))
                    }
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <Form.Control
                    type={isCheck ? "text" : "password"}
                    className="shadow-none"
                    placeholder="Password"
                    value={values.pass}
                    onChange={(e) => postUserData("pass", e.target.value)}
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <Form.Control
                    type={isCheck ? "text" : "password"}
                    placeholder="Confirm password"
                    className="shadow-none"
                    value={values.confirmPass}
                    onChange={(e) =>
                      postUserData("confirmPass", e.target.value)
                    }
                  />
                </InputGroup>

                <InputGroup className="mb-3">
                  <Form.Check
                    type="checkbox"
                    value={isCheck}
                    onChange={(e) => setIsCheck(e.target.checked)}
                    label="Show Password"
                  />
                </InputGroup>
                <Button
                  className="w-100 btn btn-lg btn-primary"
                  onClick={() => handleSubmission()}
                >
                  Signup
                </Button>
                <hr className="my-4" />
                <p className="text-center">Already have an account?</p>
                <Button
                  className="w-100 btn btn-lg btn-success"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SignUp;
