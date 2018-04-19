import React from 'react';
import { connect } from 'react-redux';
import Album from './Album';
import axios from 'axios';
import { handleAlbumSelection, handleSongSelection, handleLibraryImport } from '../actions/index';

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
    return (
      <div>
        <h1> Home </h1>
        {library.map(item => <Album album={item.album.album} key={item._id}/>)}
      </div>
    )
  }
}

const mapStateToProps = ({ library, albumSelection, songSelection }) => ({ library, albumSelection, songSelection });

const mapDispatchToProps = dispatch => ({
  albumSelect: (albumSelection) => {
    dispatch(handleAlbumSelection(albumSelection));
  },
  songSelect: (songSelection) => {
    dispatch(handleSongSelection(songSelection));
  },
  importLibrary: (library) => {
    dispatch(handleLibraryImport(library));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
