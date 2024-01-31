import React, { useEffect, useState } from "react";
import companylog from "../assets/images/company-logo.png";
import Profileicon from "../assets/images/profile-icon.png";

import {
  collection,
  getDocs,
  query,
  addDoc,
  doc,
  updateDoc,
  where,
} from "firebase/firestore";
import axios from "axios";
import moment from "moment";

import { db } from "../firebase";
import Header from "./Header";
import Footer from "./Footer";

const Comments = () => {
  const user_name = sessionStorage.getItem("user_name");

  const [values, setValues] = useState({
    name: user_name,
    comment: "",
    date: new Date(),
    ref: "1",
  });
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const changeValues = (key, e) => {
    setValues((prev) => ({ ...prev, [key]: e }));
  };

  const handleSubmit = async () => {
    try {
      if (!user_name) {
        return alert("Please Login First");
      }

      axios
        .post("https://great-expedition-backend.herokuapp.com/", {
          review: values.comment,
        })
        .then((res) => {
          if (res.status == 200) {
            setValues((prev) => ({ ...prev, ref: res.data.prediction[0] }));

            let data = {
              name: values.name,
              comment: values.comment,
              date: moment().format("MMMM Do YYYY, h:mm:ss a"),
              ref: res.data.prediction[0],
            };

            addDoc(collection(db, "comments"), data);
            setValues((prev) => ({ ...prev, comment: "", ref: null }));
            getComments();
          }
        })
        .catch((err) => {
          console.log("error while submiting comments", err);
        });
    } catch (error) {
      console.log("Comment Submit Error", error);
    }
  };

  const getComments = async () => {
    setLoading(true);
    const q = query(collection(db, "comments"));
    const data = await getDocs(q);
    setComments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoading(false);

    // console.log(
    //   "Data ",
    //   data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    // );
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div>
      <Header />
      <div class="container mt-5 mb-5">
        <div class="row height d-flex justify-content-center align-items-center">
          <div class="col-md-7">
            <div class="card">
              <div class="p-3">
                <h4>Reviews</h4>
              </div>

              <div class="mt-3 d-flex flex-row align-items-center p-3 form-color gap-2">
                <img src={companylog} width="50" class="rounded-circle mr-2" />
                <input
                  type="text"
                  value={values.comment}
                  class="form-control "
                  placeholder="Enter your review..."
                  onChange={(e) => changeValues("comment", e.target.value)}
                />
                <button
                  onClick={handleSubmit}
                  className="btn btn-dark w-25 text-light rounded"
                >
                  send
                </button>
              </div>

              <div class="mt-2 ">
                {comments
                  .filter((e) => e?.ref == "1")
                  .map((e, i) => {
                    return (
                      <div key={i} class="d-flex flex-row p-3 gap-3">
                        <img
                          src={Profileicon}
                          width="40"
                          height="40"
                          class="rounded-circle mr-3"
                          style={{ backgroundColor: "lightgray" }}
                        />

                        <div class="w-100">
                          <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex flex-row align-items-center">
                              <span class="mr-2">{e?.name}</span>
                              {/* <small class="c-badge">Top Comment</small> */}
                            </div>
                            {/* <small>{moment(e?.date).fromNow()}</small> */}
                          </div>

                          <p class="text-justify text-info comment-text mb-0">
                            {e?.comment}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Comments;
