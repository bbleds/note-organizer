import { createLogic } from 'redux-logic'
import axios from 'axios'
import { completeLogic } from '../util'
import {
  APP_ERROR,
  FETCH_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
 } from '../constants'

const fetchUserLogic = createLogic({
  type: FETCH_USER,
  async process({ getState, action }, dispatch, done){
    try{
      const res = await axios.get('/api/auth/current_user')
      completeLogic(dispatch, { type: FETCH_USER_SUCCESS, payload : res.data || false }, done)
    }
    catch(err){
      const payload = 'Could not fetch this user. Please try logging in again or contact support.'
      completeLogic(dispatch, { type: APP_ERROR, payload}, done)
    }
  }
})

export default [
  fetchUserLogic
]
