import React, {Component} from 'react';
import Navigation from './Navbar/Navigation';
import Auth from './Authenticate/Auth';
import Modal from './Modal/Modal';
import Basic from './ProfInfo/Basic';
import Starter from './ProfInfo/Starter';
import Forgot from './Authenticate/Forgot';
import MatchList from './MatchList/MatchList';
import Compatibility from './ProfInfo/Compatibility';
import {Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux'
import openSocket from 'socket.io-client';


import './App.css';
import UserList from './UserList/UserList';
import UserPage from './UserPage/UserPage';
import UnAuth from './Authenticate/UnAuth';
import HomePage from './HomePage/HomePage';
import ProfileSettings from './ProfileSettings/ProfileSettings';
import ImgUpload from './ProfInfo/ImgUpload';
import MessageBox from './MessageBox/MessageBox';
import ConvoPage from './ConvoPage/ConvoPage';
import Reset from './Authenticate/Reset';


const socket = openSocket("https://dating-site-template-tna4c.ondigitalocean.app/dating-site-backend", {
  path: "/dating-site-backend/socket.io",
  rejectUnauthorized: false
})

class App extends Component {

  
  state = {
    userSocket: false
  }

  componentDidMount() {
    //local component variable to check if user is logged in per localStorage
    
    let token = localStorage.getItem('token');
    let expiryDate = localStorage.getItem('expiryDate');
    if (!token || !expiryDate) {
      return;
    }
    //check if already reached expiry, if expiry has passed, logout. If expiry has not passed and token is still valid, update expiry date to one hour in future
    if(new Date(expiryDate) <= new Date()) {
      this.logoutHandler();
      return;
    } else {
      //app is remounted but token is still valid
      //delete token and expiration date from local storage (but use token variable to send in request)
      //make request for a new token
      //receive new token and set new expiration
      const userId = localStorage.getItem('userId');
      const name = localStorage.getItem('name')
      let isMale = localStorage.getItem('isMale')
      isMale === "true" ? isMale = true : isMale = false
 
      //delete token and expiration date from local storage (but keep token variable to send in request)


      localStorage.removeItem('token');

      fetch(process.env.REACT_APP_BACKEND + "/tokenRefresh/" + userId, {
        method: "PUT",
        headers: {
          
          Authorization: "Bearer " + token
        }
      }).then(res => {
        if(res.status !==200 && res.status !== 201 ){
        
          throw new Error("Create new token failed")
        }
  
        return res.json()
      
      }).then(res => {

        token = res.token

        if(userId && token){
          this.props.userLogin(userId, name, token, isMale)
          this.fetchNewMsg(token)
          localStorage.setItem('token', res.token);
 
        let remainingMilliseconds = 60 * 60 * 1000 * 24;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem('expiryDate', expiryDate.toISOString());
        
        
  
        setTimeout(() => {
          this.logoutHandler();
        }, remainingMilliseconds);
      }
        
      }).catch(err => {
        console.log(err)
      })

      
  }

  }

  componentDidUpdate() {
    
  }

  fetchNewMsg = (token) => {
    fetch(process.env.REACT_APP_BACKEND + "/newMessageCheck", {
      headers: {
        Authorization: "Bearer " + token
      }
    }).then(res => {
      if(res.status !==200 && res.status !== 201 ){
      
        throw new Error("Check new messages failed")
      }

      return res.json()
    
    }).then(res => {
      if(res.convoArr.length > 0){
        this.props.newMessage("add", res.convoArr)
      }
    }).catch(err => {
      console.log(err)
    })
  }

  


  logoutHandler = () => {

    this.props.logoutRedux();
  }

  updateMessages = () => {
    
    if(this.props.token && this.props.newMessageArray.length === 0){
      this.fetchNewMsg(this.props.token)
    }
    
  }


  render() {

    let renderModal = null
    if(this.props.modalType){
      renderModal = <Modal />
    }

    
    
    return (
      <div className="App">
        <Navigation logoutHandler={this.logoutHandler} />
        {renderModal}
        <div className="screen" style={{paddingTop: 62}}>
          <Switch>
            <Route path="/" exact render={(props) => (<HomePage {...props} updateMessages={this.updateMessages} />)} />
            <Route path="/auth" component={Auth} />
            <Route path="/forgotPassword" component={Forgot} />
            <Route path="/reset/:resetToken" component={Reset} />
            <Route path="/profile" render={this.props.token ? (props) => (<Basic {...props} updateMessages={this.updateMessages} />): (props) => <UnAuth {...props}/>} />
            <Route path="/profileImgs" component={this.props.token ? ImgUpload : UnAuth} />
            <Route path="/compatibility" component={this.props.token ? Compatibility : UnAuth} />
            <Route path="/matchList" render={this.props.token ? (props) => (<MatchList {...props} updateMessages={this.updateMessages} />): (props) => <UnAuth {...props}/>} />
            <Route path="/userList/:isMale" render={(props) => (<UserList {...props} updateMessages={this.updateMessages} />)} />
            <Route path="/user/:userId" render={(props) => (<UserPage {...props} updateMessages={this.updateMessages} />)} />
            
            <Route path="/profileSettings" render={this.props.token ? (props) => (<ProfileSettings {...props} updateMessages={this.updateMessages} />): (props) => <UnAuth {...props}/>} />
            <Route path="/conversations" exact component={this.props.token ? MessageBox : UnAuth} />
            <Route path="/conversations/:userId" exact component={this.props.token ? ConvoPage : UnAuth} />
          </Switch>
        </div>
      </div>
    );
  }
  
}

const mapStateToProps = state => {
  return {
    modalType: state.modalType,
    currentUserId: state.currentUserId,
    token: state.token,
    newMessageArray: state.newMessage
  }
}

const mapDispatchToProps = dispatch => {
  return {
    newMessage: (op, convo) => dispatch({type: "NEW_MSG", op: op, convo: convo}),
    logoutRedux: () => dispatch({type: "LOGOUT"}),
    userLogin: (userId, userName, token, isMale) => dispatch({type: "USER_LOGIN", userId: userId, userName: userName, token: token, isMale: isMale}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
