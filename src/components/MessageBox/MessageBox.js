import React from 'react'
import ConvoPage from '../ConvoPage/ConvoPage'
import "./MessageBox.css"
import {connect} from 'react-redux'
import {NavLink} from 'react-router-dom'
import Loader from '../Loader/Loader'

class MessageBox extends React.Component {

    state = {
        convos: [],
        loaded: false,
        currentConvo: null
    }

    componentDidMount() {
        //Convos were added to Redux state upon login 
        //Add convos to state upon mount
        // this.setState({convos: this.props.convos, loaded: true})
        fetch(process.env.REACT_APP_BACKEND + "/user/messages", {
            headers: {
                Authorization: "Bearer " + this.props.token
            },
            method: "GET",

        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                if(res.status === 500){
                    throw new Error("Issue fetching Profile data. Try again.")
                } else if(res.status === 401){
                    this.props.logoutRedux()
                    window.location.replace("/auth")
                } else {
                    throw new Error("Issue fetching Profile data. Try again.")
                }
            }
                          
            return res.json();
                
        }).then(res => {
            this.setState({convos: res.convos, loaded: true})
        }).catch(err => {
            console.log(err)
            this.setState({loaded: true, error: err.message})
        })
    }

    componentDidUpdate() {
        
        
    }
    
    render(){

        if(this.state.loaded === false){
            return <Loader />
        }

        let display = null

        if(this.state.error){
            return <h4>{this.state.message}</h4>
        }
        
        if(this.state.convos.length === 0 && this.state.loaded === true){
            return <h4>You haven't started any conversations. Message someone and start talking today!</h4>
        } 
        
        if(this.state.convos.length > 0 ){
                display = this.state.convos.map((convo, idx) => {
                    let color = null
                    if(convo.read === false){
                        color = "rgb(45, 45, 64)"
                    }
                    let messagePrev = null
                    if(convo.messages[convo.messages.length-1].content.length <= 40) {
                        messagePrev = convo.messages[convo.messages.length-1].content
                    } else if(convo.messages[convo.messages.length-1].content.length > 40){
                        messagePrev = convo.messages[convo.messages.length-1].content.slice(0,40) + "..."
                    }
                    return (<NavLink style={{margin: "20px"}} key={idx} to={"/conversations/" + convo.otherUser.id}>
                        <div className="mobileCollapse" style={{width: "77%", padding: "10px 0", marginLeft: "6%", border: "rgb(45, 45, 64) 2px solid", backgroundColor: color}}>
                            <div style={{flex: "1", padding: "0 10px", textAlign: "left"}}>
                                <img className="avImgMessages" src={convo.otherUser.avatarImg} />

                            </div>
                            <div style={{flex: "3", justifyContent: "center", margin: "auto"}}>
                                <h5 style={{fontSize: "32px"}}>{convo.otherUser.name}</h5>
                                <h6 style={{fontSize: "18px"}}>{convo.messages[convo.messages.length-1].sentAt.time}</h6>
                                {messagePrev !== null ? <h6 style={{fontSize: "28px"}}><i>"{messagePrev}"</i></h6> : null}
                            </div>

                    </div></NavLink>)
                })
            
        } 

        

        //if loaded and no convos. "No conversations. Message a user and start talking today!"

        //if loaded with convos, map through convos creating a display box to show each user and a preview of the convo. Onclick opens the convo
            //send convo object as a prop to the convo page component
        return (
            <div>
                <h2 style={{fontSize: "44px", textAlign: "left", margin: "22px 6%", marginBottom: "0"}}>Messages</h2>
                {this.state.message ? <h3>{this.state.message}</h3>: null}
                {display}
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageBox)