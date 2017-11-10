import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './header';

export default class AboutUs extends Component {
    render(){
        console.log('I am in aboutUs');
        return(
          <div>
            <Header/>
            <div className="container main-container-left-padding">
            <div className="row">
              <div className="col-md-6 portfolio-item">
                <img className="img-portfolio img-fluid img-circle aboutus-img-height" src="../images/bobby_aboutus_pic.jpg"/>
              </div>
              <div className="col-md-6">
                <a href="https://www.linkedin.com/in/bobbygrant"><h3>Bobby Grant, Founder and CEO</h3></a>
                <br/>
                <p className="about-us">
                  Bobby is the CEO of Bookbild. Prior to founding Bookbild, Bobby worked at Cowen and Company where he was focused on middle market private debt transactions in the TMT vertical. Prior to joining Cowen, Bobby executed leveraged loan transactions across sectors as a member of the loan origination team covering middle market private equity firms at Wells Fargo Foothill from 2007 – 2011.
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12"></div>
              <p className="about-us">
                Prior to joining Wells Fargo in 2007, Bobby worked as a leveraged finance associate on the energy team at UBS Investment Bank. Prior to joining UBS, Bobby worked for Morgan Stanley, primarily in its Tokyo office, where he was a credit trader from 2000 – 2004.  Bobby spent limited time in various other roles at Morgan Stanley both in its London and New York offices.
              </p>
              <br/>
              <p className="about-us">
                Bobby received an MBA from the Columbia Business School, and a BS in Business Administration from the University of California at Berkeley.
              </p>
            </div>
            <br/>
            <br/>
            <hr/>
            <div className="row">
              <div className="col-md-6">
              <a href="https://www.linkedin.com/in/santhosh-maila-2074b72"><h3>Santhosh Maila, Co-Founder and CTO</h3></a>
              <br/>
              <p className="about-us">
                Santhosh is leading the development of Bookbild’s infrastructure and building the innovations powering our platform. He brings over 15 years of experience designing and implementing large-scale, distributed applications and systems.
              </p>
              </div>
              <div className="col-md-6 portfolio-item">
                <img className="img-portfolio img-fluid img-circle aboutus-img-height" src="../images/santhosh_aboutus_pic.jpg"/>
              </div>
          </div>
          <div className="row">
            <div className="col-md-12"></div>
            <p className="about-us">
              Prior to joining Bookbild, Santhosh initiated and led the development of Nesterr Inc., a startup in InsureTech to help insurance customers compare and save on their insurance Premium. Santhosh was a member of the MyCloud at Western Digital where he was responsible for the architecture and design of Cloud Services for the Private Cloud. Prior to that, he held contract software development roles at Wells Fargo and Charles Schwab. Santhosh began his career as a software engineer at AT&T.
            </p>
            <br/>
            <p className="about-us">
              A native of Hyderabad, India, Santhosh received a BS in Electrical Engineering with Honors from JNTU and a MS in Computer Science from the Louisiana Tech University.
            </p>
          </div>
          </div>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
        </div>
        );
    }
}