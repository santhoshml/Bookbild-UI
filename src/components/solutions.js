import React, {Component} from 'react';
import { Link } from "react-router-dom";
import Header from './header';

export default class Solutions extends Component{
					// <h1 className="solutions-title">Our Solutions</h1>
	render(){

		return (
			<div>
				<Header/>
				<div className="container" >



					<br/>
					<div className="row solutions-row">
						<div className="col-md-1 solutions-card"/>
						<div className="col-md-4 solutions-card">
							<div className="headword"><i className="fa fa-exchange" aria-hidden="true"></i></div>
							<h3 className="card-title">Middle Market Lending Platform</h3>
							<br/>
							<p className="card-text">Single access point for middle market loan transactions supported by blockchain infrastructure.</p> 
							<p className="card-text">Enhanced transaction discovery - pre-qualified deal flow tailored to your unique criteria.</p>
						</div>
						<div className="col-md-2 solutions-card"/>
						<div className="col-md-4 solutions-card">
							<div className="headword"><i className="fa fa-bar-chart" aria-hidden="true"></i></div>
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
					<div className="col-md-1 solutions-card"/>
					<div className="col-md-4 solutions-card">
						<div className="headword"><i className="fa fa-table" aria-hidden="true"></i></div>
						<h3 className="card-title">Data Room</h3> 
						<br/>
						<p className="card-text">Easily transition to due diligence and seamlessly manage your transactions.</p>
					</div>
					<div className="col-md-2 solutions-card"/>
					<div className="col-md-4 solutions-card">
						<div className="headword"><i className="fa fa-users" aria-hidden="true"></i></div>
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
						<div className="col-md-1 solutions-card"/>
						<div className="col-md-4 solutions-card">
							<div className="headword"><i className="fa fa-file" aria-hidden="true"></i></div>
							<h3 className="card-title">Legal Documentation Tool</h3>
							<br/>
							<p className="card-text">Unlock your firms institutional knowledge: quickly reference deal precedents (credit agreements, inter-creditor, etc) and accelerate your deal process.</p>
						</div>
						<div className="col-md-2 solutions-card"/>
						<div className="col-md-4 solutions-card">
							<div className="headword"><i className="fa fa-trophy" aria-hidden="true"></i></div>
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
						<div className="col-md-1 solutions-card"/>
						<div className="col-md-4 solutions-card">
							<div className="headword"><i className="fa fa-comments-o" aria-hidden="true"></i></div>
							<h3 className="card-title">Messaging Platform</h3>
							<br/>
							<p className="card-text">Securely communicate with market participants</p>
						</div>
						<div className="col-md-2 solutions-card"/>
						<div className="col-md-4 solutions-card">
							<div className="headword"><i className="fa fa-leanpub" aria-hidden="true"></i></div>
							<h3 className="card-title">Concourse</h3>
							<br/>
							<p className="card-text">Bookbild community: network, connect, learn.</p>
						</div>
					</div>
					<div className="row solutions-row"/>

				</div>
				<br/>
				<br/>
				<br/>
				<br/>
				<br/>
				<br/>
				<br/>				
			</div>
		    );
	}
}