import React from 'react';
import { connect } from 'react-redux';
import Home from './components/Home';
import Login from './components/Login';
import axios from 'axios';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'unknown'
    }
  }
  componentWillMount() {
    axios.get('/api/isAuthenticated').then(res => {
      console.log(res.data.loggedIn)
      res.data.loggedIn ? this.setState({mode: 'loggedIn'}) : this.setState({mode: 'loggedOut'});
    })
  }
  render() {
    return (<MuiThemeProvider>
      {this.state.mode === 'unknown' ? null :
      this.state.mode === 'loggedIn' ? (<Home/>) : (<Login />) }
    </MuiThemeProvider>)
  }
}
