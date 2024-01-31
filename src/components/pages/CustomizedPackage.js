import React, { useState } from "react";
// import { toast } from 'react-toastify';

const CustomizedPackage = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    departurecity: "",
    whereto: "",
    tripduration: "",
    message: "",
    familymem: "",
    depdate: "",
    returndate: "",
    via: "",

  });

  let name, value;
  const postUserData = (event) => {
    name = event.target.name;
    value = event.target.value;

    setUserData({ ...userData, [name]: value });
  };

  // connect with firebase
  const submitData = async (event) => {
    event.preventDefault();
    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      message,
      departurecity,
      whereto,
      tripduration,
      familymem,
      depdate,
      returndate,
      via } = userData;

    if (
      firstName && lastName
      && phone && email
      && address && message
      && departurecity && whereto
      && tripduration && familymem && depdate && returndate && via) {
      const res = fetch(
        "https://fyp-webapp-91db9-default-rtdb.firebaseio.com//userDataRecords.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            phone,
            email,
            address,
            departurecity,
            whereto,
            tripduration,
            message,
            familymem,
            depdate,
            returndate,
            via
          }),
        }
      );
      if (res) {
        setUserData({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          address: "",
          departurecity: "",
          whereto: "",
          tripduration: "",
          message: "",
          familymem: "",
          depdate: "",
          returndate: "",
          via: "",
        });
        //   if (name === "") {
        //     toast.error(' name field is requred!',{
        //         position: "top-center",
        //     });
        //   } else if (email === "") {
        //      toast.error('email field is requred',{
        //         position: "top-center",
        //     });
        //   } else if (!email.includes("@")) {
        //      toast.error('plz enter valid email address',{
        //         position: "top-center",
        //     });
        //   } else if (phone === Number) {
        //      toast.error('Please Enter number',{
        //         position: "top-center",
        //     });

        //   }else if (!phone.includes("-")) {
        //   toast.error('Please  use "-" in number',{
        //      position: "top-center",
        //     });
        //   }else if (departurecity === "") {
        //      toast.error('Please Enter Departure City',{
        //         position: "top-center",
        //     });
        //  } else if (whereto === "") {
        //      toast.error('Please Enter Destination',{
        //         position: "top-center",
        //     });
        //   }
        //   alert("Your Request Has Been Submitted. Please wait for our team to respond ");
        // } else {
        //   alert("plz fill the data");
      }
    } else {
      alert("plz fill the data");
    }
  };

  return (
    <>
      <h1 className='customizedpackage'>Customized Your Own Packages!!</h1>
      <section className="contactus-section" style={{ backgroundColor: "lightblue", marginTop: -1 }}>
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-10 mx-auto">
              <div className="row">
                <div className="contact-leftside col-12 col-lg-5" style={{ marginTop: 150 }}>
                  <h1 className="main-heading fw-bold" >Connect With Our Team.</h1>
                </div>

                {/* right side contact form  */}
                <div className="contact-rightside col-12 col-lg-7" style={{ marginTop: 35 }}>
                  <form method="POST">
                    <div className="row">
                      <h5>PERSONAL INFORMATION:</h5>
                      <div className="col-12 col-lg-6 contact-input-feild">

                        <input
                          type="text"
                          name="firstName"
                          id=""
                          className="form-control"
                          placeholder="First Name"
                          value={userData.firstName}
                          onChange={postUserData}
                        />
                      </div>
                      <div className="col-12 col-lg-6 contact-input-feild">
                        <input
                          type="text"
                          name="lastName"
                          id=""
                          className="form-control"
                          placeholder="Last Name"
                          value={userData.lastName}
                          onChange={postUserData}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-lg-6 contact-input-feild">
                        <input
                          type="text"
                          name="phone"
                          id=""
                          className="form-control"
                          placeholder="Phone Number "
                          value={userData.phone}
                          onChange={postUserData}
                        />
                      </div>
                      <div className="col-12 col-lg-6 contact-input-feild">
                        <input
                          type="text"
                          name="email"
                          id=""
                          className="form-control"
                          placeholder="Email ID"
                          value={userData.email}
                          onChange={postUserData}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 contact-input-feild">
                        <input
                          type="text"
                          name="address"
                          id=""
                          className="form-control"
                          placeholder="Add Address"
                          value={userData.address}
                          onChange={postUserData}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <h5>ABOUT TRIP:</h5>
                      <div className="col-12 contact-input-feild">
                        <input
                          type="text"
                          name="departurecity"
                          id=""
                          className="form-control"
                          placeholder="Departure City"
                          value={userData.departurecity}
                          onChange={postUserData}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 contact-input-feild">
                        <input
                          type="text"
                          name="whereto"
                          id=""
                          className="form-control"
                          placeholder="Destination"
                          value={userData.whereto}
                          onChange={postUserData}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 contact-input-feild">
                        <input
                          type="text"
                          name="tripduration"
                          id=""
                          className="form-control"
                          placeholder="Enter Your Trip Duration"
                          value={userData.tripduration}
                          onChange={postUserData}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 contact-input-feild">
                        <input
                          type="text"
                          name="familymem"
                          id=""
                          className="form-control"
                          placeholder="Enter Your Family Member(including infants)"
                          value={userData.familymem}
                          onChange={postUserData}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 contact-input-feild">
                        <input
                          type="text"
                          name="depdate"
                          id=""
                          className="form-control"
                          placeholder="Enter your departure date(e.g. 01-jan-2022)"
                          value={userData.depdate}
                          onChange={postUserData}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 contact-input-feild">
                        <input
                          type="text"
                          name="returndate"
                          id=""
                          className="form-control"
                          placeholder="Enter your return date(e.g. 01-jan-2022)"
                          value={userData.returndate}
                          onChange={postUserData}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <h5> VIA TRANSPORT/TRANSFER:</h5>
                      <div className="col-12 contact-input-feild">
                        <input
                          type="text"
                          name="via"
                          id=""
                          className="form-control"
                          placeholder="VIA (i.e. Bus,Train,Plane)"
                          value={userData.via}
                          onChange={postUserData}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <h5>OTHER INFORMATION:</h5>
                      <div className="col-12 ">
                        <input
                          type="text"
                          name="message"
                          id=""
                          className="form-control"
                          placeholder="Your Preference"
                          value={userData.message}
                          onChange={postUserData}
                        />
                      </div>
                    </div>
                    <div class="form-check form-checkbox-style">
                      <label
                        class="form-check-label"
                        className="main-hero-para">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value={userData.chkbxlab}
                          id="flexCheckChecked"
                          onChange={postUserData}
                        />
                        I agreed to all the conditions.
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-style w-100"
                      onClick={submitData}>
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default CustomizedPackage;