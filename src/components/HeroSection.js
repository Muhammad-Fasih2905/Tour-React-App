import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../App.css';
// import { Button } from './Button';
import './HeroSection.css';

function HeroSection() {
  const navigate = useNavigate()
  return (
    <>
      <header>
        <div className="overlay"></div>
        <video src='/videos/video-1.mp4' autoPlay loop muted />
        <div className="container h-100">
          <div className="d-flex h-100 text-center align-items-center">
            <div className="w-100 text-white">
              <h1 className="display-3">ADVENTURE AWAITS</h1>
              <p className="lead mb-0">What are you waiting for?</p>
              <div className="d-grid gap-2 my-3 d-sm-flex justify-content-sm-center">
                <Button variant="light" size='lg' className="text-dark shadow-none px-4 gap-3" onClick={() => navigate('/sign-up')}>Get Started</Button>
                {/* <Button variant="outline-light" size='lg' className="border-light border shadow-none px-4">Watch Trailer <i className='far fa-play-circle' /></Button> */}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default HeroSection;
