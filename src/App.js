import React from 'react';
import Home from './components/Home';
import Login from './components/Login';
import axios from 'axios';
import GetLibrary from './components/GetLibrary';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { connect } from 'react-redux';
import { handleLibraryImport, handleUserInfo } from './actions/index';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'unknown'
    }
  }
  async componentWillMount() {
    const { setUser, importLibrary } = this.props;
    try {
      let res = await axios.get('/api/isAuthenticated')
      res.data.loggedIn ? this.setState({mode: 'loggedIn'}) : this.setState({mode: 'loggedOut'});
      if (this.state.mode === 'loggedIn') {
        let { data } = await axios.get('/api/userInfo')
        setUser(data.userInfo.displayName, data.userInfo.photo);
        importLibrary(data.library)
        this.props.library.length === 0 ?
          this.setState({mode: 'getLibrary'}) :
          this.setState({mode: 'home'});
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (<MuiThemeProvider>
      {this.state.mode === 'unknown' ? null :
      this.state.mode === 'loggedOut' ? (<Login />) :
      this.state.mode === 'home' ? (<Home app={this}/> ) :
      this.state.mode === 'getLibrary' ? (<GetLibrary app={this}/>) : null}
    </MuiThemeProvider>)
  }
}

const mapStateToProps = ({ library }) => ({ library });
const mapDispatchToProps = dispatch => ({
  setUser: (displayName, photo) => {
    dispatch(handleUserInfo(displayName, photo));
  },
  importLibrary: (library) => {
    dispatch(handleLibraryImport(library))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
