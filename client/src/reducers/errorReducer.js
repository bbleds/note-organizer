import { APP_ERROR } from '../constants'

const initialState = {
  err: false,
  errMsg: ''
}

export default (state = initialState, action) => {
  switch(action.type){
    case APP_ERROR:
      return {
        ...state,
        err: true,
        errMsg: action.payload
      }
    default:
      return state
  }
}
