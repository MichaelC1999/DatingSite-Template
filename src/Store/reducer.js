//ANY ERRORS WITH REDUX REDUCER/METHODS, CHECK ACTION/VAR NAMES FOR ANY DISCREPANCY

const initialState = {
    modalType: null,
    image: null,
    currentUserId: null,
    isMale: null,
    token: null,
    otherUser: null,
    newMessage: []
}

const reducer = (state = initialState, action)=> {
    switch(action.type){
        case "USER_LOGIN":
            
            return {
                ...state,
                token: action.token,
                currentUserId: action.userId,
                currentUserName: action.userName,
                isMale: action.isMale,
                image: null
            }
        case "LOGOUT":
            localStorage.removeItem('userId');
            localStorage.removeItem('name')
            localStorage.removeItem('token');
            localStorage.removeItem('expiryDate')
            localStorage.removeItem('isMale')
            return {
                ...state,
                token: null,
                
                currentUserId: null,
                currentUserName: null,
                isMale: null,
                otherUser: null,
                modalType: null,
                loaded: false,
                newMessage: []
            }
        case "IMG_CROP":
            return {
                ...state,
                image: action.fileObj,
                modalType: "IMG_CROP"
            }
        case "SET_IMG":
            return {
                ...state,
                image: action.fileObj,
                modalType: null
            }
        case "DEACTIVATE":
            return {
                ...state,
                modalType: "DEACTIVATE",
                chungus: "SET"
            }
        case "CLOSE_MODAL":
            return {
                ...state,
                modalType: null,
                image: null,
                chungus: null
            }
        case "UPDATE_ISMALE":
            return {
                ...state,
                isMale: action.sex
            }
        case "NEW_MSG":
            if(action.op === "add"){

                const arr1 = [...state.newMessage]
                const arr2 = action.convo

                arr2.map((convo, index) => {
                    if(arr1.includes(convo)){
                        arr2.splice(index, 1)

                    }
                })
                

                const newMessageArr = arr1.concat(arr2)


                return {
                    ...state,
                    newMessage: newMessageArr
                }


            } else if(action.op === "remove"){

                const arr = [...state.newMessage]

                const index = arr.indexOf(action.convo)

                arr.splice(index, 1)
                return {
                    ...state,
                    newMessage: arr
                }
            }
            

        default:
            return state
    }
}

export default reducer;