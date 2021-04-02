import React from 'react';
import { NavLink } from 'react-router-dom';
import Loader from '../Loader/Loader';
import LazyImage from '../LazyImage/LazyImage'


class UserList extends React.Component {
    state = {
        users: [],
        page: 1,
        totalUsersOfSex: 0,
        lastPage: 1,
        loaded: false
    }

    componentDidMount(){
        this.fetch("mount")
        this.props.updateMessages()

    }

    fetch = (status) => {

        this.setState({sex: this.props.location.pathname.split('/')[2]})

        
        //on unauth users, have two buttons showing either male or female users, add to url. on authed users, pass this.props.isMale into url to route to this comp
        fetch(process.env.REACT_APP_BACKEND + "/userList/" + this.props.location.pathname.split('/')[2] + "/" + this.state.page)
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                if(res.status === 422){
                    throw new Error("failed")
                } else if(res.status === 401){
                    this.props.logoutRedux()
                    window.location.replace("/auth")
                } else {
                    throw new Error("failure")
                }
            }

            return res.json()
        }).then( res => {
            if(status === "mount"){
                this.setState({totalUsersOfSex: res.totalUsersOfSex, lastPage: res.lastPage})
            }
            this.setState({users: res.users, loaded: true}, () => window.scrollTo(0, 0))
        }).catch(err => {
            console.log(err)
        })
    }


    componentDidUpdate() {
        if(this.state.sex !== this.props.location.pathname.split('/')[2]){
            this.fetch("mount")
        }
    }

    changePage = (page) => {

        if(page < 1 || page > this.state.lastPage){
            return
        }

        this.setState({page: page}, () => this.fetch())

    }

    render() {
        let userList = <Loader />
        if(this.state.users.length >= 1){
            
            userList = this.state.users.map((user, idx) => {
                return <NavLink to={"/user/" + user._id}>
                    <div className="listBlock" key={idx}><h2>{user.name}</h2>
                        <LazyImage
                            
                            src={user.avatarImg}
                            alt={`${user.name} image`}
                        />
                    </div>
                </NavLink>
            })
        } else if(this.state.loaded === true){
            userList = <h2>No users found</h2>
        }

        let pageNav = null

        if(this.state.loaded === true && this.state.users.length >= 1) {
            pageNav = (
                <div style={{display: "flex", flexDirection: "row", margin: "10px 20%"}}>
                    {this.state.page > 1 ? <div style={{flex: "1", cursor: "pointer"}} onClick={() => this.changePage(1)} ><h3>First</h3></div>: null}
                {this.state.page > 2 ? <div style={{flex: "1", cursor: "pointer"}} onClick={() => this.changePage(this.state.page-1)} ><h3>{this.state.page - 1}</h3></div>: null}
                <div style={{backgroundColor: "rgb(110, 211, 207)", color: "white", flex: "1", cursor: "pointer"}}><h3>{this.state.page}</h3></div>
                {this.state.page < this.state.lastPage ? <div style={{flex: "1", cursor: "pointer"}} onClick={() => this.changePage(this.state.page+1)} ><h3>{this.state.page + 1}</h3></div>: null}
                {this.state.page < this.state.lastPage - 1 ? <div style={{flex: "1", cursor: "pointer"}} onClick={() => this.changePage(this.state.lastPage)} ><h3>Last</h3></div>: null}
                </div>
            )
        }
        return (
            <div style={{marginBottom: "30px", marginTop: "20px"}}>
                {userList}
                {pageNav}
            </div>
        )
    }
}

export default UserList