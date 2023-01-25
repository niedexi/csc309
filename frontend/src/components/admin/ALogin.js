import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { alogin } from "../../actions/admin";
import { logout } from "../../actions/auth";


import "./ALogin.css";

class ALogin extends React.Component {

  loginSub(e) {
    e.preventDefault();
    const id = e.target.children[0];
    const pass = e.target.children[1];
    console.log("ID: ", id.value);
    console.log("Password: ", pass.value);
    const x = alogin(id.value, pass.value);
    x.then(() => {
      console.log('Administrator logged on successfully!');
      this.props.history.push("/admin/dashboard");
    }, (e) => {
        console.log(e.response.data)
        pass.value = "";
    });
  }

  // componentDidMount() {
  //   console.log("Existing Profile Logged Out");
  //   logout();
  // }

  render() {
    return (
      <React.Fragment>
      <div className="mainWrapper">
        <div className="alignment">
          <h1 className="mTitle">Administrator Login</h1>
          <form onSubmit={e => this.loginSub(e)}>
          <input className="fill formElem" type="text" placeholder="Administrator ID" required/>
          <input className="fill formElem" type="password" placeholder="Password" required/>
          <input id="loginButton" className="formElem" type="submit" value="Login" />
          <p className="linkText">
          <Link className="loginLink" to="/login">Return to User Login</Link>
          </p>
          </form>
        </div>
      </div>
      </React.Fragment>
    )
  }
}

export default connect(null, { logout })(ALogin);
