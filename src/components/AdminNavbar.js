import React, { useState } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const handleLogout = () => {
    setLoader(true);
    sessionStorage.removeItem("admin_id");
    sessionStorage.removeItem("admin_email");
    navigate("/admin", { replace: true });
    setLoader(false);
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand
            onClick={() => navigate("/currentpackages")}
            style={{ cursor: "pointer" }}
          >
            Admin Panel
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            className="shadow-none border-0"
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto text-center">
              <Button
                variant="outline-light"
                className="mt-1 mx-2 rounded-4 shadow-none"
                onClick={() => navigate("/currentpackages")}
              >
                Services Offered
              </Button>
              <Button
                variant="outline-light"
                className="mt-1 mx-2 rounded-4 shadow-none"
                onClick={() => navigate("/createnewpackage")}
              >
                Create New Package
              </Button>
              <Button
                variant="outline-light"
                className="mt-1 mx-2 rounded-4 shadow-none"
                onClick={() => navigate("/reviews")}
              >
                Reviews
              </Button>
              <Button
                variant="outline-light"
                className="mt-1 mx-2 rounded-4 shadow-none"
                onClick={() => navigate("/customerqueries")}
              >
                Customer Queries
              </Button>
              <Button
                variant="outline-light"
                className="mt-1 mx-2 rounded-4 shadow-none"
                onClick={() => navigate("/chat")}
              >
                Chat
              </Button>
            </Nav>
            <Nav className="ms-auto text-center">
              <Nav.Link>
                <Button
                  variant="danger"
                  className="shadow-none"
                  onClick={() => handleLogout()}
                >
                  {" "}
                  Logout{" "}
                </Button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default AdminNavbar;
