import React from 'react';
import { connect } from 'react-redux';

import {Card, CardActions, CardTitle} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import logo from '../logo.svg'

import { handleLibraryImport, handleUserInfo } from '../actions/index';
import axios from 'axios';

const style = {
  display: "block",
  textAlign: "center",
  width: "500px",
  marginTop: "30%"
}

class GetLibrary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
  }
  componentWillMount() {
    const { setUser, importLibrary } = this.props;
    axios.get("/api/userInfo").then(({data}) => {
      setUser(data.userInfo.displayName, data.userInfo.photo);
      importLibrary(data.library)
    })
  }

  getAlbums() {
    this.setState({loading: true});
    axios.get('/api/getAlbums').then((data) => {
      this.props.app.setState({mode: 'home'})
    }).catch(function(err){ console.log(err) });
  }

  render() {
    let welcomeString = this.props.library.length === 0 ? 'Welcome, ' : 'Welcome back, ';
    return <div style={style}>
        <img
          src={logo}
          className="App-logo"
          alt="logo"
          style={{width: "500px"}}
        />
      {this.state.loading ? <div>Loading</div> : null}
      {this.props.displayName === 'unknown' ? null :
        <Card>
        <CardTitle
          title={`${welcomeString}${this.props.displayName.split(" ")[0]}!`}
          subtitle="Prepare to explore your music listening history."
        />
        <CardActions>
          {this.props.library.length === 0 ?
            <FlatButton
              label="Import Library"
              primary={true}
              fullWidth={true}
              disableTouchRipple={true}
              onClick={() => this.getAlbums()} /> :
            <div>
              <FlatButton
                label="Update Library"
                primary={true}
                onClick={() => this.getAlbums()} />
              <FlatButton
                label="Continue without Update"
                onClick={() => this.props.app.setState({mode: 'home'})} />
            </div>}
        </CardActions>
      </Card>
      }
    </div>
  }
}

const mapStateToProps = ({ displayName, photo, library }) => ({ displayName, photo, library });

const mapDispatchToProps = dispatch => ({
  setUser: (displayName, photo) => {
    dispatch(handleUserInfo(displayName, photo));
  },
  importLibrary: (library) => {
    dispatch(handleLibraryImport(library));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(GetLibrary);
