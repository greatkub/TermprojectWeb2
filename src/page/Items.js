import React from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { makeStyles } from "@mui/styles";
import axios from 'axios';
import { useState, useEffect } from 'react'
import { Params, useParams } from 'react-router-dom';
import { findAllByDisplayValue, render } from '@testing-library/react';
import Select from 'react-select';
import parse from 'html-react-parser';



export default function Items({ appToken }) {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lend, setLend] = useState(true);

    const { userid } = useParams()

    const [lendItems, setLendItems] = useState([]);
    const [borrowedItems, setBorrowedItems] = useState([]);
    const [availableItems, setAvailableItems] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {

        setLendItems([]);
        setBorrowedItems([]);

        //get all items of user
        axios.get(`/items?userId=${userid}`,
            {
                headers: { 'auth-token': appToken }
            }
        )
            .then(response => {
                setItems(response.data.result)
                setAvailableItems(response.data.result.filter(item => item.avaliable == true))
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
                setLendItems(response.data.result.filter((item) => {
                    return !transactions.some((trans) => { return (item._id == trans.borrowID && trans.returnStatus == true) })
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
                setBorrowedItems(response.data.result.filter((item) => {
                    return !transactions.some((trans) => { return (item._id == trans.borrowID && trans.returnStatus == true) })
                }
                ))
                setIsLoading(true);
            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })





        console.log("ye", availableItems)
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
        console.log("click", item);
        transactions.forEach(trans => {
            if (trans.borrowID == item._id) {
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



    const renderPendingItems = lendItems.map((item, i) => {
        if (item.pendingStat == false) {
            return (
                <div className='box-card2' >
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
                    <div>
                        <Button onClick={() => handlerAccept(item)}>Accept</Button>
                        <Button onClick={() => handlerDecline(item)}>Decline</Button>
                    </div>

                </div>
            )
        }

    })
    const renderLendingItems = lendItems.map((item, i) => {
        if (item.pendingStat == true) {
            return (
                <div className='box-card2' >
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
        }

    })

    const renderAvalaibleItems = availableItems.map((item, i) => {
        return (
            <div className='box-card2' >
                <img src={item.imageURL} className='box-image' style={{ objectFit: 'cover' }}>
                </img>
                <div>
                    {item.name}
                </div>
                <div>
                    Availability: {item.avaliable + ''}
                </div>

            </div>
        )
    })


    const renderWaitingBorrow = borrowedItems.map((item, i) => {
        if (item.pendingStat == false) {
            return (
                <div className='box-card2' >
                    <img src={item.itemID.imageURL} className='box-image' style={{ objectFit: 'cover' }}>
                    </img>
                    <div>
                        {item.itemID.name}
                    </div>
                    <div>
                        {item.lenderID}
                    </div>
                    <div>
                        Duration:{item.borrowDuration}
                    </div>
                    <div>
                        Wating for owner to accept.
                    </div>
                </div>
            )
        }
    })

    const renderBorrowing = borrowedItems.map((item, i) => {
        if (item.pendingStat == true) {

            return (
                <div className='box-card2' >
                    <img src={item.itemID.imageURL} className='box-image' style={{ objectFit: 'cover' }}>
                    </img>
                    <div>
                        {item.itemID.name}
                    </div>
                    <div>
                        {item.lenderID}
                    </div>
                    <div>
                        Duration:{item.borrowDuration}
                    </div>
                    <div>
                        <Button onClick={() => handlerReturn(item)}>Return</Button>
                    </div>
                </div>
            )
        }
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

                    {/* <Button onClick={() => { console.log(transactions, borrowedItems, borrowedItems[4]._id.includes(transactions.borrowID)) }}></Button> */}
                    <Button onClick={() => { console.log(borrowedItems, transactions) }}></Button>



                    <div className="box">
                        <div style={{ display: 'flex', flexWrap: 'wrap', width: '93%', margin: 'auto', marginTop: '2%', marginBottom: '2%' }}>
                            {lend ?
                                [(renderPendingItems), (renderLendingItems), (renderAvalaibleItems)]
                                :
                                [(renderWaitingBorrow), (renderBorrowing)]
                            }
                        </div>
                    </div>

                </>
            }
        </div>
    )
}