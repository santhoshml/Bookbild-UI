import React, { Component }  from 'react';
import TwitterTimeline from 'react-twitter-embedded-timeline';
 
export default class Insights extends Component {
  render() {
    return (
      <div className="container" >
        <TwitterTimeline user="bookbild_inc" />
        <TwitterTimeline widgetId="695868534455275520" chrome="noborders noheader" />
      </div>
    );
  }
}