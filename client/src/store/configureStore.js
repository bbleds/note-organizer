import {createStore, compose, applyMiddleware} from 'redux'
import { createLogicMiddleware } from 'redux-logic'
import reducers from '../reducers'
import logic from '../logic'

export default function(initialState) {
  const middlewares = [ createLogicMiddleware(logic) ]
  return createStore(reducers, initialState, compose(applyMiddleware(...middlewares)))
}
