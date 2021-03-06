import React from 'react';
import { Button } from 'reactstrap';
import APIURL from '../helpers/environment';

const AddWatchList = (props) => {
    let title = props.selected.title;
    let description = props.selected.overview;
    let imageURL = props.selected.poster_path;

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${APIURL}watchlist/create`, {
            method: 'POST',
            body: JSON.stringify({
                watchlist: {
                    title: title,
                    description: description,
                    imageURL: imageURL
                }
            }),
            headers: new Headers({
                'Content-Type': "application/json",
                'Authorization': `Bearer ${props.token}`
            })
        }).then((res) => res.json())

        props.closeModal();
    }
    return (
        <>
            <Button id="submitWLButton" onClick={(e) => handleSubmit(e)} type="submit" >Add to Watchlist</Button>
        </>
    );
}

export default AddWatchList;