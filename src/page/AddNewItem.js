import React, { useState } from 'react'
import axios from 'axios'
import { storage } from '../firebase/fire';
import Select from 'react-select';
import { Container } from 'react-bootstrap';
import { Button } from 'bootstrap';
import { FaRegImage } from "react-icons/fa";
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
    const places = [{ value: "King Court", label: "King Court" }, { value: "AU Mall", label: "AU Mall" }, { value: "CL 1st Floor", label: "CL 1st Floor" }, { value: "VMS Building", label: "VMS Building" }]

    function handlerClick() {
        console.log(itemDesciption)
        axios.post(`${API_URI}/items`,

            {
                name: itemName,
                pricePerDay: parseInt(price),
                ownerID: appId,
                imageURL: url,
                location: location.value,
                itemDesciption: itemDesciption

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
                alert(error.response.data.message)
            })
    }


    function placelocation(get, set, data, text) {
        return (
            <div >
                <div style={{ marginBottom: 6 }}>
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
            // setImage(e.target.files[0]);
            const uploadTask = storage.ref(`images/${e.target.files[0].name}`).put(e.target.files[0]);
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
                        .child(e.target.files[0].name)
                        .getDownloadURL()
                        .then(url => {
                            setUrl(url);
                            console.log(url)
                        });
                }
            );
        }
    };

    const handleUpload = () => {
        // const uploadTask = storage.ref(`images/${e.target.files[0].name}`).put(e.target.files[0]);
        // uploadTask.on(
        //     "state_changed",
        //     snapshot => {
        //         const progress = Math.round(
        //             (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        //         );
        //         setProgress(progress);
        //     },
        //     error => {
        //         console.log(error);
        //     },
        //     () => {
        //         storage
        //             .ref("images")
        //             .child(e.target.files[0].name)
        //             .getDownloadURL()
        //             .then(url => {
        //                 setUrl(url);
        //                 console.log(url)
        //             });
        //     }
        // );
    };

    console.log("image: ", image);


    return (
        <div>
            <div className="box" style={{ backgroundColor: '#FFFFFF', zIndex: 3, position: 'absolute', left: '50%', marginLeft: '-37.5%', top: '10%', opacity: 0.95 }}>


                <Container className="box-header">
                    <label className="items">
                        Add Item
                    </label>


                </Container>


                <div className='container'>
                    <div className='row'>


                        <div class="col-sm-6" style={{ position: 'relative' }}>
                            {/* <input type="file" onChange={handleChange} /> */}
                            {url != "" ?
                                <img src={url} style={{ width: '92%', height: '94%', position: 'absolute', left: '50%', marginLeft: '-46%' }}>

                                </img>
                                :
                                <FaRegImage style={{ width: '92%', height: '94%', position: 'absolute', left: '50%', marginLeft: '-46%', opacity: 0.5 }}>

                                </FaRegImage>
                            }



                            {/* <button onClick={handleUpload}>
                                upload
                            </button> */}
                        </div>
                        {/* <br /> */}

                        <div class="col-sm-6" >
                            <div class="form-group" style={{ marginBottom: 10, width: '96%' }}>
                                <label for="inputAddress" style={{ marginBottom: 6 }}>Name</label>
                                <input placeholder="Enter a name" class="form-control" type="text" onChange={(e) => setItemName(e.target.value)} >
                                </input>
                            </div>
                            <div class="form-group" style={{ marginBottom: 10, width: '96%' }}>
                                <label for="inputAddress" style={{ marginBottom: 6 }}>Price</label>
                                <input placeholder="Enter a price" class="form-control" type="number" onChange={(e) => setPrice(e.target.value)} >
                                </input>
                            </div>
                            <div class="form-group" style={{ marginBottom: 10, width: '96%' }}>
                                <label for="inputAddress" style={{ marginBottom: 6 }}>Description</label>
                                <textarea placeholder="Enter a description" class="form-control" type="text" onChange={(e) => setItemDescription(e.target.value)}
                                    style={{ height: 100 }} >
                                </textarea>
                            </div>
                            {/* <div class="form-group">
                               
                            </div> */}



                            <div style={{ width: '96%' }}>
                                {placelocation(location, setLocation, places, "Select place appointment")}

                            </div>

                            <input type="file" onChange={handleChange} style={{ position: 'absolute', bottom: 30 }}>

                            </input>

                            <button onClick={() => handlerClick()}
                                style={{
                                    position: 'absolute', right: 20, bottom: 20, height: 45,
                                    width: 200,
                                    borderRadius: 8,
                                    backgroundColor: '#48846F',
                                    color: '#FFFFFF',
                                    border: '0px solid #FFFFFF'
                                }}>
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
