import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect } from 'react-router-dom'
import actions from '../actions'

class Dashboard extends Component{
	render(){
		const content = this.props.user === false ?
			(<Redirect to="/" />) :
			(<h1>Dashboard</h1>)

		return(
			<div>
				{content}
			</div>
		)
	}
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
