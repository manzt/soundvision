import React from 'react';
import Track from './Track';
import { Paper, List } from 'material-ui';

export default class Album extends React.Component {
  render() {
    const { album } = this.props;
    return (
        <Paper className="album">
          <div>
            <Paper style={{padding: "5px"}}>
              <img alt="" src={album.images[1].url} height="150" width="150"/>
            </Paper>
          </div>
          <div className="info">
            <b>{album.title} ({album.release_date.getFullYear()})</b><br/>
            <span>{album.artists[0].name}</span>
            <List>
              {album.tracks.map(track => <Track track={track} key={track.id}/>)}
            </List>
          </div>
        </Paper>
    )
  }
}
