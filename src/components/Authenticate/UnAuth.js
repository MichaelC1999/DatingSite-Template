import React from 'react'
import Loader from '../Loader/Loader';

class UnAuth extends React.Component {
    
    render() {
        const token = localStorage.getItem('token');

        if(!token){    
            window.location.replace("/auth/redirect" + this.props.location.pathname)
        }
        return (
            
            <div>
                <Loader />
            </div>
        )
    }
}

export default UnAuth