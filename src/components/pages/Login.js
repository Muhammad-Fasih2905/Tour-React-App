import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
// import styles from "./Login.module.css";
import { Button, Form, InputGroup } from "react-bootstrap";
import ErrorAlert from "../ErrorAlert";
import { collection, getDocs, query, where } from "firebase/firestore";
import LoadingSpinner from "../LoadingSpinner";

function Login() {
  // const userID = sessionStorage.getItem("user_id");
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    pass: "",
    role: "user",
  });
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [users, setUsers] = useState([]);
  const [showPass, setShowPass] = useState(false);
  const handleSubmission = async () => {
    try {
      if (values.email === "" || values.pass === "") {
        setError(true);
        setErrorMsg("Fill all the Fields");
      } else {
        setLoader(true);
        setError(false);
        console.log("EMAIL===>", values.email);
        console.log("PASSWORD===>", values.pass);
        const response = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.pass
        );
        const uuid = response.user.uid;
        console.log("LOGIN HANDLER RESPONSE===>", response.user);
        const q = query(collection(db, "users"), where("role", "==", "user"));
        const querySnapshot = await getDocs(q);
        const usersArr = [];
        querySnapshot.forEach((doc) => {
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
          sessionStorage.setItem("user_id", response.user.uid);
          sessionStorage.setItem("user_email", response.user.email);
          sessionStorage.setItem("user_name", response.user.displayName);
          sessionStorage.setItem("user_contact", isFound.user_contact);
          sessionStorage.setItem(
            "user_message",
            "Please wait one of our agent will reply you shortly."
          );
          navigate("/");
        } else {
          setError(true);
          setErrorMsg("Invalid Credentials");
        }
        setValues({
          email: "",
          pass: "",
        });
        setLoader(false);
      }
    } catch (error) {
      setLoader(true);
      setError(true);
      // const modifiedMessage = error.code.split("/")[1];
      // console.log(modifiedMessage);
      setErrorMsg(error.code);
      console.log("ERROR in Login Handler ===>", error);
      setLoader(false);
    }
  };
  const postUserData = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const forgotPassHandler = () => {
    if (values.email === "") {
      setError(true);
      setErrorMsg("Please Enter Email Address.");
    } else {
      sendPasswordResetEmail(auth, values.email)
        .then(() => {
          setError(true);
          setErrorMsg("Please check your Email for Reset Password.");
          setTimeout(() => {
            navigate("/forgotPass");
          }, 5000);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error.code);
          setError(true);
          setErrorMsg(errorCode);
        });
    }
  };

  // useEffect(() => {
  //   if (userID) {
  //     navigate('/')
  //   }
  // }, [userID, navigate])

  return (
    <>
      {loader ? (
        <LoadingSpinner />
      ) : (
        <div className="container col-xl-10 col-xxl-8 px-4 py-5 mt-3 vh-100">
          <div className="row align-items-center g-lg-5 py-5">
            <div className="col-lg-7 text-center text-lg-start">
              <h1 className="display-4 fw-bold lh-1 mb-3 text-primary">
                Great Expeditions
              </h1>
              <p className="col-lg-10 fs-4">
                Get the best and Competitive Packages only at Great Expedition.
              </p>
            </div>
            <div className="col-md-12 mx-auto col-lg-5">
              <div className="p-4 p-md-5 border rounded-3 bg-light">
                {error && <ErrorAlert errorMessage={errorMsg} />}
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control shadow-none"
                    id="floatingInput"
                    placeholder="name@example.com"
                    value={values.email}
                    onChange={(e) => postUserData("email", e.target.value)}
                  />
                  <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type={showPass ? "text" : "password"}
                    className="form-control shadow-none"
                    id="floatingPassword"
                    placeholder="Password"
                    value={values.pass}
                    onChange={(e) => postUserData("pass", e.target.value)}
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>
                <InputGroup className="mb-3">
                  <Form.Check
                    type="checkbox"
                    value={showPass}
                    onChange={(e) => setShowPass(e.target.checked)}
                    label="Show Password"
                  />
                </InputGroup>
                <Button
                  className="w-100 btn btn-lg btn-primary shadow-none"
                  onClick={() => handleSubmission()}
                >
                  Login
                </Button>

                <p className="text-dark pt-3" style={{ cursor: "pointer" }} onClick={() => forgotPassHandler()}>
                  Forget Password
                </p>

                <hr className="my-4" />
                <p className="text-center">Don't have an account?</p>
                <Button
                  className="w-100 btn btn-lg btn-success shadow-none"
                  onClick={() => navigate("/sign-up")}
                >
                  Create New Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
