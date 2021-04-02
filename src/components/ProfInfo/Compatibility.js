import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';


class Compatibility extends React.Component {
    state = {
        error: false,
        retake: false,
        values: {
            modTrad: [null,null,null,null,null],
            homeAdv: [null,null,null,null,null],
            intrExtr: [null,null,null,null,null],
            indiffActive: [null,null,null,null,null], 
            athRelig: [null,null,null,null,null]
            //sent in request as--- values: {category: avgNum}
        }

    }

    componentDidMount = () => {
        if(this.props.location.pathname.split("/")[2] === "retake"){
            this.setState({retake: true})
        }
    }

    changeValue = (input) => {
        const idxNum = parseInt(input.target.name.split("-")[1]) - 1
        const category = input.target.name.split("-")[0]
        

        const copy = [...this.state.values[category]]
        copy[idxNum] = parseInt(input.target.value)
        this.setState({values: {...this.state.values, [category]: copy}})
    }

    checker = async () => {
        let errorNum = 0
        let mtCount = 0
        await Promise.all(this.state.values.modTrad.map( (val, idx) => {
            if(val === null && errorNum === 0){
                errorNum = (idx+1)
        
            }
            
            return mtCount += val
        }))

        if(errorNum !== 0){
            this.setState({error: "Fill in all values to submit the test. Check question number " + errorNum })
            return
        }
        

        let advCount = 0
        this.state.values.homeAdv.map( (val, idx) => {
            if(val === null && errorNum === 0){
                errorNum = (idx+6)
            }
            
            return advCount += val
        })

        if(errorNum !== 0){
            this.setState({error: "Fill in all values to submit the test. Check question number " + errorNum })
            return
        }

        let ieCount = 0
        this.state.values.intrExtr.map( (val, idx) => {
            if(val === null && errorNum === 0){
                errorNum = (idx+11)
            }
            return ieCount += val
        })

        if(errorNum !== 0){
            this.setState({error: "Fill in all values to submit the test. Check question number " + errorNum })
            return
        }

        let iaCount = 0
        this.state.values.indiffActive.map( (val, idx) => {
            if(val === null && errorNum === 0){
                errorNum = (idx+16)
            }
            return iaCount += val
        })

        if(errorNum !== 0){
            this.setState({error: "Fill in all values to submit the test. Check question number " + errorNum })
            return
        }

        let arCount = 0
        this.state.values.athRelig.map( (val, idx) => {
            if(val === null && errorNum === 0){
                errorNum = (idx+21)
            }
            return arCount += val
        })

        if(errorNum !== 0){
            this.setState({error: "Fill in all values to submit the test. Check question number " + errorNum })
            return
        }

        return [mtCount, advCount, ieCount, iaCount, arCount]
    }


    submitTest = async () => {
        this.setState({error: false})
        //map values averaging out each category

        const arrCount = await this.checker()

        if(this.state.error){
            window.scrollTo(0, 0)

            return
        }

        

        fetch(process.env.REACT_APP_BACKEND + "/user/postCompat/" + arrCount[0] + "/" + arrCount[1] +"/" + arrCount[2] + "/" + arrCount[3] + "/" + arrCount[4], {
            headers: {
                Authorization: "Bearer " + this.props.token
            },
            method: "POST"
        }).then( res => {
            if(res.status === 200 || res.status === 201){

            } else if(res.status === 401){
                this.props.logoutRedux()
                window.location.replace("/auth")
            }
        }).then( res => {
            if(this.state.retake === true){
                window.location.replace("/profileSettings")
            } else {
                window.location.replace("/matchList")
            }
        }).catch( err => {
            console.log(err)
        })

    }

    render() {
        return (
//make a series of radio buttons that form a test 
//each answer has a name of the category and a value 0-3. upon selection, the value selected is added to the state category with that name.
//each category makes a value judgement depending on the value
//save each valued scored into CompatValues object for profileData

//rather than managing it by state, upon submit, take all the inputs with the same same, add up all the selected values 
            <div>
                {this.state.error ? <h2>{this.state.error}</h2>: null}
                <h2><NavLink to="/matchList" >Skip test</NavLink></h2>

                <div>
                    <h3>Q trad 1?</h3>
                    <input type="radio" id="mt1-1" name="modTrad-1" onChange={this.changeValue.bind()} value={0} />
                    <label for="mt1-1">1</label>
                    
                    <input type="radio" id="mt1-2" name="modTrad-1" onChange={this.changeValue.bind()} value={1} />
                    <label for="mt1-2">2</label>

                    <input type="radio" id="mt1-3" name="modTrad-1" onChange={this.changeValue.bind()} value={2} />
                    <label for="mt1-3">3</label>

                    <input type="radio" id="mt1-4" name="modTrad-1" onChange={this.changeValue.bind()} value={3} />
                    <label for="mt1-4">4</label>

                    <h3>Q trad 2?</h3>
                    <input type="radio" id="mt2-1" name="modTrad-2" onChange={this.changeValue.bind()} value={0} />
                    <label for="mt2-1">1</label>
                    
                    <input type="radio" id="mt2-2" name="modTrad-2" onChange={this.changeValue.bind()} value={1} />
                    <label for="mt2-2">2</label>

                    <input type="radio" id="mt2-3" name="modTrad-2" onChange={this.changeValue.bind()} value={2} />
                    <label for="mt2-3">3</label>

                    <input type="radio" id="mt2-4" name="modTrad-2" onChange={this.changeValue.bind()} value={3} />
                    <label for="mt2-4">4</label>

                    <h3>Q trad 1?</h3>
                    <input type="radio" id="mt3-1" name="modTrad-3" onChange={this.changeValue.bind()} value={0} />
                    <label for="mt3-1">1</label>
                    
                    <input type="radio" id="mt3-2" name="modTrad-3" onChange={this.changeValue.bind()} value={1} />
                    <label for="mt3-2">2</label>

                    <input type="radio" id="mt3-3" name="modTrad-3" onChange={this.changeValue.bind()} value={2} />
                    <label for="mt3-3">3</label>

                    <input type="radio" id="mt3-4" name="modTrad-3" onChange={this.changeValue.bind()} value={3} />
                    <label for="mt3-4">4</label>

                    <h3>Q trad 4?</h3>
                    <input type="radio" id="mt4-1" name="modTrad-4" onChange={this.changeValue.bind()} value={0} />
                    <label for="mt4-1">1</label>
                    
                    <input type="radio" id="mt4-2" name="modTrad-4" onChange={this.changeValue.bind()} value={1} />
                    <label for="mt4-2">2</label>

                    <input type="radio" id="mt4-3" name="modTrad-4" onChange={this.changeValue.bind()} value={2} />
                    <label for="mt4-3">3</label>

                    <input type="radio" id="mt4-4" name="modTrad-4" onChange={this.changeValue.bind()} value={3} />
                    <label for="mt4-4">4</label>

                    <h3>Q trad 5?</h3>
                    <input type="radio" id="mt1-1" name="modTrad-5" onChange={this.changeValue.bind()} value={0} />
                    <label for="mt1-1">1</label>
                    
                    <input type="radio" id="mt1-2" name="modTrad-5" onChange={this.changeValue.bind()} value={1} />
                    <label for="mt1-2">2</label>

                    <input type="radio" id="mt1-3" name="modTrad-5" onChange={this.changeValue.bind()} value={2} />
                    <label for="mt1-3">3</label>

                    <input type="radio" id="mt1-4" name="modTrad-5" onChange={this.changeValue.bind()} value={3} />
                    <label for="mt1-4">4</label>

                    <h3>Q adv 1?</h3>
                    <input type="radio" id="adv1-1" name="homeAdv-1" onChange={this.changeValue.bind()} value={0} />
                    <label for="adv1-1">1</label>
                    
                    <input type="radio" id="adv1-2" name="homeAdv-1" onChange={this.changeValue.bind()} value={1} />
                    <label for="adv1-2">2</label>

                    <input type="radio" id="adv1-3" name="homeAdv-1" onChange={this.changeValue.bind()} value={2} />
                    <label for="adv1-3">3</label>

                    <input type="radio" id="adv1-4" name="homeAdv-1" onChange={this.changeValue.bind()} value={3} />
                    <label for="adv1-4">4</label>

                    <h3>Q adv 2?</h3>
                    <input type="radio" id="adv2-1" name="homeAdv-2" onChange={this.changeValue.bind()} value={0} />
                    <label for="adv2-1">1</label>
                    
                    <input type="radio" id="adv2-2" name="homeAdv-2" onChange={this.changeValue.bind()} value={1} />
                    <label for="adv2-2">2</label>

                    <input type="radio" id="adv2-3" name="homeAdv-2" onChange={this.changeValue.bind()} value={2} />
                    <label for="adv2-3">3</label>

                    <input type="radio" id="adv2-4" name="homeAdv-2" onChange={this.changeValue.bind()} value={3} />
                    <label for="adv2-4">4</label>

                    <h3>Q adv 3?</h3>
                    <input type="radio" id="adv3-1" name="homeAdv-3" onChange={this.changeValue.bind()} value={0} />
                    <label for="adv3-1">1</label>
                    
                    <input type="radio" id="adv3-2" name="homeAdv-3" onChange={this.changeValue.bind()} value={1} />
                    <label for="adv3-2">2</label>

                    <input type="radio" id="adv3-3" name="homeAdv-3" onChange={this.changeValue.bind()} value={2} />
                    <label for="adv3-3">3</label>

                    <input type="radio" id="adv3-4" name="homeAdv-3" onChange={this.changeValue.bind()} value={3} />
                    <label for="adv3-4">4</label>

                    <h3>Q adv 4?</h3>
                    <input type="radio" id="adv4-1" name="homeAdv-4" onChange={this.changeValue.bind()} value={0} />
                    <label for="adv4-1">1</label>
                    
                    <input type="radio" id="adv4-2" name="homeAdv-4" onChange={this.changeValue.bind()} value={1} />
                    <label for="adv4-2">2</label>

                    <input type="radio" id="adv4-3" name="homeAdv-4" onChange={this.changeValue.bind()} value={2} />
                    <label for="adv4-3">3</label>

                    <input type="radio" id="adv4-4" name="homeAdv-4" onChange={this.changeValue.bind()} value={3} />
                    <label for="adv4-4">4</label>

                    <h3>Q adv 5?</h3>
                    <input type="radio" id="adv5-1" name="homeAdv-5" onChange={this.changeValue.bind()} value={0} />
                    <label for="adv5-1">1</label>
                    
                    <input type="radio" id="adv5-2" name="homeAdv-5" onChange={this.changeValue.bind()} value={1} />
                    <label for="adv5-2">2</label>

                    <input type="radio" id="adv5-3" name="homeAdv-5" onChange={this.changeValue.bind()} value={2} />
                    <label for="adv5-3">3</label>

                    <input type="radio" id="adv5-4" name="homeAdv-5" onChange={this.changeValue.bind()} value={3} />
                    <label for="adv5-4">4</label>

                    <h3>Q intrExtr 1?</h3>
                    <input type="radio" id="ie1-1" name="intrExtr-1" onChange={this.changeValue.bind()} value={0} />
                    <label for="ie1-1">1</label>
                    
                    <input type="radio" id="ie1-2" name="intrExtr-1" onChange={this.changeValue.bind()} value={1} />
                    <label for="ie1-2">2</label>

                    <input type="radio" id="ie1-3" name="intrExtr-1" onChange={this.changeValue.bind()} value={2} />
                    <label for="ie1-3">3</label>

                    <input type="radio" id="ie1-4" name="intrExtr-1" onChange={this.changeValue.bind()} value={3} />
                    <label for="ie1-4">4</label>

                    <h3>Q intrExtr 2?</h3>
                    <input type="radio" id="ie2-1" name="intrExtr-2" onChange={this.changeValue.bind()} value={0} />
                    <label for="ie2-1">1</label>
                    
                    <input type="radio" id="ie2-2" name="intrExtr-2" onChange={this.changeValue.bind()} value={1} />
                    <label for="ie2-2">2</label>

                    <input type="radio" id="ie2-3" name="intrExtr-2" onChange={this.changeValue.bind()} value={2} />
                    <label for="ie2-3">3</label>

                    <input type="radio" id="ie2-4" name="intrExtr-2" onChange={this.changeValue.bind()} value={3} />
                    <label for="ie2-4">4</label>

                    <h3>Q intrExtr 3?</h3>
                    <input type="radio" id="ie3-1" name="intrExtr-3" onChange={this.changeValue.bind()} value={0} />
                    <label for="ie3-1">1</label>
                    
                    <input type="radio" id="ie3-2" name="intrExtr-3" onChange={this.changeValue.bind()} value={1} />
                    <label for="ie3-2">2</label>

                    <input type="radio" id="ie3-3" name="intrExtr-3" onChange={this.changeValue.bind()} value={2} />
                    <label for="ie3-3">3</label>

                    <input type="radio" id="ie3-4" name="intrExtr-3" onChange={this.changeValue.bind()} value={3} />
                    <label for="ie3-4">4</label>

                    <h3>Q intrExtr 4?</h3>
                    <input type="radio" id="ie4-1" name="intrExtr-4" onChange={this.changeValue.bind()} value={0} />
                    <label for="ie4-1">1</label>
                    
                    <input type="radio" id="ie4-2" name="intrExtr-4" onChange={this.changeValue.bind()} value={1} />
                    <label for="ie4-2">2</label>

                    <input type="radio" id="ie4-3" name="intrExtr-4" onChange={this.changeValue.bind()} value={2} />
                    <label for="ie4-3">3</label>

                    <input type="radio" id="ie4-4" name="intrExtr-4" onChange={this.changeValue.bind()} value={3} />
                    <label for="ie4-4">4</label>

                    <h3>Q intrExtr 5?</h3>
                    <input type="radio" id="ie5-1" name="intrExtr-5" onChange={this.changeValue.bind()} value={0} />
                    <label for="ie5-1">1</label>
                    
                    <input type="radio" id="ie5-2" name="intrExtr-5" onChange={this.changeValue.bind()} value={1} />
                    <label for="ie5-2">2</label>

                    <input type="radio" id="ie5-3" name="intrExtr-5" onChange={this.changeValue.bind()} value={2} />
                    <label for="ie5-3">3</label>

                    <input type="radio" id="ie5-4" name="intrExtr-5" onChange={this.changeValue.bind()} value={3} />
                    <label for="ie5-4">4</label>

                    <h3>Q indiffActive 1?</h3>
                    <input type="radio" id="ia1-1" name="indiffActive-1" onChange={this.changeValue.bind()} value={0} />
                    <label for="ia1-1">1</label>
                    
                    <input type="radio" id="ia1-2" name="indiffActive-1" onChange={this.changeValue.bind()} value={1} />
                    <label for="ia1-2">2</label>

                    <input type="radio" id="ia1-3" name="indiffActive-1" onChange={this.changeValue.bind()} value={2} />
                    <label for="ia1-3">3</label>

                    <input type="radio" id="ia1-4" name="indiffActive-1" onChange={this.changeValue.bind()} value={3} />
                    <label for="ia1-4">4</label>

                    <h3>Q indiffActive 2?</h3>
                    <input type="radio" id="ia2-1" name="indiffActive-2" onChange={this.changeValue.bind()} value={0} />
                    <label for="ia2-1">1</label>
                    
                    <input type="radio" id="ia2-2" name="indiffActive-2" onChange={this.changeValue.bind()} value={1} />
                    <label for="ia2-2">2</label>

                    <input type="radio" id="ia2-3" name="indiffActive-2" onChange={this.changeValue.bind()} value={2} />
                    <label for="ia2-3">3</label>

                    <input type="radio" id="ia2-4" name="indiffActive-2" onChange={this.changeValue.bind()} value={3} />
                    <label for="ia2-4">4</label>

                    <h3>Q indiffActive 3?</h3>
                    <input type="radio" id="ia3-1" name="indiffActive-3" onChange={this.changeValue.bind()} value={0} />
                    <label for="ia3-1">1</label>
                    
                    <input type="radio" id="ia3-2" name="indiffActive-3" onChange={this.changeValue.bind()} value={1} />
                    <label for="ia3-2">2</label>

                    <input type="radio" id="ia3-3" name="indiffActive-3" onChange={this.changeValue.bind()} value={2} />
                    <label for="ia3-3">3</label>

                    <input type="radio" id="ia3-4" name="indiffActive-3" onChange={this.changeValue.bind()} value={3} />
                    <label for="ia3-4">4</label>

                    <h3>Q indiffActive 4?</h3>
                    <input type="radio" id="ia4-1" name="indiffActive-4" onChange={this.changeValue.bind()} value={0} />
                    <label for="ia4-1">1</label>
                    
                    <input type="radio" id="ia4-2" name="indiffActive-4" onChange={this.changeValue.bind()} value={1} />
                    <label for="ia4-2">2</label>

                    <input type="radio" id="ia4-3" name="indiffActive-4" onChange={this.changeValue.bind()} value={2} />
                    <label for="ia4-3">3</label>

                    <input type="radio" id="ia4-4" name="indiffActive-4" onChange={this.changeValue.bind()} value={3} />
                    <label for="ia4-4">4</label>

                    <h3>Q indiffActive 5?</h3>
                    <input type="radio" id="ia5-1" name="indiffActive-5" onChange={this.changeValue.bind()} value={0} />
                    <label for="ia5-1">1</label>
                    
                    <input type="radio" id="ia5-2" name="indiffActive-5" onChange={this.changeValue.bind()} value={1} />
                    <label for="ia5-2">2</label>

                    <input type="radio" id="ia5-3" name="indiffActive-5" onChange={this.changeValue.bind()} value={2} />
                    <label for="ia5-3">3</label>

                    <input type="radio" id="ia5-4" name="indiffActive-5" onChange={this.changeValue.bind()} value={3} />
                    <label for="ia5-4">4</label>

                    <h3>Q athRelig 1?</h3>
                    <input type="radio" id="ar1-1" name="athRelig-1" onChange={this.changeValue.bind()} value={0} />
                    <label for="ar1-1">1</label>
                    
                    <input type="radio" id="ar1-2" name="athRelig-1" onChange={this.changeValue.bind()} value={1} />
                    <label for="ar1-2">2</label>

                    <input type="radio" id="ar1-3" name="athRelig-1" onChange={this.changeValue.bind()} value={2} />
                    <label for="ar1-3">3</label>

                    <input type="radio" id="ar1-4" name="athRelig-1" onChange={this.changeValue.bind()} value={3} />
                    <label for="ar1-4">4</label>

                    <h3>Q athRelig 2?</h3>
                    <input type="radio" id="ar2-1" name="athRelig-2" onChange={this.changeValue.bind()} value={0} />
                    <label for="ar2-1">1</label>
                    
                    <input type="radio" id="ar2-2" name="athRelig-2" onChange={this.changeValue.bind()} value={1} />
                    <label for="ar2-2">2</label>

                    <input type="radio" id="ar2-3" name="athRelig-2" onChange={this.changeValue.bind()} value={2} />
                    <label for="ar2-3">3</label>

                    <input type="radio" id="ar2-4" name="athRelig-2" onChange={this.changeValue.bind()} value={3} />
                    <label for="ar2-4">4</label>

                    <h3>Q athRelig 3?</h3>
                    <input type="radio" id="ar3-1" name="athRelig-3" onChange={this.changeValue.bind()} value={0} />
                    <label for="ar3-1">1</label>
                    
                    <input type="radio" id="ar3-2" name="athRelig-3" onChange={this.changeValue.bind()} value={1} />
                    <label for="ar3-2">2</label>

                    <input type="radio" id="ar3-3" name="athRelig-3" onChange={this.changeValue.bind()} value={2} />
                    <label for="ar3-3">3</label>

                    <input type="radio" id="ar3-4" name="athRelig-3" onChange={this.changeValue.bind()} value={3} />
                    <label for="ar3-4">4</label>

                    <h3>Q athRelig 4?</h3>
                    <input type="radio" id="ar4-1" name="athRelig-4" onChange={this.changeValue.bind()} value={0} />
                    <label for="ar4-1">1</label>
                    
                    <input type="radio" id="ar4-2" name="athRelig-4" onChange={this.changeValue.bind()} value={1} />
                    <label for="ar4-2">2</label>

                    <input type="radio" id="ar4-3" name="athRelig-4" onChange={this.changeValue.bind()} value={2} />
                    <label for="ar4-3">3</label>

                    <input type="radio" id="ar4-4" name="athRelig-4" onChange={this.changeValue.bind()} value={3} />
                    <label for="ar4-4">4</label>

                    <h3>Q athRelig 5?</h3>
                    <input type="radio" id="ar5-1" name="athRelig-5" onChange={this.changeValue.bind()} value={0} />
                    <label for="ar5-1">1</label>
                    
                    <input type="radio" id="ar5-2" name="athRelig-5" onChange={this.changeValue.bind()} value={1} />
                    <label for="ar5-2">2</label>

                    <input type="radio" id="ar5-3" name="athRelig-5" onChange={this.changeValue.bind()} value={2} />
                    <label for="ar5-3">3</label>

                    <input type="radio" id="ar5-4" name="athRelig-5" onChange={this.changeValue.bind()} value={3} />
                    <label for="ar5-4">4</label>
                </div>
                <button type="none" onClick={this.submitTest} >Submit</button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.token,
        currentUserId: state.currentUserId
    }
}

export default connect(mapStateToProps)(Compatibility)