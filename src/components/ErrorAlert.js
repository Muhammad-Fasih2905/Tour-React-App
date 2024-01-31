import React from 'react'
import { Alert } from 'react-bootstrap'
function ErrorAlert({ errorMessage }) {
    return (
        <>
            <Alert variant="danger">
                {/* <i className='far fa-play-circle' /> */}
                <i className="fas fa-exclamation-triangle" />
                <span className="ms-2 text-capitalize fw-bold">{errorMessage}</span>
            </Alert>
        </>
    )
}

export default ErrorAlert