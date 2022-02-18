import React from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { makeStyles } from "@mui/styles";
import axios from 'axios';
import { useState, useEffect } from 'react'
import { Params, useParams } from 'react-router-dom';
import { findAllByDisplayValue } from '@testing-library/react';


export default function ItemDetail() {
    const [itemDetail, setitemDetail] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const { id } = useParams()

    function handlerClick() {
        axios.post("/borrows/create-borrow",
            // expenseLists

            {
                itemID: id,
                borrowerID: 6210014,
                lenderID: 6210015
            }

        ).then((response) => {
            console.log('done')
            console.log(response);
            // console.log(expenseLists)
            // window.location.href = `/verify/${id}`;
            alert("Success")
        })
            .catch(error => {
                console.log(error.response)
                alert("fail Edit")
            })
    }

    useEffect(() => {
        axios(`/items/${id}`)
            .then(response => {
                console.log("hi" + response.data)
                console.log(response.data.result)
                setitemDetail(response.data.result)
                setIsLoading(true)
            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })
    }, [isLoading]);

    return (


        <div>
            {isLoading &&
                <div className="box" >

                    <Container className="box-header" style={{ backgroundColor: 'red' }}>
                        <label className="items">
                            BORROW ITEM
                        </label>
                    </Container>
                    <div>
                        <img src={itemDetail.imageURL}>
                        </img>
                        <div>
                            {itemDetail.name}
                            <br />
                            {itemDetail.ownerID}
                            <br />
                            {itemDetail.itemDesciption}
                            <br />
                            {itemDetail.location}
                            <br />
                            {itemDetail.pricePerDay}
                            <br />
                            owner,item,Description,price
                        </div>
                    </div>

                    {itemDetail.avaliable &&
                        <button onClick={() => handlerClick()}>
                            Let's borrow
                        </button>
                    }


                </div>
            }
        </div>
    )
}
