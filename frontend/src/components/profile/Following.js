import React from "react";
import { uid } from "react-uid";
import { Link } from "react-router-dom";

import UIDSL from "../resources/UserIDSelectionList";

import "./FollowPages.css";

import { userUnFollow, getFollowing } from "../../actions/follow";



/*
  User class. For simplicity of arrangement/creation of text data.

  name: User's name. Type: String.
  profPic: (Normally the server would be involved here, but in this case: ) a
    local path to an image (.png or .jpg). Type: String
      NOTE: This module uses UIDSL. Please consult page for more information
            about how path to local images.
  id: User's ID (unique to the user and > 0). Type: integer (mathematical definiton)
  interests: The user's interests/languages spoken. Type: List of strings
  profile: Link to this user's profile (in this test case: /profile only).
           Type: String
*/

/*
"Server" Functionality
Anywhere where one of these functions is called, a server call would have
occured.
*/

/* Test Date */

const DEFAULT_PANEL = (
  <div id="defDiv">
    <img id="defPic" src={require("./default.jpg")} alt="Default avatar" />
    <h4 id="defTag">
      <i>Click on one of the users you are following for more information</i>
    </h4>
  </div>
);

const DEFAULT_SCREEN = (
  <h2 key="-1" id="defPanel">
    You are not currently following anyone
  </h2>
);

/* Actual Componentt */
class Following extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      panelContent: DEFAULT_PANEL,
      following: null,
      mainLoading: 1
    };
    getFollowing()
    .then(following => {
      console.log(following);
      this.setState({following: following, mainLoading: 0})
    })
    .catch(e => {console.log(e)});
    this.generateProfilePanel = this.generateProfilePanel.bind(this);
    this.profileStateChange = this.profileStateChange.bind(this);
    this.unFollow = this.unFollow.bind(this);
  }

  /*
    Removes followed from the webpage user's list of followed accounts/users.

    Takes followed (of type User)
  */
  unFollow(followed) {
    //Removes user from server (Server call required here, normally)
    userUnFollow(followed)
    .then(() => {
      this.setState({
        panelContent: DEFAULT_PANEL
      });
      //Calls the list's delSet method, to delete its currently selected object.
      this.refs.list.delSel();
    })
    .catch(() => {
      console.log("Fix");
    })
    //Resets the selection panel to be empty (i,.e. default)

  }

  /*
  Generates the entire profile panel (complete with linking functionality).
  Will create a link to a chat with following (if it already exists, will open it;
  otherwise will create new chat and open it).
  */
  generateProfilePanel(following) {
    const inTeach =
      following.following.teach.length === 0 ? (
        <li className="inLi">
          <i>
            <b>None</b>
          </i>
        </li>
      ) : (
        following.following.teach.map(lang => {
          return (
            <li key={uid(lang)} className="inLi">
              <i>{lang}</i>
            </li>
          );
        })
      );
      const inLearn =
        following.following.learn.length === 0 ? (
          <li className="inLi">
            <i>
              <b>None</b>
            </i>
          </li>
        ) : (
          following.following.learn.map(lang => {
            return (
              <li key={uid(lang)} className="inLi">
                <i>{lang}</i>
              </li>
            );
          })
        );
    return (
      <div id="profPanel">
        <h1 key={following.following._id} id="panelName">
          {following.following.name}
        </h1>
        <img
          id="panelPic"
          src={require("./default.jpg")}
          alt={`${following.following.name}'s profile.`}
        />

        <div className="panelInterests">
          <h2>
            <b>Languages I Know:</b>
          </h2>
          <ul className="inUl">{inTeach}</ul>
          <h2>
            <b>Languages I'm Learning:</b>
          </h2>
          <ul className="inUl">{inLearn}</ul>
        </div>
        <Link
          className="panelButton" to={`/profile/${following.following.user}`}>{`Visit profile`}</Link>
        <Link to={{pathname: "/chat", chatWith:{target: following.following._id}}}
        className="panelButton">Send Message</Link>
        <button
          className="panelButton"
          onClick={e => {
            console.log("Unfollowing!");
            this.unFollow(following.following._id);
          }}
        >{`Unfollow`}</button>
      </div>
    );
  }

  /*
  onSelection function that is bound to this component.
  To be passed onto the list, wherein it will be called, whenever the user's
  selection changes.

  Simply a changer of this component's state, to be used by antoher component.

  Takes following (of Type User).
  */
  profileStateChange(following) {
    this.setState({
      panelContent: this.generateProfilePanel(following)
    })
  }

  render() {
    if (this.state.mainLoading) {
      return (
        <React.Fragment>
          <div className="fmainL loader" />
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        <div className="listDiv">
          <UIDSL defaultScreen={DEFAULT_SCREEN}
          followType={0}
          input={this.state.following}
          onSelection={this.profileStateChange}
          title={"You are following:"}
          ref="list" />
        </div>
        <div className="profViewDiv">{this.state.panelContent}</div>
      </React.Fragment>
    );
  }
}

export default Following;
