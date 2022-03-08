import React from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { makeStyles } from "@mui/styles";
import axios from 'axios';
import { useState, useEffect } from 'react'
import { Params, useParams } from 'react-router-dom';
import { findAllByDisplayValue } from '@testing-library/react';
import Select from 'react-select'



export default function Items({ appToken }) {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lend, setLend] = useState(true);

    const { userid } = useParams()

    const [lendItems, setLendItems] = useState([]);
    const [borrowedItems, setBorrowedItems] = useState([]);

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
                setItems(response.data.result)
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

    }, [isLoading]);


    function renderItems() {
        // let item2 = items.map(item =>)
        // return (
        //     <div className='box-card2' >
                {/* <img src={item.imageURL} className='box-image' style={{ objectFit: 'cover' }}>
                </img>
                <div>
                    {item.name}
                </div>
                <div>
                    Availability: {item.avaliable + ''}
                </div> */}
            {/* </div> */}
        // )
    };

    



    // var foundItem;
    // var found = false;
    // lendItems.forEach((item2) => {
    //     if (item._id == item2.itemID) {
    //         found = true;
    //         foundItem = item2;
    //         // console.log(item._id, item2.itemID)
    //     }
    // })
    // if (!found) {
    //     return (
    //         <div className='box-card2' key={i} >
    //             <img src={item.imageURL} className='box-image' style={{ objectFit: 'cover' }}>
    //             </img>
    //             <div>
    //                 {item.name}
    //             </div>
    //             <div>
    //                 Availability: {item.avaliable + ''}
    //             </div>
    //         </div>
    //     )
    // }
    // else if (foundItem.pendingStat){
    //     return (
    //         <div className='box-card2'  >
    //             <img src={item.imageURL} className='box-image' style={{ objectFit: 'cover' }}>
    //             </img>
    //             <div>
    //                 {item.name}
    //             </div>
    //             <div>
    //                 Borrower: {foundItem.borrowerID}
    //             </div>
    //             <div>
    //                 Duration: {foundItem.borrowDuration}
    //             </div>
    //         </div>
    //     )
    // }
    // else if (!foundItem.pendingStat){
    //     return (
    //         <div className='box-card2'  >
    //             <img src={item.imageURL} className='box-image' style={{ objectFit: 'cover' }}>
    //             </img>
    //             <div>
    //                 {item.name}
    //             </div>
    //             <div>
    //                 Borrower: {foundItem.borrowerID}
    //             </div>
    //             <div>
    //                 Duration: {foundItem.borrowDuration}
    //             </div>
    //             <div>
    //                 <Button>Accept</Button>
    //             </div>
    //         </div>
    //     )
    // }
    // })


    const renderBorrow = items.map((item, i) => {
        borrowedItems.forEach((item2) => {
            if (item._id == item2.itemID) {
                console.log("yes");
                return (
                    <div className='box-card2' >
                        <img src={item.imageURL} className='box-image' style={{ objectFit: 'cover' }}>
                        </img>
                        <div>
                            {item.name}
                        </div>
                        <div>
                            {item2.lenderID}
                        </div>
                    </div>
                )
            }
        })

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

                    <Button onClick={() => { console.log(lendItems) }}></Button>



                    <div className="box">
                        <div style={{ display: 'flex', flexWrap: 'wrap', width: '93%', margin: 'auto', marginTop: '2%', marginBottom: '2%' }}>
                            {lend ?
                                (renderItems) :
                                (renderBorrow)
                            }
                        </div>
                    </div>

                </>
            }
        </div>
    )
}