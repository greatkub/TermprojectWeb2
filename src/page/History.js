import React from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
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

    const { userid } = useParams()

    const [lendHistory,setLendHistory] = useState([]);
    const [borrowedHistory,setBorrowedHistory] = useState([]);

    useEffect(() => {

        setLendHistory([]);
        setBorrowedHistory([]);

        axios(`/transactions/${userid}`,
            {
                headers: { 'auth-token': appToken }
            }
        )
            .then(response => {
                setHistoryItems(response.data.result.filter(item => item.returnStatus == true))
                console.log("before", historyItems)

                historyItems.forEach(item => {
                    axios(`/transactions/detail/${item._id}`,
                        {
                            headers: { 'auth-token': appToken }
                        }
                    )
                        .then(response => {

                            if (response.data.result.borrowID.lenderID == userid) {
                                // console.log("LendHistory", response.data.result)
                                // lendHistory.push(response.data.result);
                                console.log("lend");
                                setLendHistory([...lendHistory,response.data.result]);
                            }
                            else {
                                // console.log("BorrowedHistory", response.data.result)
                                // borrowedHistory.push(response.data.result);
                                setBorrowedHistory([...borrowedHistory,response.data.result]);
                            }

                        })
                        .catch(error => {
                            console.log('Error getting fake data: ' + error);
                        })
                })

                console.log("lendHistory", lendHistory);
                console.log("borrowedHistory", borrowedHistory);

                setIsLoading(true);
            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })

    }, [isLoading]);

    const renderHistory = lendHistory.map((item, i) => {
        return (
            <div>
                <div>
                    {item.returnStatus+''}
                    test1
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
                                <div style={{ color: '#48846F', fontWeight: '500', marginLeft: '2vw' }} onClick={() => { }}>
                                    Lend History
                                </div>
                                <div style={{ color: '#48846F', fontWeight: '500', marginLeft: '2vw' }} onClick={() => { }}>
                                    Borrowed History
                                </div>
                            </Navbar.Brand>
                        </Container>
                    </Navbar>

                    <Button onClick={() => {console.log(lendHistory)}}></Button>

                    <Container>
                        { renderHistory }
                        hello

                    </Container>
                </>
            }
        </div>
    )
}
