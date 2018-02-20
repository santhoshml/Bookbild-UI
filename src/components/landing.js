import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './header';

export default class Landing extends Component {
    render(){
        return(
          <div>
            <Header/>
            <div>

              {/* <!-- Header --> */}
              <header className="header" id="top">
                <div className="text-vertical-center">
                  <h1 style={{marginBottom: '50px', color : 'white'}}>BOOKBILD</h1>
                  <h3 style={{color : 'white'}}>Enterprise Software for Private Debt Transactions</h3>
                  <br/>
                  <br/>
                  <br/>
                  <span className="index-bottom-text">Our platform features a marketplace supported by blockchain infrastructure, <br/>aggregate data analytics, and custom transaction diligence support</span>
                </div>
              </header>

            


              {/* <!-- Footer --> */}
              <footer>
                <div className="container">
                  <div className="row">
                    <div className="mx-auto text-center">
                      <br/>
                      <div>
                        <div className="cust-footer-left footer-data">
                          <span className="indent"><a href="/aboutUs ">Our Team</a></span>
                          <span className="indent"><a href="/contactUs">Contact Us</a></span>
                          <span className="indent"><a href="/termsAndConditions">Terms &amp; Conditions</a></span>
                          <span className="indent"><a href="/privacyPolicy ">Privacy Policy</a></span>
                        </div>
                        <br/>
                        <div className="cust-footer-right footer-data">
                          <span className="indent-after">
                            <a href="https://twitter.com/bookbild_inc" className="btn btn-default btn-lg">
                              <i className="fa fa-twitter fa-fw"></i> <span className="network-name">Twitter</span>
                            </a>
                          </span>
                          <span className="indent-after">
                            <a href="https://www.linkedin.com/company/bookbild-inc." className="btn btn-default btn-lg">
                              <i className="fa fa-linkedin" aria-hidden="true"></i> <span className="network-name">LinkedIn</span>
                            </a>
                          </span>
                          <span className="indent-after">
                            <a href="https://angel.co/bookbild" className="btn btn-default btn-lg">
                              <i className="fa fa-angellist" aria-hidden="true"></i> <span className="network-name">AngelList</span>
                            </a>
                          </span>
                        </div>
                      </div>
                      <br/>
                      <div>
                        <p className="text-muted">Copyright &copy; Bookbild Inc. {new Date().getFullYear()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </footer>                
            </div>
          </div>
        );
    }
}