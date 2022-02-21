import React from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { makeStyles } from "@mui/styles";
import axios from 'axios';
import { useState, useEffect } from 'react'
import { Params, useParams } from 'react-router-dom';
import { findAllByDisplayValue } from '@testing-library/react';
import Select from 'react-select'



export default function ItemDetail() {
    const [itemDetail, setitemDetail] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [duration, setDuration] = useState(1);
    const days = [{ value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' }, { value: 6, label: '6' }, { value: 7, label: '7' }]



    const { id } = useParams()

    function handlerClick() {
        axios.post("/borrows/create-borrow",
            // expenseLists

            {
                itemID: id,
                borrowerID: 6210014,
                lenderID: itemDetail.ownerID,
                borrowDuration: parseInt(duration)
            }

        ).then((response) => {
            console.log('done')
            console.log(response);
            // console.log(expenseLists)
            // window.location.href = `/verify/${id}`;
            alert("Success")
            window.location.reload(false);
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

    function thisItemDuration(get, set, data, text) {
        return (
            <div>
                <div>
                    {text}
                </div>
                <Select
                    width='100px'
                    defaultValue={get}
                    onChange={set}
                    options={data}
                />
            </div>
        )
    }

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
                        <div>
                            {thisItemDuration(duration, setDuration, days, "set your duration")}
                            <button onClick={() => handlerClick()}>
                                Let's borrow
                            </button>
                        </div>

                    }

                </div>
            }
        </div>
    )
}
