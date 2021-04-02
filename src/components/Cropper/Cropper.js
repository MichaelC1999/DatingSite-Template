import React from 'react';
import ReactCrop from 'react-image-crop';
import {connect} from 'react-redux';
import {image64toCanvasRef, extractImageFileExtensionFromBase64, base64StringtoFile} from './ImageUtil';
import 'react-image-crop/dist/ReactCrop.css';

class Cropper extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imgSrc: null,
            windowHeight: undefined,
            windowWidth: undefined,
            crop: {
                aspect: 1,
            },
            error: null
        }
    }
    
    handleResize = () => this.setState({
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
      });

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize)
        if(this.props.imageFile){
            const myFileItemReader = new FileReader()
            myFileItemReader.addEventListener("load", () => {
               this.setState({imgSrc: myFileItemReader.result})
            }, false)
            myFileItemReader.readAsDataURL(this.props.imageFile)

        }
        
    }
    
    handleImageLoaded = (image) => {
        this.imageRef = image

    }

    imageToCanvas = () => {
        image64toCanvasRef(this.imageRef, this.state.crop)
    }

    handleCropComplete = (pixelCrop, crop) => {

        let factor = 0

        //if pixelcrop.width + pixelCrop.x > factor + this.imageRef.width
        if(this.state.windowWidth>=600){
            factor = (this.state.windowWidth*.8 - this.imageRef.width)/2
        }

        if(pixelCrop.width + pixelCrop.x > factor + this.imageRef.width){

            //take pixelCrop.width - length of crop width past imageRef (crop.x + crop width)
            this.setState({crop: {...pixelCrop, width: pixelCrop.width - ((pixelCrop.width + pixelCrop.x) - (factor + this.imageRef.width)), height: pixelCrop.height - ((pixelCrop.width + pixelCrop.x) - (factor + this.imageRef.width))}})
            
        }

        if(pixelCrop.x - factor < 0 && pixelCrop.height !== 0){
            this.setState({crop: {...pixelCrop, x: factor, width: pixelCrop.width - factor + pixelCrop.x, height: pixelCrop.height - factor + pixelCrop.x}})
            
        }
    }

    saveCroppedImage = (e) => {
        e.preventDefault()
        if(this.state.crop.width < 40 || this.state.crop.height < 40){
            this.setState({error: "Image crop too small. Try again."})
            return 
        }

        

        const canvasRef = image64toCanvasRef(this.imageRef, this.state.crop)

        const ext = extractImageFileExtensionFromBase64(this.state.imgSrc)
        const imageData64 = canvasRef.toDataURL('image/' + ext)
        const croppedPic = base64StringtoFile(imageData64, this.props.imageFile.name)
        this.props.setImg(croppedPic)
    }

    onCropChange = (crop) => {


        this.setState({ crop, error: null })


    }

    render() {
        return (
            <React.Fragment>
                {this.state.error ? <h3 style={{zIndex: "1000"}}>{this.state.error}</h3>: null}
                <button onClick={this.state.crop.width > 40 && this.state.crop.height> 40 ? this.saveCroppedImage : null} style={{zIndex: "1000", display: "absolute", marginBottom: "0", color: "black", backgroundColor: "rgb(110, 211, 207)", border: "black 2px solid"}}>{this.state.crop.width > 40 && this.state.crop.height> 40 ? "Save" : "Crop the image into a square to continue"}</button>
                {this.state.imgSrc ? <ReactCrop style={{zIndex: "600", display: "absolute", height: "95%", top: "0"}} onChange={(crop) => this.onCropChange(crop)} src={this.state.imgSrc} crop={this.state.crop} onImageLoaded={this.handleImageLoaded} onComplete={this.handleCropComplete} /> : null}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        imageFile: state.image,
        token: state.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setImg: (fileObj) => dispatch({type: "SET_IMG", fileObj: fileObj})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cropper)