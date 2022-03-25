import React, { useState } from 'react'
import axios from 'axios'
import { storage } from '../firebase/fire';
import Select from 'react-select';
import { Container } from 'react-bootstrap';

// path:/items

// body:

// {name: "some thing",
// pricePerDay: 400,
// imageURL: "url here",
// ownerID: "6210015",
// location: "king devid",
// itemDesciption: "some thing"}

export default function AddNewItem({ appToken, appId }) {
    const API_URI = process.env.REACT_APP_API_URL;

    const [itemName, setItemName] = useState('')
    const [price, setPrice] = useState(0)
    const [location, setLocation] = useState('')
    const [itemDesciption, setItemDescription] = useState('')
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);
    const places = [{ value: "place A", label: "place A" }, { value: "place B", label: "place B" }]

    function handlerClick() {

        axios.post(`${API_URI}/items`,

            {
                name: itemName,
                pricePerDay: price,
                ownerID: appId,
                imageURL: url,
                location: location.value,
                itemDescription: "itemDesciption"

            },
            {
                headers: { 'auth-token': appToken }
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


    function placelocation(get, set, data, text) {
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


    const handleChange = e => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            error => {
                console.log(error);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        setUrl(url);
                    });
            }
        );
    };

    console.log("image: ", image);


    return (
        <div style={{ height: '100vh' }}>
            <div className="box" style={{ backgroundColor: '#FFFFFF' }}>


                <Container className="box-header">
                    <label className="items">
                        Add Item
                    </label>


                </Container>


                <div className='container'>
                    <div className='row'>


                        <div class="col-sm-4" style={{ backgroundColor: 'red' }}>
                            <input type="file" onChange={handleChange} />
                            <img src={url}>

                            </img>
                            <button onClick={handleUpload}>
                                upload
                            </button>
                        </div>
                        {/* <br /> */}

                        <div class="col-sm-8" style={{ backgroundColor: 'blue' }}>
                            <div class="form-group">
                                <label for="inputAddress">Name</label>
                                <input placeholder="Enter a name" class="form-control" type="text" onChange={(e) => setItemName(e.target.value)} >
                                </input>
                            </div>
                            <div class="form-group">
                                <label for="inputAddress">Price</label>
                                <input placeholder="Enter a price" class="form-control" type="number" onChange={(e) => setPrice(e.target.value)} >
                                </input>
                            </div>
                            <div class="form-group">
                                <label for="inputAddress">Description</label>
                                <input placeholder="Enter a description" class="form-control" type="text" onChange={(e) => setItemDescription(e.target.value)} >
                                </input>
                            </div>
                            {/* <div class="form-group">
                               
                            </div> */}




                            {placelocation(location, setLocation, places, "Select place appointment")}


                            <button onClick={() => handlerClick()}>
                                submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
