import React, {Component} from 'react'
import { NavLink } from 'react-router-dom';
import NavMobile from '../NavMobile/NavMobile';
import "./Navigation.css";
import {connect} from 'react-redux';

class Navigation extends Component {

    state = {
        drawer: false
    }

    showDrawer = () => {
        this.setState({drawer: !this.state.drawer})
    }



    render() {
        let unreadToggle = null
        if(this.props.newMessage.length > 0){
            unreadToggle = "nav-link-unread"
        }
        return (
            <React.Fragment>
                <NavMobile  showDrawer={this.showDrawer} drawerState={this.state.drawer} logoutHandler={this.props.logoutHandler}/>
                <header>
                    
                    <nav className="navbar">
                        <div className="container-fluid">
                        <div className="navbar-header mobile-nav">
                            <button onClick={this.showDrawer} className="menu-btn">Menu</button>
                            {/* <img className="logo-head" alt="logo" src="" height="30"/> */}
                            <a className="navbar-name" href="/">SocialSite</a>
                        </div>
                        <div className="nav-list">
                            <ul className="navbar-name">
                                {/* <li><NavLink className="nav-link" to="/">Home</NavLink></li> */}
                                {/* <li><a className="nav-link" href="https://github.com/MichaelC1999/WheresApp-Frontend" >Project</a></li> */}
                            
                            {this.props.currentUserId ? <React.Fragment>
                                <li><NavLink className={"nav-link " + unreadToggle} to="/conversations" >Messages</NavLink></li>
                                <li><NavLink className="nav-link" to={this.props.isMale === true ? "/userList/female": "/userList/male"}>{this.props.isMale === true ? "Girls" : "Guys"}</NavLink></li>
                                <li><NavLink className="nav-link" to="/matchList" >My matches</NavLink></li>
                                <li><NavLink className="nav-link" to={"/user/" + this.props.currentUserId} >My profile</NavLink></li>
                                <li><NavLink className="nav-link" to="/profileSettings" >Edit profile</NavLink></li>
                                <li onClick={this.props.logoutHandler} ><NavLink to="/" className="nav-link">Logout</NavLink></li>
                            </React.Fragment> : <React.Fragment>
                                <li><NavLink className="nav-link" to="/auth" >Login</NavLink></li>
                                <li><NavLink className="nav-link" to={"/userList/male"}>Guys</NavLink></li>
                                <li><NavLink className="nav-link" to={"/userList/female"}>Girls</NavLink></li>

                                </React.Fragment>}
                            </ul>
                        </div>
                        </div>
                    </nav>
                </header>
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

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);