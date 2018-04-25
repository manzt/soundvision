import React from 'react';
import { connect } from 'react-redux';
import Album from './Album';
import logo from '../logo.svg';
import Playlist from './Playlist';
import Visual from './Visual';

import FileUpload from 'material-ui/svg-icons/file/file-upload';
import { IconButton } from 'material-ui';

const styles = {
  icon: {
    width: 10,
    height: 10,
    fill: '#636363',
    opacity: '0.3'
  },
  button: {
    width: 10,
    height: 10,
    padding: 0,
  },
};

class Home extends React.Component {
  render() {
    return (
      <div style={{display: "block", alignText: "center"}}>
        <div>
          <img
            src={logo}
            className="App-logo"
            alt="logo"
            style={{width: "200px"}}
          />
        </div>
        {this.props.library.length === 0 ? null : <Visual />}
        <Playlist app={this.props.app}/>
        {this.props.albumSelection.map(item => <Album album={item} key={item.id}/>)}
        {/* <Playlist app={this.props.app}/> */}
      </div>
    )
  }
}

const mapStateToProps = ({ library, albumSelection }) => ({ library, albumSelection });

export default connect(mapStateToProps, null)(Home);
