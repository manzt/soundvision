import React from 'react';
import { connect } from 'react-redux';
import Album from './Album';
import logo from '../logo.svg';
import Playlist from './Playlist'
import axios from 'axios';
import { handleAlbumSelection, handleLibraryImport } from '../actions/index';




class Home extends React.Component {
  componentWillMount(){
    const { importLibrary } = this.props;
    axios.get('/api/albums', {withCredentials: true}).then(function({data}) {
      if (data.success) {
        importLibrary(data.albums)
      }
    })
  }
  render() {
    const { library } = this.props;
    let album, album2, album3;
    if(library[0]) {
      album = library[0].album.album
      album2 = library[1].album.album
      album3 = library[2].album.album
    }
    return (
      <div style={{display: "block", alignText: "center"}}>
        <img
          src={logo}
          className="App-logo"
          alt="logo"
          style={{width: "200px"}}
        />
        {/* <Logo/> */}
        {album? <Album album={album}/> : null}
        {album2? <Album album={album2}/> : null}
        {album3? <Album album={album3}/> : null}
        {/* {library.map(item => <Album album={item.album.album} key={item._id}/>)} */}
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
