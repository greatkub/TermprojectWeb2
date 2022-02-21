import React from 'react'
import { Navbar, Nav, Container, Button, Modal, Form } from 'react-bootstrap';
import { makeStyles } from "@mui/styles";
import axios from 'axios';
import { useState, useEffect, useRef } from 'react'
import { Params, useParams } from 'react-router-dom';
import { findAllByDisplayValue } from '@testing-library/react';



export default function Profile() {
    const [userDetail, setuserDetail] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const firstnameRef = useRef();
    const lastnameRef = useRef();
    const emailRef = useRef();
    const phoneNumRef = useRef();
    const locationRef = useRef();

    const { userid } = useParams()

    function editProfile() {
        const firstname1 = firstnameRef.current.value;
        const lastname1 = lastnameRef.current.value;
        const email1 = emailRef.current.value;
        const phoneNum1 = phoneNumRef.current.value;
        const location1 = locationRef.current.value;

        axios.put(`/users/${userid}`,
            {
                id: userid,
                firstname: firstname1,
                lastname: lastname1,
                imageURL: userDetail.imageURL,
                dormLocation: location1,
                email: email1,
                phoneNumber: phoneNum1,
              }
        ).then((response) => {
            console.log('done')
            console.log(response);
            alert("Success");
            handleClose();
        })
            .catch(error => {
                console.log(error.response)
                alert("fail Edit")
            })
        
    }

    useEffect(() => {
        axios(`/users/${userid}`)
            .then(response => {
                console.log("hi" + response.data)
                console.log(response.data.result)
                setuserDetail(response.data.result)
                setIsLoading(true)
            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })
    }, [isLoading]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (


        <div>
            {isLoading &&
                <div className="box" >

                    <Container className="box-header" style={{ backgroundColor: 'red' }}>
                        <label className="items">
                            USER PROFILE
                        </label>
                    </Container>
                    <div className="profile">
                        <img src={userDetail.imageURL}>
                        </img>
                        <div className="userInfo">
                            Name: {userDetail.firstname} {userDetail.lastname}
                            <br />
                            ID: {userDetail.id}
                            <br />
                            Email: {userDetail.email}
                            <br />
                            Phone: {userDetail.phoneNumber}
                            <br />
                            Location: {userDetail.dormLocation}
                            <br />
                            <div className="editBtn">
                                <Button onClick={handleShow}>
                                    Edit Profile
                                </Button>
                            </div>
                            <Modal centered show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Edit Profile</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control type="text" defaultValue={userDetail.firstname} ref={firstnameRef} />
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control type="text" defaultValue={userDetail.lastname} ref={lastnameRef} />
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="email" defaultValue={userDetail.email} ref={emailRef} />
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control type="text" defaultValue={userDetail.phoneNumber} ref={phoneNumRef} />
                                        <Form.Label>Location</Form.Label>
                                        <Form.Control type="text" defaultValue={userDetail.dormLocation} ref={locationRef} />
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button variant="primary" onClick={editProfile}>
                                        Save Changes
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}