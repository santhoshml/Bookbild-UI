import React, {Component} from 'react';
import { Link } from "react-router-dom";

export default class Solutions extends Component{

	render(){

		return (
			<div className="container" >

				<h1 className="solutions-title">Our Solutions</h1>

				<br/>

				<div className="row solutions-row">
					<div className="col-md-4 solutions-card">
						<div className="headword">X</div>
						<h3 className="card-title">Middle Market Loan Transactions</h3>
						<br/>
						<p className="card-text">Single access point for institutional middle market private debt capital.</p> 
						<p className="card-text">Friction-less new deal discovery - enhance pipelines with pre-qualified deal flow tailored to your unique criteria.</p>
					</div>
					<div className="col-md-2 solutions-card"/>
					<div className="col-md-4 solutions-card">
						<div className="headword">A</div>
						<h3 className="card-title">Market Data Analytics</h3>
						<br/>
						<p className="card-text">Real-time private debt benchmark index across sectors and aggregate transaction data analysis (e.g. supply/demand heat maps, pricing and structure trends, etc).</p>
					</div>
				  </div>
				  <div className="row solutions-row"/>
				  <br/>
				  <br/>
				  <br/>
				  <br/>
				<div className="row solutions-row">
				  <div className="col-md-4 solutions-card">
					  <hr className="hr-card"/>
					  <div className="headword">O</div>
					<h3 className="card-title">Data Room</h3> 
					<br/>
					<p className="card-text">Easily transition to due diligence and seamlessly manage your transactions.</p>
				  </div>
				  <div className="col-md-2 solutions-card"/>
				  <div className="col-md-4 solutions-card">
				  	<hr className="hr-card"/>
					<div className="headword">G</div>
					<h3 className="card-title">Working Group List</h3>
					<br/>
					<p className="card-text">Automate the WGL - advanced deal team connectivity and communications.</p>
				  </div>
				</div>
				<div className="row solutions-row"/>
				<br/>
				<br/>
				<br/>
				<br/>
				<div className="row solutions-row">
					<div className="col-md-4 solutions-card">
						<hr className="hr-card"/>
						<div className="headword">L</div>
						<h3 className="card-title">Legal Documentation Tool</h3>
						<br/>
						<p className="card-text">Unlock your firms institutional knowledge: quickly reference deal precedents (credit agreements, inter-creditor, etc) and accelerate your deal process.</p>
					</div>
					<div className="col-md-2 solutions-card"/>
					<div className="col-md-4 solutions-card">
						<hr className="hr-card"/>
						<div className="headword">T</div>
						<h3 className="card-title">Tombstones</h3>
						<br/>
						<p className="card-text">Showcase closed deals and connect with your deal teams.</p>
					</div>
				</div>
				<div className="row solutions-row"/>
				<br/>
				<br/>
				<br/>
				<br/>
				<div className="row solutions-row">
					<div className="col-md-4 solutions-card">
						<hr className="hr-card"/>
						<div className="headword">M</div>
						<h3 className="card-title">Messaging Platform</h3>
						<br/>
						<p className="card-text">Securely communicate with market participants.</p>
					</div>
					<div className="col-md-2 solutions-card"/>
					<div className="col-md-4 solutions-card">
						<hr className="hr-card"/>
						<div className="headword">C</div>
						<h3 className="card-title">Concourse</h3>
						<br/>
						<p className="card-text">Bookbild community: network, connect, learn.</p>
					</div>
				</div>
				<div className="row solutions-row"/>

			</div>
		    );
	}
}