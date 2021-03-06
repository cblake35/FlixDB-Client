import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Switch, Link, Route } from 'react-router-dom';
import { RiHomeWifiFill } from 'react-icons/ri';
import { VscPreview, VscOpenPreview } from 'react-icons/vsc';
import { FaListAlt } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdModeEdit } from 'react-icons/md';
import MainHome from '../reviews/MainHome';
import AllReviews from '../reviews/AllReviews';
import MyReviews from '../reviews/MyReviews';
import Watchlist from '../reviews/WatchList';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import APIURL from '../helpers/environment';
import { RiMovie2Line } from 'react-icons/ri'


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid rgb(204, 204, 204)',
        boxShadow: 'none'
    },
}));


const SideBar = (props) => {
    const classes = useStyles();
    const [sideOpen, setSideOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [imageData, setImageData] = useState({});
    const [imageURL, setImageURL] = useState('')

    const handleOpen = async () => {
        setOpen(true);
        await fetch('profileImg.json', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(imgData => setImageData(imgData))
    };

    const handleClose = () => {
        setOpen(false);
        handleCollapse();
    };

    const handleSubmit = async (e) => {
        setImageURL(e.target.src)

        await fetch(`${APIURL}user/update/avatar`, {
            method: 'PUT',
            body: JSON.stringify({
                user: {
                    image: e.target.src
                }
            }),
            headers: new Headers({
                'Content-Type': "application/json",
                'Authorization': `Bearer ${props.token}`
            })
        })
        handleClose();
    }

    const handleCollapse = () => {
        let sidebarContent = document.querySelector('#sidebarContent')

        if (sideOpen) {
            sidebarContent.classList.add('toggleContent');
            setSideOpen(false);
        } else {
            sidebarContent.classList.remove('toggleContent');
            setSideOpen(true);
        }
    }



    useEffect(() => {
        fetch(`${APIURL}user/userinfo`, {
            method: 'GET',
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization': `Bearer ${props.token}`
            })
        }).then((response) => response.json()
        ).then((data) => {
            setImageURL(data.image)
        })
    })

    return (
        <div id='mainWrapper'>
            <Row className='headerBar g-0'>
                <Col>
                    <GiHamburgerMenu type='button' className='navIcon' onClick={handleCollapse} />
                    <a href='/' className='headerTitle'><h2><RiMovie2Line /> FlixDB</h2></a>
                </Col>
            </Row>
            <Row className='sidebarWrapper g-0'>
                <div className='toggleContent' id='sidebarContent'>
                    <Col className='userInfo'>
                        <div>
                            {
                                imageURL ? <img className='mainAvatar' src={`${imageURL}`} alt='User Avatar' /> :
                                    <img className='mainAvatar' src={`/assets/noAvatar.png`} alt='User Avatar' />
                            }

                        </div>
                        <Button className='avatarEditBtn' type="button" onClick={handleOpen}>
                            <MdModeEdit /> Edit
                        </Button>

                        <Modal
                            id='imgModal'
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            className={classes.modal}
                            open={open}
                            onClose={handleClose}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                                timeout: 500,
                            }}
                        >
                            <Fade in={open}>
                                <div className={classes.paper}>
                                    <Row id='profileImgWrapper' >
                                        <h1>choose an avatar</h1>
                                        {imageData.images ?
                                            imageData.images.map((image, index) => {
                                                return (

                                                    <Col className='proImgCard'>
                                                        <img key={index} onClick={handleSubmit} src={`${image.profileImg_URL}`} alt='Profile Pic' />
                                                    </Col>
                                                )
                                            })
                                            : undefined
                                        }
                                    </Row>
                                </div>
                            </Fade>
                        </Modal>

                    </Col>
                    <Col className='userOperations'>
                        <ul className='operationsList'>
                            <li onClick={handleCollapse}><Link to='/'><RiHomeWifiFill />  Home</Link></li>
                            <li onClick={handleCollapse}><Link to='/myreviews'><VscPreview /> My Reviews</Link></li>
                            <li onClick={handleCollapse}><Link to='/alluserreviews'><VscOpenPreview /> Movie Reviews</Link></li>
                            <li onClick={handleCollapse}><Link to='/watchlist'><FaListAlt /> Watch List</Link></li>
                        </ul>
                        <Button onClick={props.logout}>Logout</Button>
                    </Col>
                </div>
                <div className='sidebarRoute'>
                    <Switch>
                        <Route exact path='/'><MainHome token={props.token} /></Route>
                        <Route exact path='/myreviews'><MyReviews token={props.token} /></Route>
                        <Route exact path='/alluserreviews'><AllReviews token={props.token} /></Route>
                        <Route exact path='/watchlist'><Watchlist token={props.token} /></Route>
                    </Switch>
                </div>
            </Row>
        </div>
    )
}

export default SideBar;