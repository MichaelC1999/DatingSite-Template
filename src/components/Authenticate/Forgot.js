import React from 'react'
import Loader from '../Loader/Loader'
import {connect} from 'react-redux'

class Forgot extends React.Component {

    state = {
        email: "",
        requestSuccess: false,
        loading: false,
        message: null
    }

    //comp did mount if logged in, redirect to profile settings
    componentDidUpdate() {
        if(this.props.token) {
            window.location.replace('/profileSettings')
        }
    }

    requestEmail = () => {
        this.setState({message: null})
        if(!this.state.email.includes("@") || !this.state.email.includes(".")){
            this.setState({message: "Please enter a valid email"})
            return
        }

        this.setState({loading: true})

        const formData = new FormData()

        formData.append('email', this.state.email)

        fetch(process.env.REACT_APP_BACKEND + "/forgotPassword", {
            method: "PUT",
            body: formData
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                if(res.status === 422){
                    throw new Error("failed")
                } else {
                    throw new Error("failure")
                }
            }
            return res.json()
        }).then(res => {
            this.setState({loading: false, requestSuccess: true, message: "Check your email to continue. If you have previously made an account with this email, you will receive a link."})
        }).catch(err => {
            console.log(err)
            this.setState({loading: false, requestSuccess: false, message: "Failed to initiate password change. Try again"})
        })
    }

    render () {
        let display = (
            <React.Fragment>
                {this.state.message ? <h2 style={{color: "red"}}>{this.state.message}</h2>: null}
                <h3>Enter your email</h3>
                <input type="text" placeholder="email" name="email" onChange={(value) => this.setState({email: value.target.value})} value={this.state.email}/>
                <h4 style={{width: "85px", margin: "15px auto"}} className="defButton" onClick={this.requestEmail}>Submit</h4>
            </React.Fragment>
        )

        if(this.state.loading === true){
            display = <Loader />
        }

        if(this.state.requestSuccess === true){
            display = <React.Fragment>
                <h3>{this.state.message}</h3>
            </React.Fragment>
        }

        
        return (
            <div>
                {display}
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(Forgot)