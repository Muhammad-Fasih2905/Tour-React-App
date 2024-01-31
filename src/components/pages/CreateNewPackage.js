import React, { useState } from "react";
import { Container, Row, Form, Button, Col } from "react-bootstrap";
import AdminNavbar from "../AdminNavbar";
import Multiselect from "multiselect-react-dropdown";
import { db, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import LoadingSpinner from "../LoadingSpinner";

const regionOptions = [
  {
    id: 0,
    label: "North",
    value: "north",
  },
  {
    id: 1,
    label: "South",
    value: "south",
  },
];

function CreateNewPackage() {
  const [loader, setLoader] = useState(false);
  const [file, setFile] = useState(null);
  const [values, setValues] = useState({
    title: "",
    description: "",
    contactNo: "",
    facilities: [],
    price: 0,
    tripDuration: 0,
    departDate: "",
    returnDate: "",
    region: "",
  });

  const handleChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const postUserData = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  // const imagesListRef = ref(storage, "images/");
  const handleImageUpload = () => {
    if (
      file == null ||
      values.title === "" ||
      values.description === "" ||
      values.contactNo === "" ||
      values.facilities === [] ||
      values.price === 0 ||
      values.departDate === "" ||
      values.returnDate === "" ||
      values.tripDuration === 0 ||
      values.region === ""
    ) {
      alert("Fill all the Fields");
      return;
    }
    setLoader(true);
    const imageRef = ref(storage, `images/${file.name}`);
    uploadBytes(imageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        try {
          (async () => {
            console.log(url);
            await addDoc(collection(db, "packages"), {
              title: values.title,
              description: values.description,
              region: values.region,
              contactNo: values.contactNo,
              image: url,
              facilities: values.facilities,
              price: Number(values.price),
              departDate: values.departDate,
              returnDate: values.returnDate,
              tripDuration: Number(values.tripDuration),
              review: "",
              rating: 0,
              avg_rating: 0,
              users_rating: [],
            });
          })();
          alert("Package Created.");
        } catch (error) {
          console.log("ERROR in handle Image Upload", error);
          alert("error", error);
        }
      });
    });
    setLoader(false);
  };

  // console.log("IMAGE URL--->", imageURL)
  // const getAllImages = () => {
  //   // listAll(imagesListRef).then((response) => {
  //   //   response.items.forEach((item) => {
  //   //     getDownloadURL(item).then((url) => {
  //   //       setImageURL((prev) => [...prev, url]);
  //   //     });
  //   //   });
  //   // });
  // }

  // const handleCreateNewPackage = async () => {
  //   try {
  //     if (values.title === '' || values.description === '' || values.contactNo === '' || values.facilities === [] || values.price === 0 || values.departDate === '' || values.returnDate === '') {
  //       alert('Fill all the Fields')
  //     } else {
  //       handleImageUpload()
  //       console.log(myURL)
  //       await addDoc(collection(db, "packages"), {
  //         title: values.title,
  //         description: values.description,
  //         contactNo: values.contactNo,
  //         image: imageURL,
  //         facilities: values.facilities,
  //         price: values.price,
  //         departDate: values.departDate,
  //         returnDate: values.returnDate,
  //         review: 0
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  return (
    <>
      {loader ? (
        <LoadingSpinner />
      ) : (
        <>
          <AdminNavbar />
          <Container>
            <h3 className="text-center my-5">Create New Package</h3>
            <Form.Group className="mb-3" controlId="formGridAddress1">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Title"
                onChange={(e) =>
                  postUserData("title", e.target.value.toLowerCase())
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGridAddress2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                as="textarea"
                rows={3}
                onChange={(e) =>
                  postUserData("description", e.target.value.toLowerCase())
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Region</Form.Label>
              <Form.Select
                aria-label="Region"
                onChange={(e) => postUserData("region", e.target.value)}
              >
                <option value="">Select Region</option>
                {regionOptions.map((e, i) => (
                  <option key={i} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Contact No.</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Contact No."
                  onChange={(e) =>
                    postUserData("contactNo", e.target.value.replace(/\D/g, ""))
                  }
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Facilities Included</Form.Label>
                <Multiselect
                  placeholder="Select Facilities"
                  isObject={false}
                  onRemove={(e) => console.log(e)}
                  onSelect={(e) => postUserData("facilities", e)}
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
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control type="file" onChange={(e) => handleChange(e)} />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Price"
                  onChange={(e) => postUserData("price", e.target.value)}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Depart Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Depart Date"
                  onChange={(e) => postUserData("departDate", e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Return Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Return Date"
                  onChange={(e) => postUserData("returnDate", e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Trip Duration</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="No. of Days"
                  onChange={(e) => postUserData("tripDuration", e.target.value)}
                />
              </Form.Group>
            </Row>
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                size="lg"
                className="shadow-none"
                onClick={() => handleImageUpload()}
              >
                Create New Package
              </Button>
            </div>
          </Container>
        </>
      )}
    </>
  );
}

export default CreateNewPackage;
