import React from 'react';

export default class Track extends React.Component {
  render() {
    const { track } = this.props;
    return (
      <div>{track.name}</div>
    )
  }
}
