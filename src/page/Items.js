import React from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { makeStyles } from "@mui/styles";
import axios from 'axios';
import { useState, useEffect } from 'react'
import { Params, useParams } from 'react-router-dom';
import { findAllByDisplayValue } from '@testing-library/react';
import Select from 'react-select'



export default function Items({ appToken }) {
    const [historyItems, setHistoryItems] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const { userid } = useParams()


    useEffect(() => {
        axios(`/transactions/${userid}`)
            .then(response => {
                console.log("hi" + response.data)
                console.log(response.data.result)
                setHistoryItems(response.data.result)
                setIsLoading(true)
            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })
    }, [isLoading]);



    return (

        <div>
            {isLoading &&
                <div>
                    hekki
                </div>

            }

        </div>
    )
}
