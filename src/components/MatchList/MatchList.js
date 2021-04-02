import React from 'react';
import {connect} from 'react-redux';
import { NavLink } from 'react-router-dom';
import Loader from '../Loader/Loader';
import LazyImage from '../LazyImage/LazyImage'

//react tinder card for mobile

class MatchList extends React.Component {

    state = {
        users: [],
        otherSexUserCount: null,
        loaded: false,
        error: null
    }

    fetchList = () => {
        if(this.props.hasOwnProperty("token") && this.state.loaded === false){
            fetch(process.env.REACT_APP_BACKEND + "/userMatch", {
            headers: {
                Authorization: "Bearer " + this.props.token
            }

            }).then(res => {
                if(res.status !== 200 && res.status !== 201){
                    if(res.status === 422){
                        throw new Error("failed")
                    } else if(res.status === 404){
                        throw new Error("test incomplete")
                    } else if(res.status === 401){
                        this.props.logoutRedux()
                        window.location.replace("/auth")
                    } else {
                        throw new Error("failure")
                    }
                }

                return res.json()
            }).then(resData => {
                this.setState({users: resData.users, loaded: true, otherSexUserCount: resData.otherSexUserCount})
            }).catch(err => {
                if(err.message === "test incomplete"){
                    this.setState({loaded: true, error: "You cannot be matched with users without taking the compatibility test."})
                } else {
                    this.setState({loaded: true, error: "Error fetching match list. Try again."})

                }
            })
        }
    }

    componentDidUpdate() {
        this.fetchList()
    }

    componentDidMount() {
        this.fetchList()
        this.props.updateMessages()
    }

    render() {
        if(this.state.loaded === false){
            return <Loader />
        }

        if(this.state.error === "You cannot be matched with users without taking the compatibility test."){
            return <div>
                <h2 style={{margin: "35px 0"}}>{this.state.error}</h2>
                <h4 style={{border: "rgb(85, 85, 97) 2px solid", fontSize: "22px", margin: "auto", padding: "5px", width: "50%"}}><NavLink to="/compatibility" >Click here to take the test</NavLink></h4>
            </div>
        }
        

        if(this.state.error !== null){
            
            return <h2>{this.state.error}</h2>
        }

        let userList

        if(this.state.users.length >= 1){
            
            userList = this.state.users.map( (user, idx) => {
                return <NavLink to={"/user/" + user._id}><div className="listBlock" key={idx}><h2>{user.name}</h2><LazyImage src={user.avatarImg} alt={`${user.name} image`} /></div></NavLink>
            })
        } else {
            userList = <h2>No users found</h2>
        }
        return (
            <div>
                {this.state.users.length >= 1 ? <React.Fragment><h1>Here are your matches</h1><h2>{this.state.users.length} matches / {this.state.otherSexUserCount} users</h2></React.Fragment> : null}
                {userList}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentUserId: state.currentUserId,
        token: state.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logoutRedux: () => dispatch({type: "LOGOUT"})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchList)