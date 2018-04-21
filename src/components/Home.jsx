import React from 'react';
import { connect } from 'react-redux';
import Album from './Album';
import logo from '../logo.svg';
import Playlist from './Playlist';
import Visual from './Visual';
import axios from 'axios';
import { handleAlbumSelection, handleLibraryImport } from '../actions/index';
//import { CircularProgress } from 'material-ui';

class Home extends React.Component {
  componentWillMount(){
    const { importLibrary } = this.props;
    if (this.props.library.length === 0) {
      axios.get('/api/albums').then(({data}) => {
        if (data.success) importLibrary(data.albums)
      })
    }
  }
  render() {
    return (
      <div style={{display: "block", alignText: "center"}}>
        <img
          src={logo}
          className="App-logo"
          alt="logo"
          style={{width: "200px"}}
        />
        <Visual />
          {this.props.albumSelection.map(item => <Album album={item} key={item.id}/>)}
          <Playlist/>
      </div>
    )
  }
}

const mapStateToProps = ({ library, albumSelection }) => ({ library, albumSelection });

const mapDispatchToProps = dispatch => ({
  importLibrary: (library) => {
    dispatch(handleLibraryImport(library));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
