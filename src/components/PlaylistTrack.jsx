import React from 'react';
import { ListItem } from 'material-ui';

const innerStyle = {
  padding: "5px",
  fontSize: '10px',
  borderBottom: 'solid rgba(160, 160, 160, 0.87) 0.5px',
}

const numberStyle = {
  color: "rgba(160, 160, 160, 0.87)"
}

export default class PlaylistTrack extends React.Component {
  render() {
    const { track } = this.props;
    return (
      <ListItem
        className="track_list"
        innerDivStyle={innerStyle}>
        {/* <span style={numberStyle}>{track.track_number}.</span> */}
         {track.name}
      </ListItem>
    )
  }
}
