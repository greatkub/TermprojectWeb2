import { useState, useEffect, useRef } from 'react'
import { makeStyles } from '@mui/styles';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios'



const useStyles = makeStyles((theme) => ({
    paper: {
        width: 587,
        height: 424,
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        border: '1px solid #D8D8D8',
        margin: 'auto',
        position: 'relative'
    },
    inputframe: {
        width: 398,
        height: 49,
        border: '1px solid #D8D8D8',
        borderRadius: 8,
        textAlign: 'center'
    },
    login_btn: {
        height: 45,
        width: 398,
        borderRadius: 8,
        backgroundColor: '#48846F',
        color: '#FFFFFF',
        border: '0px solid #FFFFFF'
    },
    art1: {
        height: 95,
        width: 5,
        backgroundColor: '#48846F',
        right: -3,
        position: 'absolute',
        top: 30
    }
}));
export default function Login(props) {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const idRef = useRef();
    const firstnameRef = useRef();
    const lastnameRef = useRef();
    const emailRef = useRef();
    const phoneNumRef = useRef();
    const locationRef = useRef();
    const password1Ref = useRef();
    const password2Ref = useRef();

    function register() {
        const idRef1 = idRef.current.value;
        const firstnameRef1 = firstnameRef.current.value;
        const lastnameRef1 = lastnameRef.current.value;
        const emailRef1 = emailRef.current.value;
        const phoneNumRef1 = phoneNumRef.current.value;
        const locationRef1 = locationRef.current.value;
        const password1Ref1 = password1Ref.current.value;
        const password2Ref1 = password2Ref.current.value;

        if (password1Ref1 != password2Ref1) {
            alert('Password not match')
        }
        else {
            axios.post("/auth/register",
                {
                    id: idRef1,
                    password: password1Ref1,
                    firstname: firstnameRef1,
                    lastname: lastnameRef1,
                    dormLocation: locationRef1,
                    email: emailRef1,
                    phoneNumber: phoneNumRef1
                }

            ).then((response) => {
                console.log('done')
                console.log(response);
                alert("Success")
                handleClose();
            })
                .catch(error => {
                    console.log(error.response.data.message)
                    alert(error.response.data.message)
                })
            
        }
    }

    const classes = useStyles()
    const [id, setId] = useState()
    const [password, setPassword] = useState()
    const [authId, setAuthId] = useState()
    const [authToken, setAuthToken] = useState()

    function handlerClick() {
        axios.post("/auth/login",
            {
                id: id,
                password: password,
            }

        ).then((response) => {
            console.log('done')
            console.log(response);
            console.log(response.data.result[`auth-token`])
            // setAuthToken(response.data.result[`auth-token`])
            // setAuthId(response.data.result.id)

            props.appId(response.data.result.id)
            props.appToken(response.data.result[`auth-token`])
            // console.log(props.appToken)
            // console.log(expenseLists)
            // window.location.href = `/verify/${id}`;
            alert("Success")
        })
            .catch(error => {
                console.log(error.response)
                alert("fail")
            })
    }

    //username 6210015, password 1234567
    return (
        <div style={{ height: '100%', width: '100%' }}>

            <div className={classes.paper} style={{ top: '12%' }}>
                <div className={classes.art1} />
                <div style={{ position: 'absolute', top: '20%', left: '22.5%', margin: '-35px 0 0 -35px' }}>
                    <div style={{ fontWeight: 700, fontSize: 30, color: '#48846F', width: '100%', textAlign: 'center' }}>
                        L E N D I T
                    </div>
                    <div style={{ fontWeight: 400, fontSize: 18, color: '#48846F', textAlign: 'center' }}>
                        Borrow Anything You Like
                    </div>
                    <div style={{ height: 50 }} />

                    <input placeholder='  username' type='text' className={classes.inputframe} onChange={(e) => setId(e.target.value)}>

                    </input>
                    <div style={{ height: 14 }} />
                    <input placeholder='  password' type='password' className={classes.inputframe} onChange={(e) => setPassword(e.target.value)}>

                    </input>
                    <div style={{ height: 30 }} />
                    <button className={classes.login_btn} onClick={() => handlerClick()}>
                        Login
                    </button>
                    <div style={{ bottom: -120, position: 'absolute', textAlign: 'center', width: '100%' }}>
                        Don’t have an account?
                        <a className="signUp" onClick={handleShow}> Sign up </a>
                        now!
                    </div>
                </div>





            </div>
            <Modal centered show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sign Up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row >
                        <Col>
                            {/* <Form.Label>Student ID</Form.Label> */}
                            <Form.Control type="text" placeholder="Student ID" ref={idRef} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col>
                            {/* <Form.Label>First Name</Form.Label> */}
                            <Form.Control type="text" placeholder="First name" ref={firstnameRef} />
                        </Col>
                        <Col>
                            {/* <Form.Label>Last Name</Form.Label> */}
                            <Form.Control type="text" placeholder="Surname" ref={lastnameRef} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col>
                            {/* <Form.Label>New Password</Form.Label> */}
                            <Form.Control type="password" placeholder="Password" ref={password1Ref} />

                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col>
                            {/* <Form.Label>New Password</Form.Label> */}
                            <Form.Control type="password" placeholder="Confirm Password" ref={password2Ref} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col>
                            {/* <Form.Label>Email address</Form.Label> */}
                            <Form.Control type="email" placeholder="Email" ref={emailRef} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col>
                            {/* <Form.Label>Phone Number</Form.Label> */}
                            <Form.Control type="text" placeholder="Phone Number" ref={phoneNumRef} />
                        </Col>
                        <Col>
                            {/* <Form.Label>Location</Form.Label> */}
                            <Form.Control type="text" placeholder="Location" ref={locationRef} />
                        </Col>
                    </Row>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => register()}>
                        Sign Up
                    </Button>
                </Modal.Footer>
            </Modal>


        </div>

    )
}
