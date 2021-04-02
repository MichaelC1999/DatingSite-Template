//Prof pic, bio entry. Not queryable but required info

import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import {connect} from 'react-redux'
import "./Signup.css";

//pass on everything as props from signup on auth, dont submit anything until user is finished with this page. after starter comp is filled out, then send post user request.

class Starter extends React.Component {
    
    state = {
        geocode: "",
        info: {
            age: 21,
            location: {
                town: "",
                state: ""
            },
            bio: ""
            
        }
    }

    componentDidMount() {
        if(this.props.hasOwnProperty("info")){
            this.setState({info: this.props.info, geocode: this.props.info.location.town + ", " + this.props.info.location.state})
        }
        // if(true){
        //     //this.props.editing is true
        //     this.setState({editing: true})
        //     console.log(this.props.currentUserId)
        //     // while(this.props.currentUserId === null){
        //     //     setTimeout(console.log(this.props.currentUserId), 1000)
        //     // }
        //     fetch(process.env.REACT_APP_BACKEND + "/user/" + this.props.currentUserId + "/starter", {
        //         //redux props not yet defined in component did mount, but do in render. Maybe pass it on as a param from router
        //         headers: {
        //             Authorization: "Bearer " + this.props.token
        //         }
        //     }).then( res => {
        //         if(res.status !== 200 && res.status !== 201){
        //             if(res.status === 500){
        //                 throw new Error("Issue fetching Profile data. Try again.")
        //             } else {
        //                 throw new Error("Issue fetching Profile data. Try again.")
        //             }
        //         }
                
        //         return res.json();
        //     }).then(resData => {
        //         this.setState({info: {age: resData.age, bio: resData.bio, location: {town: resData.town, state: resData.state}}})
        //     })
        // }
    }

    validInputs = () => {
        if(this.state.info.age < 18 || this.state.info.age > 100){
            this.setState({error: "Your age should be between 18 and 100"})
        }
        if(this.state.info.location.town.length < 2){
            this.setState({error: "Invalid Location, please try again"})
        }
        if(this.state.info.location.state.length!== 2){
            this.setState({error: "Invalid Location, please try again"})
        }

    }

    changeValue = (input) => {
        this.setState({info: {...this.state.info, [input.target.name]: input.target.value}});
    }

    setLocValue = (location) => {
        this.setState({info: {...this.state.info, location: {town: location.split(", ")[0], state: location.split(", ")[1]}}})
    }


    handleSelect = (loc) => {
        
        this.setLocValue(loc)
        this.setState({geocode: loc})
        
    };

    changePlacesSearch = geocode => {
        this.setState({ geocode })
    }

    continue = async() => {
        this.setState({error: null})
        if(this.props.edit === true){
            await this.validInputs()
            if(!this.state.error){
                this.starterEditSubmit()
                
            }
            return
        }
        this.props.setErr("null")
        await this.validInputs()
        if(!this.state.error){
            
            this.props.uponSignupSubmit(this.state.info.age, this.state.info.location, this.state.info.bio)
        } else if(this.state.error && !this.props.error){
            this.props.setErr(this.state.error)
        }
        
    }

    starterEditSubmit = () => {
        const formData = new FormData()
        formData.append('age', this.state.info.age)
        formData.append('locTown', this.state.info.location.town)
        formData.append('locState', this.state.info.location.state)
        if(this.state.info.bio){
            formData.append('bio', this.state.info.bio)
        }
        fetch(process.env.REACT_APP_BACKEND + '/user/starter', {
                    method: 'POST',
                    headers: {
                      Authorization: "Bearer " + this.props.token
                    },
                    body: formData
                  }).then(res => {
                        if(res.status !== 200 && res.status !== 201){
                            if(res.status === 422){
                                throw new Error("problem")
                            } else if(res.status === 401){
                                this.props.logoutRedux()
                                window.location.replace("/auth")
                            } else {
                                throw new Error("There was a registration error. Try again later.")
                            }
                        }
                        
                        return res.json();
                        
                  }).then(resData => {
                        this.props.history.push('/profileSettings')
        
                        this.setState({message: null})
                  }).catch(err => {
                        this.setState({error: err.message})
                })
    }

    render() {
        let searchOptions = {
            types: ['(regions)'],
            componentRestrictions: {country: 'us'}
            
        }
        return (
            <div className="Auth authForm" style={{marginTop: "30px"}}>
                <textarea name="bio" onChange={this.changeValue.bind()} value={this.state.info.bio} placeholder="Tell us about yourself"/>
                
                <PlacesAutocomplete
                    value={this.state.geocode}
                    onChange={this.changePlacesSearch}
                    onSelect={this.handleSelect}
                    searchOptions={searchOptions}>

                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <React.Fragment>
                        <input
                        {...getInputProps({
                            placeholder: 'Search Places ...',
                            className: 'location-search-input',
                        })}
                        />
                        <div style={{textAlign: "left"}} className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map(suggestion => {
                            if(suggestion.types.includes("locality") === false && suggestion.types.includes("neighborhood") === false){
                                return
                            }
                            const className = suggestion.active
                            ? 'suggestion-item--active'
                            : 'suggestion-item';
                            // inline style for demonstration purpose
                            const style = suggestion.active
                            ? { backgroundColor: '#fafafa', cursor: 'pointer', marginLeft: 0 }
                            : { backgroundColor: '#ffffff', cursor: 'pointer', marginLeft: 0 };
                            return (
                            <div
                                {...getSuggestionItemProps(suggestion, {
                                className,
                                style,
                                })}
                            >
                                <span>{suggestion.description}</span>
                            </div>
                            );
                        })}
                        </div>
                    </React.Fragment>
                    )}
                </PlacesAutocomplete>
                

                <input name="age" onChange={this.changeValue.bind()} type="number" min="18" max="100" placeholder="Age?" value={this.state.info.age} />

                
                <button onClick={this.continue}>Continue</button>
                
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

export default connect(mapStateToProps)(Starter);