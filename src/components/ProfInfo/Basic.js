import React from 'react';
import {connect} from 'react-redux';
import ImgUpload from './ImgUpload';
import "./Basic.css";


//comparitive info used to search for matches and user search functionality

class Basic extends React.Component {
    
    state = {
        //
        message: null,
        showImgUpload: false,
        basicInfo: {
            religiousDenom: "",
            prevMarried: false,
            hasChildren: false, 
            drinks: "", //never, rarely, sometimes, often
            smokes: false,
            height: "", //ex. 5'4" string
            occupation: "",
            relType: "unsure" //romance, long term, marriage, unsure
        },
        displayInfo: {
            hobbies: [],
            music: [],
            showsMovies: [],
            interests: [],
            areYouReligiousQ: "",
            describeMatch: "",
            aspirations: ""
        },
        arrState: {
            //currently what has been entered in the textbox
            hobbies: "",
            music: "",
            showsMovies: "",
            interests: ""
        }
    }

    sendData = () => {
        
        this.setState({message: null, error: null})

        var data = new FormData();

        

        for(let x=0; x<Object.keys(this.state.displayInfo).length; x++){
            data.append(Object.keys(this.state.displayInfo)[x], Object.values(this.state.displayInfo)[x])
        }

        data.append("divide", Object.keys(this.state.displayInfo).length)

        for(let x=0; x<Object.keys(this.state.basicInfo).length; x++){
            data.append(Object.keys(this.state.basicInfo)[x], Object.values(this.state.basicInfo)[x])
        }

        fetch(process.env.REACT_APP_BACKEND + '/user/updateBasic', {
            method: 'POST',
            headers: {
                Authorization: "Bearer "+ this.props.token,
                  
            },
            body: data
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                if(res.status === 401){
                    this.props.logoutRedux()
                    window.location.replace("/auth")
                } else {
                    throw new Error("Error adding info to profile. Try again.")
                }
            }
                        
            return res.json();
                        
        }).then(res => {
            if(this.props.hasOwnProperty("edit") === false) {
                this.props.history.push('/compatibility')
            } else {
                //modal or notification to say that the new info has been set
                this.setState({message: "Profile updated!"})
            }
        }).catch(err => {
            this.setState({error: err.message})
            window.scrollTo(0, 0)

        })
    }

    componentDidMount() {
        window.scrollTo(0, 0)

        if(this.props.hasOwnProperty("displayInfo") && this.props.hasOwnProperty("basicInfo")){
            this.setState({displayInfo: this.props.displayInfo, basicInfo: this.props.basicInfo})

        }
        
    }

    arrChangeValue = (input) => {

        if(this.state.arrState[input] === ""){
            return
        }
        //input box where the user writes something, then clicks a button when done typing. pushes to array
        this.setState({displayInfo: {...this.state.displayInfo, [input]: [...this.state.displayInfo[input], this.state.arrState[input]]}}, () => this.setState({arrState: {...this.state.arrState, [input]: ""}}))
    }

    changeValue = (input) => {
        let val = input.target.value

        if(val === "true"){
            val = true
        }
        if(val === "false"){
            val = false
        }
        this.setState({[input.target.className]: {...this.state[input.target.className], [input.target.name]: val}});
    }


    removeArrItem = (idx, name) => {
        let array = [...this.state.displayInfo[name]]
        array.splice(idx, 1)
        this.setState({displayInfo: {...this.state.displayInfo, [name]: array}})
    }

    render() {


        let hobbies = this.state.displayInfo.hobbies.map((hobby,idx)=> {
            return <li key={idx} onClick={()=>this.removeArrItem(idx, "hobbies")}>{hobby}</li>
        })

        let music = this.state.displayInfo.music.map((item,idx)=> {
            return <li key={idx} onClick={()=>this.removeArrItem(idx, "music")}>{item}</li>
        })

        let showsMovies = this.state.displayInfo.showsMovies.map((item,idx)=> {
            return <li key={idx} onClick={()=>this.removeArrItem(idx, "showsMovies")}>{item}</li>
        })

        let interests = this.state.displayInfo.interests.map((interest,idx)=> {
            return <li key={idx} onClick={()=>this.removeArrItem(idx, "interests")}>{interest}</li>
        })

        let imgUpload = null

        if(this.state.showImgUpload === true){
            imgUpload = <ImgUpload />
        }
        return (
            <div style={{marginTop: "40px"}}>

                {this.state.message || this.state.error ? <h3>{this.state.error || this.state.message}</h3>: null}

                <div style={{marginLeft: "60px", marginRight: "60px"}} onClick={() => this.setState({showImgUpload: true})}>
                    <h3 style={this.state.showImgUpload === true ? {display: "none"} : {border: "rgb(45, 45, 64) 1px solid", margin: 0, padding: "15px"}}>Click here to add more profile images</h3>
                    {imgUpload}
                </div>
                <div className="topBoxes">
                <div className ="topSelect">
                <input name="occupation"  className="basicInfo"  maxLength="20" type="text" onChange={this.changeValue.bind()} value={this.state.basicInfo.occupation} placeholder="What is your job? Or what are you studying?"/>
                    
                <select name="height"  className="basicInfo"  onChange={this.changeValue.bind()} value={this.state.basicInfo.height}>
                    <option value="">Height?</option>
                    <option value="<4'10">Under 4'10"</option>
                    <option value="4'10">4'10"</option>
                    
                    <option value="4'11">4'11"</option>
                    <option value="5'">5'</option>
                    <option value="5'1">5'1"</option>
                    <option value="5'2">5'2"</option>
                    <option value="5'3">5'3"</option>
                    <option value="5'4">5'4"</option>
                    <option value="5'5">5'5"</option>
                    <option value="5'6">5'6"</option>
                    <option value="5'7">5'7"</option>
                    <option value="5'8">5'8"</option>
                    <option value="5'9">5'9"</option>
                    <option value="5'10">5'10"</option>
                    <option value="5'11">5'11"</option>
                    <option value="6'">6'</option>
                    <option value="6'1">6'1"</option>
                    <option value="6'2">6'2"</option>
                    <option value="6'3">6'3"</option>

                </select>

                <select name="religiousDenom"  className="basicInfo"  onChange={this.changeValue.bind()} value={this.state.basicInfo.religiousDenom}>
                    <option value="">Religion?</option>
                    <option value="Catholic">Catholic</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Jewish">Jewish</option>

                    <option value="Orthodox">Orthodox</option>
                    <option value="Protestant-Evangelical">Evangelical</option>
                    <option value="Protestant-Baptist">Baptist</option>
                    <option value="Protestant-Other">Protestant-Other</option>
                </select>

                <select name="drinks"  className="basicInfo"  onChange={this.changeValue.bind()} value={this.state.basicInfo.drinks}>
                    <option value="">How often do you drink?</option>
                    <option value="Never">Never</option>
                    <option value="Rarely">Rarely</option>
                    <option value="Sometimes">Sometimes</option>
                    <option value="Often">Often</option>
                </select>


                <select name="relType"  className="basicInfo"  onChange={this.changeValue.bind()} value={this.state.basicInfo.relType}>
                    <option value="unsure">Unsure</option>
                    <option value="Romance">Romance</option>
                    <option value="Long-Term">Long Term Dating</option>
                    <option value="Marriage">Marriage</option>
                </select>

                </div>

                <div className="topRadio">

                <h3>Were you previously married?</h3>
                <div className="test">

                <input type="radio" id="ymarried" name="prevMarried"  className="basicInfo" checked={this.state.basicInfo.prevMarried === true} onChange={this.changeValue.bind()} value={true}/>
                <h5 className="basicInfo">Yes</h5>
                <input type="radio" id="nmarried" name="prevMarried"  className="basicInfo" checked={this.state.basicInfo.prevMarried === false} onChange={this.changeValue.bind()} value={false}/>
                <h5 className="basicInfo">No</h5>
                </div>


                <h3>Do you have children?</h3>
                <div className="test">

                <input type="radio" id="ychildren" name="hasChildren" className="basicInfo" checked={this.state.basicInfo.hasChildren === true}  onChange={this.changeValue.bind()} value={true}/>
                <h5 className="basicInfo">Yes</h5>
                <input type="radio" id="nchildren" name="hasChildren"  className="basicInfo" checked={this.state.basicInfo.hasChildren === false} onChange={this.changeValue.bind()} value={false}/>
                <h5 className="basicInfo">No</h5>
                </div>
                
                <h3>Do you smoke?</h3>
                <div className="test">

                <input type="radio" id="ysmoke" name="smokes" className="basicInfo" checked={this.state.basicInfo.smokes === true} onChange={this.changeValue.bind()} value={true}/>
                <h5 className="basicInfo">Yes</h5>
                <input type="radio" id="nsmoke" name="smokes" className="basicInfo" checked={this.state.basicInfo.smokes === false} onChange={this.changeValue.bind()} value={false}/>
                <h5 className="basicInfo">No</h5>
                </div>
                </div>
                </div>
                <div className="authForm">
                <h3>Are you religious?</h3>
                <textarea placeholder="Explain here" onChange={this.changeValue.bind()} name="areYouReligiousQ" className="displayInfo" value={this.state.displayInfo.areYouReligiousQ}/>
                
                <h3>Describe your ideal match?</h3>
                <textarea placeholder="Explain here" onChange={this.changeValue.bind()} className="displayInfo" name="describeMatch" value={this.state.displayInfo.describeMatch}/>
                
                <h3>What are your aspirations?</h3>
                <textarea placeholder="Explain here" onChange={this.changeValue.bind()} name="aspirations" className="displayInfo" value={this.state.displayInfo.aspirations}/>
                
                <div className="listInputs">

                <h2><ul>{hobbies}</ul></h2>
                <input onChange={(x) => this.setState({arrState: {...this.state.arrState, hobbies: x.target.value}})} value={this.state.arrState.hobbies} type="text" />
                <button type="none" onClick={() => this.arrChangeValue("hobbies")}>Add hobby</button>
                </div>
                <div className="listInputs">

                <h2><ul>{music}</ul></h2>
                <input onChange={(x) => this.setState({arrState: {...this.state.arrState, music: x.target.value}})} value={this.state.arrState.music} type="text" />
                <button type="none" onClick={() => this.arrChangeValue("music")}>Add music</button>
                </div>

                <div className="listInputs">
                <h2><ul>{showsMovies}</ul></h2>
                <input onChange={(x) => this.setState({arrState: {...this.state.arrState, showsMovies: x.target.value}})} value={this.state.arrState.showsMovies} type="text" />
                <button type="none" onClick={() => this.arrChangeValue("showsMovies")}>Add Show/Movie</button>
                </div>

                <div className="listInputs">
                <h2><ul>{interests}</ul></h2>
                <input onChange={(x) => this.setState({arrState: {...this.state.arrState, interests: x.target.value}})} value={this.state.arrState.interests} type="text" />
                <button type="none" onClick={() => this.arrChangeValue("interests")}>Add interest</button>
                </div>
                <button type="none" onClick={this.sendData} >Continue</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.token,
        currentUserId: state.currentUserId,
        image: state.image

    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Basic);