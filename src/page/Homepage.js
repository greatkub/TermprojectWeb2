import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap';
import { makeStyles } from "@mui/styles";
import axios from 'axios';
import { useState, useEffect } from 'react'



export default function Homepage() {

    const [allItems, setAllItems] = useState();
    const [itemsDetail, setItemsDetail] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        axios('items')
            .then(response => {
                console.log("hi" + response.data)
                setAllItems(response.data.result)
                setIsLoading(true)
            })
            .catch(error => {
                console.log('Error getting fake data: ' + error);
            })
    }, []);

    function handlerClick(i) {
        setItemsDetail(i._id)
    }

    return (

        <div className="box" >

            <Container className="box-header" style={{ backgroundColor: 'red' }}>
                <label className="items">
                    Items
                </label>

                <div className="form-group search">
                    <input id="searchBar" type="text" className="form-control" placeholder="Search" />
                    <span className="fa fa-search form-control-feedback"></span>
                </div>


            </Container>

            {isLoading &&
                <div style={{ display: 'flex', flexWrap: 'wrap', width: '93%', margin: 'auto', marginTop: '2%', marginBottom: '2%' }}>
                    {allItems.map((item, i) => {
                        return (
                            <div className='box-card' key={i} onClick={() => handlerClick(item)}>
                                <img src={item.imageURL} className='box-image' style={{ objectFit: 'cover' }}>

                                </img>
                                <div>
                                    {item.name}
                                </div>

                            </div>
                        )
                    })}

                </div>
            }


        </div>
    )
}
