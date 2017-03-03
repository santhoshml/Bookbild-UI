import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import { registerCompany } from '../actions/index';
import {Link} from 'react-router';

import * as actionCreators from '../actions/index';

class RegisterCompany extends Component{
	// static contextTypes ={
	//     router : PropTypes.object
	// };

	onSubmit(props){
			// const { createPost } = this.props;
    	// const { post } = this.state;
    	// const { router } = this.context;
			//
	    // this.props.registerCompany(props)
	    //   .then(()=>{
	    //     this.context.router.push('/');
	    //   });
	}

	render(){
		const {fields:{companyName, ein, role
			, streetAddress, city, state, zip
			, userFullName, email, password, confirmPassword, phone
			}, handleSubmit} = this.props;

		return (
		      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
		        <h3>Compay Details</h3>

		        <div className="form-group">
		          <label> Company Name </label>
		          <input type="text" className="form-control" {...companyName}/>
		        </div>

		        <div className="form-group">
		          <label>EIN of the Company</label>
		          <input type="text" className="form-control" {...ein}/>
		        </div>

		        <div className="form-group">
		          <label>Role of the company</label>
		          <input type="text" className="form-control" {...role}/>
		        </div>

						<br/>
						<hr/>
						<h3>Address Details</h3>

						<div className="form-group">
		          <label> Street Address </label>
		          <input type="text" className="form-control" {...streetAddress}/>
		        </div>

		        <div className="form-group">
		          <label>State</label>
		          <input type="text" className="form-control" {...state}/>
		        </div>

		        <div className="form-group">
		          <label>Zipcode</label>
		          <input type="text" className="form-control" {...zipcode}/>
		        </div>

						<br/>
						<hr/>
						<h3>Contact Details</h3>

						<div className="form-group">
		          <label> Full Name </label>
		          <input type="text" className="form-control" {...fullName}/>
		        </div>

		        <div className="form-group">
		          <label>Email</label>
		          <input type="text" className="form-control" {...email}/>
		        </div>

		        <div className="form-group">
		          <label>Password</label>
		          <input type="text" className="form-control" {...password}/>
		        </div>

						<div className="form-group">
		          <label>Confirm Password</label>
		          <input type="text" className="form-control" {...confirmPassword}/>
		        </div>

						<div className="form-group">
		          <label>Phone Number</label>
		          <input type="text" className="form-control" {...phoneNumber}/>
		        </div>

		        <button type="submit" className="btn btn-primary">Submit</button>
		        <Link to="/" className="btn btn-danger">Cancel</Link>
		      </form>
		    );
	}
}

// function validate(values){
//   const errors={};
//
//   if(!values.companyName){
//     errors.companyName='Enter a company name';
//   }
//
//   if(!values.ein){
//     errors.ein='Enter company EIN';
//   }
//
//   if(!values.role){
//     errors.role='Enter company role';
//   }
//
//   if(!values.email){
//     errors.email='Enter a email';
//   }
//
//   if(!values.phone){
//     errors.phone='Enter phone#';
//   }
//
//   if(!values.address){
//     errors.address='Enter address';
//   }
//
//   if(!values.city){
//     errors.city='Enter a city';
//   }
//
//   if(!values.state){
//     errors.state='Enter State';
//   }
//
//   if(!values.zip){
//     errors.zip='Enter zip';
//   }
//
//   if(!values.userFullName){
//     errors.userFullName='Enter full name of the user';
//   }
//
//   if(!values.password){
//     errors.password='Enter password';
//   }
//
//   return errors;
// }

export default reduxForm({
  'form': 'RegisterCompany',
  'fields': ['companyName', 'ein', 'role', 'streetAddress', 'city', 'state', 'zip', 'userFullName', 'email', 'password', 'confirmPassword', 'phone']
}, null, {registerCompany})(RegisterCompany);
