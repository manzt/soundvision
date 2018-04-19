import React from 'react';
import { connect } from 'react-redux';
import Home from './components/Home';
import Login from './components/Login';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

let App = ({ loggedIn }) => {
  return (<MuiThemeProvider>
    {!loggedIn ? (<Login />) : (<Home/>)}
  </MuiThemeProvider>)
};

const mapStateToProps = ({ loggedIn }) => ({ loggedIn });

App = connect(mapStateToProps, null)(App);

export default App;
