import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';


class App extends Component {
  componentWillMount(){
    axios.get('/api/albums', {withCredentials: true}).then( function(data) {
      console.log(data)
      if (data.success) {
        console.log(data.albums)
      }
    })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          Frig off
        </p>
      </div>
    );
  }
}

export default App;
