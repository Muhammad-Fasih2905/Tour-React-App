import React from 'react';
import '../../App.css';
import Footer from '../Footer';

import { Form, ToastContainer } from 'react-bootstrap';
import { Button } from '../Button';
import { NavLink } from 'react-router-dom';
// import { ToastContainer} from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
function ForgetPassword() {
    return (
        <>
            <div className="container mt-3">
                <section className='d-flex justify-content-between'>
                    <div className="left_data mt-3 p-3" style={{ width: "100%" }}>
                        <h3 className='text-center col-lg-6'>Reset Password</h3>
                        <Form >

                            <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                                <Form.Control type="email" name='email' placeholder="Enter email" />
                            </Form.Group>

                            <Form.Group className="mb-3 col-lg-6" controlId="formBasicPassword">
                                <Form.Control type="password" name='password' placeholder="New Password" />
                            </Form.Group>

                            <Form.Group className="mb-3 col-lg-6" controlId="formBasicPassword">
                                <Form.Control type="password" name='confirmpassword' placeholder="New Password" />
                            </Form.Group>

                            <Button variant="primary" className='col-lg-6' style={{ background: "rgb(67, 185, 127)" }} type="submit">
                                Submit
                            </Button>
                        </Form>
                        <p className='mt-3'>Click Continue to go further <span><NavLink to="/login">Continue</NavLink></span> </p>
                    </div>
                </section>
                <ToastContainer />
                <Footer />
            </div>
        </>
    )
}

export default ForgetPassword