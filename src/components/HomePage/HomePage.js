import React from 'react'
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux'


class HomePage extends React.Component {

    componentDidMount() {
        this.props.updateMessages()
    }

    render() {
        return (
            <React.Fragment>
                <h1>HOMEPAGE</h1>
                <p>(Homepage UI retracted for portfolio purposes)</p>
                <div style={{backgroundColor: "rgb(110, 211, 207)", width: "80vw", margin: "auto", padding: "10px", border: "1px solid rgb(45, 45, 64)"}}>
                    
                    <h2><NavLink style={{color: "rgb(45, 45, 64)"}} to="/userList/female">Female users</NavLink></h2>
                    <h2><NavLink style={{color: "rgb(45, 45, 64)"}} to="/userList/male">Male users</NavLink></h2>
                </div>
            </React.Fragment>

        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)