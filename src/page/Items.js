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
        axios.get(`/items?userId=${userid}`,
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
        axios.get(`/transactions/${userid}`,
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
        axios.get(`/borrows/lender?userId=${userid}`,
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
        axios.get(`/borrows/borrower?userId=${userid}`,
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
        axios.patch("/borrows/lender/accept",
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
                        axios.post("/transactions",
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
                axios.patch("/transactions/" + trans._id,
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
        axios.delete("/borrows/" + item._id,
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
        axios.delete("/items/" + item._id,
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

        axios.put(`/items/${itemUpdate}`,
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



    const renderPendingItems = pendingItems.map((item, i) => {
        return (
            <div className='box-card2' key={i}>
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
                <div className="lower">
                    <div>
                        <Button variant="info" style={{ width: '50%' }} onClick={() => handlerAccept(item)}>Accept</Button>
                        <Button variant="danger" style={{ width: '50%' }} onClick={() => handlerDecline(item)}>Decline</Button>
                    </div>

                </div>

            </div>
        )
    })
    const renderLendingItems = lendingItems.map((item, i) => {
        return (
            <div className='box-card2' key={i}>
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
            <div className='box-card3' key={i}>
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

                <div className="lower">
                    <div>
                        <Button variant="info" style={{ width: '50%' }} onClick={() => handlerUpdate(item)}>Edit</Button>
                        <Button variant="danger" style={{ width: '50%' }} onClick={() => handlerDelete(item)}>Delete</Button>
                    </div>

                </div>
            </div>


        )
    })


    const renderWaitingBorrow = waitBorrowItems.map((item, i) => {
        return (
            <div className='box-card2' key={i}>
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
            <div className='box-card2' key={i}>
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
        <div>
            {isLoading &&
                <>
                    <Navbar bg="light" variant="light">
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


                    <div className="box">
                        <div className="box-1" style={{ display: 'flex', flexWrap: 'wrap', width: '93%', margin: 'auto', marginTop: '2%', marginBottom: '2%' }}>

                            {lend && pendingItems.length != 0 &&
                                <>
                                    <h3>Pending Items</h3>
                                    {(renderPendingItems)}
                                </>
                            }
                            {lend && lendingItems.length != 0 &&
                                <>
                                    <h3>Lending Items</h3>
                                    {(renderLendingItems)}
                                </>
                            }
                            {lend && availableItems.length != 0 &&
                                <>
                                    <h3>Available Items</h3>
                                    {(renderAvailableItems)}
                                </>
                            }
                            {lend && pendingItems.length == 0 && lendingItems.length == 0 && availableItems.length == 0 &&
                                <>
                                    <h3>No Lend Items in the record</h3>
                                </>
                            }



                            {!lend && waitBorrowItems.length != 0 &&
                                <>
                                    <h3>Pending Items</h3>
                                    {(renderWaitingBorrow)}
                                </>
                            }
                            {!lend && borrowingItems.length != 0 &&
                                <>
                                    <h3>Borrowing Items</h3>
                                    {(renderBorrowing)}
                                </>
                            }
                            {!lend && borrowingItems.length == 0 && waitBorrowItems.length == 0 &&
                                <>
                                    <h3>No Borrowed Items in the record</h3>
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