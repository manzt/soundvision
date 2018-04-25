import React from 'react';
import { connect } from 'react-redux';
import { Paper, TextField, List, Snackbar, IconButton } from 'material-ui';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import FileUpload from 'material-ui/svg-icons/file/file-upload';
import PlaylistTrack from './PlaylistTrack';
import axios from 'axios';
import { handleClearSongSelection } from '../actions/index';

const styles = {
  icon: {
    width: 20,
    height: 20,
    fill: '#636363',
    opacity: '0.3'
  },
  button: {
    width: 25,
    height: 25,
    padding: 0,
  },
};

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      open: false
    }
  }
  createPlaylist = async () => {
    let tracks = this.props.songSelection.map(track => track.id);
    try {
      let success = await axios.post('/api/createPlaylist', {tracks: tracks, name: this.state.title});
      if (success) {
        this.props.clearSongSelection();
        this.setState({
          open: true,
          title: ""
        })
      }
    } catch (error) {
      console.log('no playlist sent!')
    }
  }

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Paper id="playlist" zDepth={1}>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <TextField
              value={this.state.title}
              hintText='New Playlist'
              underlineShow={false}
              onChange={(e) => this.setState({ title: e.target.value })}
            />
            <div>
              <IconButton
                tooltip='UPDATE LIBRARY'
                tooltipPosition='top-left'
                iconStyle={styles.icon}
                onClick={() => this.props.app.setState({mode: 'getLibrary'})}
                >
                <Refresh/>
              </IconButton>
              <IconButton
                tooltip='CREATE PLAYLIST'
                tooltipPosition='top-right'
                iconStyle={styles.icon}
                onClick={this.createPlaylist} >
                <FileUpload/>
              </IconButton>
            </div>
          </div>
          <div className='tracks'>
            <List>
             {this.props.songSelection.map(item => <PlaylistTrack track={item} key={item.id}/>)}
            </List>
          </div>
        </Paper>
        <Snackbar
          open={this.state.open}
          message="Created your soundvision playlist"
          contentStyle={{textAlign: 'center'}}
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ songSelection }) => ({ songSelection });

const mapDispatchToProps = dispatch => ({
  clearSongSelection: () => {
    dispatch(handleClearSongSelection());
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
