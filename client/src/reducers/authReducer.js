import {
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE
 } from '../constants'

const initialState = {
  user: null
}

export default (state = initialState, action) => {
  switch(action.type){
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        user: action.payload
      }
    case FETCH_USER_FAILURE:
      return {
        ...state,
        user: false
      }
    default:
      return state
  }
}
