import React from "react";
import { uid } from "react-uid";
import { Link } from "react-router-dom";

import UIDSL from "../resources/UserIDSelectionList";

import "./FollowPages.css";

import { getFollowers } from "../../actions/follow";

/*
This is enarly exactly the same as Following.js, however, the option to deletes
users from the list is not present.

As such, the documentation is effectively, identical.
So, please, look to Following.js for any documentation.
*/

const DEFAULT_PANEL = (
  <div id="defDiv">
    <img id="defPic" src={require("./default.jpg")} alt="Default avatar" />
    <h4 id="defTag"><i>Click on one of your followers to see more information</i></h4>
  </div>
);

const DEFAULT_SCREEN = (
  <div key="-1" id="defPanel">
    You do not have any followers
  </div>
);

class Followers extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      panelContent: DEFAULT_PANEL,
      mainLoading: 1,
      followers: null,
    };
    getFollowers()
    .then(followers => {console.log(followers);
      this.setState({followers: followers, mainLoading: 0})
    })
    .catch((e) => console.log(e));
    this.generateProfilePanel = this.generateProfilePanel.bind(this);
    this.profileStateChange = this.profileStateChange.bind(this);

  }

  generateProfilePanel(followerData) {
    const inTeach =
      followerData.follower.teach.length === 0 ? (
        <li className="inLi">
          <i>
            <b>None</b>
          </i>
        </li>
      ) : (
        followerData.follower.teach.map(lang => {
          return (
            <li key={uid(lang)} className="inLi">
              <i>{lang}</i>
            </li>
          );
        })
      );
      const inLearn =
        followerData.follower.learn.length === 0 ? (
          <li className="inLi">
            <i>
              <b>None</b>
            </i>
          </li>
        ) : (
          followerData.follower.learn.map(lang => {
            return (
              <li key={uid(lang)} className="inLi">
                <i>{lang}</i>
              </li>
            );
          })
        );
    return(
      <div id="profPanel">
        <h1 key={followerData.follower.id} id="panelName">{followerData.follower.name}</h1>
        <img id="panelPic" src={require('./default.jpg')} alt={`${followerData.follower.name}'s profile.`} />
        <div id="panelInterests">
          <h2><b>Languages I Know:</b></h2>
          <ul className="inUl">{inTeach}</ul>
          <h2><b>Languages I'm Learning</b></h2>
          <ul className="inUl">{inTeach}</ul>
        </div>
        <Link to={`/profile/${followerData.follower.user}`} className="panelButton">Visit profile</Link>
        <Link to={{pathname: "/chat/", chatWith:{target: followerData.follower._id}}}
          className="panelButton">Send Message</Link>
      </div>
    );
  }

  profileStateChange(follower) {
    this.setState({
      panelContent: this.generateProfilePanel(follower)
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
    return(
      <React.Fragment>
      <div className="listDiv">
        <UIDSL defaultScreen={DEFAULT_SCREEN} followType={1} input={this.state.followers}
        onSelection={this.profileStateChange} title={"Your followers:"}/>
      </div>
      <div className="profViewDiv">
        {this.state.panelContent}
      </div>
      </React.Fragment>
    );
  }
}

export default Followers;
