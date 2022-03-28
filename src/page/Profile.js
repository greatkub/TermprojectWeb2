import React from 'react'
import { Navbar, Nav, Container, Button, Modal, Form } from 'react-bootstrap';
import { makeStyles } from "@mui/styles";
import axios from 'axios';
import { useState, useEffect, useRef } from 'react'
import { Params, useParams } from 'react-router-dom';
import { findAllByDisplayValue } from '@testing-library/react';



export default function Profile({ appToken }) {
    const API_URI = process.env.REACT_APP_API_URL;

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

        const obj = {
            id: userid,
            firstname: firstname1,
            lastname: lastname1,
            imageURL: userDetail.imageURL,
            dormLocation: location1,
            email: email1,
            phoneNumber: phoneNum1,
        }


        axios.put(`${API_URI}/users/${userid}`,
            obj,
            {
                headers: { 'auth-token': appToken }
            }
        ).then((response) => {
            console.log('done')
            console.log(response);
            // alert("Success");
            handleClose();
            setuserDetail(obj)
        })
            .catch(error => {
                console.log(error.response)
                alert("fail Edit")
            })

    }

    useEffect(() => {
        axios(`${API_URI}/users/${userid}`, {
            headers:
            {
                'auth-token': appToken
            }

        })
            .then(response => {
                console.log("hi" + response.data)
                console.log(response.data.result)
                setuserDetail(response.data.result)
                setIsLoading(true)
            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })
    }, userDetail);



    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div >
            {isLoading &&
                // <div className="box" style={{ backgroundColor: '#FFFFFF', zIndex: 3, position: 'absolute', left: '50%', marginLeft: '-37.5%', top: '10%', opacity: 0.95 }}>

                //         <Container className="box-header" style={{ backgroundColor: '#FFFFFF' }}>
                //             <label className="items">
                //                 USER PROFILE
                //             </label>
                //         </Container>
                //         <div className="container" style={{height: '100%', background: 'blue'}}>
                //             <div className='row' style={{backgroundColor: 'red'}}>

                //                 <div class="col-sm-6" style={{ position: 'relative'}}>
                //                     <img src={userDetail.imageURL} style={{width: '92%', height: '94%', position: 'absolute', left: '50%', marginLeft: '-46%'}}>
                //                     </img>
                //                             {/* <img src={itemDetail.imageURL} style={{ width: '92%', height: '94%', position: 'absolute', left: '50%', marginLeft: '-46%' }}>

                //                     </img> */}
                //                 </div>


                //                 <div class="col-sm-6" style={{ position: 'relative', backgroundColor: 'white', width: "50%"}}>
                //                     <div>
                //                         Name: {userDetail.firstname} {userDetail.lastname}
                //                     </div>
                //                     <div>
                //                         ID: {userDetail.id}
                //                     </div>
                //                     <div>
                //                         Email: {userDetail.email}
                //                     </div>

                //                     <div>
                //                         Phone: {userDetail.phoneNumber}
                //                     </div>

                //                     <div>
                //                         Location: {userDetail.dormLocation}
                //                     </div>


                //                     <div className="editBtn">
                //                         <Button onClick={handleShow}>
                //                             Edit Profile
                //                         </Button>
                //                     </div>
                //                     <Modal centered show={show} onHide={handleClose}>
                //                         <Modal.Header closeButton>
                //                             <Modal.Title>Edit Profile</Modal.Title>
                //                         </Modal.Header>
                //                         <Modal.Body>
                //                             <Form>
                //                                 <Form.Label>First Name</Form.Label>
                //                                 <Form.Control type="text" defaultValue={userDetail.firstname} ref={firstnameRef} />
                //                                 <Form.Label>Last Name</Form.Label>
                //                                 <Form.Control type="text" defaultValue={userDetail.lastname} ref={lastnameRef} />
                //                                 <Form.Label>Email address</Form.Label>
                //                                 <Form.Control type="email" defaultValue={userDetail.email} ref={emailRef} />
                //                                 <Form.Label>Phone Number</Form.Label>
                //                                 <Form.Control type="text" defaultValue={userDetail.phoneNumber} ref={phoneNumRef} />
                //                                 <Form.Label>Location</Form.Label>
                //                                 <Form.Control type="text" defaultValue={userDetail.dormLocation} ref={locationRef} />
                //                             </Form>
                //                         </Modal.Body>
                //                         <Modal.Footer>
                //                             <Button variant="secondary" onClick={handleClose}>
                //                                 Close
                //                             </Button>
                //                             <Button variant="primary" onClick={editProfile}>
                //                                 Save Changes
                //                             </Button>
                //                         </Modal.Footer>
                //                     </Modal>
                //                 </div>
                //             </div>
                //         </div>
                //     </div>

                <div className="box" style={{ backgroundColor: '#FFFFFF', zIndex: 3, position: 'absolute', left: '50%', marginLeft: '-37.5%', top: '10%', opacity: 0.95 }}>


                    <Container className="box-header">
                        <label className="items">
                            USER PROFILE
                        </label>


                    </Container>


                    <div className='container'>
                        <div className='row'>


                            <div class="col-sm-6" style={{ position: 'relative' }}>
                                {/* <input type="file" onChange={handleChange} /> */}
                                {/* {url != "" ?
                                    <img src={url} style={{ width: '92%', height: '94%', position: 'absolute', left: '50%', marginLeft: '-46%' }}>

                                    </img>
                                    :
                                    <FaRegImage style={{ width: '92%', height: '94%', position: 'absolute', left: '50%', marginLeft: '-46%', opacity: 0.5 }}>

                                    </FaRegImage>
                                } */}

                                <img src={userDetail.imageURL} style={{ width: '92%', height: '94%', position: 'absolute', left: '50%', marginLeft: '-46%' }}>

                                </img>

                                {/* <button onClick={handleUpload}>
                            upload
                        </button> */}
                            </div>
                            {/* <br /> */}

                            <div class="col-sm-6" >
                                <div class="form-group" style={{ marginBottom: 10, width: '96%' }}>
                                    <label for="inputAddress" style={{ marginBottom: 6 }}>Name</label>
                                    <input placeholder="Enter a name" class="form-control" type="text" value={`${userDetail.firstname} ${userDetail.lastname}`}  >

                                    </input>
                                </div>
                                <div class="form-group" style={{ marginBottom: 10, width: '96%' }}>
                                    <label for="inputAddress" style={{ marginBottom: 6 }}>ID</label>
                                    <input placeholder="Enter a price" class="form-control" type="number" value={userDetail.id} >
                                    </input>
                                </div>
                                <div class="form-group" style={{ marginBottom: 10, width: '96%' }}>
                                    <label for="inputAddress" style={{ marginBottom: 6 }}>Email</label>
                                    <input placeholder="Enter a price" class="form-control" type="text" value={userDetail.email} >
                                    </input>
                                </div>
                                <div class="form-group" style={{ marginBottom: 10, width: '96%' }}>
                                    <label for="inputAddress" style={{ marginBottom: 6 }}>Phone</label>
                                    <input placeholder="Enter a price" class="form-control" type="text" value={userDetail.phoneNumber} >
                                    </input>
                                </div>
                                <div class="form-group" style={{ marginBottom: 10, width: '96%' }}>
                                    <label for="inputAddress" style={{ marginBottom: 6 }}>Location</label>
                                    <input placeholder="Enter a price" class="form-control" type="text" value={userDetail.dormLocation} >
                                    </input>
                                </div>
                                {/* <div class="form-group" style={{ marginBottom: 10, width: '96%' }}>
                                    <label for="inputAddress" style={{ marginBottom: 6 }}>Description</label>
                                    <textarea placeholder="Enter a description" class="form-control" type="text" 
                                        style={{ height: 100 }} >
                                    </textarea>
                                </div> */}
                                {/* <div class="form-group">
                           
                        </div> */}







                                <button onClick={handleShow}
                                    style={{
                                        position: 'absolute', right: 20, bottom: 20, height: 45,
                                        width: 200,
                                        borderRadius: 8,
                                        backgroundColor: '#48846F',
                                        color: '#FFFFFF',
                                        border: '0px solid #FFFFFF'
                                    }}>
                                    Edit Profile
                                </button>
                                {/* <div className="editBtn">
                                    <Button onClick={handleShow}>
                                        Edit Profile
                                    </Button>
                                </div> */}
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
                </div>
            }
        </div>
    )
}
