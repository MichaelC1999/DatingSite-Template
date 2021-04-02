import React from 'react'
import {connect} from 'react-redux';


class AvatarImg extends React.Component {

    constructor(props) {
        super(props)
        this.inputOpenFileRef = React.createRef()
        this.state = {
            image: null
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

    openFileInput = () => {
        this.inputOpenFileRef.current.value = ""
        this.inputOpenFileRef.current.click()
    }

    render () {
        return (
            <div style={{border: "rgb(45, 45, 64) 2px solid"}}>
                    <label className="defButton" onClick={this.openFileInput} for="image">{this.props.image ? "Image selected!" : "Select an image" }<input ref={this.inputOpenFileRef} type="file" name="image" accept=".jpg, .jpeg, .png" onChange={this.changeImage.bind()}/></label>
                    {this.props.image && this.props.hasOwnProperty("submitImg") ? <button class="defButton" type="none" onClick={this.props.submitImg}>Upload</button> : null}

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        image: state.image
    }
}

const mapDispatchToProps = dispatch => {
    return {
        imgCrop: (fileObj) => dispatch({type: "IMG_CROP", fileObj: fileObj})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AvatarImg)