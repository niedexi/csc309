import React from "react";
import { uid } from "react-uid";
import "./ADashboard.css";
import { aConfirmAuthMarker, alogout, aGetUsers } from "../../actions/admin";
import axios from "axios";
//import Register from "./components/auth/Register";

class ADashboard extends React.Component {

  //Muh authMarker checking.
  constructor(props) {
    super(props);
    if (!aConfirmAuthMarker()) {
      this.props.history.push("/admin/login");
    }
    this.state = {
      loading: 1,
      users: null,
      userListing: null
    };
    aGetUsers()
    .then(users => {
      this.setState({users: users, loading: 0, userListing: this.genListings(users)});
    })
    .catch(e => {
      console.log(e);
      this.props.history.push("/admin/login");
    })
  }

  //Because we cannot have nice things.
  //Also, admin logs out on ANY page change (including going back)

  //console.log("Dashboard");
  //console.log(this);
  //const { users } = Register
  removeUser = user => {
    //console.log(users)
    console.log(user);
    const filtered = this.state.users.filter(s => {
      return s !== user;
    });
    console.log(filtered);

    this.setState({
      users: filtered
    });
    //users = filtered
    //console.log(users)
  };

  genListings(users) {
    const compiled = [];
    for(let user of users) {
      const tmp = (
        <tr key={uid(user)}>
          <td>
            <input type="checkbox" className="checkbox" />
          </td>
          <td className="name">
            {user.username}
          </td>
          <td>{user.email}</td>

          <td className="restrict">
            <div className="inner">
              <button
                className="remove"
                onClick={this.removeUser.bind(this, user)}
              >
                Remove Profile
              </button>
            </div>
            <div className="inner">
              <button className="warning">Send Warning</button>
            </div>
          </td>
        </tr>
      );
      compiled.push(tmp);
    }
    return compiled;
  }

  render() {
    if (this.state.loading) {
      return (
        <React.Fragment>
            <div className="aMainL loader" />
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        <div className="box">
          <div className="box-head">
            <h2 className="left">Account Management</h2>
            <div className="right">
              <label>search users</label>
              <input type="text" className="field" />
              <input type="submit" className="button" value="search" />
            </div>
          </div>

          <div className="table">
            <table
              id="usertable"
              width="100%"
              border="0"
              cellspacing="0"
              cellpadding="0"
            >
              <tbody>
                <tr id="tableHeader">
                  <th>
                    <input type="checkbox" className="checkbox" />
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Language</th>
                  <th className="ac">
                    Content Control
                  </th>
                </tr>
                {this.state.userListing}
              </tbody>
            </table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default ADashboard;
