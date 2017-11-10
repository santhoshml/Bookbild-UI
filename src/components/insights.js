import React, { Component }  from 'react';
import TwitterTimeline from 'react-twitter-embedded-timeline';
import Header from './header';

export default class Insights extends Component {
  render() {
    return (
      <div>
        <Header/>
        <div className="container main-container-left-padding" >
          <TwitterTimeline user="bookbild_inc"/>
        </div>
      </div>
    );
  }
}