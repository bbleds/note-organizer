import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect } from 'react-router-dom'
import actions from '../actions'
import Searchbar from '../components/Searchbar'
import RecentNotes from '../components/RecentNotes'

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
									<Searchbar/>
									<RecentNotes/>
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
