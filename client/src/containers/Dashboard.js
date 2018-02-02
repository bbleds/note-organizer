import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect } from 'react-router-dom'
import actions from '../actions'

class Dashboard extends Component{
	render(){

		const { user } = this.props


		return(
			<div>
				{
					user === false ? (<Redirect to="/" />) :
						user === null ? (<div>Loading application</div>) :
							(<div>
									{
										user.profile_img_url ? <img src={user.profile_img_url} />	:
										''
									}
									<h1>Welcome, {user.first_name}</h1>
									<div className="row">
										<div className="col s12">
											<div className="row">
												<div className="input-field col s12">
													<i className="material-icons prefix">search</i>
													<input type="text" id="autocomplete-input" className="autocomplete"/>
													<label for="autocomplete-input">Search my notes...</label>
												</div>
											</div>
										</div>
									</div>
							</div>)
				}
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
