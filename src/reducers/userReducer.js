const initialState = {
  currentUser: null,
  subscriptionInfo: null
}

const userReducer = (state = initialState, action) => {

  switch(action.type){
    case 'SET_USER':
      return {
        ...state,
        currentUser: action.currentUser
      }

    case 'SET_SUB_INFO':
      return {
        ...state,
        subscriptionInfo: action.subInfo
      }

    default:
      return state;
  }
}

export default userReducer;
