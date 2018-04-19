import React from 'react';
import { connect } from 'react-redux';

import { ListItem } from 'material-ui';
import { handleSongSelection } from '../actions/index';

const innerStyle = {
  padding: "5px",
  fontSize: '10px',
  borderBottom: 'solid rgba(160, 160, 160, 0.87) 0.5px',
}

const numberStyle = {
  color: "rgba(160, 160, 160, 0.87)"
}
class Track extends React.Component {
  render() {
    const { track, songSelect } = this.props;
    return (
      <ListItem
        className="track_list"
        innerDivStyle={innerStyle}
        //send track id and other info to playlist
        onClick={() => songSelect(track)}>
        <span style={numberStyle}>{track.track_number}.</span> {track.name}
      </ListItem>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  songSelect: (songSelection) => {
    dispatch(handleSongSelection(songSelection));
  }
});

export default connect(null, mapDispatchToProps)(Track);
