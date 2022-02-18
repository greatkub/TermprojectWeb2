import React, { useState } from 'react'


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
    const [imageUrl, setImageUrl] = useState('')
    const [ownerID, setOwnerID] = useState('')
    const [location, setLocation] = useState('')
    const [itemDesciption, setItemDescription] = useState('')

    return (
        <div>
            AddNewItem
        </div>
    )
}
