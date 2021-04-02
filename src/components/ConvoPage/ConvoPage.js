import React from 'react'
import {connect } from 'react-redux'
import Message from '../Message/Message'
import "./ConvoPage.css"
import Loader from '../Loader/Loader'

class ConvoPage extends React.Component {


    state = {
        convo: {},
        currentMessage: "",
        loaded: false,
        convoId: null,
        error: null
    }


    componentDidMount() {
        //if received convo as prop, setState convoStarted to true and conversation to this.props.convo
        const otherUserId = this.props.location.pathname.split("/")[2]
        fetch(process.env.REACT_APP_BACKEND + "/user/checkConvo/" + otherUserId, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + this.props.token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                if(res.status === 500){
                    throw new Error("Issue fetching Profile data. Try again.")
                } else if(res.status === 418){
                    throw new Error("User account not found. It appears that this user deleted their account")
                } else if(res.status === 401){
                    this.props.logoutRedux()
                    window.location.replace("/auth")
                } else {
                    throw new Error("Issue fetching Profile data. Try again.")
                }
            }
                          
            return res.json();
        }).then(res => {
            if(res.convo.hasOwnProperty("_id")){
                this.props.newMessage("remove", res.convo_id)
                this.setState({convoId: res.convo._id})
            }
            this.setState({loaded: true, convo: res.convo})
            this.scrollToBottom()
        }).catch(err => {
            this.setState({error: err.message})
        })
    }

    submitMessage = () => {
        if(this.state.currentMessage === ""){
            return
        }

        this.setState({error: null})

        const formData = new FormData()

        formData.append("content", this.state.currentMessage)
        formData.append("otherUserId", this.state.convo.otherUser.id)

        //if convostarted is true, send request to newMessage route
        if(this.state.convoId !== null){
            formData.append("convoId", this.state.convoId)
            fetch(process.env.REACT_APP_BACKEND + "/user/messages/newMessage", {
            headers: {
                Authorization: "Bearer " + this.props.token
            },
            method: "POST",
            body: formData
        }).then(res => {
                if(res.status !== 200 && res.status !== 201){
                    if(res.status === 422){
                        throw new Error("Failed to send message")
                    } else if(res.status === 401){
                        this.props.logoutRedux()
                        window.location.replace("/auth")
                    } else if(res.status === 418){
                        throw new Error("Message failed. Receiving user not found.")
                    } else {
                        throw new Error("Failed to send message")
                    }
                }
                return res.json()
        }).then(res => {
            this.setState({convo: {...this.state.convo, messages: [...this.state.convo.messages, res.msg]}, currentMessage: ""})
            this.scrollToBottom()
        }).catch(err => {
            this.setState({error: err.message})
        })
        }

        //if convostarted is false, send request to newConvo route
        if(this.state.convoId === null){
            fetch(process.env.REACT_APP_BACKEND + "/user/messages/newConvo", {
                headers: {
                    Authorization: "Bearer " + this.props.token
                },
                method: "POST",
                body: formData
            }).then(res => {
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
            }).then(res => {
                
                this.setState({convo: res.convo, currentMessage: "", convoId: res.convo._id})
            }).catch(err => {
                this.setState({error: err.message})
            })
        }
        
    }

    inputChange = (e) => {
        this.setState({currentMessage: e.target.value})
    }

    scrollToBottom = () => {
        var div = document.getElementById("convoBox");
        div.scrollTop = div.scrollHeight - div.clientHeight;
    }

    writeMessage = () => {
        document.getElementById('sendMsg').scrollIntoView();
    }

    render() {

        if(this.state.loaded === false){
            return <div style={{marginTop: "40px"}}><Loader /></div>

        }

        let display = null

        if(this.state.error){
            return display = <h3>{this.state.error}</h3>
        }
        //if convostarted  is true, map conversation.messages
            //if current user sent is true, display message in quote box and peg to right, else display message from the left
                //put time on each message. If message date sent at is not equal to prior message or is first message, print date above message
        if(this.state.convoId !== null && this.state.loaded === true){
            display = this.state.convo.messages.map((msg, idx) => {
                // if(msg.currentUserSent === true){
                //     return <div key={idx} style={{backgroundColor: "rgb(110, 211, 207)"}}><p>{msg.content}</p></div>
                // } else {
                //     return <div key={idx} style={{backgroundColor: "lime"}}><p>{msg.content}</p></div>
                // }
                return <Message key={idx} content={msg.content} sent={msg.currentUserSent} />
            })
        } else {
            display = <h4>No Messages yet</h4>
        }
        //if convo started is false, render no messages
        return (
            <div style={{marginTop: "30px"}}>

                {this.state.convo.messages.length > 3 ? <button className="defButton hideDesktop" type="none" onClick={this.writeMessage}>Send Response</button> : null}
                
                <div  id="convoBox" style={{border: "black 2px solid", margin: "20px 10px", backgroundColor: "rgb(85, 85, 97)", maxHeight: "50vh"}}>
                    {display}

                </div>
                <div className="mobileCollapse">
                    {this.state.convo.hasOwnProperty("otherUser") ? <div style={{flex: "1", marginLeft: "10px"}}>
                    
                    <img id="convoAvImg" style={{display: "inline-block"}} src={this.state.convo.otherUser.avatarImg} /></div> : null} 
                    <div id="sendMsg" style={{flex: "2", padding: "10px 10%"}}>
                        <h3 style={{marginTop: "10px"}}>{this.state.convo.otherUser.name}</h3>
                        <input style={{width: "80%", height: "35px", fontSize: "18px"}} type="text" value={this.state.currentMessage} onChange={this.inputChange.bind()} placeholder="Write message here" />
                        <button className="defButton" style={{width: "20%", height: "35px", boxShadow: "none", marginTop: "10px"}} type="none" onClick={this.submitMessage}>Send</button>

                    </div>
                </div>
                
                
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
        newMessage: (op, convo) => dispatch({type: "NEW_MSG", op: op, convo: convo}),
        logoutRedux: () => dispatch({type: "LOGOUT"})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConvoPage)