import React from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { makeStyles } from "@mui/styles";
import axios from 'axios';
import { useState, useEffect } from 'react'
import { Params, useParams } from 'react-router-dom';
import { findAllByDisplayValue } from '@testing-library/react';
import Select from 'react-select'



export default function ItemDetail({ appToken, appId }) {
    const API_URI = process.env.REACT_APP_API_URL;

    const [itemDetail, setitemDetail] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [duration, setDuration] = useState(1);
    const days = [{ value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' }, { value: 6, label: '6' }, { value: 7, label: '7' }]



    const { id } = useParams()

    function handlerClick() {
        axios.post(`${API_URI}/borrows/create-borrow`,
            // expenseLists
            {
                itemID: id,
                borrowerID: appId,
                lenderID: itemDetail.ownerID,
                borrowDuration: parseInt(duration.value),
                pendingStat: false
            },
            {
                headers: { 'auth-token': appToken }
            }

        ).then((response) => {
            console.log('done')
            console.log(response);
            // console.log(expenseLists)
            // window.location.href = `/verify/${id}`;
            alert("Success request borrow")
            window.location.reload(true);
        })
            .catch(error => {
                console.log(error.response)
                alert("fail Edit")
            })
    }

    useEffect(() => {
        axios(`${API_URI}/items/${id}`)
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
                <div className="box" style={{ backgroundColor: '#FFFFFF',zIndex: 3, position: 'absolute', left: '50%', marginLeft: '-37.5%', top: '10%', opacity: 0.95}}>
                    <Container className="box-header">
                        <label className="items">
                            BORROW ITEM
                        </label>
                    </Container>
                    <div className='container'>
                        <div className='row'>

                            <div class="col-sm-5" >
                                <img src={itemDetail.imageURL} >
                                </img>
                            </div>

                            <div class="col-sm-7" >

                                <div>
                                    <div>
                                        Item: {itemDetail.name}
                                    </div>

                                    <div>
                                        Owner: {itemDetail.ownerID}
                                    </div>

                                    <div>
                                        Detail: {itemDetail.itemDesciption}
                                    </div>

                                    <div>
                                        Location: {itemDetail.location}
                                    </div>

                                    <div>
                                        price/day: {itemDetail.pricePerDay} ฿
                                    </div>

                                    

                                </div>
                                {itemDetail.avaliable && itemDetail.ownerID != appId &&
                                    <div>
                                        {thisItemDuration(duration, setDuration, days, "Set your duration")}
                                        <div>
                                            <Button onClick={() => handlerClick()}>
                                                Let's borrow
                                            </Button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>





                    {/* <button onClick={() => console.log(itemDetail.ownerID, appId, duration)}></button> */}

                </div>
            }
        </div>
    )
}
