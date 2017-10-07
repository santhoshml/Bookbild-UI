import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Landing extends Component{
    render(){
        console.log('I am in landing');
        return(
            <div>
    {/* <!-- Navigation --> */}
    <a id="menu-toggle" href="#" className="btn btn-dark btn-lg toggle">
      <i className="fa fa-bars"></i>
    </a>
    <nav id="sidebar-wrapper">
      <ul className="sidebar-nav">
        <a id="menu-close" href="#" className="btn btn-light btn-lg pull-right toggle">
          <i className="fa fa-times"></i>
        </a>
        <li className="sidebar-brand">
          <a className="js-scroll-trigger" href="#top">Home</a>
        </li>
        <li>
          <a className="js-scroll-trigger" href="/rvtool">Deal Comparision Tool</a>
        </li>
        <li>
          <a className="js-scroll-trigger" href="/">Login</a>
        </li>
        <li>
          <a className="js-scroll-trigger" href="#about">About</a>
        </li>
        <li>
          <a className="js-scroll-trigger" href="#services">Services</a>
        </li>
        <li>
          <a className="js-scroll-trigger" href="#portfolio">Blog</a>
        </li>
        <li>
          <a className="js-scroll-trigger" href="#contact" onclick={$( "#menu-close").click()}>Contact</a>
        </li>
      </ul>
    </nav>

    {/* <!-- Header --> */}
    <header className="header" id="top">
      <div className="text-vertical-center">
        <h1>BOOKBILD</h1>
        <h3>Middle Market Lending Platform</h3>
        <br/>
        <a href="#about" className="btn btn-dark btn-lg js-scroll-trigger">Find Out More</a>
      </div>
    </header>

    {/* <!-- About --> */}
    <section id="about" className="about">
      <div className="container text-center">
        <h2>Bookbild provides transaction and data solutions for middle market private debt.</h2>
        <p className="lead">Our platform features marketplace access, aggregate data analytics, and custom transaction diligence support..</p>
      </div>
      {/* <!-- /.container --> */}
    </section>

    {/* <!-- Services --> */}
    <section id="services" className="services bkbd-primary text-white">
      <div className="container">
        <div className="row text-center">
          <div className="col-lg-10 mx-auto">
            <h2>Our Services</h2>
            <hr className="small"/>
            <div className="row">
              <div className="col-md-3 col-sm-6">
                <div className="service-item">
                  <span className="fa-stack fa-4x">
                    <i className="fa fa-circle fa-stack-2x"></i>
                    <i className="fa fa-cloud fa-stack-1x text-primary"></i>
                  </span>
                  <h4>
                    <strong>Products</strong>
                  </h4>
                  <p></p>
                  <a href="#" className="btn btn-light">Learn More</a>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="service-item">
                  <span className="fa-stack fa-4x">
                    <i className="fa fa-circle fa-stack-2x"></i>
                    <i className="fa fa-compass fa-stack-1x text-primary"></i>
                  </span>
                  <h4>
                    <strong>Deal Comp. Tool</strong>
                  </h4>
                  <p></p>
                  <a href="#" className="btn btn-light">Learn More</a>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="service-item">
                  <span className="fa-stack fa-4x">
                    <i className="fa fa-circle fa-stack-2x"></i>
                    <i className="fa fa-flask fa-stack-1x text-primary"></i>
                  </span>
                  <h4>
                    <strong>Blog</strong>
                  </h4>
                  <p></p>
                  <a href="#" className="btn btn-light">Learn More</a>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="service-item">
                  <span className="fa-stack fa-4x">
                    <i className="fa fa-circle fa-stack-2x"></i>
                    <i className="fa fa-shield fa-stack-1x text-primary"></i>
                  </span>
                  <h4>
                    <strong>About Us</strong>
                  </h4>
                  <p></p>
                  <a href="#" className="btn btn-light">Learn More</a>
                </div>
              </div>
            </div>
            {/* <!-- /.row (nested) --> */}
          </div>
          {/* <!-- /.col-lg-10 --> */}
        </div>
        {/* <!-- /.row --> */}
      </div>
      {/* <!-- /.container --> */}
    </section>


    {/* <!-- Footer --> */}
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-lg-10 mx-auto text-center">
            <h4>
              <strong>Bookbild</strong>
            </h4>
            {/* <!-- <p>455 Market St.
              <br>San Francisco, CA 90210</p> --> */}
            <ul className="list-unstyled">
              {/* <li>
                <!-- <i className="fa fa-phone fa-fw"></i>
                (415) 456-7890</li> --> */}
              <li>
                <i className="fa fa-envelope-o fa-fw"></i>
                <a href="mailto:info@bookbild.com">info@bookbild.com</a>
              </li>
            </ul>
            <br/>
            <ul className="list-inline">
              <li className="list-inline-item">
                <a href="https://twitter.com/bookbild_inc" className="btn btn-default btn-lg"><i className="fa fa-twitter fa-fw"></i> <span className="network-name">Twitter</span></a>
              </li>
              <li className="list-inline-item">
                <a href="https://www.linkedin.com/company/bookbild-inc." className="btn btn-default btn-lg"><i className="fa fa-linkedin" aria-hidden="true"></i> <span className="network-name">LinkedIn</span></a>
              </li>
              <li className="list-inline-item">
                <a href="https://angel.co/bookbild" className="btn btn-default btn-lg"><i className="fa fa-angellist" aria-hidden="true"></i> <span className="network-name">AngelList</span></a>
              </li>
            </ul>
            <hr className="small"/>
            <p className="text-muted">Copyright &copy; Bookbild Inc. 2017</p>
          </div>
        </div>
      </div>

      <a id="to-top" href="#top" className="btn btn-dark btn-lg js-scroll-trigger">
        <i className="fa fa-chevron-up fa-fw fa-1x"></i>
      </a>
    </footer>                
            </div>
        );
    }
}