import React, { useState, useEffect } from "react";
import "../../App.css";
import Header from "../Header";
// import ProductImage from "../../assets/images/package-img.png";
import Airplane from "../../assets/images/airplane.png";
import Icon2 from "../../assets/images/img-2.png";
import Icon3 from "../../assets/images/img-3.png";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Card, Modal, Button, Form, Alert } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import LoadingSpinner from "../LoadingSpinner";
import Footer from "../Footer";

export default function Products() {
  const userID = sessionStorage.getItem("user_id");
  const user_email = sessionStorage.getItem("user_email");
  const [loader, setLoader] = useState(false);
  // const [packages, setPackages] = useState([]);
  const [status, setStatus] = useState("Purchase");
  const [show, setShow] = useState(false);
  const [myPackages, setmyPackages] = useState([]);
  const [acceptedPackages, setAcceptedPackages] = useState([]);
  const [rejectedPackages, setRejectedPackages] = useState([]);
  const [pendingPackages, setPendingPackages] = useState([]);
  const [customPackages, setCustomPackages] = useState([]);
  const [currentPackage, setCurrentPackage] = useState([]);
  const [customCurrentPackage, setCustomCurrentPackages] = useState([]);
  const [values, setValues] = useState({
    image: "",
    title: "",
    price: "",
    description: "",
    departDate: "",
    returnDate: "",
    duration: "",
    totalAmount: "",
    user_members: 0,
  });
  const [customValues, setCustomValues] = useState({
    address: "",
    departCity: "",
    destination: "",
    price: 0,
    departDate: "",
    returnDate: "",
    otherInformation: "",
    travelVia: [],
    member: 0,
    tripDuration: 0,
    createdAt: "",
    email: "",
  });
  const [totalMembers, setTotalMembers] = useState(1);
  const [customTotalMembers, setCustomTotalMembers] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [rating2, setRating2] = useState(0);
  const [review2, setReview2] = useState("");
  const [myReview, setMyReview] = useState("");
  const [reviewShow, setReviewShow] = useState(false);
  // const [myReview2, setMyReview2] = useState("");
  const [reviewShow2, setReviewShow2] = useState(false);
  const [show2, setShow2] = useState(false);
  const [customStatus, setCustomStatus] = useState("Purchase");

  const [myRating, setMyRating] = useState(0);

  const getPackages = async () => {
    setLoader(true);
    // Get USER PURCHASE REQUEST
    const q = query(
      collection(db, "user_purchase_packages"),
      where("user_id", "==", userID)
    );
    const data = await getDocs(q);
    setmyPackages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    // Get CustomPackages Request
    const customQuery = query(
      collection(db, "customerQueries"),
      where("user_id", "==", userID)
    );
    const customData = await getDocs(customQuery);
    setCustomPackages(
      customData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
    setLoader(false);
  };

  console.log("user_puchase_packages===>", myPackages);
  console.log("CUSTOM_PACKAGES====>", customPackages);

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
      totalAmount: "",
    });
    setReviewShow(false);
    // getPackages();
  };

  const handleShow = async (e) => {
    // let check = myPackages.filter(f => f.package_id === e.id)
    // console.log("HANDLE SHOW  ===>", check);
    console.log("E ==>", e);
    if (e.isRequested) {
      setStatus("Pending");
    } else if (e.isAccepted) {
      setStatus("Accepted");
    } else if (e.isRejected) {
      setStatus("Rejected");
    }
    setShow(true);
    setValues({
      image: e.package_image,
      title: e.package_title,
      // description: e.description,
      // departDate: e.departDate,
      // returnDate: e.returnDate,
      duration: e.package_duration,
      price: e.package_price,
      totalAmount: e.total_amount,
      user_members: Number(e.total_members),
    });
    setReview(e.review);
    // setRating(e.rating);
    setMyRating(e.rating);
    setTotalMembers(Number(e.total_members));
    setSelectedPackage(e);
    setCurrentPackage(e);
  };

  const handleClose2 = () => {
    setShow2(false);
    setCustomValues({
      address: "",
      departCity: "",
      destination: "",
      price: 0,
      departDate: "",
      otherInformation: "",
      travelVia: [],
      member: 0,
      tripDuration: 0,
      createdAt: "",
      email: "",
    });
    setReviewShow2(false);
    // getPackages();
  };

  const handleShow2 = (e) => {
    console.log("HandleShow2====>", e);
    if (e.isRequested) {
      setCustomStatus("Pending");
    } else if (e.isAccepted) {
      setCustomStatus("Accepted");
    } else if (e.isRejected) {
      setCustomStatus("Rejected");
    }
    setShow2(true);
    setCustomValues({
      address: e.address,
      departCity: e.departCity,
      destination: e.destination,
      price: e.price,
      departDate: e.departDate,
      returnDate: e.returnDate,
      otherInformation: e.otherInformation,
      travelVia: e.travelVia,
      member: e.members,
      tripDuration: e.tripDuration,
      createdAt: e.created_At,
      email: e.email,
    });
    setReview2(e.review);
    setRating2(e.rating);
    setCustomCurrentPackages(e);
  };

  const purchasePackageHandler = async () => {
    console.log("DATA==>", selectedPackage);
    if (totalMembers === 0) {
      alert("Enter No. of Members");
      return;
    } else {
      await addDoc(collection(db, "user_purchase_packages"), {
        user_id: userID,
        user_email: user_email,
        package_id: selectedPackage.id,
        package_image: selectedPackage.image,
        package_title: selectedPackage.title,
        package_duration: selectedPackage.tripDuration,
        package_price: selectedPackage.price,
        total_members: totalMembers,
        total_amount: selectedPackage.price * totalMembers,
        isRequested: true,
        isAccepted: false,
        isRejected: false,
        dateTime: new Date().toLocaleString(),
      });
      alert("Package Purchase Successfully.");
    }
  };

  console.log("Current Package====>", currentPackage);
  // Rating Handle

  const handleRating = async (rate) => {
    setLoader(true);
    console.log("===>", currentPackage.id);
    console.log(rate);
    setRating(rate);
    const myDoc = doc(db, "user_purchase_packages", currentPackage.id);
    const packageDoc = doc(db, "packages", currentPackage.package_id);
    await updateDoc(myDoc, { rating: rate });
    await updateDoc(packageDoc, {
      users_rating: arrayUnion({ id: Math.random() * 8, rating: rate }),
    });
    let tempArr = [];
    currentPackage.users_rating.length &&
      currentPackage.users_rating.forEach((fe) => tempArr.push(fe.rating));
    let avgRating =
      ((tempArr.length ? tempArr.reduce((a, b) => a + b, 0) : 0) + rate) /
      ((tempArr.length ? tempArr.length : 0) + 1);
    console.log("avgRating", avgRating);
    console.log(currentPackage.users_rating);
    await updateDoc(packageDoc, { avg_rating: avgRating });
    setShow(false);
    getPackages();
  };

  const handleReview = async () => {
    if (myReview === "" && rating === 0) {
      alert("Fill all the Fields.");
      return;
    } else {
      setLoader(true);
      const packageDoc = doc(db, "packages", currentPackage.package_id);
      const myDoc = doc(db, "user_purchase_packages", currentPackage.id);
      const newFields = {
        review: myReview, // MODIFY
      };
      await updateDoc(myDoc, newFields);
      await updateDoc(myDoc, { rating: rating });
      await updateDoc(packageDoc, {
        users_rating: arrayUnion({ id: Math.random() * 8, rating: rating }),
      });
      let tempArr = [];
      currentPackage.users_rating.length &&
        currentPackage.users_rating.forEach((fe) => tempArr.push(fe.rating));
      let avgRating =
        ((tempArr.length ? tempArr.reduce((a, b) => a + b, 0) : 0) + rating) /
        ((tempArr.length ? tempArr.length : 0) + 1);
      console.log("avgRating", avgRating);
      console.log(currentPackage.users_rating);
      await updateDoc(packageDoc, { avg_rating: avgRating });
      alert("Review Submit Successfully.");
      setMyReview("");
      setShow(false);
      setReviewShow(false);
      getPackages();
    }
  };

  // UPDATE MEMBERS

  const handleUpdateMembers = async () => {
    if (totalMembers === 0 || totalMembers === "") {
      alert("Fill all the Fields.");
    } else {
      console.log("handleUpdateMembers===>", totalMembers);
      const myDoc = doc(db, "user_purchase_packages", currentPackage.id);
      const newFields = {
        total_members: totalMembers, // MODIFY
        total_amount: totalMembers * currentPackage.package_price,
      };
      await updateDoc(myDoc, newFields);
      handleClose();
      getPackages();
    }
  };

  // UPDATE MEMBERS FOR CUSTOM PACKAGE

  const updateMembers = async () => {
    if (totalMembers === 0 || totalMembers === "") {
      alert("Fill all the Fields.");
    } else {
      console.log("Update Members ===>", totalMembers);
      const myDoc = doc(db, "customerQueries", customCurrentPackage.id);
      const newFields = {
        members: totalMembers, // MODIFY
      };
      await updateDoc(myDoc, newFields);
      setShow2(false);
      getPackages();
    }
  };

  // Optional callback functions
  // const onPointerEnter = () => console.log('Enter')
  // const onPointerLeave = () => console.log('Leave')
  // const onPointerMove = (value, index) => console.log(value, index)

  const handleAcceptFilter = () => {
    let newArr = myPackages?.filter((f) => f.isAccepted === true);
    setAcceptedPackages(newArr);
  };

  const handleRejectFilter = () => {
    let newArr = myPackages?.filter((f) => f.isRejected === true);
    setRejectedPackages(newArr);
  };

  const handlePendingFilter = () => {
    let newArr = myPackages?.filter((f) => f.isRequested === true);
    setPendingPackages(newArr);
  };

  useEffect(() => {
    getPackages();
  }, []);
  useEffect(() => {
    handleRejectFilter();
    handleAcceptFilter();
    handlePendingFilter();
  }, [myPackages]);

  console.log("REVIEW===>", reviewShow);

  return (
    <>
      {loader ? (
        <LoadingSpinner />
      ) : (
        <>
          <Header />
          <div className="products">
            <h1 className="display-1">My Packages</h1>
          </div>

          {/* Accept */}

          {acceptedPackages.length ? (
            <h3 className="text-center my-5">Accepted Packages</h3>
          ) : null}

          <div className="album pb-5 bg-light">
            <div className="container">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {acceptedPackages?.map((e, i) => {
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
                          height={200}
                          src={e.package_image}
                        />
                        <Card.Body>
                          <Card.Title className="text-capitalize text-dark">
                            {e.package_title}
                          </Card.Title>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="btn-group">
                              <img
                                style={{
                                  backgroundColor: "rgba(77, 45, 219, 0.518)",
                                }}
                                className="img-fluid p-1 rounded-circle mx-1"
                                alt="Travel Image"
                                src={Airplane}
                              />
                              <img
                                style={{
                                  backgroundColor: "rgba(77, 45, 219, 0.518)",
                                }}
                                className="img-fluid px-2 py-1 rounded-circle mx-1"
                                alt="Travel Image"
                                src={Icon3}
                              />
                              <img
                                style={{
                                  backgroundColor: "rgba(77, 45, 219, 0.518)",
                                }}
                                className="img-fluid p-1 rounded-circle mx-1"
                                alt="Travel Image"
                                src={Icon2}
                              />
                            </div>
                            <small className="text-dark fs-5">
                              {" "}
                              Rs. {e.total_amount.toLocaleString()}
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
                            {" "}
                            Trip Duration : {e.package_duration} Days{" "}
                          </p>
                        </Card.Body>
                      </div>
                      <Modal show={show} onHide={handleClose} scrollable={true}>
                        <Modal.Header closeButton>
                          <Modal.Title>Package Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <img
                            src={values.image}
                            alt="packageImg"
                            className="my-2 img-fluid"
                          />
                          <Alert
                            className="text-center"
                            variant={
                              status === "Accepted"
                                ? "success"
                                : customStatus === "Pending"
                                ? "secondary"
                                : "danger"
                            }
                          >
                            {status}
                          </Alert>
                          <p>
                            {" "}
                            Package Name:{" "}
                            <span className="text-success text-capitalize">
                              {values.title}
                            </span>
                          </p>

                          {/* <p> Package Description: {description}</p> */}
                          {/* <p> Depart Date: {values.departDate}</p>
                        <p> Return Date: {values.returnDate}</p> */}
                          <p> Trip Duration: {values.duration} Days</p>
                          <p>Members: {values.user_members}</p>
                          <p>
                            {" "}
                            Total Amount:{" "}
                            <span className="text-success fw-bold">
                              {" "}
                              RS {values.totalAmount.toLocaleString()}
                            </span>{" "}
                          </p>
                          <p>
                            {" "}
                            Per Head:{" "}
                            <span className="text-success fw-bold">
                              {" "}
                              RS {values.price.toLocaleString()}{" "}
                            </span>{" "}
                          </p>
                          {review !== "" ? (
                            <p className="text-capitalize">Reviews: {review}</p>
                          ) : null}
                          <div className="my-4">
                            {!myRating <= 0 ? (
                              <Rating
                                size={25}
                                initialValue={rating}
                                readonly
                              />
                            ) : null}
                          </div>
                          <div>
                            {status === "Accepted" ? (
                              <>
                                {reviewShow && (
                                  <>
                                    <Form.Control
                                      as="textarea"
                                      className="shadow-none mt-3 mb-3"
                                      placeholder="Review"
                                      onChange={(e) =>
                                        setMyReview(
                                          e.target.value.toLowerCase()
                                        )
                                      }
                                    />
                                    <div>
                                      {/*  Rating */}
                                      <Rating
                                        initialValue={rating}
                                        onClick={(rate) => setRating(rate)}
                                        size={25}
                                      />
                                    </div>
                                    <Button
                                      variant={
                                        rating === 0 || myReview === ""
                                          ? "secondary"
                                          : "success"
                                      }
                                      className="mt-3"
                                      disabled={
                                        rating === 0 || myReview === ""
                                          ? true
                                          : false
                                      }
                                      style={{ width: 150 }}
                                      onClick={() => handleReview()}
                                    >
                                      Submit Review
                                    </Button>
                                  </>
                                )}
                              </>
                            ) : null}
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          {status === "Accepted" ? (
                            <div className="d-flex w-100 justify-content-between">
                              {/* {rating <= 0 ? (
                                <Rating
                                  initialValue={rating}
                                  onClick={(rate) => handleRating(rate)}
                                  size={25}
                                />
                              ) : (
                                <Rating
                                  size={25}
                                  initialValue={rating}
                                  readonly
                                />
                              )} */}
                              {currentPackage.review === "" &&
                              reviewShow === false ? (
                                <Button
                                  variant="primary"
                                  style={{ width: 150 }}
                                  onClick={() => setReviewShow(true)}
                                >
                                  Review
                                </Button>
                              ) : null}
                            </div>
                          ) : null}
                        </Modal.Footer>
                      </Modal>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pending */}

          {pendingPackages.length ? (
            <h3 className="text-center my-5">Pending Packages</h3>
          ) : null}

          <div className="album py-5 bg-light">
            <div className="container">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {pendingPackages.map((e, i) => {
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
                          height={200}
                          src={e.package_image}
                        />
                        <Card.Body>
                          <Card.Title className="text-capitalize text-dark">
                            {e.package_title}
                          </Card.Title>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="btn-group">
                              <img
                                style={{
                                  backgroundColor: "rgba(77, 45, 219, 0.518)",
                                }}
                                className="img-fluid p-1 rounded-circle mx-1"
                                alt="Travel Image"
                                src={Airplane}
                              />
                              <img
                                style={{
                                  backgroundColor: "rgba(77, 45, 219, 0.518)",
                                }}
                                className="img-fluid px-2 py-1 rounded-circle mx-1"
                                alt="Travel Image"
                                src={Icon3}
                              />
                              <img
                                style={{
                                  backgroundColor: "rgba(77, 45, 219, 0.518)",
                                }}
                                className="img-fluid p-1 rounded-circle mx-1"
                                alt="Travel Image"
                                src={Icon2}
                              />
                            </div>
                            <small className="text-dark fs-5">
                              {" "}
                              Rs. {e.total_amount.toLocaleString()}
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
                            {" "}
                            Trip Duration : {e.package_duration} Days{" "}
                          </p>
                        </Card.Body>
                      </div>
                      <Modal show={show} onHide={handleClose} scrollable={true}>
                        <Modal.Header closeButton>
                          <Modal.Title>Package Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <img
                            src={values.image}
                            alt="packageImg"
                            className="my-2 img-fluid"
                          />
                          <Alert
                            className="text-center"
                            variant={
                              status === "Accepted"
                                ? "success"
                                : customStatus === "Pending"
                                ? "secondary"
                                : "danger"
                            }
                          >
                            {status}
                          </Alert>
                          <p>
                            {" "}
                            Package Name:{" "}
                            <span className="text-success text-capitalize">
                              {values.title}
                            </span>
                          </p>

                          {/* <p> Package Description: {description}</p> */}
                          {/* <p> Depart Date: {values.departDate}</p>
                        <p> Return Date: {values.returnDate}</p> */}
                          <p> Trip Duration: {values.duration} Days</p>
                          <p>Members: {values.user_members}</p>
                          <p>
                            {" "}
                            Total Amount:{" "}
                            <span className="text-success fw-bold">
                              {" "}
                              RS {values.totalAmount.toLocaleString()}
                            </span>{" "}
                          </p>
                          <p>
                            {" "}
                            Per Head:{" "}
                            <span className="text-success fw-bold">
                              {" "}
                              RS {values.price.toLocaleString()}{" "}
                            </span>{" "}
                          </p>
                          {review !== "" ? (
                            <p className="text-capitalize">Reviews: {review}</p>
                          ) : null}
                          {status === "Pending" ? (
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
                                <Button
                                  variant="success"
                                  className="mt-2"
                                  onClick={() => handleUpdateMembers()}
                                >
                                  Update Members
                                </Button>
                              </Form.Group>
                              {status === "Accepted" ? (
                                <>
                                  {reviewShow && (
                                    <>
                                      <Form.Control
                                        as="textarea"
                                        className="shadow-none mt-3 mb-3"
                                        placeholder="Review"
                                        onChange={(e) =>
                                          setMyReview(
                                            e.target.value.toLowerCase()
                                          )
                                        }
                                      />
                                      <Button
                                        variant="success"
                                        disabled={
                                          rating <= 0 || myReview === ""
                                            ? true
                                            : false
                                        }
                                        style={{ width: 150 }}
                                        onClick={() => handleReview()}
                                      >
                                        Submit Review
                                      </Button>
                                    </>
                                  )}
                                </>
                              ) : null}
                            </div>
                          ) : null}
                        </Modal.Body>
                        <Modal.Footer>
                          {
                            status === "Purchase" ? (
                              <Button
                                variant="primary"
                                onClick={() => purchasePackageHandler()}
                              >
                                {status}
                              </Button>
                            ) : status === "Accepted" ? (
                              <div className="d-flex w-100 justify-content-between">
                                {rating <= 0 ? (
                                  <Rating
                                    initialValue={rating}
                                    onClick={(rate) => handleRating(rate)}
                                    size={25}
                                  />
                                ) : (
                                  <Rating
                                    size={25}
                                    initialValue={rating}
                                    readonly
                                  />
                                )}
                                {currentPackage.review === "" &&
                                reviewShow === false ? (
                                  <Button
                                    variant="primary"
                                    style={{ width: 150 }}
                                    onClick={() => setReviewShow(true)}
                                  >
                                    Review
                                  </Button>
                                ) : null}
                              </div>
                            ) : null

                            // status === "Pending" ? (
                            //   <Button variant="secondary" className="shadow-none">
                            //     {status}
                            //   </Button>
                            // ) : (
                            //   <Button variant="danger" className="shadow-none">
                            //     {status}
                            //   </Button>
                            // )
                          }
                        </Modal.Footer>
                      </Modal>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reject */}

          {rejectedPackages.length ? (
            <h3 className="text-center my-5">Rejected Packages</h3>
          ) : null}

          <div className="album py-5 bg-light">
            <div className="container">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {rejectedPackages.map((e, i) => {
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
                          height={200}
                          src={e.package_image}
                        />
                        <Card.Body>
                          <Card.Title className="text-capitalize text-dark">
                            {e.package_title}
                          </Card.Title>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="btn-group">
                              <img
                                style={{
                                  backgroundColor: "rgba(77, 45, 219, 0.518)",
                                }}
                                className="img-fluid p-1 rounded-circle mx-1"
                                alt="Travel Image"
                                src={Airplane}
                              />
                              <img
                                style={{
                                  backgroundColor: "rgba(77, 45, 219, 0.518)",
                                }}
                                className="img-fluid px-2 py-1 rounded-circle mx-1"
                                alt="Travel Image"
                                src={Icon3}
                              />
                              <img
                                style={{
                                  backgroundColor: "rgba(77, 45, 219, 0.518)",
                                }}
                                className="img-fluid p-1 rounded-circle mx-1"
                                alt="Travel Image"
                                src={Icon2}
                              />
                            </div>
                            <small className="text-dark fs-5">
                              {" "}
                              Rs. {e.total_amount.toLocaleString()}
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
                            {" "}
                            Trip Duration : {e.package_duration} Days{" "}
                          </p>
                        </Card.Body>
                      </div>
                      <Modal show={show} onHide={handleClose} scrollable={true}>
                        <Modal.Header closeButton>
                          <Modal.Title>Package Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <img
                            src={values.image}
                            alt="packageImg"
                            className="my-2 img-fluid"
                          />
                          <Alert
                            className="text-center"
                            variant={
                              status === "Accepted"
                                ? "success"
                                : customStatus === "Pending"
                                ? "secondary"
                                : "danger"
                            }
                          >
                            {status}
                          </Alert>
                          <p>
                            {" "}
                            Package Name:{" "}
                            <span className="text-success text-capitalize">
                              {values.title}
                            </span>
                          </p>

                          {/* <p> Package Description: {description}</p> */}
                          {/* <p> Depart Date: {values.departDate}</p>
                        <p> Return Date: {values.returnDate}</p> */}
                          <p> Trip Duration: {values.duration} Days</p>
                          <p>Members: {values.user_members}</p>
                          <p>
                            {" "}
                            Total Amount:{" "}
                            <span className="text-success fw-bold">
                              {" "}
                              RS {values.totalAmount.toLocaleString()}
                            </span>{" "}
                          </p>
                          <p>
                            {" "}
                            Per Head:{" "}
                            <span className="text-success fw-bold">
                              {" "}
                              RS {values.price.toLocaleString()}{" "}
                            </span>{" "}
                          </p>
                          {review !== "" ? (
                            <p className="text-capitalize">Reviews: {review}</p>
                          ) : null}
                          {status === "Pending" ? (
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
                                <Button
                                  variant="success"
                                  className="mt-2"
                                  onClick={() => handleUpdateMembers()}
                                >
                                  Update Members
                                </Button>
                              </Form.Group>
                              {status === "Accepted" ? (
                                <>
                                  {reviewShow && (
                                    <>
                                      <Form.Control
                                        as="textarea"
                                        className="shadow-none mt-3 mb-3"
                                        placeholder="Review"
                                        onChange={(e) =>
                                          setMyReview(
                                            e.target.value.toLowerCase()
                                          )
                                        }
                                      />
                                      <Button
                                        variant="success"
                                        style={{ width: 150 }}
                                        onClick={() => handleReview()}
                                      >
                                        Submit Review
                                      </Button>
                                    </>
                                  )}
                                </>
                              ) : null}
                            </div>
                          ) : null}
                        </Modal.Body>
                        <Modal.Footer>
                          {
                            status === "Purchase" ? (
                              <Button
                                variant="primary"
                                onClick={() => purchasePackageHandler()}
                              >
                                {status}
                              </Button>
                            ) : status === "Accepted" ? (
                              <div className="d-flex w-100 justify-content-between">
                                {rating <= 0 ? (
                                  <Rating
                                    initialValue={rating}
                                    onClick={(rate) => handleRating(rate)}
                                    size={25}
                                  />
                                ) : (
                                  <Rating
                                    size={25}
                                    initialValue={rating}
                                    readonly
                                  />
                                )}
                                {currentPackage.review === "" &&
                                reviewShow === false ? (
                                  <Button
                                    variant="primary"
                                    style={{ width: 150 }}
                                    onClick={() => setReviewShow(true)}
                                  >
                                    Review
                                  </Button>
                                ) : null}
                              </div>
                            ) : null

                            // status === "Pending" ? (
                            //   <Button variant="secondary" className="shadow-none">
                            //     {status}
                            //   </Button>
                            // ) : (
                            //   <Button variant="danger" className="shadow-none">
                            //     {status}
                            //   </Button>
                            // )
                          }
                        </Modal.Footer>
                      </Modal>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CustomPackages */}

          {customPackages.length ? (
            <h3 className="text-center py-5">Custom Packages</h3>
          ) : null}

          <div className="album py-5 bg-light">
            <div className="container">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {customPackages?.map((e, i) => {
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
                        onClick={() => handleShow2(e)}
                      >
                        <Card.Img
                          variant="top"
                          className="pt-3 px-3"
                          height={200}
                          src="https://via.placeholder.com/300"
                        />
                        <Card.Body>
                          <Card.Title className="text-capitalize text-dark">
                            Custom Package
                          </Card.Title>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-dark fs-5">
                              {" "}
                              Rs. {e.price.toLocaleString()}
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
                            {" "}
                            Trip Duration : {e.tripDuration} Days{" "}
                          </p>
                        </Card.Body>
                      </div>
                      <Modal
                        show={show2}
                        onHide={handleClose2}
                        scrollable={true}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Package Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Alert
                            className="text-center"
                            variant={
                              customStatus === "Accepted"
                                ? "success"
                                : customStatus === "Pending"
                                ? "secondary"
                                : "danger"
                            }
                          >
                            {customStatus}
                          </Alert>
                          <p>
                            {" "}
                            Address:{" "}
                            <span className="text-success text-capitalize">
                              {customValues.address}
                            </span>
                          </p>

                          <p>
                            {" "}
                            Trip Duration: {customValues.tripDuration} Days
                          </p>
                          <p>
                            {" "}
                            Total Amount:{" "}
                            <span className="text-success fw-bold">
                              {" "}
                              {customValues.price} RS{" "}
                            </span>{" "}
                          </p>
                          <p>Your Email: {customValues.email}</p>
                          <p>Departure: {customValues.departCity}</p>
                          <p>Destination: {customValues.destination}</p>
                          <p>Date & Time: {customValues.createdAt}</p>
                          <p>
                            Travel Via : {customValues.travelVia.join(", ")}
                          </p>
                          <p>Members : {customValues.member}</p>
                          <p>Departure Date: {customValues.departDate}</p>
                          <p>Return Date: {customValues.returnDate}</p>
                          {customStatus === "Accepted" ? (
                            <>
                              <div>
                                <Form.Group
                                  className="mb-3"
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Label>Total Members: </Form.Label>
                                  <Form.Control
                                    type="number"
                                    placeholder="No. of Members"
                                    onChange={(e) =>
                                      setCustomTotalMembers(e.target.value)
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <div>
                                <Button
                                  variant="success"
                                  onClick={() => updateMembers()}
                                >
                                  {" "}
                                  Update Members{" "}
                                </Button>
                              </div>
                            </>
                          ) : null}
                        </Modal.Body>
                        {/* <Modal.Footer>

                        </Modal.Footer> */}
                      </Modal>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
