import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {BrowserRouter, Route} from 'react-router-dom'
import Dashboard from './Dashboard'
import Header from '../components/Header'
import Landing from '../components/Landing'
import actions from '../actions'


class App extends Component {

  componentDidMount(){
    this.props.actions.fetchUser()
  }

  render(){
    const { user } = this.props

    return (
      <div className="container">
        <BrowserRouter>
          <div>
           <Header user={user} />
           <Route exact path="/" component={Landing} />
           <Route exact path="/dashboard" component={Dashboard} />
          </div>
        </BrowserRouter>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    error: state.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
