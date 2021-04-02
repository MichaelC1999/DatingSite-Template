import React from 'react'
import {connect} from 'react-redux'
import "./ImgUpload.css"


class ImgUpload extends React.Component {

    constructor(props) {
        super(props)
        this.inputOpenFileRef = React.createRef()
        this.state = {
            image: null,
            uploaded: []
        }
    }

    componentDidMount() {
        if(this.props.hasOwnProperty("profileImgs")){
            this.setState({uploaded: this.props.profileImgs})
        } else {
            fetch(process.env.REACT_APP_BACKEND + "/user/fetchImgs", {
                headers: {
                    Authorization: "Bearer " + this.props.token
                }
            }).then(res => {
                return res.json()
            }).then(res => {
                this.setState({uploaded: res.images})
            }).catch(err => {
                console.log(err)
            })
        }
        
        
    }
    
    changeImage = (input) => {
        
        this.setState({image: input.target.value})

        if(!input.target.files[0]){
            return
        }

        const file = input.target.files[0]

        this.props.imgCrop(file)

    }

    componentWillUnmount = () => {
        if(this.props.hasOwnProperty("updateUserImgs")){
            this.props.updateUserImgs(this.state.uploaded)
        }
    }

    submitImg = () => {
        this.setState({error: null, message: null})
        if(this.state.uploaded.length === 5){
            this.setState({error: "You have reached the maximum of 5 images"})
            return
        }
        if(!this.props.image instanceof File||!this.props.image){
            this.setState({error: "Error with image selected. Try to upload a different profile picture."})
            return
        }
        const formData = new FormData();

        formData.append('avatarImg', this.props.image)

        fetch(process.env.REACT_APP_BACKEND + "/user/profileImg", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + this.props.token
            },
            body: formData
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                if(res.status === 500){
                    throw new Error("Issue fetching Profile data. Try again.")
                } else {
                    throw new Error("Issue fetching Profile data. Try again.")
                }
            }

            this.setState({message: "Profile picture updated successfully"})
            return res.json()
        }).then(res => {
            this.props.nullImg()
            if(this.state.uploaded.length < 5){
                this.setState({ uploaded: [...this.state.uploaded, res.imgUrl] })
            }
        }).catch( err => {
            this.setState({error: err.message})
        })

    }


    deleteImg = (idx) => {
        this.deleteConfirm(null)
        this.setState({error: null, message: null})
        fetch(process.env.REACT_APP_BACKEND + "/user/deleteImage/" + idx, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + this.props.token
            }
        }).then( res => {
            if(res.status === 200 || res.status === 201){
            } else if(res.status === 401){
                this.props.logoutRedux()
                window.location.replace("/auth")
            }
            return res.json()
        }).then(res => {
            const picArr = [...this.state.uploaded]
            picArr.splice(idx, 1)
            this.setState({uploaded: picArr, message: res.message, error: null})
        }).catch(err => {
            console.log(err)

            this.setState({error: "Failed to delete image"})
        })
    }

    openFileInput = () => {
        this.inputOpenFileRef.current.value = ""
        window.scrollTo(0, 0)

        this.inputOpenFileRef.current.click()
        this.setState({message: null, error: null})
    }

    deleteConfirm = (idx) => {
        this.setState({imgToDelete: idx})
    }
    
    render() {
        const imgs = this.state.uploaded.map((img, idx) => {

            if(this.state.imgToDelete === idx){
                return <div className="profImgUploaded" ><button className="defButton" type="none" onClick={() => this.deleteImg(idx)}>Delete</button><button className="defButton" type="none" onClick={() => this.deleteConfirm(null)}>Cancel</button></div>
            }
            
            return <img className="profImgUploaded" key={idx} src={img} onClick={() => this.deleteConfirm(idx)} />
        })
        return (
            <div style={{border: "rgb(45, 45, 64) 2px solid", margin: "5px 0", padding: "5px"}}>
                <h3>Upload up to 5 images to your profile</h3>
                {this.state.message ? <h4>{this.state.message}</h4> : null}
                {this.state.error ? <h4>{this.state.error}</h4> : null}

                <div>
                    <label class="defButton" onClick={this.openFileInput} for="image">{this.props.image ? "Image selected!" : "Select an image" }<input ref={this.inputOpenFileRef} type="file" name="image" accept=".jpg, .jpeg, .png" onChange={this.changeImage.bind()}/></label>
                    {this.props.image ? <button class="defButton" type="none" onClick={this.submitImg}>Upload</button> : null}

                </div>
                <div className="imgContainer">
                    {imgs}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentUserId: state.currentUserId,
        token: state.token,
        image: state.image
    }
}

const mapDispatchToProps = dispatch => {
    return {
        imgCrop: (fileObj) => dispatch({type: "IMG_CROP", fileObj: fileObj}),
        nullImg: () => dispatch({type: "SET_IMG", fileObj: null})

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImgUpload)