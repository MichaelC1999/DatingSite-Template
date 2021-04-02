import React from 'react';
import {connect} from 'react-redux';
//import * as actionTypes from '../../Store/actionTypes';
import ReactCrop from 'react-image-crop';
import Starter from './Starter';
import 'react-image-crop/dist/ReactCrop.css';
import './Signup.css'
import AvatarImg from '../AvatarImg/AvatarImg'



class Authenticate extends React.Component {
    constructor(props) {
        super(props)
        this.inputOpenFileRef = React.createRef()
        this.state = {
            imgSrc: null,
            crop: {
                aspect: 1,
            },
            continueSignup: false,
            essentials: {
                isMale: null,
                name: ""
            },
            image: null
        }
    }

    

    validInputs = () => {
        if(this.props.pass.length < 8 || this.props.pass.length > 30){
            this.setState({error: "Your password should be between 8 and 30 characters"})
        }
        if(this.props.pass !== this.props.confPass){
            this.setState({error: "Your passwords do not match"})

        }
        if(!this.validEmail(this.props.email)){
            this.setState({error: "Not a valid email address. Example: abcd1234@gmail.com"})
        }
        if(this.state.essentials.isMale === null){
            this.setState({error: "Select a gender"})
        }
        if(this.state.essentials.name.length < 1){
            this.setState({error: "Enter a name"})
        }
        if(this.props.image === null){
            this.setState({error: "Image not selected. Select an image file to upload and crop it into a square."})

        }
    }

    validEmail = (email) => {        
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexp.test(email);
    }

    loadRest = async() => {
        //Sanitize and validate before continuing and loading the rest of page
        this.setState({error: null})
        this.props.setErr("null")

        
        await this.validInputs()
        
        if(!this.state.error && this.state.continueSignup === false){
            this.setState({continueSignup: true})

        } else if(this.state.error && !this.props.error){
            this.props.setErr(this.state.error)
        }
    }

    uponSignupSubmit = async (age, location, bio) => {
        await this.loadRest()
        let profObj = {
            age,
            location,
            bio,
            name: this.state.essentials.name,
            isMale: this.state.essentials.isMale
        }

        
        this.props.uponSignupSubmit(profObj)
    }

    openFileInput = () => {
        this.inputOpenFileRef.current.value = ""
        this.inputOpenFileRef.current.click()
    }

    render() {
        let signup

        if(this.state.continueSignup === true){
            signup = <Starter setErr={this.props.setErr.bind()} edit={false} uponSignupSubmit={this.uponSignupSubmit.bind()}/>
        }

        

        return <React.Fragment>
            <div className="Auth authForm">
                <h1>Signup</h1>

                <AvatarImg />

                <div style={{display: "flex", padding: "0", marginTop: "20px"}}>
                <div style={this.state.essentials.isMale === true ? {paddingLeft: "10px", marginRight: "6px", flex: "1", backgroundColor: "rgb(45, 45, 64)", border: "blue 2px solid", color: "white", flexDirection: "column"} : {paddingLeft: "10px", marginRight: "6px", flex: "1", border: "blue 2px solid", flexDirection: "column", color: "blue"}} onClick={() => this.setState({essentials: {...this.state.essentials, isMale: true}})}><h5> I am a man </h5></div>
                <div style={this.state.essentials.isMale === false ? {paddingLeft: "10px", marginLeft: "6px", flex: "1", backgroundColor: "rgb(45, 45, 64)", border: "pink 2px solid", flexDirection: "column", color: "white"} : {paddingLeft: "10px", marginLeft: "6px", flex: "1", border: "pink 2px solid", flexDirection: "column", color: "pink"}} onClick={() => this.setState({essentials: {...this.state.essentials, isMale: false}})}><h5>I am a woman</h5></div>

                </div>

                

                <label for="name">Name</label>
                <input style={this.state.essentials.name ? {backgroundColor: "rgb(45, 45, 64)", color: "white"} : {border: "rgb(110, 211, 207) 2px solid"}} type="text" placeholder="Name" name="name" value={this.state.essentials.name} onChange={(input) => this.setState({essentials: {...this.state.essentials, name: input.target.value}})} />

                <label for="email" >Email (ex. abc123@gmail.com)</label>
                <input autoComplete="new-password" style={this.props.email.includes('@') && this.props.email.includes('.') ? {backgroundColor: "rgb(45, 45, 64)", color: "white"} : {border: "rgb(110, 211, 207) 2px solid"}} type="text" placeholder="Email" name="email" value={this.props.email} onChange={this.props.UPDATE} />
                <label for="pass" >Password (8-30 letters)</label>
                <input autoComplete="new-password" style={this.props.pass.length >= 8 && this.props.pass.length <= 30 ? {backgroundColor: "rgb(45, 45, 64)", color: "white"} : {border: "rgb(110, 211, 207) 2px solid"}} type="password" placeholder="Password" name="pass" value={this.props.pass} onChange={this.props.UPDATE} />
                <label for="confPass" >Password (8-30 letters)</label>
                <input autoComplete="new-password" style={this.props.confPass.length >= 8 && this.props.confPass.length <= 30 ? {backgroundColor: "rgb(45, 45, 64)", color: "white"} : {border: "rgb(110, 211, 207) 2px solid"}} type="password" placeholder="Confirm Password" name="confPass" value={this.props.confPass} onChange={this.props.UPDATE} />
                {!this.state.continueSignup ? <button type="none" onClick={this.loadRest}>Continue Signup</button> : null}

                {!this.state.continueSignup ? <button onClick={this.props.switchComp} >Switch to Login</button> : null}



                </div>
            {signup}

        </React.Fragment>

    }
}

const mapStateToProps = state => {
    return {
        image: state.image
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userLogin: (userId, userName, token) => dispatch({type: "USER_LOGIN", userId: userId, userName: userName, token: token}),
        imgCrop: (fileObj) => dispatch({type: "IMG_CROP", fileObj: fileObj})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);