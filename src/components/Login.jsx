import React from 'react';
import logo from '../logo.svg'
import login from '../login.svg';

const style = {
  display: "block",
  textAlign: "center",
  width: "600px",
  marginTop: "30%"
}

export default class Login extends React.Component {
  render() {
    return <div style={style}>
      <img
        src={logo}
        className="App-logo"
        alt="logo"
        style={{width: "600px"}}
      />
      <img
        src={login}
        className="App-login"
        alt="login"
        onClick={() => console.log("clicked")}
        style={{width: "200px", marginTop: "15px"}}
      />
    </div>
  }
}
