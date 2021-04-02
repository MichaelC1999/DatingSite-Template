import React from 'react'
import Loader from '../Loader/Loader'

class Reset extends React.Component {

    state = {
        message: null,
        tokenValid: null,
        loading: true
    }

    componentDidMount() {
        fetch(process.env.REACT_APP_BACKEND + "/resetTokenCheck/" + this.props.match.params.resetToken, {
            method: "GET"
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                if(res.status === 404){
                    throw new Error("Token invalid. Create an account.")
                } else {
                    throw new Error("Failed to check reset password availability. Try again.")
                }
                
            }
            return res.json()
        }).then(res => {
            this.setState({tokenValid: true, loading: false})
        }).catch(err => {
            console.log(err)
            this.setState({message: err.message, tokenValid: false, loading: false})

        })
    }

    submitNewPass = () => {
        this.setState({message: null})

        if(this.state.pass.length < 8 || this.state.pass.length > 30){
            this.setState({message: "Your password should be between 8 and 30 characters."})
            return
        }

        if(this.state.confirmPass !== this.state.pass){
            this.setState({message: "Passwords do not match.", loading: true})
            return
        }

        const formData = new FormData()

        formData.append("pass", this.state.pass)

        fetch(process.env.REACT_APP_BACKEND + "/newPass/" + this.props.match.params.resetToken, {
            method: "PUT",
            body: formData
        }).then(res => {

            if(res.status !== 200 && res.status !== 201){
                if(res.status === 404){
                    throw new Error("Token invalid. Create an account.")
                } else {
                    throw new Error("Failed to check reset password availability. Try again.")
                }
                
            }

            return res.json()
        }).then(res => {

            window.location.replace("/auth")

        }).catch(err => {
            console.log(err)
            this.setState({message: "Error submitting new password. Try again", loading: false})
        })

    }

    render() {

        let display = <React.Fragment><h3>{this.state.message ? this.state.message : ""}</h3></React.Fragment>

        if(this.state.loading === true){
            return <Loader />
        }

        if(this.state.tokenValid === true){
            display = <React.Fragment>
                {this.state.message ? <h2 style={{color: "red"}}>{this.state.message}</h2>: null}

                <h3>Enter your new password</h3>
                <input style={{display: "block", margin: "10px auto", width: "20vw", minWidth: "90px"}} type="password" placeholder="Enter password" onChange={(val) => this.setState({pass: val.target.value}) } value={this.state.pass} />
                <input style={{display: "block", margin: "10px auto", width: "20vw", minWidth: "90px"}} type="password" placeholder="Confirm password" onChange={(val) => this.setState({confirmPass: val.target.value}) } value={this.state.confirmPass} />
                <h3 style={{width: "100px", margin: "16px auto"}} onClick={this.submitNewPass} className="defButton">Submit</h3>
            </React.Fragment>
        } else if(this.state.tokenValid === false){
            display = <React.Fragment>
                <h3>{this.state.message} Check your email again or contact support.</h3>
                
            </React.Fragment>
        }

        return (
            <div>
                {display}
            </div>
        )
    }
}

export default Reset