import React from 'react';
import { connect } from 'react-redux';
import Home from './components/Home';
import Login from './components/Login';

let App = ({ loggedIn }) => {
  return (<div>
    {!loggedIn ? (<Login />) : (<Home/>)}
  </div>)
};

const mapStateToProps = ({ loggedIn }) => ({ loggedIn });

App = connect(mapStateToProps, null)(App);

export default App;
