import React from 'react'

export default () => {
	return (
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
	)
}
