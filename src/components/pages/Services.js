import React, { useState, useEffect, useContext } from "react";
import "../../App.css";
import Header from "../Header";
// import ProductImage from "../../assets/images/package-img.png";
import Airplane from "../../assets/images/airplane.png";
import Icon2 from "../../assets/images/img-2.png";
import Icon3 from "../../assets/images/img-3.png";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import {
  Card,
  Modal,
  Button,
  Form,
  FloatingLabel,
  InputGroup,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import LoadingSpinner from "../LoadingSpinner";
// import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import ErrorAlert from "../ErrorAlert";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function Services() {
  const navigate = useNavigate();
  const userID = sessionStorage.getItem("user_id");
  const user_email = sessionStorage.getItem("user_email");
  const user_contact = sessionStorage.getItem("user_contact");
  const user_name = sessionStorage.getItem("user_name");
  const { purchasePackage, setPurchasePackage, totalMembers, setTotalMembers } =
    useContext(UserContext);
  // const navigate = useNavigate();
  console.log(userID);
  const [loader, setLoader] = useState(false);
  const [packages, setPackages] = useState([]);
  const [northPackages, setNorthPackages] = useState([]);
  const [southPackages, setSouthPackages] = useState([]);
  const [status, setStatus] = useState("Purchase");
  const [show, setShow] = useState(false);
  const [myPackages, setmyPackages] = useState([]);
  const [currentPackage, setCurrentPackage] = useState([]);
  const [values, setValues] = useState({
    image: "",
    title: "",
    price: "",
    description: "",
    departDate: "",
    returnDate: "",
    duration: "",
    review: "",
    totalAmount: "",
    facilities: [],
  });
  // const [totalMembers, setTotalMembers] = useState(1);
  // const [selectedPackage, setSelectedPackage] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [search, setSearch] = useState(null);
  const [searchName, setSearchName] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");
  const dropdownValues = [
    {
      id: 0,
      label: "Name",
      value: "name",
    },
    {
      id: 1,
      label: "Price",
      value: "price",
    },
  ];
  // New States
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [queryShow, setQueryShow] = useState(false);
  const [customerQuery, setCustomerQuery] = useState("");
  // Signup States
  const [signup, setSignup] = useState(false);
  const [signUpValues, setSignUpValues] = useState({
    fullName: "",
    emailAddress: "",
    contactNo: "",
    password: "",
    confirmPassword: "",
  });
  const getPackages = async () => {
    // Get Packages Request
    setLoader(true);
    const package_data = await getDocs(collection(db, "packages"));
    setPackages(
      package_data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
    // Get USER PURCHASE REQUEST
    const q = query(
      collection(db, "user_purchase_packages"),
      where("user_id", "==", userID)
    );
    const data = await getDocs(q);
    setmyPackages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoader(false);
  };

  // console.log("user_puchase_packages===>", myPackages);
  // console.log("PACKAGES====>", packages);
  const handleClose = () => {
    setShow(false);
    setValues({
      image: "",
      title: "",
      description: "",
      departDate: "",
      returnDate: "",
      duration: "",
      price: "",
      review: "",
      totalAmount: "",
      facilities: [],
    });
  };

  const handleShow = async (e) => {
    // let check = myPackages.filter(f => f.package_id === e.id)
    // console.log("HANDLE SHOW  ===>", check);
    // console.log("E ==>", e)
    // if (check[0].isRequested) {
    //   setStatus('Pending')
    // } else if (check[0].isAccepted) {
    //   setStatus('Accepted')
    // } else if (check[0].isRejected) {
    //   setStatus('Rejected')
    // }
    console.log("SERVICES HANDLE SHOW===>", e);
    setShow(true);
    setValues({
      image: e.image,
      title: e.title,
      description: e.description,
      departDate: e.departDate,
      returnDate: e.returnDate,
      duration: e.tripDuration,
      price: e.price,
      facilities: e.facilities,
      // review: e.review,
      // totalAmount: e.total_amount
    });
    // setTotalMembers(1);
    setPurchasePackage(e);
    // setCurrentPackage(check[0])
  };

  const purchasePackageHandler = async () => {
    console.log("DATA==>", purchasePackage);
    if (totalMembers === 0 || totalMembers === "") {
      alert("Enter No. of Members");
      return;
    } else {
      await addDoc(collection(db, "user_purchase_packages"), {
        user_id: userID,
        user_email: user_email,
        user_contact: user_contact,
        package_id: purchasePackage.id,
        package_image: purchasePackage.image,
        package_title: purchasePackage.title,
        package_description: purchasePackage.description,
        package_facilities: purchasePackage.facilities,
        package_duration: purchasePackage.tripDuration,
        package_price: purchasePackage.price,
        total_members: totalMembers,
        total_amount: purchasePackage.price * totalMembers,
        isRequested: true,
        isAccepted: false,
        isRejected: false,
        review: "",
        rating: 0,
        users_rating: purchasePackage.users_rating,
        avg_rating: purchasePackage.avg_rating,
        dateTime: new Date().toLocaleString(),
      });
      alert("Package Purchase Successfully.");
      handleClose();
    }
  };

  // Rating Handle

  const handleRating = async (rate) => {
    console.log("===>", currentPackage.id);
    console.log(rate);
    setRating(rate);
    const myDoc = doc(db, "user_purchase_packages", currentPackage.id);
    const newFields = {
      rating: rate, // MODIFY
    };
    await updateDoc(myDoc, newFields);
  };

  const handleReview = async () => {
    if (review === "") {
      alert("Fill all the Fields.");
      return;
    } else {
      console.log("handleReview ===>", currentPackage.id);
      console.log("REVIEW ===>", review);
      const myDoc = doc(db, "user_purchase_packages", currentPackage.id);
      const newFields = {
        review: review, // MODIFY
      };
      await updateDoc(myDoc, newFields);
      alert("Review Submit Successfully.");
    }
  };
  // Optional callback functions
  // const onPointerEnter = () => console.log('Enter')
  // const onPointerLeave = () => console.log('Leave')
  // const onPointerMove = (value, index) => console.log(value, index)

  // console.log("SEARCH====>", typeof search);

  const handleSelect = (e) => {
    console.log("select===>", e);
    setSelectedValue(e);
  };

  // LOGIN

  const handleShowLogin = () => {
    handleClose();
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
    setEmail("");
    setPassword("");
  };

  const handleUserLogin = async () => {
    try {
      if (email === "" || password === "") {
        setError(true);
        setErrorMsg("Fill all the Fields");
      } else {
        setLoader(true);
        setError(false);
        const response = await signInWithEmailAndPassword(
          auth,
          email,
          password
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
        } else {
          setError(true);
          setErrorMsg("Invalid Credentials");
        }
        setEmail("");
        setPassword("");
        setLoader(false);
        handleCloseLogin();
      }
    } catch (error) {
      setLoader(true);
      setError(true);
      setErrorMsg(error.code);
      console.log("ERROR in Login Handler ===>", error);
      setLoader(false);
    }
  };

  // SIGNUP HANDLER

  let passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^_&|*])[a-zA-Z0-9!@#$%^_&*]{7,15}$/;

  const handleSubmission = () => {
    if (
      !signUpValues.fullName ||
      !signUpValues.emailAddress ||
      !signUpValues.password ||
      !signUpValues.contactNo ||
      !signUpValues.confirmPassword
    ) {
      setError(true);
      setErrorMsg("Fill all fields");
      return;
    } else if (signUpValues.contactNo.length !== 11) {
      setError(true);
      setErrorMsg("Phone Number must be 11 digits");
      return;
    } else if (
      !signUpValues.emailAddress.includes("@") ||
      !signUpValues.emailAddress.includes(".")
    ) {
      setError(true);
      setErrorMsg("Invalid Email Address");
    } else if (!signUpValues.password.match(passwordRegex)) {
      setError(true);
      setErrorMsg(
        `Password should be atleast 8-15 characters long and should contain letters numbers and special character`
      );
      return;
    } else if (signUpValues.password !== signUpValues.confirmPassword) {
      setError(true);
      setErrorMsg("Password and Confirm Password does not match.");
      return;
    } else {
      setError(false);
      setErrorMsg("");
      setLoader(true);
      createUserWithEmailAndPassword(
        auth,
        signUpValues.emailAddress,
        signUpValues.password
      )
        .then(async (res) => {
          setLoader(true);
          const user = res.user;
          console.log("SIGNUP USER===>", user);
          await addDoc(collection(db, "users"), {
            user_id: user.uid,
            user_name: signUpValues.fullName,
            user_email: signUpValues.emailAddress,
            user_contact: signUpValues.contactNo,
            role: "user",
          });
          await updateProfile(user, {
            displayName: signUpValues.fullName,
          });
          sessionStorage.setItem("user_id", user.uid);
          sessionStorage.setItem("user_email", user.email);
          sessionStorage.setItem("user_name", user.displayName);
          sessionStorage.setItem("user_contact", signUpValues.contactNo);
          sessionStorage.setItem(
            "user_message",
            "Please wait one of our agent will reply you shortly."
          );
          setLoader(false);
          handleCloseLogin();
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

  const handleNorthPackages = () => {
    let newArr = packages?.filter((f) => f.region === "north");
    setNorthPackages(newArr);
  };

  const handleSouthPackages = () => {
    let newArr = packages?.filter((f) => f.region === "south");
    setSouthPackages(newArr);
  };

  const handleQuery = async () => {
    if (customerQuery === "") {
      alert("Fill all the Fields.");
      return;
    } else {
      try {
        await addDoc(collection(db, "queries"), {
          user_id: userID,
          user_email: user_email,
          user_contact: user_contact,
          user_name: user_name,
          package_id: purchasePackage.id,
          // package_image: purchasePackage.image,
          package_title: purchasePackage.title,
          customer_query: customerQuery,
          // package_description: purchasePackage.description,
          // package_facilities: purchasePackage.facilities,
          // package_duration: purchasePackage.tripDuration,
          // package_price: purchasePackage.price,
          // total_members: totalMembers,
          // total_amount: purchasePackage.price * totalMembers,
          // isRequested: true,
          // isAccepted: false,
          // isRejected: false,
          // review: "",
          // rating: 0,
          // users_rating: purchasePackage.users_rating,
          // avg_rating: purchasePackage.avg_rating,
          dateTime: new Date().toLocaleString(),
        });
        alert("Query Submit Successfully.");
        handleClose();
      } catch (error) {
        console.log("ERROR in HandleQuery===>", error);
      }
    }
  };

  const postSignUpData = (key, value) => {
    setSignUpValues((prev) => ({ ...prev, [key]: value }));
  };

  const forgotPassHandler = () => {
    if (email === "") {
      setError(true);
      setErrorMsg("Please Enter Email Address.");
    } else {
      sendPasswordResetEmail(auth, email)
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

  useEffect(() => {
    if (userID !== null && Object.keys(purchasePackage).length > 0) {
      purchasePackageHandler();
      setPurchasePackage({});
      setTotalMembers(1);
      console.log("PURCHASE PACKAGE RUN..");
    }
  }, [userID]);

  // console.log("NORTH PACKAGES====>", northPackages);

  useEffect(() => {
    getPackages();
  }, []);

  useEffect(() => {
    handleNorthPackages();
    handleSouthPackages();
  }, [packages]);
  return (
    <>
      {loader ? (
        <LoadingSpinner />
      ) : (
        <>
          <Header />
          <div className="products">
            <h1 className="display-1">Services</h1>
          </div>

          <div className="album py-5 bg-light">
            <div className="container">
              {/* <InputGroup className="mb-3">
                <DropdownButton
                  variant="success"
                  title={`Filter By`}
                  id="input-group-dropdown-1"
                  className="shadow-none"
                  onSelect={handleSelect}
                >
                  {dropdownValues.map((e, i) => {
                    return (
                      <>
                        <Dropdown.Item eventKey={e.value}>
                          {e.label}
                        </Dropdown.Item>
                      </>
                    );
                  })}
                </DropdownButton>
                {selectedValue === "price" ? (
                  <Form.Control
                    type="text"
                    value={search}
                    placeholder="Enter your budget price"
                    className="shadow-none"
                    onChange={(e) =>
                      setSearch(e.target.value.replace(/\D/g, ""))
                    }
                  />
                ) : (
                  <Form.Control
                    type="text"
                    value={searchName}
                    placeholder="Enter package name / location"
                    className="shadow-none"
                    onChange={(e) =>
                      setSearchName(e.target.value.replace(/[0-9]/g, ""))
                    }
                  />
                )}
              </InputGroup> */}
              {/* <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                <>
                  {packages?.filter((f) =>
                    search
                      ? f.price <= +search
                      : searchName
                      ? f.title.toLowerCase().includes(searchName.toLowerCase())
                      : f
                  ).length ? (
                    packages.map((e, i) => {
                      console.log("EEEE===>", e);
                      return (
                        <div className="col" key={i}>
                          <div
                            className="card shadow mx-3 my-3"
                            style={{
                              border: "none",
                              borderRadius: 15,
                              backgroundColor: "rgba(131, 56, 236, 0.08)",
                              cursor: "pointer",
                              height: 450,
                            }}
                            onClick={() => handleShow(e)}
                          >
                            <Card.Img
                              variant="top"
                              className="pt-3 px-3"
                              height={220}
                              src={e.image}
                            />
                            <Card.Body>
                              <Card.Title className="text-capitalize text-dark">
                                {e.title}
                              </Card.Title>
                              <Card.Text>{e.description}</Card.Text>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="btn-group">
                                  <img
                                    style={{
                                      backgroundColor:
                                        "rgba(77, 45, 219, 0.518)",
                                    }}
                                    className="img-fluid p-1 rounded-circle mx-1"
                                    alt="Travel Image"
                                    src={Airplane}
                                  />
                                  <img
                                    style={{
                                      backgroundColor:
                                        "rgba(77, 45, 219, 0.518)",
                                    }}
                                    className="img-fluid px-2 py-1 rounded-circle mx-1"
                                    alt="Travel Image"
                                    src={Icon3}
                                  />
                                  <img
                                    style={{
                                      backgroundColor:
                                        "rgba(77, 45, 219, 0.518)",
                                    }}
                                    className="img-fluid p-1 rounded-circle mx-1"
                                    alt="Travel Image"
                                    src={Icon2}
                                  />
                                </div>
                                <small className="text-dark fs-5">
                                  Rs. {e.price.toLocaleString()} Per Head
                                </small>
                              </div>
                              <p
                                className="pt-3"
                                style={{
                                  color: "blue",
                                  fontWeight: "normal",
                                  fontSize: 13,
                                }}
                              >
                                 
                                Trip Duration : {e.tripDuration} Days 
                              </p>
                            </Card.Body>
                          </div>
                          <Modal
                            show={show}
                            onHide={handleClose}
                            scrollable={true}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>Package Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <p>
                                <img
                                  src={values.image}
                                  alt="packageImg"
                                  className="my-2 img-fluid"
                                />
                              </p>
                              <p>
                                 
                                Package Name: 
                                <span className="text-success text-capitalize">
                                  {values.title}
                                </span>
                              </p>
                              <p> Trip Duration: {values.duration} Days</p>
                              <p>
                                 
                                Per Head: 
                                <span className="text-danger fw-bold">
                                   
                                  {values.price} RS 
                                </span> 
                              </p>
                              <p>
                                 
                                Total Amount: 
                                <span className="text-danger fw-bold">
                                   
                                  {values.price * totalMembers} RS 
                                </span> 
                              </p>
                              {status === "Purchase" ? (
                                <div>
                                  <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlInput1"
                                  >
                                    <Form.Label>Total Members: </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="No. of Members"
                                      value={totalMembers}
                                      onChange={(e) =>
                                        setTotalMembers(
                                          e.target.value.replace(/\D/g, "")
                                        )
                                      }
                                    />
                                  </Form.Group>
                                </div>
                              ) : status === "Accepted" ? (
                                <div>
                                  {currentPackage.review === "" ? (
                                    <FloatingLabel
                                      controlId="floatingTextarea"
                                      label="Enter Review"
                                      className="mb-3"
                                    >
                                      <Form.Control
                                        as="textarea"
                                        className="shadow-none"
                                        placeholder="Review"
                                        onChange={(e) =>
                                          setReview(
                                            e.target.value.toLowerCase()
                                          )
                                        }
                                      />
                                    </FloatingLabel>
                                  ) : null}
                                </div>
                              ) : null}
                            </Modal.Body>
                            <Modal.Footer>
                              {status === "Purchase" ? (
                                <Button
                                  variant="primary"
                                  onClick={
                                    userID !== null
                                      ? () => purchasePackageHandler()
                                      : () => navigate("/login")
                                  }
                                >
                                  {status}
                                </Button>
                              ) : status === "Accepted" ? (
                                <div className="d-flex w-100 justify-content-between">
                                  {currentPackage.rating <= 0 ? (
                                    <Rating
                                      initialValue={currentPackage.rating}
                                      onClick={(rate) => handleRating(rate)}
                                      size={25}
                                    />
                                  ) : (
                                    <Rating
                                      size={25}
                                      initialValue={currentPackage.rating}
                                      readonly
                                    />
                                  )}
                                  {currentPackage.review === "" ? (
                                    <Button
                                      variant="primary"
                                      style={{ width: 150 }}
                                      onClick={() => handleReview()}
                                    >
                                      Submit Review
                                    </Button>
                                  ) : null}
                                </div>
                              ) : status === "Pending" ? (
                                <Button
                                  variant="secondary"
                                  className="shadow-none"
                                >
                                  {status}
                                </Button>
                              ) : (
                                <Button
                                  variant="danger"
                                  className="shadow-none"
                                >
                                  {status}
                                </Button>
                              )}
                              {status !== "Accepted" ? (
                                <Button
                                  variant="secondary"
                                  className="shadow-none"
                                >
                                  Query
                                </Button>
                              ) : null}
                            </Modal.Footer>
                          </Modal>
                        </div>
                      );
                    })
                  ) : (
                    <Container className="m-5 w-100">
                      <p className="text-center text-danger">
                        No packages found under the budget of {search}
                      </p>
                    </Container>
                  )}
                </>
              </div> */}
              {northPackages.length > 0 ? (
                <h3 className="text-center my-5">North Region </h3>
              ) : null}
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {northPackages?.map((e, i) => {
                  return (
                    <div className="col" key={i}>
                      <div
                        className="card shadow mx-3 my-3"
                        style={{
                          border: "none",
                          borderRadius: 15,
                          backgroundColor: "rgba(131, 56, 236, 0.08)",
                          cursor: "pointer",
                        }}
                        onClick={() => handleShow(e)}
                      >
                        <Card.Img
                          variant="top"
                          className="pt-3 px-3"
                          height={220}
                          src={e.image}
                        />
                        <Card.Body>
                          <Card.Title className="text-capitalize text-dark">
                            {e.title}
                          </Card.Title>
                          <Card.Text
                            className="text-capitalize text-Elipsis"
                            style={{
                              height: 50,
                            }}
                          >
                            {e.description}
                          </Card.Text>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="btn-group">
                              <img
                                style={{
                                  backgroundColor: "rgba(77, 45, 219, 0.518)",
                                }}
                                className="img-fluid p-1 rounded-circle mx-1"
                                alt="img1"
                                src={Airplane}
                              />
                              <img
                                style={{
                                  backgroundColor: "rgba(77, 45, 219, 0.518)",
                                }}
                                className="img-fluid px-2 py-1 rounded-circle mx-1"
                                alt="img2"
                                src={Icon3}
                              />
                              <img
                                style={{
                                  backgroundColor: "rgba(77, 45, 219, 0.518)",
                                }}
                                className="img-fluid p-1 rounded-circle mx-1"
                                alt="img3"
                                src={Icon2}
                              />
                            </div>
                            <small className="text-dark">
                              Rs. {e.price.toLocaleString()} Per Head
                            </small>
                          </div>
                          <p
                            className="pt-3"
                            style={{
                              color: "blue",
                              fontWeight: "normal",
                              fontSize: 13,
                            }}
                          >
                            Trip Duration : {e.tripDuration} Days
                          </p>
                          <p
                            style={{
                              color: "blue",
                              fontWeight: "normal",
                              fontSize: 13,
                            }}
                          >
                            Depart Date: {e.departDate} 
                          </p>
                          <p
                            style={{
                              color: "blue",
                              fontWeight: "normal",
                              fontSize: 13,
                            }}
                          >
                            Return Date: {e.returnDate}
                          </p>
                        </Card.Body>
                      </div>
                      <Modal show={show} onHide={handleClose} scrollable={true}>
                        <Modal.Header closeButton>
                          <Modal.Title>Package Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <p>
                            <img
                              src={values.image}
                              alt="packageImg"
                              className="my-2 img-fluid"
                            />
                          </p>
                          <p>
                            Package Name:
                            <span className="text-success text-capitalize">
                              {values.title}
                            </span>
                          </p>

                          <p>
                            Package Facilities:
                            <span className="text-success text-capitalize">
                              {values.facilities.join(", ")}
                            </span>
                          </p>
                          <p> Trip Duration: {values.duration} Days</p>
                          <p>
                            Per Head:
                            <span className="text-danger fw-bold">
                              {values.price} RS
                            </span>
                          </p>
                          <p>
                            Total Amount:
                            <span className="text-danger fw-bold">
                              {values.price * totalMembers} RS
                            </span>
                          </p>
                          <p className="text-capitalize">
                            Package Description:
                            <pre className="text-success">
                              {values.description}
                            </pre>
                          </p>
                          {queryShow && (
                            <>
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label>Query: </Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter your Query"
                                  value={customerQuery}
                                  onChange={(e) =>
                                    setCustomerQuery(e.target.value)
                                  }
                                />
                              </Form.Group>
                              <Button
                                variant="success"
                                size="sm"
                                className="mt-3"
                                onClick={() => handleQuery()}
                              >
                                Submit Query
                              </Button>
                            </>
                          )}
                        </Modal.Body>
                        <Modal.Footer>
                          {status === "Purchase" ? (
                            <div className="d-flex flex-row w-100 justify-content-between">
                              <div>
                                <Form.Group controlId="exampleForm.ControlInput1">
                                  <Form.Label>Total Members: </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="No. of Members"
                                    value={totalMembers}
                                    onChange={(e) =>
                                      setTotalMembers(
                                        e.target.value.replace(/\D/g, "")
                                      )
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="shadow-none mt-4"
                                  style={{ height: 38 }}
                                  onClick={
                                    userID !== null
                                      ? () => purchasePackageHandler()
                                      : () => handleShowLogin()
                                  }
                                >
                                  {status}
                                </Button>
                                {userID && (
                                  <Button
                                    variant="secondary"
                                    className="shadow-none mx-2 mt-4"
                                    size="sm"
                                    style={{ height: 38 }}
                                    onClick={() => setQueryShow(!queryShow)}
                                  >
                                    Query
                                  </Button>
                                )}
                              </div>
                            </div>
                          ) : null}
                        </Modal.Footer>
                      </Modal>
                    </div>
                  );
                })}
              </div>
              {southPackages.length ? (
                <h3 className="text-center my-5">South Region</h3>
              ) : null}
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {southPackages?.map((e, i) => {
                  return (
                    <div className="col" key={i}>
                      <div
                        className="card shadow mx-3 my-3"
                        style={{
                          border: "none",
                          borderRadius: 15,
                          backgroundColor: "rgba(131, 56, 236, 0.08)",
                          cursor: "pointer",
                          height: 450,
                        }}
                        onClick={() => handleShow(e)}
                      >
                        <Card.Img
                          variant="top"
                          className="pt-3 px-3"
                          height={220}
                          src={e.image}
                        />
                        <Card.Body>
                          <Card.Title className="text-capitalize text-dark">
                            {e.title}
                          </Card.Title>
                          <Card.Text
                            className="text-capitalize text-Elipsis"
                            style={{
                              height: 50,
                            }}
                          >
                            {e.description}
                          </Card.Text>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="btn-group">
                              <img
                                style={{
                                  backgroundColor: "rgba(77, 45, 219, 0.518)",
                                }}
                                className="img-fluid p-1 rounded-circle mx-1"
                                alt="img6"
                                src={Airplane}
                              />
                              <img
                                style={{
                                  backgroundColor: "rgba(77, 45, 219, 0.518)",
                                }}
                                className="img-fluid px-2 py-1 rounded-circle mx-1"
                                alt="img5"
                                src={Icon3}
                              />
                              <img
                                style={{
                                  backgroundColor: "rgba(77, 45, 219, 0.518)",
                                }}
                                className="img-fluid p-1 rounded-circle mx-1"
                                alt="img-4"
                                src={Icon2}
                              />
                            </div>
                            <small className="text-dark">
                              Rs. {e.price.toLocaleString()} Per Head
                            </small>
                          </div>
                          <p
                            className="pt-3"
                            style={{
                              color: "blue",
                              fontWeight: "normal",
                              fontSize: 13,
                            }}
                          >
                            Trip Duration : {e.tripDuration} Days
                          </p>
                        </Card.Body>
                      </div>
                      <Modal show={show} onHide={handleClose} scrollable={true}>
                        <Modal.Header closeButton>
                          <Modal.Title>Package Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <p>
                            <img
                              src={values.image}
                              alt="packageImg"
                              className="my-2 img-fluid"
                            />
                          </p>
                          <p>
                            Package Name:
                            <span className="text-success text-capitalize">
                              {values.title}
                            </span>
                          </p>
                          <p className="text-capitalize">
                            Package Description:
                            <pre className="text-success">
                              {values.description}
                            </pre>
                          </p>
                          <p>
                            Package Facilities:
                            <span className="text-success text-capitalize">
                              {values.facilities.join(", ")}
                            </span>
                          </p>
                          <p> Trip Duration: {values.duration} Days</p>
                          <p>
                            Per Head:
                            <span className="text-danger fw-bold">
                              {values.price} RS
                            </span>
                          </p>
                          <p>
                            Total Amount:
                            <span className="text-danger fw-bold">
                              {values.price * totalMembers} RS
                            </span>
                          </p>
                          {status === "Purchase" ? (
                            <div>
                              <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlInput1"
                              >
                                <Form.Label>Total Members: </Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="No. of Members"
                                  value={totalMembers}
                                  onChange={(e) =>
                                    setTotalMembers(
                                      e.target.value.replace(/\D/g, "")
                                    )
                                  }
                                />
                              </Form.Group>
                            </div>
                          ) : status === "Accepted" ? (
                            <div>
                              {currentPackage.review === "" ? (
                                <FloatingLabel
                                  controlId="floatingTextarea"
                                  label="Enter Review"
                                  className="mb-3"
                                >
                                  <Form.Control
                                    as="textarea"
                                    className="shadow-none"
                                    placeholder="Review"
                                    onChange={(e) =>
                                      setReview(e.target.value.toLowerCase())
                                    }
                                  />
                                </FloatingLabel>
                              ) : null}
                            </div>
                          ) : null}
                        </Modal.Body>
                        <Modal.Footer>
                          {status === "Purchase" ? (
                            <Button
                              variant="primary"
                              onClick={
                                userID !== null
                                  ? () => purchasePackageHandler()
                                  : () => handleShowLogin()
                              }
                            >
                              {status}
                            </Button>
                          ) : status === "Accepted" ? (
                            <div className="d-flex w-100 justify-content-between">
                              {currentPackage.rating <= 0 ? (
                                <Rating
                                  initialValue={currentPackage.rating}
                                  onClick={(rate) => handleRating(rate)}
                                  size={25}
                                />
                              ) : (
                                <Rating
                                  size={25}
                                  initialValue={currentPackage.rating}
                                  readonly
                                />
                              )}
                              {currentPackage.review === "" ? (
                                <Button
                                  variant="primary"
                                  style={{ width: 150 }}
                                  onClick={() => handleReview()}
                                >
                                  Submit Review
                                </Button>
                              ) : null}
                            </div>
                          ) : status === "Pending" ? (
                            <Button variant="secondary" className="shadow-none">
                              {status}
                            </Button>
                          ) : (
                            <Button variant="danger" className="shadow-none">
                              {status}
                            </Button>
                          )}
                          {status !== "Accepted" ? (
                            <Button variant="secondary" className="shadow-none">
                              Query
                            </Button>
                          ) : null}
                        </Modal.Footer>
                      </Modal>
                    </div>
                  );
                })}
              </div>
              {/* Login Modal */}
              <Modal show={showLogin} onHide={handleCloseLogin}>
                <Modal.Header closeButton>
                  <Modal.Title>{signup ? "Signup" : "Login"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {error ? (
                    <>
                      <ErrorAlert errorMessage={errorMsg} />
                    </>
                  ) : null}
                  <Form>
                    {!signup && (
                      <>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            value={email}
                            placeholder="name@example.com"
                            // autoFocus
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={password}
                            placeholder="password"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </Form.Group>
                        {!signup && (
                          <>
                            <Button
                              variant="success"
                              className="w-100"
                              onClick={() => handleUserLogin()}
                            >
                              Login
                            </Button>
                          </>
                        )}
                        <p
                          className="text-dark pt-3 text-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => forgotPassHandler()}
                        >
                          Forgot Password
                        </p>
                        <p className="text-center my-3">
                          Don't have an account?
                        </p>

                        <Button
                          variant="primary"
                          className="w-100 "
                          onClick={() => setSignup(true)}
                        >
                          Create an Account
                        </Button>
                      </>
                    )}
                    {signup && (
                      <>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={signUpValues.fullName}
                            placeholder="Full Name"
                            autoFocus
                            onChange={(e) =>
                              postSignUpData(
                                "fullName",
                                e.target.value.toLowerCase()
                              )
                            }
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            value={signUpValues.emailAddress}
                            placeholder="name@example.com"
                            // autoFocus
                            onChange={(e) =>
                              postSignUpData(
                                "emailAddress",
                                e.target.value.toLowerCase()
                              )
                            }
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Contact No.</Form.Label>
                          <Form.Control
                            type="text"
                            value={signUpValues.contactNo}
                            placeholder="Contact No."
                            onChange={(e) =>
                              postSignUpData(
                                "contactNo",
                                e.target.value.replace(/\D/g, "")
                              )
                            }
                          />
                        </Form.Group>

                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={signUpValues.password}
                            placeholder="Password"
                            onChange={(e) =>
                              postSignUpData("password", e.target.value)
                            }
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Confirm Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={signUpValues.confirmPassword}
                            placeholder="Confirm Password"
                            onChange={(e) =>
                              postSignUpData("confirmPassword", e.target.value)
                            }
                          />
                        </Form.Group>
                        {signup && (
                          <Button
                            variant="success"
                            className="w-100"
                            onClick={() => handleSubmission()}
                          >
                            Create Account
                          </Button>
                        )}
                        <p className="text-center my-3">
                          Already have an account?
                        </p>
                        <Button
                          variant="primary"
                          className="w-100"
                          onClick={() => setSignup(false)}
                        >
                          Login
                        </Button>
                      </>
                    )}
                  </Form>
                </Modal.Body>
              </Modal>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
