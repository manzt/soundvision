import React from 'react';
import { connect } from 'react-redux';
import { Paper, TextField, List, Snackbar, IconButton } from 'material-ui';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import FileUpload from 'material-ui/svg-icons/file/file-upload';
import RadioButtonChecked from 'material-ui/svg-icons/toggle/radio-button-checked';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';

import PlaylistTrack from './PlaylistTrack';
import axios from 'axios';
import { handleClearSongSelection, handleAlbumSelection } from '../actions/index';
import * as d3 from 'd3';

const styles = {
  icon: {
    width: 18,
    height: 18,
  },
  icon2: {
    width: 16,
    height: 16,
    paddingBottom: 1
  },
};
const iconColor = '#d5d5d5';
const checkedColor = '#b6a6cd';
const hoverColor = '#24cf5f';

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
              underlineFocusStyle	={{'borderBottom': 'none'}}
              onChange={(e) => this.setState({ title: e.target.value })}
            />
            <div>
              <IconButton
                iconStyle={styles.icon2}
                disableTouchRipple={true}
                onClick={() => {
                  d3.selectAll(".selected")
                    .classed("selected", false)
                    .style('fill-opacity', "0.5")
                    .style('stroke-width', "0")
                  //sends dispatch to update album selection to an empty array
                  this.props.albumSelect(d3.selectAll(".selected").data());
                }}
                >
                {this.props.albumSelection.length === 0 ?
                  <RadioButtonUnchecked
                    color={iconColor}
                  /> :
                  <RadioButtonChecked
                    color={checkedColor}
                  />}
              </IconButton>
              <IconButton
                // tooltip='UPDATE LIBRARY'
                // tooltipPosition='top-right'
                // tooltipStyles={{fontSize: '8px'}}
                disableTouchRipple={true}
                iconStyle={styles.icon}
                hoveredStyle={styles.hover}
                onClick={() => {
                  this.props.albumSelect([]);
                  this.props.clearSongSelection();
                  this.props.app.setState({mode: 'getLibrary'})
                }}
                >
                <Refresh
                  color={iconColor}
                  hoverColor={checkedColor}
                />
              </IconButton>
              <IconButton
                // tooltip='CREATE PLAYLIST'
                // tooltipPosition='top-right'
                // tooltipStyles={{fontSize: '8px'}}
                iconStyle={styles.icon}
                disableTouchRipple={true}
                hoveredStyle={{color: checkedColor}}
                //style={styles.button}
                onClick={this.createPlaylist} >
                <FileUpload
                  color={iconColor}
                  hoverColor={checkedColor}
                />
              </IconButton>
            </div>
          </div>
          <div className='tracks'>
            <List>
             {this.props.songSelection.map(item => <PlaylistTrack track={item} key={item.uniqID}/>)}
            </List>
          </div>
        </Paper>
        <Snackbar
          open={this.state.open}
          message="Created your SOUNDVISION playlist"
          contentStyle={{textAlign: 'center'}}
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ songSelection, albumSelection }) => ({ songSelection, albumSelection });

const mapDispatchToProps = dispatch => ({
  clearSongSelection: () => {
    dispatch(handleClearSongSelection());
  },
  albumSelect: (albumSelection) => {
    dispatch(handleAlbumSelection(albumSelection));
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
