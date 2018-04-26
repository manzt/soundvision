import React from 'react';
import Home from './components/Home';
import Login from './components/Login';
import axios from 'axios';
import GetLibrary from './components/GetLibrary';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { connect } from 'react-redux';
import { handleLibraryImport, handleUserInfo, handleModeChange } from './actions/index';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'unknown'
    }
  }
  async componentDidMount() {
    const { setUser, importLibrary, modeChange } = this.props;
    try {
      let { data } = await axios.get('/api/isAuthenticated');
      console.log('isauth', data)
      if (data.loggedIn) {
        console.log('inside logged in')
        setUser(data.displayName, data.photo);
        importLibrary(data.library)
        this.props.library.length === 0 ? modeChange('getLibrary') : modeChange('home');
      } else { modeChange('loggedOut') }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (<MuiThemeProvider>
      {this.props.mode === 'unknown' ? null :
      this.props.mode === 'loggedOut' ? (<Login />) :
      this.props.mode === 'home' ? (<Home /> ) :
      this.props.mode === 'getLibrary' ? (<GetLibrary />) : null}
    </MuiThemeProvider>)
  }
}

const mapStateToProps = ({ library, mode }) => ({ library, mode });
const mapDispatchToProps = dispatch => ({
  setUser: (displayName, photo) => {
    dispatch(handleUserInfo(displayName, photo));
  },
  importLibrary: (library) => {
    dispatch(handleLibraryImport(library));
  },
  modeChange: (mode) => {
    dispatch(handleModeChange(mode));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
