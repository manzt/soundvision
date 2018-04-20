import React from 'react';
import { connect } from 'react-redux';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
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
  componentWillMount() {
    const { setUser, importLibrary } = this.props;
    axios.get("/api/userInfo").then(function({data}) {
      setUser(data.userInfo.displayName, data.userInfo.photo);
      importLibrary(data.library)
    })
  }
  
  getAlbums() {
    axios.get('/api/library')
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
              onClick={() => this.getAlbums()}/> :
            <div>
              <FlatButton
                label="Update Library"
                primary={true} />
              <FlatButton
                label="Continue"
                secondary={true} />
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
