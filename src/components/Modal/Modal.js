import React from 'react';
import Backdrop from '../Backdrop/Backdrop';
import Cropper from '../Cropper/Cropper';

import {connect} from 'react-redux';


import './Modal.css';

//create event with modal type as DELETE_POST and render a delete confirmation, that when yes is submitted a delet erequest is made to the server

class Modal extends React.Component {

    state= {
        message: null
    }

    

    render() {
        let modalCompToRender = null;


        if(this.props.modalType === "IMG_CROP"){
            modalCompToRender = <Cropper/>
        } 


        return (
            <div>
                <Backdrop />
                <div
                    className="Modal"
                    
                    style={{
                        transform: true ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: true ? '1' : '0'
                    }}>
                    {modalCompToRender}
                </div>
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        modalType: state.modalType,
        token: state.token,
        chungus: state.chungus
    }
}

const mapDispatchToProps = dispatch => {
    return {
        closeModal: () => dispatch({type: "CLOSE_MODAL"}),
        logoutRedux: () => dispatch({type: "LOGOUT"})

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);

