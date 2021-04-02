import React from 'react'
import Starter from '../ProfInfo/Starter'
import {connect} from 'react-redux'
import Basic from '../ProfInfo/Basic'
import ImgUpload from '../ProfInfo/ImgUpload'
import Modal from '../Modal/Modal'
import AvatarImg from '../AvatarImg/AvatarImg'

class ProfileSettings extends React.Component {

    state = {
        compToRender: null,
        error: null,
        message: null,
        loaded: false,
        image: null,
        inputs: {
            name: null,
            email: null,
            oldPassword: "",
            newPassword: "",
        }
    }

    compToRender = (comp) => {
        this.setState({compToRender: comp})
    }

    
    changeImage = (input) => {
        
        this.setState({image: input.target.value})

        if(!input.target.files[0]){
            return
        }

        const file = input.target.files[0]

        this.props.imgCrop(file)

    }

    componentDidMount() {
        if(this.props.hasOwnProperty("token") && this.props.hasOwnProperty("currentUserId") && this.state.loaded === false){
            this.props.updateMessages()

            fetch(process.env.REACT_APP_BACKEND + "/userData", {
                //redux props not yet defined in component did mount, but do in render. Maybe pass it on as a param from router
                headers: {
                    Authorization: "Bearer " + this.props.token
                }
            }).then( res => {
                if(res.status !== 200 && res.status !== 201){
                    if(res.status === 500){
                        throw new Error("Issue fetching Profile data. Try again.")
                    } else if(res.status === 401){
                        this.props.logoutRedux()
                        window.location.replace("/auth")
                    } else {
                        throw new Error("Issue fetching Profile data. Try again.")
                    }
                }
                
                return res.json();
            }).then(resData => {
                this.setState({loaded: true, user: resData.user, inputs: {name: resData.user.name, email: resData.user.email}})
                if(resData.convoArr.length > 0){
                    this.props.newMessage("add", resData.convoArr)
                  }
            }).catch(err => {
                console.log(err)

                this.setState({loaded: true, error: err.message})
            })
        }
        
    }

    handleAuthSubmit = () => {
        const name = this.state.inputs.name
        const email = this.state.inputs.email
        const newPassword = this.state.inputs.newPassword
        const oldPassword = this.state.inputs.oldPassword
        const formData = new FormData()

        this.setState({error: null})


        if(this.state.inputs.hasOwnProperty("oldPassword") && this.state.inputs.hasOwnProperty("newPassword")){
            if(newPassword.length < 8 && newPassword.length !== 0 || newPassword.length > 30){
                this.setState({error: "Your new password must be between 8 and 30 characters. If you wish to keep your same password, leave both password bars empty. "})
                return
            } else if(oldPassword.length < 8 && oldPassword.length !== 0 || oldPassword.length > 30){
                this.setState({error: "Enter your old password to change it to a new one. If you wish to keep your same password, leave both password bars empty. "})
                return
            }
            
            if(newPassword.length >= 8 && newPassword.length <= 30 && oldPassword.length >= 8 && oldPassword.length <= 30){
                formData.append("oldPassword", oldPassword)
                formData.append("newPassword", newPassword)
            }    
        }
        

        if(email !== this.state.user.email && email !== ""){
            formData.append("email", email)
        }

        if(name !== this.state.user.name && name !== ""){
            formData.append("name", name)
        }

        
        fetch(process.env.REACT_APP_BACKEND + "/user/updateAuth", {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + this.props.token
            },
            body: formData
        }).then(res => {
            
            if(res.status !== 200 && res.status !== 201){
                if(res.status === 500){
                    throw new Error("Issue fetching Profile data. Try again.")
                } else if(res.status === 401){
                    this.props.logoutRedux()
                    window.location.replace("/auth")
                } else {
                    throw new Error("Issue fetching Profile data. Try again.")
                }
            }
                
            return res.json();
        }).then(resData => {
            if(resData.updateList.length>=1){
                const str = resData.updateList.join(", ")

                this.setState({message: "The following updates were made: " + str})
            }
        }).catch(err => {
            console.log(err)
            this.setState({error: err.message})
        })

        
    }

    
    updateInput = (input) => {
        this.setState({inputs: {...this.state.inputs, [input.target.name]: input.target.value}});
    }

    submitImg = () => {
        this.setState({error: null})
        if(!this.props.image instanceof File||!this.props.image){
            console.log("not a file")
            this.setState({error: "Error with image selected. Try to upload a different profile picture."})
            return
        }
        const formData = new FormData();

        formData.append('avatarImg', this.props.image)

        fetch(process.env.REACT_APP_BACKEND + "/user/avatarImg", {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + this.props.token
            },
            body: formData
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                if(res.status === 500){
                    throw new Error("Issue fetching Profile data. Try again.")
                } else if(res.status === 401){
                    this.props.logoutRedux()
                    window.location.replace("/auth")
                } else {
                    throw new Error("Issue fetching Profile data. Try again.")
                }
            }

            this.props.nullImg()

            this.setState({message: "Profile picture updated successfully"})
        }).catch( err => {
            this.setState({error: err.message})
        })

    }

    deleteAcct = () => {
        fetch(process.env.REACT_APP_BACKEND + "/deleteUser", {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + this.props.token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                if(res.status === 500){
                    throw new Error("Issue fetching Profile data. Try again.")
                } else {
                    throw new Error("Issue fetching Profile data. Try again.")
                }
            }
                
            return res.json();
        }).then(res => {
            this.setState({message: res.message})

            
            this.props.logoutRedux()
                
            
        }).then( res => {
            setTimeout(() => {
                window.location.replace("/")
            }, 5000)
        }).catch(err => {
            this.setState({message: err.message})
        })
    }

    render() {

        let compToRender = null

        if(this.state.compToRender === "starter"){
            const info = {
                bio: this.state.user.bio,
                age: this.state.user.age,
                location: {
                    town: this.state.user.location.town,
                    state: this.state.user.location.state
                }
            }
            compToRender = <Starter edit={true} info={info} />
        } else if(this.state.compToRender === "basic"){
            const displayInfo = this.state.user.displayInfo
            const basicInfo = this.state.user.basicInfo


            compToRender = <Basic displayInfo={displayInfo} basicInfo={basicInfo} edit={true} />
        } else if(this.state.compToRender === "compat"){
            window.location.replace("/compatibility/retake")
        } else if(this.state.compToRender === "auth"){
            compToRender = <div>
                <h3>{this.state.error}</h3>
                <div><input onChange={this.updateInput.bind()} placeholder="Name" name="name" value={this.state.inputs.name}/></div>
                <div><input onChange={this.updateInput.bind()} placeholder="Email" name="email" value={this.state.inputs.email}/></div>
                <div><input onChange={this.updateInput.bind()} placeholder="Old password" name="oldPassword" value={this.state.inputs.oldPassword}/></div>
                <div><input onChange={this.updateInput.bind()} placeholder="New password" name="newPassword" value={this.state.inputs.newPassword}/></div>
                <button style={{marginTop: "12px"}} type="none" onClick={this.handleAuthSubmit}>Submit</button>
            </div>
        } else if(this.state.compToRender === "pic"){
            compToRender = <AvatarImg submitImg={this.submitImg} />
        } else if(this.state.compToRender === "images"){
            compToRender = <div style={{width: "90%", margin: "auto"}}><ImgUpload profileImgs={this.state.user.profileImgs} /></div>
        } else if(this.state.compToRender === "deactivate"){
            compToRender = <div style={{margin: "15px 10px", paddingBottom: "7px", border: "2px solid rgb(110, 211, 207)"}}>
                <h3>Are you sure you want to deactivate your account? This action cannot be undone.</h3>
                {this.state.message === null ? <div><button onClick={this.deleteAcct}>Yes</button>
                <button onClick={() => this.setState({compToRender: null})}>Cancel</button></div> : <h4>{this.state.message}</h4>}
            </div>
            
            
        }


        return (
            <div>
                {this.state.message ? <div style={{border: "2px solid rgb(110, 211, 207)", width: "90vw", margin: "15px auto"}}><h2>{this.state.message}</h2></div> : null}
                <div onClick={() => this.compToRender("auth")}><h2>Account Login Info</h2></div>
                <div onClick={() => this.compToRender("pic")}><h2>Avatar Image</h2></div>
                <div onClick={() => this.compToRender("images")}><h2>Profile pictures</h2></div>

                <div onClick={() => this.compToRender("starter")}><h2>Personal Info</h2></div>
                <div onClick={() => this.compToRender("basic")}><h2>About You</h2></div>
                <div onClick={() => this.compToRender("compat")}><h2>Compatibility test</h2></div>
                <div onClick={() => this.compToRender("deactivate")}><h2>Deactivate Account</h2></div>

                {compToRender}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentUserId: state.currentUserId,
        token: state.token,
        image: state.image,
        modalType: state.modalType
    }
}

const mapDispatchToProps = dispatch => {
    return {
        imgCrop: (fileObj) => dispatch({type: "IMG_CROP", fileObj: fileObj}),
        deactivate: () => dispatch({type: "DEACTIVATE"}),
        nullImg: () => dispatch({type: "SET_IMG", fileObj: null}),
        logoutRedux: () => dispatch({type: "LOGOUT"}),
        newMessage: (op, convo) => dispatch({type: "NEW_MSG", op: op, convo: convo}),




    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettings)