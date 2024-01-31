import React, { useState, useEffect } from "react";
import {
  Container,
  Tab,
  Tabs,
  Table,
  Button,
  Modal,
  Row,
  Form,
  Col,
} from "react-bootstrap";
import AdminNavbar from "../AdminNavbar";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
// import  SMTPClient from "emailjs";

function CustomerQueries() {
  const [purchaseQuery, setPurchaseQuery] = useState([]);
  const [customPackages, setCustomPackages] = useState([]);
  const [customerQuery, setCustomerQuery] = useState([]);
  const [values, setValues] = useState({
    id: "",
    user_id: "",
    user_name: "",
    user_email: "",
    user_contact: "",
    address: "",
    total_members: 0,
    tripDuration: 0,
    departCity: "",
    destination: "",
    departDate: "",
    returnDate: "",
    travelVia: "",
    otherInform: "",
  });

  const [show, setShow] = useState(false);
  const getPurchasingQuery = async () => {
    const data = await getDocs(collection(db, "user_purchase_packages"));
    setPurchaseQuery(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    const custom_package_data = await getDocs(
      collection(db, "customerQueries")
    );
    setCustomPackages(
      custom_package_data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
    const customer_queries = await getDocs(collection(db, "queries"));
    setCustomerQuery(
      customer_queries.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };

  console.log("purchaseQuery===>", purchaseQuery);
  console.log("customQuery====>", customPackages);
  console.log("QUERY===>", customerQuery);

  const requestAccept = async (id) => {
    const myDoc = doc(db, "user_purchase_packages", id);
    const newFields = {
      isRequested: false, // MODIFY
      isRejected: false,
      isAccepted: true, // MODIFY
    };
    await updateDoc(myDoc, newFields);
    getPurchasingQuery();
  };

  const requestReject = async (id) => {
    const myDoc = doc(db, "user_purchase_packages", id);
    const newFields = {
      isRequested: false, // MODIFY
      isAccepted: false,
      isRejected: true, // MODIFY
    };
    await updateDoc(myDoc, newFields);
    getPurchasingQuery();
  };
  // const client = new SMTPClient({
  //   user: 'user',
  //   password: 'password',
  //   host: 'smtp.your-email.com',
  //   ssl: true,
  // });
  
 

// const sendEmail=async()=>{
//   try {
//     const message = await client.sendAsync({
//       text: 'i hope this works',
//       from: 'you <hassanafnan20@gmail.com>',
//       to: 'afnan.hassan@crowdbotics.com ',
//       cc: 'else <else@your-email.com>',
//       subject: 'testing emailjs',
//     });
//     console.log('message send email',message);
//   } catch (err) {
//     console.error('err email',err);
//   }
// }


  const handleCustomAccept = async (id) => {
    const myDoc = doc(db, "customerQueries", id);
    const newFields = {
      isRequested: false, // MODIFY
      isRejected: false,
      isAccepted: true, // MODIFY
    };
    await updateDoc(myDoc, newFields);
    getPurchasingQuery();
  };

  const handleCustomReject = async (id) => {
    const myDoc = doc(db, "customerQueries", id);
    const newFields = {
      isRequested: false, // MODIFY
      isAccepted: false,
      isRejected: true, // MODIFY
    };
    await updateDoc(myDoc, newFields);
    getPurchasingQuery();
  };

  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    setShow(true);
    setValues({
      id: e.id,
      user_id: e.user_id,
      user_name: e.user_name,
      user_email: e.email,
      user_contact: e.phoneNumber,
      address: e.address,
      total_members: e.members,
      tripDuration: e.tripDuration,
      departCity: e.departCity,
      destination: e.destination,
      departDate: e.departDate,
      returnDate: e.returnDate,
      travelVia: e.travelVia,
      price: e.price.toLocaleString(),
      otherInform: e.otherInform,
    });
  };

  useEffect(() => {
    getPurchasingQuery();
  }, []);

 

  return (
    <>
      <AdminNavbar />
      <Container>
        <Tabs
          defaultActiveKey="query"
          id="justify-tab-example"
          className="mt-5"
          justify
        >
          <Tab eventKey="query" title="Customer Queries">
            {/* <h3 className="text-center my-5">Purchasing Query</h3> */}
            <div className="my-3 p-3 bg-body rounded shadow">
              <Table striped bordered hover size="sm" responsive>
                <thead className="text-center">
                  <tr>
                    {/* <th>#</th> */}
                    {/* <th>User ID</th>
                    <th>Package ID</th> */}
                    <th>Package Title</th>
                    <th>User Email</th>
                    <th>Contact No.</th>
                    <th>Customer Query</th>
                    <th>Query Date & Time</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {customerQuery
                    ?.sort(
                      (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
                    )
                    .map((e, i) => {
                      return (
                        <tr key={i}>
                          {/* <td>{i}</td> */}
                          <td className="text-capitalize">{e.package_title}</td>
                          <td>{e.user_email}</td>
                          <td>{e.user_contact}</td>
                          <td className="text-success">{e.customer_query}</td>
                          <td>{e.dateTime}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          </Tab>
          <Tab eventKey="profile" title="Purchasing Query">
            {/* <h3 className="text-center my-5">Purchasing Query</h3> */}
            <div className="my-3 p-3 bg-body rounded shadow">
              <Table striped bordered hover size="sm" responsive>
                <thead className="text-center">
                  <tr>
                    {/* <th>#</th> */}
                    {/* <th>User ID</th>
                    <th>Package ID</th> */}
                    <th>Package Title</th>
                    <th>User Email</th>
                    <th>Contact No.</th>
                    <th>Query Date & Time</th>
                    <th>Package Price</th>
                    <th>Members</th>
                    <th>Duration</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {purchaseQuery
                    ?.sort(
                      (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
                    )
                    .map((e, i) => {
                      return (
                        <tr key={i}>
                          {/* <td>{i}</td> */}
                          <td className="text-capitalize">{e.package_title}</td>
                          <td>{e.user_email}</td>
                          <td>{e.user_contact}</td>
                          <td>{e.dateTime}</td>
                          <td>RS. {e.package_price.toLocaleString()}</td>
                          <td>{e.total_members}</td>
                          <td>{e.package_duration}</td>
                          <td>RS. {e.total_amount.toLocaleString()}</td>
                          <td className="text-danger">
                            {e.isRequested ? (
                              <span>Pending</span>
                            ) : e.isRejected ? (
                              <span className="text-danger">Rejected</span>
                            ) : (
                              <span className="text-success">Accepted</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex justify-content-center align-items-center">
                              {e.isRequested && (
                                <Button
                                  variant="success"
                                  onClick={() => requestAccept(e.id)}
                                  // onClick={client}
                                >
                                  Accept
                                </Button>
                              )}
                              {!e.isRejected ? (
                                <Button
                                  variant="danger"
                                  className="mx-2"
                                  onClick={() => requestReject(e.id)}
                                >
                                  Reject
                                </Button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          </Tab>
          <Tab eventKey="longer-tab" title="Customize Package Query">
            {/* <h3 className="text-center my-5">Custom Package Query</h3> */}

            <div className="my-3 p-3 bg-body rounded shadow">
              <Table striped bordered hover size="sm" responsive>
                <thead className="text-center">
                  <tr>
                    {/* <th>#</th> */}
                    <th>User Email</th>
                    <th>Contact No.</th>
                    <th>Total Members</th>
                    <th>Duration</th>
                    <th>Departure City</th>
                    <th>Destination</th>
                    <th>Query Date & Time</th>
                    <th>Status</th>
                    <th>View Details</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {customPackages
                    ?.sort(
                      (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
                    )
                    .map((e, i) => {
                      return (
                        <tr key={i}>
                          {/* <td>{i}</td> */}
                          <td>{e.email}</td>
                          <td>{e.phoneNumber}</td>
                          <td>{e.members}</td>
                          <td>{e.tripDuration}</td>
                          <td className="text-success text-capitalize">
                            {e.departCity}
                          </td>
                          <td className="text-danger text-capitalize">
                            {e.destination}
                          </td>
                          <td>{e.created_At}</td>
                          <td>
                            {" "}
                            {e.isRequested ? (
                              <span className="text-danger">Pending</span>
                            ) : e.isRejected ? (
                              <span className="text-danger">Rejected</span>
                            ) : (
                              <span className="text-success">Accepted</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex justify-content-center align-items-center">
                              <Button
                                variant="primary"
                                size="sm"
                                className="shadow-none"
                                onClick={() => handleShow(e)}
                              >
                                View Details
                              </Button>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center align-items-center">
                              {e.isRequested && (
                                <Button
                                  variant="success"
                                  size="sm"
                                  className="shadow-none"
                                  onClick={() => handleCustomAccept(e.id)}
                                >
                                  Accept
                                </Button>
                              )}
                              {!e.isRejected ? (
                                <Button
                                  variant="danger"
                                  className="mx-2 shadow-none"
                                  size="sm"
                                  onClick={() => handleCustomReject(e.id)}
                                >
                                  Reject
                                </Button>
                              ) : null}
                            </div>
                          </td>
                          <Modal
                            show={show}
                            onHide={handleClose}
                            scrollable={true}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>Custom Package Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <Row className="mb-3">
                                <h4 className="py-3">User Details:-</h4>
                                <Form.Group as={Col} md="12">
                                  <Form.Label>User Name</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Address"
                                    defaultValue={values.user_name}
                                    disabled
                                  />
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                  <Form.Label>Email Address</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Address"
                                    defaultValue={values.user_email}
                                    disabled
                                  />
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                  <Form.Label>Contact No.</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Address"
                                    defaultValue={values.user_contact}
                                    disabled
                                  />
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                  <Form.Label>Address</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Address"
                                    defaultValue={values.address}
                                    disabled
                                  />
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <h4 className="py-3">Trip Details:-</h4>
                                <Form.Group as={Col} md="12">
                                  <Form.Label>Depart City</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Address"
                                    defaultValue={values.departCity}
                                    disabled
                                  />
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                  <Form.Label>Destination</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Address"
                                    defaultValue={values.destination}
                                    disabled
                                  />
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                  <Form.Label>Total Members</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Address"
                                    defaultValue={values.total_members}
                                    disabled
                                  />
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                  <Form.Label>Departure Date</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Address"
                                    defaultValue={values.departDate}
                                    disabled
                                  />
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                  <Form.Label>Return Date</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Address"
                                    defaultValue={values.returnDate}
                                    disabled
                                  />
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                  <Form.Label>Duration</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Address"
                                    defaultValue={values.tripDuration}
                                    disabled
                                  />
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                  <Form.Label>Travel Via</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Address"
                                    defaultValue={values.travelVia}
                                    disabled
                                  />
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                  <Form.Label>Price</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Price"
                                    defaultValue={values.price}
                                    disabled
                                  />
                                </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                <h4 className="py-3">Other Details:-</h4>
                                <Form.Group as={Col} md="12">
                                  <Form.Label>Other Information</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Address"
                                    defaultValue={values.otherInform}
                                    disabled
                                  />
                                </Form.Group>
                              </Row>
                            </Modal.Body>
                            <Modal.Footer>
                              {/* <Button variant="secondary" onClick={handleClose}>
                                Close
                              </Button> */}
                              <Button variant="primary" onClick={handleClose}>
                                Save Changes
                              </Button>
                            </Modal.Footer>
                          </Modal>
                          {/* <td>{e.members}</td> */}
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          </Tab>
        </Tabs>
      </Container>
    </>
  );
}

export default CustomerQueries;
