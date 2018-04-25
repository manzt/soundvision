import React from 'react';
import { connect } from 'react-redux';
import { CircularProgress } from 'material-ui';
import {Card, CardTitle} from 'material-ui/Card';
import logo from '../logo.svg'

import { handleLibraryImport } from '../actions/index';
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
  async componentWillMount() {
    this.updateLibrary();
  }

  async updateLibrary() {
    this.setState({loading: true});
    try {
      await axios.get('/api/updateLibrary')
      let { data } = await axios.get('/api/albums')
      this.props.importLibrary(data.library);
      this.props.app.setState({mode: 'home'})
    } catch (error) {
      console.log(error)
    }
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
        <Card>
        <CardTitle
          title={`${welcomeString}${this.props.displayName.split(" ")[0]}!`}
          subtitle={this.props.library.length === 0 ?
            "Preparing your music library. This could take a few minutes..." :
            "Updating your music Library. This should take a few minutes..."
          }
        />
        {this.state.loading ? <CircularProgress /> : null}
      </Card>
    </div>
  }
}

const mapStateToProps = ({ displayName, photo, library }) => ({ displayName, photo, library });

const mapDispatchToProps = dispatch => ({
  importLibrary: (library) => {
    dispatch(handleLibraryImport(library));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(GetLibrary);
