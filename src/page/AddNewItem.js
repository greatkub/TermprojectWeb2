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
export default function AddNewItem() {
    const [itemName, setItemName] = useState('')
    const [price, setPrice] = useState(0)
    const [ownerID, setOwnerID] = useState(6210015)
    const [location, setLocation] = useState('')
    const [itemDesciption, setItemDescription] = useState('')
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);
    const places = [{ value: "place A", label: "place A" }, { value: "place B", label: "place B" }]

    function handlerClick() {
        axios.post("/items",
            {
                name: itemName,
                pricePerDay: price,
                ownerID: ownerID,
                imageURL: url,
                location: location.value,
                itemDescription: "itemDesciption"
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
        <div className="box" >

            <Container className="box-header" style={{ backgroundColor: 'red' }}>
                <label className="items">
                    Add Item
                </label>


            </Container>
            <div>
                <div>
                    ReactFirebaseFileUpload
                    <br />
                    <input type="file" onChange={handleChange} />
                    <img src={url}>

                    </img>
                    <button onClick={handleUpload}>
                        upload
                    </button>
                </div>
                AddNewItem
                <br />

                <input placeholder="Enter a name" type="text" onChange={(e) => setItemName(e.target.value)} >
                </input>
                <input placeholder="Enter a price" type="number" onChange={(e) => setPrice(e.target.value)} >
                </input>
                {placelocation(location, setLocation, places, "Select place appointment")}
                {/* <input placeholder="Enter a location" type="text" onChange={(e) => setLocation(e.target.value)} >
            </input> */}
                <input placeholder="Enter a description" type="text" onChange={(e) => setItemDescription(e.target.value)} >
                </input>


                <button onClick={() => handlerClick()}>
                    submit
                </button>

            </div>
        </div>
    )
}
