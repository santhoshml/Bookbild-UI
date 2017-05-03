import React, { Component } from 'react';
import {Link} from 'react-router';

export default class App extends Component {
  render() {
    return (
      <div container p-y-1>
        {this.props.children}
      </div>
    );
  }
}
