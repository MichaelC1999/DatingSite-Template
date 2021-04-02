import React from 'react'

class Message extends React.Component {
    render () {
        let backgroundColor = null
        let color = null
        let marginLeft = null
        let marginRight = null

        if(this.props.sent) {
            backgroundColor = "rgb(110, 211, 207)"
            color = "white"
            marginLeft = "40%"

        } else {
            backgroundColor = "white"
            color = "rgb(110, 211, 207)"
            marginLeft = "10%"
        }
        return (
            <div style={{width: "50%", backgroundColor: backgroundColor, color: color, marginLeft: marginLeft, marginRight: marginRight, fontSize: "20px", marginTop: "10px", marginBottom: "10px", borderRadius: "5px", border: "black 1px solid", padding: "2px"}}><p>{this.props.content}</p></div>

        )
    }
}

export default Message