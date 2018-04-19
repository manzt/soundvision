import React from 'react';
import { connect } from 'react-redux';
import Album from './Album';
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
    let album;
    if(library[0]) {album = library[0].album.album}
    return (
      <div>
        <h1> Home </h1>
        {album? <Album album={album}/> : null}
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
