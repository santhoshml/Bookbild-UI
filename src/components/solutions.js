import React, {Component} from 'react';
import { Link } from "react-router-dom";

export default class Solutions extends Component{

	render(){

		return (
			<div className="container" >

				<h2>Solutions </h2>

				<br/>
				<h4 className="indent"><span className="glyphicon glyphicon-leaf"/>Middle Market Loan Transactions</h4>

				<br/>
				<h4 className="indent"><span className="glyphicon glyphicon-leaf"/>Market Data Analytics</h4>

				<br/>
				<h4 className="indent"><span className="glyphicon glyphicon-leaf"/>Data Room</h4>

				<br/>
				<h4 className="indent"><span className="glyphicon glyphicon-leaf"/>Working Group List</h4>

				<br/>
				<h4 className="indent"><span className="glyphicon glyphicon-leaf"/>Legal Documentation Tool</h4>

				<br/>
				<h4 className="indent"><span className="glyphicon glyphicon-leaf"/>Tombstones</h4>

				<br/>
				<h4 className="indent"><span className="glyphicon glyphicon-leaf"/>Messaging Platform</h4>

				<br/>
				<h4 className="indent"><span className="glyphicon glyphicon-leaf"/>Concourse</h4>

				</div>
		    );
	}
}