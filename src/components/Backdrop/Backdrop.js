import React from 'react';
import {connect} from 'react-redux';
import './Backdrop.css';

class Backdrop extends React.Component {
    
    clickedHandler = () => {
        if(this.props.showDrawer){
            this.props.showDrawer();
            return
        }
        this.props.closeModal()
    }

    render() {
        return (
            <div className="Backdrop" onClick={this.clickedHandler}>

            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        closeModal: () => dispatch({type: "CLOSE_MODAL"})
    }
}


export default connect(null, mapDispatchToProps)(Backdrop)