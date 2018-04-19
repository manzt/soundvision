import React from 'react';
import { connect } from 'react-redux';

import { Paper, TextField, List } from 'material-ui';
import PlaylistTrack from './PlaylistTrack';

class Playlist extends React.Component {
  render() {
    const { songSelection } = this.props;
    return (
        <Paper id="playlist">
          <div><TextField/></div>
          <List>
            {songSelection.map(item => <PlaylistTrack track={item}/>)}
          </List>
        </Paper>
    )
  }
}

const mapStateToProps = ({ songSelection }) => ({ songSelection });

export default connect(mapStateToProps, null)(Playlist);
