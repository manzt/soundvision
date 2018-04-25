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

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

class Track extends React.Component {
  render() {
    const { track, songSelect } = this.props;
    const id = guidGenerator();
    return (
      <ListItem
        className="track_list"
        innerDivStyle={innerStyle}
        disableTouchRipple={true}
        //send track id and other info to playlist
        onClick={() => { console.log(track); console.log(id); return songSelect({...track, uniqID: guidGenerator()}) }}>
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
