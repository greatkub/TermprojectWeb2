import React from 'react'
import { Navbar, Nav, Container, Button, Modal, Form } from 'react-bootstrap';
import { makeStyles } from "@mui/styles";
import axios from 'axios';
import { useState, useEffect, useRef } from 'react'
import { Params, useParams } from 'react-router-dom';
import { findAllByDisplayValue, render } from '@testing-library/react';
import Select from 'react-select';
import parse from 'html-react-parser';



export default function Items({ appToken }) {
    const API_URI = process.env.REACT_APP_API_URL;

    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lend, setLend] = useState(true);

    const { userid } = useParams()

    const [pendingItems, setPendingItems] = useState([]);
    const [lendingItems, setLendingItems] = useState([]);
    const [availableItems, setAvailableItems] = useState([]);
    const [borrowingItems, setBorrowingItems] = useState([]);
    const [waitBorrowItems, setWaitBorrowItems] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [itemNameUpdate, setItemNameUpdate] = useState();
    const [priceUpdate, setPriceUpdate] = useState();
    const [locationUpdate, setLocationUpdate] = useState();
    const [descriptionUpdate, setDescriptionUpdate] = useState();
    const [ownerIDUpdate, setOwnerID] = useState();
    const [imageURLUpdate, setImageURL] = useState();
    const [itemUpdate, setItemUpdate] = useState();

    const itemNameRef = useRef();
    const priceRef = useRef();
    const locationRef = useRef();
    const descriptionRef = useRef();

    const places = [{ value: "place A", label: "place A" }, { value: "place B", label: "place B" }]

    useEffect(() => {

        //get all items of user
        axios.get(`${API_URI}/items?userId=${userid}`,
            {
                headers: { 'auth-token': appToken }
            }
        )
            .then(response => {
                setItems(response.data.result)
                setAvailableItems(response.data.result.filter(item => item.avaliable === true))
                console.log("Items", items)

            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })
        //get all transactions
        axios.get(`${API_URI}/transactions/${userid}`,
            {
                headers: { 'auth-token': appToken }
            }
        )
            .then(response => {
                setTransactions(response.data.result)

            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })
        // Get lended Items
        axios.get(`${API_URI}/borrows/lender?userId=${userid}`,
            {
                headers: { 'auth-token': appToken }
            }
        )
            .then(response => {
                setPendingItems(response.data.result.filter((item) => {
                    return item.pendingStat == false && !transactions.some((trans) => { return (item._id === trans.borrowID && trans.returnStatus === true) })
                }))
                setLendingItems(response.data.result.filter((item) => {
                    return item.pendingStat == true && !transactions.some((trans) => { return (item._id === trans.borrowID && trans.returnStatus === true) })
                }))
            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })
        //get all borrowed Items
        axios.get(`${API_URI}/borrows/borrower?userId=${userid}`,
            {
                headers: { 'auth-token': appToken }
            }
        )
            .then(response => {
                setWaitBorrowItems(response.data.result.filter((item) => {
                    return item.pendingStat == false && !transactions.some((trans) => { return (item._id === trans.borrowID && trans.returnStatus === true) })
                }
                ))
                setBorrowingItems(response.data.result.filter((item) => {
                    return item.pendingStat == true && !transactions.some((trans) => { return (item._id === trans.borrowID && trans.returnStatus === true) })
                }
                ))

                console.log(availableItems, pendingItems, lendingItems)

                setIsLoading(true);
            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })

    }, [isLoading]);

    function handlerAccept(item) {
        console.log("click", item);
        axios.patch(`${API_URI}/borrows/lender/accept`,
            {
                borrowID: item._id
            },
            {
                headers: { 'auth-token': appToken }
            }
        )
            .then(response => {
                items.forEach(item2 => {
                    if (item2.name == item.itemID.name) {
                        var price = item2.pricePerDay * item.borrowDuration
                        console.log("price: ", price)
                        axios.post(`${API_URI}/transactions`,
                            {
                                borrowID: item._id,
                                totalPrice: price
                            },
                            {
                                headers: { 'auth-token': appToken }
                            }
                        )
                            .then(response => {
                                alert("Success accept borrow");
                                window.location.reload(true);
                            })
                            .catch(error => {
                                console.log('Error getting fake data: ' + error);
                            })
                    }
                })
            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })
    }

    function handlerReturn(item) {
        console.log("click", item, appToken);
        transactions.forEach(trans => {

            console.log(trans)

            if (trans.borrowInfo.borrowID == item._id) {
                axios.patch(`${API_URI}/transactions/` + trans._id,
                    {
                        _id: trans._id
                    },
                    {
                        headers: { 'auth-token': appToken }
                    }
                )
                    .then(response => {
                        console.log(response)
                        alert("success return")
                        window.location.reload(true);
                    })
                    .catch(error => {
                        console.log('Error getting fake data: ' + error);
                    })
            }
        })
    }

    function handlerDecline(item) {
        axios.delete(`${API_URI}/borrows/` + item._id,
            {
                headers: { 'auth-token': appToken }
            }
        )
            .then(response => {
                console.log(response)
                alert("success Decline")
                window.location.reload(true);
            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })
    }

    function handlerDelete(item) {
        axios.delete(`${API_URI}/items/` + item._id,
            {
                headers: { 'auth-token': appToken }
            }
        )
            .then(response => {
                console.log(response)
                alert("success Delete")
                window.location.reload(true);
            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })

        //delete borrows
        //delete transactions
    }

    function handlerUpdate(item) {
        setItemNameUpdate(item.name)
        setPriceUpdate(item.pricePerDay)
        setLocationUpdate(item.location)
        setDescriptionUpdate(item.itemDesciption)
        setOwnerID(item.ownerID)
        setImageURL(item.imageURL)
        setItemUpdate(item._id)
        handleShow();
    }

    function confirmUpdate() {
        const obj = {
            name: itemNameRef.current.value,
            pricePerDay: priceRef.current.value,
            ownerID: ownerIDUpdate,
            imageURL: imageURLUpdate,
            location: locationRef.current.value,
            itemDescription: descriptionRef.current.value
        }

        axios.put(`${API_URI}/items/${itemUpdate}`,
            obj,
            {
                headers: { 'auth-token': appToken }
            }
        ).then((response) => {
            console.log('done')
            console.log(response);
            alert("Success Update Item");
            handleClose();
            window.location.reload(true);

        })
            .catch(error => {
                console.log(error.response)
                alert("fail Edit")
            })
    }
    const [showText, setShowText] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(-1)

    const [showText2, setShowText2] = useState(false)
    const [currentIndex2, setCurrentIndex2] = useState(-1)

    function over(e, index) {
        e.target.style.opacity = 0.8;
        e.target.style.backgroundColor = 'black';

        setShowText(true)
        setCurrentIndex(index)


    }
    function out(e, index) {
        e.target.style.opacity = 1;
        e.target.style.backgroundColor = '';
        setShowText(false)
        setCurrentIndex(index)


    }

    function overAvailableItem(e, index) {
        e.target.style.opacity = 0.8;
        e.target.style.backgroundColor = 'black';

        setShowText2(true)
        setCurrentIndex2(index)


    }
    function outAvailableItem(e, index) {
        e.target.style.opacity = 1;
        e.target.style.backgroundColor = '';
        setShowText2(false)
        setCurrentIndex2(index)


    }

    //     <Hover onHover={<div> Show this on hover </div>}>
    //     <div> Show on no hover </div>
    // </Hover>
    const renderPendingItems = pendingItems.map((item, i) => {
        return (
            <div style={{ position: 'relative', marginLeft: 20 }} key={i}>

                <div className='box-card' style={{ backgroundColor: '', position: 'absolute', zIndex: 4 }} onMouseEnter={e => { over(e, i) }}
                    onMouseLeave={e => { out(e, i) }}
                >
                    {showText && currentIndex == i &&
                        <div style={{ position: 'absolute', zIndex: 5, left: '50%', marginLeft: '-20%', top: '50%', marginTop: '-25%' }}>
                            <Button variant="info" style={{ width: '100%', display: 'block' }} onClick={() => handlerAccept(item)}>Accept</Button>
                            <div style={{ height: '20px' }} />
                            <Button variant="danger" style={{ width: '100%', display: 'block' }}
                                onClick={() => handlerDecline(item)}
                            >Decline</Button>

                        </div>

                    }


                </div>
                <div className='box-card' >
                    <div className='upper'>
                        <img src={item.itemID.imageURL} className='box-image' style={{ objectFit: 'cover' }}>
                        </img>
                        <div>
                            {item.itemID.name}
                        </div>
                        <div>
                            Borrower:{item.borrowerID}
                        </div>
                        <div>
                            Duration:{item.borrowDuration}
                        </div>

                    </div>
                    {/* <div className="lower">
                    <div>
                        <Button variant="info" style={{ width: '50%' }} onClick={() => handlerAccept(item)}>Accept</Button>
                        <Button variant="danger" style={{ width: '50%' }} onClick={() => handlerDecline(item)}>Decline</Button>
                    </div>

                </div> */}

                </div>
            </div>
        )
    })
    const renderLendingItems = lendingItems.map((item, i) => {
        return (
            <div className='box-card' key={i}>
                <img src={item.itemID.imageURL} className='box-image' style={{ objectFit: 'cover' }}>
                </img>
                <div>
                    {item.itemID.name}
                </div>
                <div>
                    Borrower:{item.borrowerID}
                </div>
                <div>
                    Duration:{item.borrowDuration}
                </div>
            </div>
        )

    })

    const renderAvailableItems = availableItems.map((item, i) => {
        return (
            <div style={{ position: 'relative', marginLeft: 20 }} key={i}>

                <div className='box-card' style={{ backgroundColor: '', position: 'absolute', zIndex: 4 }} onMouseEnter={e => { overAvailableItem(e, i) }}
                    onMouseLeave={e => { outAvailableItem(e, i) }}
                >
                    {showText2 && currentIndex2 == i &&
                        <div style={{ position: 'absolute', zIndex: 5, left: '50%', marginLeft: '-20%', top: '50%', marginTop: '-25%' }}>
                            <Button variant="info" style={{ width: '100%', display: 'block' }} onClick={() => handlerUpdate(item)}>Edit</Button>
                            <div style={{ height: '20px' }} />
                            <Button variant="danger" style={{ width: '100%', display: 'block' }}
                                onClick={() => handlerDelete(item)}
                            >Delete</Button>

                        </div>

                    }


                </div>

                <div className='box-card' key={i}>

                    <div className='upper'>
                        <img src={item.imageURL} className='box-image' style={{ objectFit: 'cover' }}>
                        </img>
                        <div>
                            {item.name}
                        </div>
                        <div>
                            Location: {item.location}
                        </div>
                        <div>
                            Availability: {item.avaliable + ''}
                        </div>

                    </div>

                    {/* <div className="lower">
                    <div>
                        <Button variant="info" style={{ width: '50%' }} onClick={() => handlerUpdate(item)}>Edit</Button>
                        <Button variant="danger" style={{ width: '50%' }} onClick={() => handlerDelete(item)}>Delete</Button>
                    </div>

                </div> */}
                </div>
            </div>



        )
    })


    const renderWaitingBorrow = waitBorrowItems.map((item, i) => {
        return (
            <div className='box-card' key={i} style={{ fontSize: 'small', height: 320, width: 230 }}>
                <img src={item.itemID.imageURL} className='box-image' style={{ objectFit: 'cover' }}>
                </img>
                <div>
                    {item.itemID.name}
                </div>
                <div>
                    Owner: {item.lenderID}
                </div>
                <div>
                    Duration: {item.borrowDuration}
                </div>
                <div>
                    Wating for owner to accept.
                </div>
            </div>
        )
    })

    const renderBorrowing = borrowingItems.map((item, i) => {
        return (
            <div className='box-card' key={i}>
                <div className='upper'>
                    <img src={item.itemID.imageURL} className='box-image' style={{ objectFit: 'cover' }}>
                    </img>
                    <div>
                        {item.itemID.name}
                    </div>
                    <div>
                        Owner: {item.lenderID}
                    </div>
                    <div>
                        Duration: {item.borrowDuration}
                    </div>


                </div>
                <div className="lower">
                    <div >
                        <Button variant="info" onClick={() => handlerReturn(item)}>Return</Button>
                    </div>

                </div>

            </div>
        )
    })



    return (
        <div style={{ zIndex: 3, position: 'absolute', width: '100%' }}>
            {isLoading &&
                <>
                    <Navbar bg="light" variant="light" style={{ height: 60, opacity: 0.9 }}>
                        <Container>
                            <Navbar.Brand style={{ display: 'flex' }}>
                                {lend ? (<>
                                    <div style={{ color: '#48846F', fontWeight: '500', marginLeft: '2vw' }} onClick={() => { setLend(true) }}>
                                        Lend Items
                                    </div>
                                    <div style={{ color: '#48846F', fontWeight: '300', marginLeft: '2vw' }} onClick={() => { setLend(false) }}>
                                        Borrowed Items
                                    </div>
                                </>) : (<>
                                    <div style={{ color: '#48846F', fontWeight: '300', marginLeft: '2vw' }} onClick={() => { setLend(true) }}>
                                        Lend Items
                                    </div>
                                    <div style={{ color: '#48846F', fontWeight: '500', marginLeft: '2vw' }} onClick={() => { setLend(false) }}>
                                        Borrowed Items
                                    </div>
                                </>)}

                            </Navbar.Brand>
                        </Container>
                    </Navbar>


                    <div style={{ backgroundColor: '#FFFFFF', position: 'absolute', left: '50%', marginLeft: '-35%' ,zIndex: 1,   opacity: 0.95, height: '80vh',width: '70%', marginTop: '2%', overflowY: 'scroll', borderRadius: 10}}>
                        <div className="box-1" style={{ margin: 'auto', marginTop: '2%', marginBottom: '2%' }}>

                            {lend && pendingItems.length != 0 &&
                                <div>
                                    <h3 style={{ marginBottom: 15, marginTop: 15, marginLeft: 22 }}>Pending Items</h3>
                                    <div className='example' style={{ display: 'flex', overflowX: 'scroll' }}>

                                        {(renderPendingItems)}
                                        {/* {(renderPendingItems)}
                                        {(renderPendingItems)} */}

                                    </div>
                                </div>

                            }
                            {lend && lendingItems.length != 0 &&
                                <div>
                                    <h3 style={{ marginBottom: 15, marginTop: 15,  marginLeft: 22}}>Lending Items</h3>

                                    <div className='example' style={{ display: 'flex', overflowX: 'scroll' }}>

                                        {(renderLendingItems)}

                                    </div>
                                </div>
                            }
                            {lend && availableItems.length != 0 &&
                                <div >
                                    <h3 style={{ marginBottom: 15, marginTop: 15,  marginLeft: 22 }}>Available Items</h3>
                                    <div className='example' style={{ display: 'flex', overflowX: 'scroll' }}>

                                        {(renderAvailableItems)}

                                    </div>
                                </div>
                            }
                            {lend && pendingItems.length == 0 && lendingItems.length == 0 && availableItems.length == 0 &&
                                <>
                                    <h3>No Lend Items in the record</h3>
                                </>
                            }



                            {!lend && waitBorrowItems.length != 0 &&
                                <div>
                                    <h3 style={{ marginBottom: 15, marginTop: 15,marginLeft: 22 }}>Pending Items</h3>

                                    <div className='example' style={{ display: 'flex', overflowX: 'scroll' }}>

                                        {(renderWaitingBorrow)}

                                    </div>
                                </div>
                            }
                            {!lend && borrowingItems.length != 0 &&
                                <div>
                                    <h3 style={{ marginBottom: 15, marginTop: 15, marginLeft: 22 }}>Borrowing Items</h3>

                                    <div className='example' style={{ display: 'flex', overflowX: 'scroll' }}>

                                        {(renderBorrowing)}

                                    </div>
                                </div>
                            }
                            {!lend && borrowingItems.length == 0 && waitBorrowItems.length == 0 &&
                                <>
                                    <h3 >No Borrowed Items in the record</h3>
                                </>
                            }

                        </div>
                    </div>
                    <Modal centered show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Item</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" defaultValue={itemNameUpdate} ref={itemNameRef} />
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="text" defaultValue={priceUpdate} ref={priceRef} />
                                <Form.Label>Description</Form.Label>
                                <Form.Control type="email" defaultValue={descriptionUpdate} ref={descriptionRef} />
                                <Form.Label>Location</Form.Label>
                                <Form.Control type="text" defaultValue={locationUpdate} ref={locationRef} />
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={confirmUpdate}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>

                </>
            }
        </div>
    )
}