import React from 'react';
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';

import Backdrop from '../Backdrop/Backdrop';
import './NavMobile.css'

class NavMobile extends React.Component {
    render() {
        let unreadToggle = null
        if(this.props.newMessage.length > 0){
            unreadToggle = "nav-link-unread"
        }
        let displayDrawer;
        if(this.props.drawerState){
            displayDrawer = (
                <React.Fragment>
                
                <div className="drawer slide-in-left-enter-active" onClick={this.props.showDrawer} style={{
                        transform: true ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: true ? '1' : '0'
                    }}>
                    <ul>
                        {this.props.currentUserId ? <React.Fragment>
                                <li><NavLink className={"nav-link-mobile " + unreadToggle} to="/conversations" >Messages</NavLink></li>
                                <li><NavLink className="nav-link-mobile" to={this.props.isMale === true ? "/userList/female": "/userList/male"}>{this.props.isMale === true ? "Girls" : "Guys"}</NavLink></li>
                                <li><NavLink className="nav-link-mobile" to="/matchList" >My matches</NavLink></li>
                                <li><NavLink className="nav-link-mobile" to={"/user/" + this.props.currentUserId} >My profile</NavLink></li>
                                <li><NavLink className="nav-link-mobile" to="/profileSettings" >Edit profile</NavLink></li>
                                <li onClick={this.props.logoutHandler} ><NavLink to="/" className="nav-link-mobile">Logout</NavLink></li>
                            </React.Fragment> : <React.Fragment>
                                <li><NavLink className="nav-link-mobile" to="/auth" >Login</NavLink></li>
                                <li><NavLink className="nav-link-mobile" to={"/userList/male"}>Guys</NavLink></li>
                                <li><NavLink className="nav-link-mobile" to={"/userList/female"}>Girls</NavLink></li>

                                </React.Fragment>}
                    </ul>
                </div>
                <Backdrop showDrawer={this.props.showDrawer}/>
            </React.Fragment>
            )
        }
        return (
            <React.Fragment>
                {displayDrawer}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {

    return {
        currentUserId: state.currentUserId,
        messages: state.messages,
        isMale: state.isMale,
        newMessage: state.newMessage
    }
}

const mapDispatchToProps = dispatch => {
    return {
        // addPost: () => dispatch({type: actionTypes.ADD_POST}),
        // openMail: () => dispatch({type: actionTypes.OPEN_MAIL})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavMobile);