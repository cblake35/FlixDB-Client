import React, {
    useState
} from 'react';
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';

const CreateReview = (props) => {
    const [userReview, setUserReview] = useState('');
    // const [ title, setTitle ] = useState('');
    // const [ description, setDescription ] = useState('');
    // const [ imageURL, setImageURL ] = useState('');

    console.log(props.selected);

    let title = props.selected.title;
    let description = props.selected.overview;
    let imageURL = props.selected.poster_path;

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('https://cb-movie-reviews-server.herokuapp.com/reviews/create', {
            method: 'POST',
            body: JSON.stringify({
                review: {
                    title: title,
                    description: description,
                    review: userReview,
                    imageURL: imageURL
                }
            }),
            headers: new Headers({
                'Content-Type': "application/json",
                'Authorization': `Bearer ${props.token}`
            })
        }).then((res) => res.json())
            .then((logData) => {
                console.log(logData);
            })
    }

    return (
        <div>
            <Form className="reviewForm" onSubmit={handleSubmit}>
                <Input id="user-review" value={userReview} label="Write a Review" type="text" onChange={(e) => setUserReview(e.target.value)} />
                <Button className="homepageButton" id="submitReviewButton" type="submit" >Submit Review</Button>
            </Form>
        </div>
    );
}

export default CreateReview;