import React from 'react';
import  { NavLink, Redirect } from 'react-router-dom'
import ImgUpload from '../ProfInfo/ImgUpload'


import './UserPage.css'
import {connect} from 'react-redux'
import Loader from '../Loader/Loader';

class UserPage extends React.Component {
    
    state = {
        user: null,
        editing: false,
        uploadingImgs: false
    }
    //fetch user by userId in params
    //fill out userInfo with info about user by ID
    //pass userId in userPage prop to <MainFeed ... />
    //in MainFeed comp, check for userPage prop. If userPage has a value (value would be userId passed from here), fetch all posts made by user with this id
    
    editUser = () => {
        this.setState({editing: true});
    }

    bioChange = (e) => {
        this.setState({user: {...this.state.user, bio: e.target.value}});
    }

    updateUserImgs = (imgs) => {
        this.setState({user: {...this.state.user, profileImgs: imgs}})
    }

    submitEdit = (e) => {
        e.preventDefault();
        
        this.setState({editing: false })
        const formData = new FormData();
        formData.append('bio', this.state.user.bio);
        fetch(process.env.REACT_APP_BACKEND + '/user/bio/' + this.props.match.params.userId, {
                method: 'PUT',
                headers: {
                    authorization: 'Bearer ' + this.props.token
                },
                body: formData
            }).then(res => {
                if(res.status !==200 && res.status !== 201 ){
                    if(res.status === 401){
                        this.props.logoutRedux()
                        window.location.replace("/auth")
                    } else {
                        throw new Error("Editing user page failed")
                    }
                }

                return res.json();

            }).catch(err => {
                console.log(err)
                this.setState({error: err.message})

            })
    }

    componentDidMount() {
        this.setState({userId: this.props.match.params.userId, loading: true}, () => this.getUserPage())   
        this.props.updateMessages()
     
    }

    componentDidUpdate() {
        if(this.props.match.params.userId !== this.state.userId){
            this.setState({userId: this.props.match.params.userId, loading: true}, () => this.getUserPage())
        }
    }

    getUserPage = () => {
        fetch(process.env.REACT_APP_BACKEND + "/user/page/" + this.state.userId, {
            method: "GET"
        }).then(response => {
            if(response.status !== 200 && response.status !== 201){
                if(response.status === 404){
                    throw new Error("404 User not found.");
                } else {
                    throw new Error("Fetching this users page has failed.");
                }
            }
            return response.json()
        }).then(resData => {
            this.setState({user: resData.user, loading: false})
        }).catch(err => {
            console.log(err.message);
            this.setState({error: err.message, loading: false});
        })
    }

    sendMessage = () => {
        this.props.otherUser(this.state.user.name, this.state.user._id, this.state.user.avatarImg)
    }

    render () {
        //loop through posts, map them into Post components to render
        
        let loaded = null
        let bio;

        if(this.state.loading === true){
            return <Loader />
        }
        

        if(this.state.user){
            if(this.props.match.params.userId === this.props.currentUserId && this.props.token){
                this.state.user.bio ? bio = <p onClick={this.editUser}>{this.state.user.bio}</p> : bio =<p onClick={this.editUser}>Click here to edit your bio</p>
            } else {
                this.state.user.bio ? bio = <p>{this.state.user.bio}</p> : bio = <p>This user has no bio</p>
            }
            if(this.state.editing){
                bio = <form onSubmit={this.submitEdit.bind()} >
                    <textarea className="big-input-box" type="textarea" onChange={this.bioChange.bind()} placeholder="Write your new bio here" value={this.state.user.bio} />
                    <button style={{marginBottom: 15}} type="submit">Submit edit</button>
                </form>
            }


            let values = null

            // let modTradBar = this.state.user.values.modTrad.map(val => {
            //     return <div style={{width: "12px", backgroundColor: "pink", margin: "3px"}}/>
            // })

            let modTradBar = []

            for(let i = 0; i< 15; ++i){

                if(i < this.state.user.values.modTrad){
                    modTradBar.push(<div style={{width: "10px", backgroundColor: "lime", flex: 1}}/>)
                } else {
                    modTradBar.push(<div style={{width: "10px", opacity: 0, margin: "3px", flex: 1}}/>)
                }
            }

            let homeAdvBar = []

            for(let i = 0; i< 15; ++i){

                if(i < this.state.user.values.homeAdv){
                    homeAdvBar.push(<div style={{width: "10px", backgroundColor: "lime", flex: 1}}/>)
                } else {
                    homeAdvBar.push(<div style={{width: "10px", opacity: 0, margin: "3px", flex: 1}}/>)
                }
            }

            let intrExtrBar = []

            for(let i = 0; i< 15; ++i){

                if(i < this.state.user.values.intrExtr){
                    intrExtrBar.push(<div style={{width: "10px", backgroundColor: "lime", flex: 1}}/>)
                } else {
                    intrExtrBar.push(<div style={{width: "10px", opacity: 0, margin: "3px", flex: 1}}/>)
                }
            }

            let indiffActiveBar = []

            for(let i = 0; i< 15; ++i){

                if(i < this.state.user.values.indiffActive){
                    indiffActiveBar.push(<div style={{width: "10px", backgroundColor: "lime", flex: 1}}/>)
                } else {
                    indiffActiveBar.push(<div style={{width: "10px", opacity: 0, margin: "3px", flex: 1}}/>)
                }
            }

            let athReligBar = []

            for(let i = 0; i< 15; ++i){

                if(i < this.state.user.values.athRelig){
                    athReligBar.push(<div style={{width: "10px", backgroundColor: "lime", flex: 1}}/>)
                } else {
                    athReligBar.push(<div style={{width: "10px", opacity: 0, margin: "3px", flex: 1}}/>)
                }
            }

            //let homeAdvBar = this.state.user.values


            if(this.state.user.values.modTrad >= 0 && this.state.user.values.homeAdv >= 0 && this.state.user.values.intrExtr >= 0 && this.state.user.values.indiffActive >= 0 && this.state.user.values.athRelig >= 0){
                values = <div >
                    <div style={{display: "flex", flexDirection: "row", margin: "6px"}}>
                        <h5 style={{flex: 1, textAlign: "left", margin: "auto"}} className="half valLabels">Modern - Trad </h5><div className="half valBarContainer">{modTradBar}</div>
                    </div>
                    <div style={{display: "flex", flexDirection: "row", margin: "6px"}}>
                        <h5 style={{flex: 1, textAlign: "left", margin: "auto"}} className="half valLabels" >Home - Adventure </h5><div className="half valBarContainer">{homeAdvBar}</div>
                    </div>
                    <div style={{display: "flex", flexDirection: "row", margin: "6px"}}>
                        <h5 style={{flex: 1, textAlign: "left", margin: "auto"}} className="half valLabels" >Introvert - Extrovert </h5><div className="half valBarContainer">{intrExtrBar}</div>

                    </div>
                    <div style={{display: "flex", flexDirection: "row", margin: "6px"}}>
                        <h5 style={{flex: 1, textAlign: "left", margin: "auto"}} className="half valLabels" >Independent - Community </h5><div className="half valBarContainer">{indiffActiveBar}</div>

                    </div>
                    <div style={{display: "flex", flexDirection: "row", margin: "6px"}}>
                        <h5  style={{flex: 1, textAlign: "left", margin: "auto"}} className="half valLabels">Atheist - Religious </h5><div  className="half valBarContainer">{athReligBar}</div>

                    </div>
                </div>
            }



            let messageButton = null

            if(!this.props.currentUserId && !this.props.token){
                messageButton = <NavLink to={"/auth"} ><button type="none" style={{marginBottom: "10px"}} >Login to talk</button></NavLink>
            } else if(this.props.currentUserId !== this.state.user._id){
                messageButton = <NavLink to={"/conversations/" + this.state.user._id} ><button type="none" style={{marginBottom: "10px"}} onClick={this.sendMessage} >Send message</button></NavLink>
            }


            loaded = (
                <div className="userPage container-fluid">
                    <div className="row justify-content-center">
                        <div className="userInfo col-sm-4">
                            
                            <img className="img-fluid" style={{marginTop: "20px"}} src={this.state.user.avatarImg} alt="" />
                            
                            <h1>{this.state.user.name}</h1>
                            <h2>{this.state.user.age} y/o</h2>
                            {bio}
                            <h3>{this.state.user.location.town}, {this.state.user.location.state}</h3>

                            {messageButton}
                            
                            {/* <button style={{marginBottom: "10px"}} >Send Message</button>  */}
                        </div>  
                        <div className="userBlock col-sm-7">
                            {this.state.user.profileImgs.length < 5 && this.props.match.params.userId === this.props.currentUserId && this.props.token && this.state.uploadingImgs === false ? <div onClick={() => this.setState({uploadingImgs: true})}><h4 style={{marginTop: "20px", marginBottom: "10px", cursor: "pointer"}} className="defButton">Click here to upload more profile images</h4></div> : null}
                            {this.state.uploadingImgs === true && this.props.match.params.userId === this.props.currentUserId && this.props.token ? <React.Fragment><button type="none" style={{marginTop: "20px"}} className="defButton" onClick={() => this.setState({uploadingImgs: false})}>Close Image Upload</button><ImgUpload updateUserImgs={(imgs) => this.updateUserImgs(imgs)} profileImgs={this.state.user.profileImgs} /></React.Fragment> : null}
                            {this.state.user.profileImgs.length > 0 && this.state.uploadingImgs === false ? <img src={this.state.user.profileImgs[0]} /> : null}
                            <ul>
                                {this.state.user.basicInfo.religiousDenom.length > 0 ? <li>Religious Denomination: {this.state.user.basicInfo.religiousDenom} </li>:null}
                                {this.state.user.basicInfo.prevMarried !== null ? this.state.user.basicInfo.prevMarried === true ? <li>Previously married: Yes</li>: <li>Previously married: No</li> : null}
                                {this.state.user.basicInfo.hasChildren !== null ? this.state.user.basicInfo.hasChildren === true ? <li>Has children: Yes</li>: <li>Has children: No</li> : null}
                                {this.state.user.basicInfo.drinks.length > 0 ? <li>Drinks: {this.state.user.basicInfo.drinks}</li>:null}
                                {this.state.user.basicInfo.smokes !== null ? this.state.user.basicInfo.smokes === true ? <li>Smoker: Yes</li>: <li>Smoker: No</li> : null}
                                {this.state.user.basicInfo.height.length > 0 ? <li>Height: {this.state.user.basicInfo.height}</li> :null}
                                {this.state.user.basicInfo.occupation.length > 0 ? <li>Occupation: {this.state.user.basicInfo.occupation}</li> :null}
                                {this.state.user.basicInfo.relType.length > 0 ? <li>Relationship Preference: {this.state.user.basicInfo.relType}</li> :null}
                            
                            </ul>
                            {this.state.user.profileImgs.length > 1 && this.state.uploadingImgs === false ? <img src={this.state.user.profileImgs[1]} /> : null}
                            
                            <ul>
                                {this.state.user.displayInfo.hobbies.length > 0 ? <li>Hobbies: {this.state.user.displayInfo.hobbies.join(", ")}</li> :null}
                                {this.state.user.displayInfo.music.length > 0 ? <li>Music: {this.state.user.displayInfo.music.join(", ")}</li> :null}
                                {this.state.user.displayInfo.showsMovies.length > 0 ? <li>Shows and Movies: {this.state.user.displayInfo.showsMovies.join(", ")}</li> :null}
                                {this.state.user.displayInfo.interests.length > 0 ? <li>Interests: {this.state.user.displayInfo.interests.join(", ")}</li> :null}


                            </ul>

                            {this.state.user.displayInfo.areYouReligiousQ.length > 0 ? <h5>How religious are you? {this.state.user.displayInfo.areYouReligiousQ}</h5> :null}
                            {this.state.user.displayInfo.describeMatch.length > 0 ? <h5>How would you describe your ideal match? {this.state.user.displayInfo.describeMatch}</h5> :null}
                            {this.state.user.displayInfo.aspirations.length > 0 ? <h5>What are some of your dreams and aspirations? {this.state.user.displayInfo.aspirations}</h5> :null}


                            {this.state.user.profileImgs.length > 2 && this.state.uploadingImgs === false ? <img src={this.state.user.profileImgs[2]} /> : null}
                            
                            {values}
                            
                            {this.state.user.profileImgs.length > 3 && this.state.uploadingImgs === false ? <img src={this.state.user.profileImgs[3]} /> : null}
                            {this.state.user.profileImgs.length > 4 && this.state.uploadingImgs === false ? <img src={this.state.user.profileImgs[4]} /> : null}

                        </div>
                    </div>

                </div>
            )
            
        }
        if(this.state.error){
            loaded = <h2>{this.state.error}</h2>;
        }
        return ( <div>{loaded}</div> )
    }
}

const mapStateToProps = state => {
    return {
        currentUserId: state.currentUserId,
        token: state.token,
        otherUserState: state.otherUser
    }
}

const mapDispatchToProps = dispatch => {
    return {
        otherUser: (name, id, avatarImg) => dispatch({type: "OTHER_USER", name: name, id: id, avatarImg: avatarImg})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);