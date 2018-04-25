import React from 'react';
import { ListItem} from 'material-ui';
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

const buttonStyle = {
  width: 15,
  height: 15,
  padding: 5,
}

const iconColor = '#d5d5d5';
const hoverColor = '#b6a6cd'

class PlaylistTrack extends React.Component {
  render() {
    const { track, removeSong } = this.props;
    return (
      <ListItem
        className="tracks"
        innerDivStyle={innerStyle}
        disabled={true}
        rightIconButton={
          <ClearIcon
            color={iconColor}
            hoverColor={hoverColor}
            onClick={() => removeSong(track)}
            style={buttonStyle}/>}
            >
         <span>{track.name} - {track.artists[0].name}</span>
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
