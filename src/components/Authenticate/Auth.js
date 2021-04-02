import React, {Component} from  'react';
import Login from './Login';
import Signup from '../ProfInfo/Signup';
import {connect} from 'react-redux';
import Loader from '../Loader/Loader';


//called upon when login tab is clicked. used to switch between login and signup methods

class Auth extends React.Component{

    state = {
        comp: "login",
        authInfo: {
            email: "",
            pass: "",
            confPass: ""
        },
        essentials: {
            age: null,
            location: {
                town: "",
                state: ""
            },
            bio: "",
            isMale: null,
            name: ""
        }
    }

    componentDidMount() {
        if(this.props.location.pathname.split("/")[2] === "redirect"){
            this.setState({error: "You must be logged in to see that page"})
        }
    }

    loginSuccess = async (userId, userName, token, isMale) => {
        //once backend has returned a successful login, change redux state of userId to the successful login userId, or the userId of user created at signup
        //also after session/cookies created in backend, relay to here to update state for session for logged in users
        try {
            localStorage.setItem('userId', userId);
            localStorage.setItem('token', token)
            localStorage.setItem('name', userName)
            localStorage.setItem('isMale', isMale === true ? "true" : "false")
            let remainingMilliseconds = 60 * 60 * 1000 * 24;
            const expiryDate = new Date(
                new Date().getTime() + remainingMilliseconds
                );
                localStorage.setItem('expiryDate', expiryDate.toISOString());
            this.props.userLogin(userId, userName, token, isMale)
            //this.props.setMsg(messages)

            this.props.history.push(this.props.location.pathname.split("/")[2] === "redirect" ? this.props.location.pathname.split("/redirect")[1] : "")
            
            
        } catch (err) {
            console.log(err, 'assigning user Id to redux error', userId, userName, token)
        }
        
    }

    setChildErr = err => {
        if(err === "null"){
            this.setState({error: null})
            return
        }
        if(!this.state.error){
            this.setState({error: err, loading: false})
            window.scrollTo(0, 0)

        }
    }

    

    uponSignupSubmit = async (essentials) => {

        this.setState({loading: true})
                
        this.setState({ essentials })

        if(this.state.authInfo.email.length< 5 || this.state.authInfo.pass.length < 8){
            this.setState({error: "Error with email or password. Refresh and try again."})
            return
        }

        if(!this.props.image instanceof File||!this.props.image){
            console.log("not a file")
            this.setState({error: "Error with image selected. Try to upload a different profile picture."})
            return
        }
        
        try {
            
                if(this.state.error){
                    this.setState({loading: false})
                    return ;
                }
        
        
                //post request to api/users
                //backend looks if already users with that email address
                //if no user is found, post request and create a new user
                //if user creation was a success...

                const formData = new FormData();
        
                formData.append('email', this.state.authInfo.email)
                formData.append('password', this.state.authInfo.pass)
                formData.append('name', this.state.essentials.name)
                formData.append('age', this.state.essentials.age)
                formData.append('locTown', this.state.essentials.location.town)
                formData.append('locState', this.state.essentials.location.state)
                formData.append('isMale', this.state.essentials.isMale)
                formData.append('avatarImg', this.props.image)

                if(this.state.essentials.bio){
                    formData.append('bio', this.state.essentials.bio)
                }
                fetch(process.env.REACT_APP_BACKEND + '/users', {
                    method: 'POST',
                    headers: {
                      
                    },
                    body: formData
                  }).then(res => {
                      
                        if(res.status !== 200 && res.status !== 201){
                            this.setState({loading: false})
                            if(res.status === 422){
                                throw new Error("Email is already in use.")
                            } else if(res.status === 418){
                                throw new Error("Issues uploading profile picture. Select the picture and submit again.")
                            } else if(res.status === 500){
                                throw new Error("There seems to be an issue with our server. Refresh and try again.")
                            } else {
                                throw new Error("There was a registration error. Try again later.")
                            }
                        }

                        this.setState({message: "Account created! Redirecting to profile editing", loading: false})

                        
                        return res.json();
                        
                  }).then(res => {
                      this.props.nullImg()
        
                        this.loginSuccess(res.userId, res.userName, res.token, res.isMale, []);
                  }).then(res => {
                        this.props.history.push('/profile')

                  }).catch(err => {
                        this.setState({error: err.message, loading: false})
                        window.scrollTo(0, 0)

                })
        
        } catch (err) {
            console.log(err)
            this.setState({error: err, loading: false})
            window.scrollTo(0, 0)

        }

    }

    switchComp = (e) => {
        e.preventDefault()
        {this.state.comp === "login" ? this.setState({...this.state, comp: "signup"}) : this.setState({...this.state, comp: "login"})}
    }

    updateInput = (input) => {
        this.setState({...this.state, authInfo: {...this.state.authInfo, [input.target.name]: input.target.value}});
    }

    render() {
        let compRender

        {this.state.comp === "login" ? 
            compRender = <Login 
                setErr={this.setChildErr.bind()} 
                error={this.state.error} 
                loginSuccess={(userId, userName, token, isMale) => this.loginSuccess(userId, userName, token, isMale)} 
                switchComp={this.switchComp} 
                pass={this.state.authInfo.pass} 
                history={this.props.history} 
                email={this.state.authInfo.email} 
                UPDATE={this.updateInput.bind()} /> : 
            compRender = <Signup 
                setErr={this.setChildErr.bind()} 
                error={this.state.error} 
                switchComp={this.switchComp} 
                uponSignupSubmit={this.uponSignupSubmit.bind()} 
                history={this.props.history} 
                pass={this.state.authInfo.pass} 
                confPass={this.state.authInfo.confPass}
                email={this.state.authInfo.email} 
                UPDATE={this.updateInput.bind()} />}


        return (
            <React.Fragment>
                <h3 style={{color: "rgb(110, 211, 207)"}}>{this.state.error || this.state.message}</h3>

                {this.state.loading === true ? <Loader /> : null}

                {compRender}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        image: state.image
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userLogin: (userId, userName, token, isMale) => dispatch({type: "USER_LOGIN", userId: userId, userName: userName, token: token, isMale: isMale}),
        nullImg: () => dispatch({type: "SET_IMG", fileObj: null})

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);