import React, { useEffect, useState } from "react";
import { InputGroup, Form, Button } from "react-bootstrap";
import ErrorAlert from "../ErrorAlert";
import LoadingSpinner from "../LoadingSpinner";
import { confirmPasswordReset } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
const ForgotPass = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loader, setLoader] = useState(false);
  let passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^_&|*])[a-zA-Z0-9!@#$%^_&*]{7,15}$/;
  const postUserData = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleChangePassword = () => {
    if (values.password === "" || values.confirmPassword === "") {
      setError(true);
      setErrorMsg("Please fill all the Fields.");
      return;
    } else if (!values.password.match(passwordRegex)) {
      setError(true);
      setErrorMsg(
        `Password should be atleast 8-15 characters long and should contain letters numbers and special character`
      );
      return;
    } else if (values.password !== values.confirmPassword) {
      setError(true);
      setErrorMsg("Password and Confirm Password does not match.");
      return;
    } else {
      setLoader(true);
      const queryParams = new URLSearchParams(window.location.search);
      const oobCode = queryParams.get("oobCode");
      console.log("MY CODE ====>", oobCode);
      confirmPasswordReset(auth, oobCode, values.password)
        .then(() => {
          navigate("/login");
        })
        .catch((error) => {
          console.log("ERROR in Forgot Password Handler===>", error);
          setError(true);
          setErrorMsg("Internal Server Error. Try Again Later");
        });
      setLoader(false);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const oobCode = queryParams.get("oobCode");
    if (!oobCode) {
      navigate("/login");
    }
  }, []);

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
              <p className="col-lg-10 fs-4">Change Your Password</p>
            </div>
            <div className="col-md-12 mx-auto col-lg-5">
              <div className="p-4 p-md-5 border rounded-3 bg-light">
                {error && <ErrorAlert errorMessage={errorMsg} />}
                <div className="form-floating mb-3">
                  <input
                    type={showPass ? "text" : "password"}
                    className="form-control shadow-none"
                    id="floatingInput"
                    placeholder="Create new password"
                    value={values.password}
                    onChange={(e) => postUserData("password", e.target.value)}
                  />
                  <label htmlFor="floatingInput">New Password</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type={showPass ? "text" : "password"}
                    className="form-control shadow-none"
                    id="floatingPassword"
                    placeholder="Password"
                    value={values.confirmPassword}
                    onChange={(e) =>
                      postUserData("confirmPassword", e.target.value)
                    }
                  />
                  <label htmlFor="floatingPassword">Confirm Password</label>
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
                  onClick={() => handleChangePassword()}
                >
                  Save
                </Button>
                {/* <hr className="my-4" />
                <p className="text-center">Don't have an account?</p>
                <Button
                  className="w-100 btn btn-lg btn-success shadow-none"
                  onClick={() => navigate("/login")}
                >
                  Create New Account
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgotPass;
