import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap';
import { makeStyles } from "@mui/styles";
import { Params, useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react'




export default function Homepage({ appToken }, { appId }) {

    const [allItems, setAllItems] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);

    const { userid } = useParams()

    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTEwMTU1IiwiaWF0IjoxNjQ2MDUyNDQxfQ.xD0PL9dsvz015Eb3z56vXnWPdK13NJpnY__QJBNaJrE"
    useEffect(() => {
        (async () => {
            await axios('/items',
                {
                    headers:
                    {
                        'auth-token': appToken
                    }
                }

            )
                .then(response => {
                    console.log("hi" + response.data)
                    setAllItems(response.data.result)
                    setFilteredItems(response.data.result)
                    setIsLoading(true)
                })
                .catch(error => {
                    console.log('Error getting fake data: ' + error);
                })
        })()

    }, []);


    function searchItem() {
        var searchbar = document.getElementById('searchBar').value.toLowerCase();
        var filter = allItems.filter(item => {
            return item.name.toLowerCase().includes(searchbar);
        })
        setFilteredItems(filter)
    };

    const renderItems = filteredItems.map((item, i) => {
        return (
            <div className='box-card' key={i} onClick={() => handlerClick(item)}>
                <img src={item.imageURL} className='box-image' style={{ objectFit: 'cover' }}>
                </img>
                <div>
                    <div style={{fontWeight: 600, fontSize: 13, width: 150, marginLeft: 10, marginTop: 10}}>
                        {item.name}
                    </div>
                </div>
            </div>
        )
    })

    function handlerClick(i) {
        window.location.href = `/itemDetail/${i._id}`
    }

    return (

        <div className="box" style={{ backgroundColor: '#FFFFFF' }}>

            <Container className="box-header" >
                <label className="items">
                    Items
                </label>
                {/* <button onClick={}> 

                </button> */}

                <div className="form-group search">
                    <input id="searchBar" type="text" className="form-control" placeholder="Search" onChange={searchItem} />
                    <span className="fa fa-search form-control-feedback"></span>
                </div>
            </Container>

            {isLoading &&
                <div style={{ display: 'flex', flexWrap: 'wrap', width: '93%', margin: 'auto', marginTop: '2%', marginBottom: '2%' }}>
                    {renderItems}
                </div>
            }


        </div>
    )
}
