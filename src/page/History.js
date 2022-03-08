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
        axios(`/transactions/${userid}`,
            {
                headers: { 'auth-token': appToken }
            }
        )
            .then(response => {
                console.log("allitems", response.data.result);
                setHistoryItems(response.data.result.filter(item => item.returnStatus == true));
                var result = response.data.result.filter(item => item.returnStatus == true);
                var count = 0;
                result.forEach(item => {
                    axios(`/transactions/detail/${item._id}`,
                        {
                            headers: { 'auth-token': appToken }
                        }
                    )
                        .then(response => {
                            if (response.data.result.borrowID.lenderID == userid) {
                                console.log("LendHistory", response.data.result)
                                // lendHistory.push(response.data.result);
                                lendHistory.push(response.data.result);

                                count++;

                            }
                            else {
                                // console.log("BorrowedHistory", response.data.result)
                                // borrowedHistory.push(response.data.result);
                                borrowedHistory.push(response.data.result);
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


            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })
    }, []);


    var name;
    const renderLendHistory = lendHistory.map((item, i) => {
        
        return (
            <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.borrowID.itemID.name}</td>
                <td>{item.borrowID.borrowerID}</td>
                <td>{item.totalPrice}</td>
            </tr>
        )
    })


    const renderBorrowedHistory = borrowedHistory.map((item, i) => {
        
        return (
            <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.borrowID.itemID.name}</td>
                <td>{item.borrowID.lenderID}</td>
                <td>{item.totalPrice}</td>
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

                    

                    <Container>

                        <Table striped bordered hover size="sm">

                            {lend ? (<>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Item</th>
                                        <th>Borrower</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderLendHistory}
                                </tbody>
                            </>) : (<>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Item</th>
                                        <th>Lender</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderBorrowedHistory}
                                </tbody>
                            </>)}





                        </Table>

                    </Container>
                </>
            }
        </div>
    )
}
