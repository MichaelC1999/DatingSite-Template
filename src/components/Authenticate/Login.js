import React from 'react';
import {connect} from 'react-redux';
//import * as actionTypes from '../../Store/actionTypes';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import './Login.css';



class Authenticate extends React.Component {
    
    state = {
        error: null
    }

    validInputs = () => {
        if(this.props.pass.length < 8 || this.props.pass.length > 30){
            this.setState({error: "Your password should be between 8 and 30 characters"})
        }
        if(!this.validEmail(this.props.email)){
            this.setState({error: "Not a valid email address. Example: abcd1234@gmail.com"})
        }

    }

    validEmail = (email) => {        
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexp.test(email);
    }

    submitLogin = () => {

        
        //post request to api/login
        //backend find user by email
        //if user is found...
        fetch(process.env.REACT_APP_BACKEND + '/login', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.props.email,
                password: this.props.pass,
            })
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                if(res.status === 404){
                    throw new Error("Login failed! Email not found")
                } else if(res.status === 403){
                    throw new Error("Login failed! Password incorrect")
                } else if(res.status === 500){
                    throw new Error("There seems to be a server error. Refresh and try again.")
                } else {
                    throw new Error("Login failed! Email and password combo do not match")
                }
            }
            return res.json();            
        }).then(res => {
            if(res.convos.length > 0){
                const convoArr = []
                res.convos.map(convo => {
                    if(convo.read === false){
                        convoArr.push(convo._id)
                    }
                })
                this.props.newMessage("add", convoArr)

            }
            this.props.loginSuccess(res.userId, res.userName, res.token, res.isMale)
            

        }).catch(err => {
            this.props.setErr(err.message)
        })            
    }

    submitAuth =  async (e) => {
        e.preventDefault();

        this.props.setErr("null")
        this.setState({error: null})

        await this.validInputs()


        if(!this.state.error){
            await this.setState({email: this.props.email.toLowerCase()})
            this.submitLogin();
        } else if(this.state.error && !this.props.error){
            this.props.setErr(this.state.error)
        }
    }
    
    render() {
        
        return (
            <div className="Auth">
                <h1>Login</h1>
                <form className="authForm" onSubmit={this.submitAuth}>
                    

                    <label for="email" >Email (ex. abc123@gmail.com)</label>
                    <input autoComplete="new-password" type="text" placeholder="Email" name="email" value={this.props.email} onChange={this.props.UPDATE} />
                    <label for="pass" >Password (8-30 letters)</label>
                    <input autoComplete="new-password" type="password" placeholder="Password" name="pass" value={this.props.pass} onChange={this.props.UPDATE} />

                    <a href="/forgotPassword">Forgot your password?</a>

                    <button type="none" onClick={this.submitAuth}>Login</button>
                    <button onClick={this.props.switchComp} type="none" >Switch to Signup</button>
                </form>
                

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return {
        newMessage: (op, convo) => dispatch({type: "NEW_MSG", op: op, convo: convo}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);