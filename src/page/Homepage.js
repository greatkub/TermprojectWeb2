import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap';
import { makeStyles } from "@mui/styles";
import { Params, useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react'




export default function Homepage({ appToken }, { appId }) {
    const API_URI = process.env.REACT_APP_API_URL;

    const [allItems, setAllItems] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);

    const { userid } = useParams()

    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTEwMTU1IiwiaWF0IjoxNjQ2MDUyNDQxfQ.xD0PL9dsvz015Eb3z56vXnWPdK13NJpnY__QJBNaJrE"
    useEffect(() => {
        (async () => {
            await axios(`${API_URI}/items`,
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

    function handlerScrollUp() {
        window.scrollTo(0, 0)

    }
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

        <div className="box" style={{ backgroundColor: '#FFFFFF', position: 'absolute', left: '50%', marginLeft: '-37.5%' ,zIndex: 1,   opacity: 0.95, height: '80vh', overflowY: 'scroll'}}>

            <Container className="box-header" >
                <label className="items" style={{position: 'absolute', left: 20, top: 20, fontWeight: 400}}>
                    Items
                </label>
                {/* <button onClick={}> 

                </button> */}

                <div className="form-group search" style={{top: 6, right: 40, position: 'absolute'}}>
                    <input id="searchBar" type="text" className="form-control" placeholder="Search" onChange={searchItem}  />
                    <span className="fa fa-search form-control-feedback"></span>
                </div>
            </Container>

            {isLoading &&
                // <div style={{ display: 'flex', flexWrap: 'wrap', width: '93%', margin: 'auto', marginTop: '2%', marginBottom: '2%' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', left: '50%', marginLeft: '4%', marginTop: '2%'}}>

                    {renderItems}
                </div>
            }

        {/* <button onClick={() => {handlerScrollUp()}}/> */}
        </div>
    )
}
