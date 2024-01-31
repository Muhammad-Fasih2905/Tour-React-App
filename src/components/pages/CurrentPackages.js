import React, { useState, useEffect } from "react";
import AdminNavbar from "../AdminNavbar";
// import ProductImage from "../../assets/images/package-img.png";
import Airplane from "../../assets/images/airplane.png";
import Icon2 from "../../assets/images/img-2.png";
import Icon3 from "../../assets/images/img-3.png";
import {
  Button,
  Card,
  Container,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import LoadingSpinner from "../LoadingSpinner";
import Multiselect from "multiselect-react-dropdown";

function CurrentPackages() {
  // const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);

  const [values, setValues] = useState({
    id: "",
    title: "",
    description: "",
    price: 0,
    contactNo: "",
    departDate: "",
    returnDate: "",
    tripDuration: 0,
    facilities: [],
    image: "",
  });

  const getPackages = async () => {
    const data = await getDocs(collection(db, "packages"));
    setPackages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  console.log(packages);

  const deletePackage = async (id) => {
    console.log("deletePackage===>", id);
    setLoader(true);
    const docRef = doc(db, "packages", id);
    await deleteDoc(docRef);
    console.log("delete doc success");
    getPackages();
    setLoader(false);
  };

  const handleClose = () => {
    setValues({
      id: "",
      title: "",
      description: "",
      price: "",
      contactNo: "",
      departDate: "",
      returnDate: "",
      tripDuration: "",
      facilities: [],
    });
    setShow(false);
  };

  const handleShow = (e) => {
    setValues({
      id: e.id,
      title: e.title,
      description: e.description,
      price: e.price,
      contactNo: e.contactNo,
      departDate: e.departDate,
      returnDate: e.returnDate,
      tripDuration: e.tripDuration,
      facilities: e.facilities,
    });
    setShow(true);
  };

  const handlePackageUpdate = async (id) => {
    const q = doc(db, "packages", id);
    const data = {
      title: values.title,
      description: values.description,
      price: Number(values.price),
      tripDuration: Number(values.tripDuration),
      contactNo: values.contactNo,
      departDate: values.departDate,
      returnDate: values.returnDate,
      facilities: values.facilities,
    };
    await updateDoc(q, data);
    handleClose();
    alert("Package Updated.");
    getPackages();
  };

  // console.log("CURRENT PACKAGES ===>", values);

  useEffect(() => {
    getPackages();
  }, []);

  const postUserData = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {loader ? (
        <LoadingSpinner />
      ) : (
        <>
          <AdminNavbar />

          <div className="album py-5 bg-light">
            <Container>
              <h3 className="text-center mb-4"> Services Offered </h3>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {packages.map((e, i) => {
                  return (
                    <div className="col" key={i}>
                      <div
                        className="card shadow mx-3 my-3"
                        style={{
                          border: "none",
                          borderRadius: 15,
                          backgroundColor: "rgba(131, 56, 236, 0.08)",
                          height: 600,
                        }}
                      >
                        <Card.Img
                          variant="top"
                          className="p-3"
                          src={e.image}
                          height={250}
                        />
                        <Card.Body>
                          <Card.Title className="text-capitalize">
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
                                alt="Travel"
                                src={Airplane}
                              />
                              <img
                                style={{
                                  backgroundColor: "rgba(77, 45, 219, 0.518)",
                                }}
                                className="img-fluid px-2 py-1 rounded-circle mx-1"
                                alt="Travel"
                                src={Icon3}
                              />
                              <img
                                style={{
                                  backgroundColor: "rgba(77, 45, 219, 0.518)",
                                }}
                                className="img-fluid p-1 rounded-circle mx-1"
                                alt="Travel"
                                src={Icon2}
                              />
                            </div>
                            <small className="text-danger ">
                              {" "}
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
                            {" "}
                            Trip Duration: {e.tripDuration} Days{" "}
                          </p>
                          <div className="w-100 p-2">
                            <div>
                              <Button
                                variant="danger"
                                className="w-100 shadow-none"
                                onClick={() => deletePackage(e.id)}
                              >
                                Delete Package
                              </Button>
                            </div>
                            <div>
                              <Button
                                variant="primary"
                                className="w-100 shadow-none mt-2"
                                onClick={() => handleShow(e)}
                              >
                                Edit Package Details
                              </Button>
                            </div>
                          </div>
                          {/* MODAL */}
                          <Modal
                            show={show}
                            onHide={handleClose}
                            scrollable={true}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>Edit Package Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                  <Form.Label>Title</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={values.title}
                                    onChange={(e) =>
                                      postUserData("title", e.target.value)
                                    }
                                  />
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                  <Form.Label>Description</Form.Label>
                                  <Form.Control
                                    type="text"
                                    as="textarea"
                                    rows={3}
                                    value={values.description}
                                    onChange={(e) =>
                                      postUserData(
                                        "description",
                                        e.target.value
                                      )
                                    }
                                  />
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                  <Form.Label>Facilities Included</Form.Label>
                                  {/* <Form.Control
                                    type="text"
                                    as="textarea"
                                    rows={3}
                                    value={values.description}
                                    onChange={(e) =>
                                      postUserData(
                                        "description",
                                        e.target.value
                                      )
                                    }
                                  /> */}
                                  <Multiselect
                                    selectedValues={values.facilities}
                                    placeholder="Select Facilities"
                                    isObject={false}
                                    showArrow={true}
                                    onRemove={(e) => postUserData("facilities", e)}
                                    onSelect={(e) =>
                                      postUserData("facilities", e)
                                    }
                                    options={[
                                      "Breakfast 1 Time",
                                      "Breakfast 2 Time (Anda Paratha OR Halwa Puri",
                                      "Lunch 1 Time",
                                      "Lunch 2 Time",
                                      "Dinner 1 Time",
                                      "Dinner 2 Time",
                                      "Bonfire",
                                      "Concert",
                                      "Musical Night",
                                      "Live BBQ Dinner",
                                      "Live Karahi Dinner",
                                      "Camping",
                                      "Departure Stop Pick & Drop",
                                      "Hotel Rooms On Twin Sharing",
                                      "Seperate For Couples (Extra Charges)",
                                    ]}
                                    // selectedValues={}
                                    // style={{  }}
                                    showCheckbox
                                  />
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                  <Form.Label>Depart Date</Form.Label>
                                  <Form.Control
                                    type="date"
                                    value={values.departDate}
                                    onChange={(e) =>
                                      postUserData("departDate", e.target.value)
                                    }
                                  />
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                  <Form.Label>Return Date</Form.Label>
                                  <Form.Control
                                    type="date"
                                    value={values.returnDate}
                                    onChange={(e) =>
                                      postUserData("returnDate", e.target.value)
                                    }
                                  />
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                  <Form.Label>Trip Duration</Form.Label>
                                  <Form.Control
                                    type="number"
                                    value={values.tripDuration}
                                    onChange={(e) =>
                                      postUserData(
                                        "tripDuration",
                                        e.target.value
                                      )
                                    }
                                  />
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                  <Form.Label>Price</Form.Label>
                                  <Form.Control
                                    type="number"
                                    value={values.price}
                                    onChange={(e) =>
                                      postUserData("price", e.target.value)
                                    }
                                  />
                                </Form.Group>
                              </Row>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                variant="success"
                                onClick={() => handlePackageUpdate(values.id)}
                              >
                                Save Changes
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </Card.Body>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Container>
          </div>
        </>
      )}
    </>
  );
}

export default CurrentPackages;
