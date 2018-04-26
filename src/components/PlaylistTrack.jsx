import React from 'react';
import { ListItem} from 'material-ui';
import { connect } from 'react-redux';
import { handleSongRemove } from '../actions/index';

//import AddIcon from 'material-ui/svg-icons/content/add';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import Done from 'material-ui/svg-icons/action/done';

const innerStyle = {
  padding: "5px",
  fontSize: '10px',
  borderBottom: 'solid rgba(160, 160, 160, 0.87) 0.5px',
  display: "flex",
  // justifyContent: 'space-between',
}

const buttonStyle = {
  width: 15,
  height: 15,
  padding: 5,
  pointerEvents: 'none'
}

const trackStyle = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginRight: '10px'
}

const iconColor = '#d5d5d5';
const hoverColor = '#f7f7f7';
const checkedColor = '#b6a6cd';
//const hoverColor = '#ededed';


class PlaylistTrack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  };
  render() {
    const { track, removeSong } = this.props;
    return (
      <ListItem
        className="tracks"
        innerDivStyle={innerStyle}
        hoverColor={hoverColor}
        onMouseOver={() => this.setState({hover: true})}
        onMouseOut={() => this.setState({hover: false})}
        onClick={() => removeSong(track)}
        disableTouchRipple={true}
        rightIconButton={this.state.hover ?
          <ClearIcon
            color={checkedColor}
            style={buttonStyle}/> :
          <Done
            color={iconColor}
            style={buttonStyle}/>}>
         <div style={{...trackStyle, width: '200px'}}>{track.name}</div>
         <div style={{...trackStyle, width: '150px'}}>{track.artists[0].name}</div>
         <div style={{...trackStyle, width: '150px'}}>{track.album}</div>
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
