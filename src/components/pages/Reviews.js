import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import AdminNavbar from "../AdminNavbar";
import ProfileIcon from "../../assets/images/profile-icon.png";
import { Rating } from "react-simple-star-rating";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import LoadingSpinner from "../LoadingSpinner";

function Reviews() {
  const [loader, setLoader] = useState(false);
  const [reviews, setReviews] = useState([]);
  const getReviews = async () => {
    setLoader(true);
    const q = query(
      collection(db, "user_purchase_packages"),
      where("isAccepted", "==", true)
    );
    const data = await getDocs(q);
    setReviews(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoader(false);
  };
  console.log(reviews);
  useEffect(() => {
    getReviews();
  }, []);

  return (
    <>
      {loader && <LoadingSpinner />}
      <AdminNavbar />
      <Container>
        <h3 className="text-center my-5">Reviews & Ratings</h3>
        <div className="my-3 p-3 bg-body rounded shadow">
          {reviews?.map((e, i) => {
            return (
              <div className="d-flex pt-3" key={i}>
                {e.review !== "" || e.rating !== 0 ? (
                  <>
                    <img
                      src={ProfileIcon}
                      className="bd-placeholder-img flex-shrink-0 me-2 rounded"
                      width={32}
                      height={32}
                      alt="placeholderImage"
                    />
                    <div className="pb-3 mb-0 small lh-sm border-bottom w-100">
                      <div className="d-flex justify-content-between">
                        <strong className="text-gray-dark">
                          {e.user_email}
                        </strong>
                        {/* <small></small> */}
                        {e.rating === 0 ? (
                          <span>No Rating</span>
                        ) : (
                          <Rating size={20} initialValue={e.rating} readonly />
                        )}
                      </div>
                      <span className="d-block text-muted text-capitalize">Package Name: {e.package_title}</span>
                      <span className="d-block text-muted text-capitalize">
                        {e.review === "" ? "No Reviews" : e.review}
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </Container>
    </>
  );
}

export default Reviews;
