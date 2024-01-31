import React from "react";
import "./Footer.css";
import { Button } from "react-bootstrap";

function Footer() {
  const fb_link = "https://www.facebook.com/profile.php?id=100076060059383";
  const insta_link =
    "https://www.instagram.com/great._.expeditions/?igshid=YmMyMTA2M2Y%3D";

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="footer-container">
      <section className="footer-subscription">
        <p className="footer-subscription-heading">
          Join the Adventure newsletter to receive our best vacation deals
        </p>
        <p className="footer-subscription-text">
          You can unsubscribe at any time.
        </p>
        <div className="input-areas">
          <form>
            <input
              className="footer-input"
              name="email"
              type="email"
              placeholder="Your Email"
            />
            <Button variant="light" size="lg" className="border-1 border-light">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
      {/* <div className="footer-links">
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <p className="fs-4 text-white">About Us</p>
            <p className="text-white" style={{ cursor: "pointer" }}>
              How it works
            </p>
            <p className="text-white" style={{ cursor: "pointer" }}>
              Testimonials
            </p>
            <p className="text-white" style={{ cursor: "pointer" }}>
              Careers
            </p>
            <p className="text-white" style={{ cursor: "pointer" }}>
              Investors
            </p>
            <p className="text-white" style={{ cursor: "pointer" }}>
              Terms of Service
            </p>
          </div>
          <div className="footer-link-items">
            <p className="fs-4 text-white">Contact Us</p>
            <p className="text-white" style={{ cursor: "pointer" }}>
              Contact
            </p>
            <p className="text-white" style={{ cursor: "pointer" }}>
              Support
            </p>
            <p className="text-white" style={{ cursor: "pointer" }}>
              Destinations
            </p>
            <p className="text-white" style={{ cursor: "pointer" }}>
              Sponsorships
            </p>
          </div>
        </div>
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <p className="fs-4 text-white" style={{ cursor: "pointer" }}>
              Videos
            </p>
            <p className="text-white" style={{ cursor: "pointer" }}>
              Submit Video
            </p>
            <p className="text-white" style={{ cursor: "pointer" }}>
              Ambassadors
            </p>
            <p className="text-white" style={{ cursor: "pointer" }}>
              Agency
            </p>
            <p className="text-white" style={{ cursor: "pointer" }}>
              Influencer
            </p>
          </div>
          <div className="footer-link-items">
            <p className="fs-4 text-white">Social Media</p>
            <p className="text-white" style={{ cursor: "pointer" }}>
              Instagram
            </p>
            <p
              className="text-white"
              style={{ cursor: "pointer" }}
              onClick={() => openInNewTab(fb_link)}
            >
              Facebook
            </p>
            <p className="text-white" style={{ cursor: "pointer" }}>
              Youtube
            </p>
            <p className="text-white" style={{ cursor: "pointer" }}>
              Twitter
            </p>
          </div>
        </div>
      </div> */}
      <section className="social-media">
        <div className="social-media-wrap">
          <div className="footer-logo">
            <p className="social-logo fs-4" style={{ cursor: "pointer" }}>
              <img
                src="../company-logo.png"
                alt="logo"
                className="mx-2"
                width={40}
                height={40}
              />
              Great Expeditions
            </p>
          </div>
          <small className="website-rights">Great Expeditions © 2022</small>
          <div className="social-icons">
            <p
              className="social-icon-link facebook"
              target="_blank"
              aria-label="Facebook"
              style={{ cursor: "pointer" }}
              onClick={() => openInNewTab(fb_link)}
            >
              <i className="fab fa-facebook-f" />
            </p>
            <p
              className="social-icon-link instagram"
              target="_blank"
              aria-label="Instagram"
              style={{ cursor: "pointer" }}
              onClick={() => openInNewTab(insta_link)}
            >
              <i className="fab fa-instagram" />
            </p>
            <p
              className="social-icon-link youtube"
              target="_blank"
              aria-label="Youtube"
              style={{ cursor: "pointer" }}
            >
              <i className="fab fa-youtube" />
            </p>
            <p
              className="social-icon-link twitter"
              target="_blank"
              aria-label="Twitter"
              style={{ cursor: "pointer" }}
            >
              <i className="fab fa-twitter" />
            </p>
            <p
              className="social-icon-link twitter"
              target="_blank"
              aria-label="LinkedIn"
              style={{ cursor: "pointer" }}
            >
              <i className="fab fa-linkedin" />
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
