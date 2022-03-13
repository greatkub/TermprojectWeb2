import React from 'react'
import { Navbar, Nav, Container, Button, Table } from 'react-bootstrap';
import { makeStyles } from "@mui/styles";
import axios from 'axios';
import { useState, useEffect } from 'react'
import { Params, useParams } from 'react-router-dom';
import { findAllByDisplayValue } from '@testing-library/react';
import Select from 'react-select';
import useLocalStorage from 'use-local-storage';



export default function History({ appToken }) {
    const [historyItems, setHistoryItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lend, setLend] = useState(true);
    // const [name, setName] = useState('');

    const { userid } = useParams()

    const [lendHistory, setLendHistory] = useState([]);
    const [borrowedHistory, setBorrowedHistory] = useState([]);
    var name;
    useEffect(() => {
        // get transactions of user
        try {
            axios.get(`/transactions/${userid}`,
                {
                    headers: { 'auth-token': appToken }
                }
            )
                .then(response => {
                    console.log("allitems", response.data.result);
                    setHistoryItems(response.data.result.filter(item => item.returnStatus == true));
                    var result = response.data.result.filter(item => item.returnStatus == true);
                    var count = 0;
                    if (result.length != 0) {
                        result.forEach(item => {
                            axios.get(`/transactions/detail/${item._id}`,
                                {
                                    headers: { 'auth-token': appToken }
                                }
                            )
                                .then(response => {
                                    if (response.data.result.borrowID.lenderID == userid) {
                                        console.log("LendHistory", response.data.result)
                                        // lendHistory.push(response.data.result);
                                        lendHistory.push(response.data.result);
                                        setLendHistory(lendHistory)
                                        count++;

                                    }
                                    else {
                                        // console.log("BorrowedHistory", response.data.result)
                                        // borrowedHistory.push(response.data.result);
                                        borrowedHistory.push(response.data.result);
                                        setBorrowedHistory(borrowedHistory);
                                        count++;
                                    }

                                    if (result.length == count) {
                                        console.log("loading")
                                        setIsLoading(true);
                                    }
                                })
                                .catch(error => {
                                    console.log('Error getting fake data: ' + error);
                                })
                        })
                    }
                })
                .catch(error => {
                    console.log('Error getting fake data: ' + error);
                })
        }
        catch (e) {
            console.log(e)
        }

    }, []);

    const renderLendHistory = lendHistory.map((item, i) => {
        return (
            <tr key={i}>
                <td style={{textAlign: 'center' }}>{i + 1}</td>
                <td>{item.borrowID.itemID.name}</td>
                <td style={{textAlign: 'center' }}>{item.borrowID.borrowerID}</td>
                <td style={{textAlign: 'center' }}>฿ {item.totalPrice}</td>
            </tr>
        )
    })
    const renderBorrowedHistory = borrowedHistory.map((item, i) => {

        return (
            <tr key={i}>
                <td style={{textAlign: 'center' }}>{i + 1}</td>
                <td>{item.borrowID.itemID.name}</td>
                <td style={{textAlign: 'center' }}>{item.borrowID.lenderID}</td>
                <td style={{textAlign: 'center' }}>฿ {item.totalPrice}</td>
            </tr>
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
                                        Lend History
                                    </div>
                                    <div style={{ color: '#48846F', fontWeight: '300', marginLeft: '2vw' }} onClick={() => { setLend(false) }}>
                                        Borrowed History
                                    </div>
                                </>) : (<>
                                    <div style={{ color: '#48846F', fontWeight: '300', marginLeft: '2vw' }} onClick={() => { setLend(true) }}>
                                        Lend History
                                    </div>
                                    <div style={{ color: '#48846F', fontWeight: '500', marginLeft: '2vw' }} onClick={() => { setLend(false) }}>
                                        Borrowed History
                                    </div>
                                </>)}
                            </Navbar.Brand>
                        </Container>
                    </Navbar>

                    {/* <Button onClick={() => { console.log(historyItems,lendHistory, borrowedHistory) }}> Test </Button> */}


                    <Container>

                        <Table striped bordered hover size="sm">
                            {lend && lendHistory.length != 0 &&
                                <>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '5%', textAlign: 'center' }}>#</th>
                                            <th style={{ width: '71%' }}>Item</th>
                                            <th style={{ width: '12%', textAlign: 'center' }}>Borrower</th>
                                            <th style={{ width: '12%', textAlign: 'center' }}>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderLendHistory}
                                    </tbody>
                                </>
                            }
                            {lend && lendHistory.length == 0 &&
                                <>
                                    <h3>No Lend History record</h3>
                                </>
                            }

                            {!lend && borrowedHistory.length != 0 &&
                                <>
                                    <thead>
                                        <tr>
                                        <th style={{ width: '5%', textAlign: 'center' }}>#</th>
                                            <th style={{ width: '71%' }}>Item</th>
                                            <th style={{ width: '12%', textAlign: 'center' }}>Lender</th>
                                            <th style={{ width: '12%', textAlign: 'center' }}>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderBorrowedHistory}
                                    </tbody>
                                </>
                            }
                            {lend && borrowedHistory.length == 0 &&
                                <>
                                    <h3>No Borrowed History record</h3>
                                </>
                            }



                        </Table>

                    </Container>
                </>
            }
        </div>
    )
}
