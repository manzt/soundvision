import React from 'react';
import { connect } from 'react-redux';

import { Paper, TextField, List, FlatButton } from 'material-ui';
import PlaylistAddCheck from 'material-ui/svg-icons/av/playlist-add-check';

import PlaylistTrack from './PlaylistTrack';

// const innerStyle = {
//   padding: "5px",
//   fontSize: '10px',
//   borderBottom: 'solid rgba(160, 160, 160, 0.87) 0.5px',
//   display: "flex",
//   justifyContent: 'space-between'
// }

class Playlist extends React.Component {
  render() {
    const { songSelection } = this.props;
    return (
        <Paper id="playlist">
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <TextField
              hintText='New Playlist'
              underlineShow={false}
            />
            <FlatButton
              label="create playlist"
              labelPosition="before"
              icon={<PlaylistAddCheck/>}
            />
          </div>
          <div className='tracks'>
            <List>
             {songSelection.map(item => <PlaylistTrack track={item} key={item.id}/>)}
            </List>
          </div>
        </Paper>
    )
  }
}

const mapStateToProps = ({ songSelection }) => ({ songSelection });

export default connect(mapStateToProps, null)(Playlist);
