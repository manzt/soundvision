import React from 'react';
import Track from './Track';

export default class Album extends React.Component {
  render() {
    const { album } = this.props;
    return (
        <div className="album">
          <img alt="" src={album.images[1].url} height="100" width="100"/>
          <div className="title">
            <b>
              {album.name} ({album.release_date.slice(0,4)})
            </b><br/>
              {album.artists[0].name}
          </div>
          <div>
            {album.tracks.items.map(track => <Track track={track} key={track.id}/>)}
          </div>
        </div>
    )
  }
}
