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

    useEffect(() => {

        setLendItems([]);
        setBorrowedItems([]);

        //get all items of user
        axios(`/items?userId=${userid}`,
            {
                headers: { 'auth-token': appToken }
            }
        )
            .then(response => {
                setItems(response.data.result.filter(item => item.avaliable == true))
                console.log("Items", items)

            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })

        // Get lended Items
        axios(`/borrows/Lender?userId=${userid}`,
            {
                headers: { 'auth-token': appToken }
            }
        )
            .then(response => {
                setLendItems(response.data.result)
                console.log("LendItems", lendItems)

                
            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })

        axios(`/borrows/Borrower?userId=${userid}`,
            {
                headers: { 'auth-token': appToken }
            }
        )
            .then(response => {
                setBorrowedItems(response.data.result)
                console.log("BorrowedItems", borrowedItems)
                setIsLoading(true);
            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })

            
        

        console.log("ye", availableItems)
    }, []);




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
                        <Button>Accept</Button>
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

    const renderAvalaibleItems = items.map((item, i) => {
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


    const renderBorrow = borrowedItems.map((item, i) => {
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
                    <Button>Return</Button>
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

                    <Button onClick={() => { console.log(items,lendItems,availableItems) }}></Button>



                    <div className="box">
                        <div style={{ display: 'flex', flexWrap: 'wrap', width: '93%', margin: 'auto', marginTop: '2%', marginBottom: '2%' }}>
                            {lend ?

                                [(renderPendingItems), (renderLendingItems), (renderAvalaibleItems)]


                                : (renderBorrow)
                            }
                        </div>
                    </div>

                </>
            }
        </div>
    )
}