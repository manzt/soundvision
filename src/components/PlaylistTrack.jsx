import React from 'react';
import { ListItem, IconButton} from 'material-ui';
import { connect } from 'react-redux';
import { handleSongRemove } from '../actions/index';

//import AddIcon from 'material-ui/svg-icons/content/add';
import ClearIcon from 'material-ui/svg-icons/content/clear';

const innerStyle = {
  padding: "5px",
  fontSize: '10px',
  borderBottom: 'solid rgba(160, 160, 160, 0.87) 0.5px',
  display: "flex",
  justifyContent: 'space-between'
}

const smallIcon = {
  width: 15,
  height: 15,
  fill: '#636363',
  opacity: '0.3',
}

const buttonStyle = {
  width: 10,
  height: 10,
  padding: 0,
  display: "flex",
  justifyContent: "center",
  alignContent: "center"
}

class PlaylistTrack extends React.Component {
  render() {
    const { track, removeSong } = this.props;
    return (
      <ListItem
        className="tracks"
        innerDivStyle={innerStyle}
        onClick={() => removeSong(track)}>
         <span>{track.name} - {track.artists[0].name}</span>
         <IconButton
           style={buttonStyle}
           iconStyle={smallIcon}>
            <ClearIcon/>
         </IconButton>
      </ListItem>
    )
  }
}


const mapDispatchToProps = dispatch => ({
  removeSong: (song) => {
    dispatch(handleSongRemove(song));
  }
})

export default connect(null, mapDispatchToProps)(PlaylistTrack);
