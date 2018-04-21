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
    // const { library } = this.props;
    // let album, album2, album3;
    // if(library[0]) {
    //   album = library[0].album
    //   album2 = library[1].album
    //   album3 = library[2].album
    // }
    // console.log(library)
    return (
      <div style={{display: "block", alignText: "center"}}>
        <img
          src={logo}
          className="App-logo"
          alt="logo"
          style={{width: "200px"}}
        />
        <Visual />
          {/* {library.length === 0 ? <CircularProgress style={{width: "100%"}}/> : null} */}
          {/* {album? <Album album={album}/> : null}
          {album2? <Album album={album2}/> : null}
          {album3? <Album album={album3}/> : null} */}
          {/* {this.props.albumSelection.map(item => <Album album={item.album} key={item._id}/>)} */}
          <Playlist/>
      </div>
    )
  }
}

const mapStateToProps = ({ library, albumSelection }) => ({ library, albumSelection });

const mapDispatchToProps = dispatch => ({
  albumSelect: (albumSelection) => {
    dispatch(handleAlbumSelection(albumSelection));
  },
  importLibrary: (library) => {
    dispatch(handleLibraryImport(library));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
