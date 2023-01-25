import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { uid } from "react-uid";

import { getProfileById } from "../../actions/profile";

import { setAlert } from "../../actions/alert";

import { followUser } from "../../actions/follow";

import "./Profile.css";

/*
"Server" data & functions.
Obviously, not a real server. but rather the texting data for this page.
It is store here for two reasons:
  1) To facilitate function design that better mimics that, which would be used
    in conjunction with a real server/
  2) To make the code below slightly less polluted and slightly more readable
Naturally, anywhere where such functions are used, data would be obtained from
the server.
"such functions" refers to any of the the "all caps, underscore global functions"
seen below.
*/

// Creates individual icon img elements for followers and following buttons to use.
const formIcon = (id, src) => {
  return (
    <img
      key={id}
      className="microFImage"
      src={require(`${src}`)}
      alt="Profile Avatar, Not Working"
    />
  );
};

// Creates and returns list of icons that are to be displayed on the
// following and follower buttons.
// Specifically, it does this for first five followers and users followed.
const followIconGenerator = source => {
  const images = [];
  for (let i = 0; i < 5 && i < source.length; i++) {
    const imgSrc =
      source[i].profPic === null ? "./default.jpg" : source[i].profPic;
    images.push(this.formIcon(source[i].id, imgSrc));
  }
  return images;
};

// Creates and returns a list of list items, where each list corresponds to one of
// the user's (spoken) languages.
const langList = langs => {
  if (langs.length === 0) {
    return (
      <li key="0" className="langListItem">
        <b>
          <i>None</i>
        </b>
      </li>
    );
  }
  const langLIs = [];
  for (let lang of langs) {
    langLIs.push(
      <li key={uid(lang)} className="langListItem">
        <i>{lang}</i>
      </li>
    );
  }
  return langLIs;
};

const Profile = ({
  getProfileById,
  profile: { profile, loading },
  auth,
  match
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);

  return (
    <Fragment>
      {profile === null || loading ? (
        <br />
      ) : (
        <Fragment>
          {auth.isAuthenticated && auth.user._id === profile.user && (
            <Link to="/edit-profile" className="btn btn-dark">
              Edit Profile
            </Link>
          )}

          {/* user name, profile photo, bio */}
          <div className="profile-grid my-1">
            <div className="profile-exp bg-white p-2">
              {profile.photo ? (
                <img className="round-img my-1" src={profile.photo} alt="" />
              ) : (
                <img
                  className="round-img my-1"
                  src={require("./default.jpg")}
                  alt=""
                />
              )}
              <img className="round-img my-1" src={profile.photo} alt="" />
              <h1 className="large">{profile.name}</h1>
              <div className="profile-about bg-light p-2">
                <h2 className="text-primary">About Me</h2>
                {profile.bio && (
                  <Fragment>
                    <p>{profile.bio}</p>
                    <div className="line" />
                  </Fragment>
                )}
              </div>
            </div>

            {/* user info */}
            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Profile</h2>
              <p>
                <strong>Gender: </strong> {profile.gender}
              </p>
              <p>
                <strong>Age: </strong> {profile.age}
              </p>
              <p>
                <strong>Nationality: </strong> {profile.nationality}
              </p>
              <p>
                <strong>Location: </strong> {profile.location}
              </p>
              <p>
                <strong>Languages I Know: </strong> {profile.teach.join(",")}
              </p>
              <p>
                <strong>Languages I'm Learning: </strong>{" "}
                {profile.learn.join(",")}
              </p>
            </div>
          </div>

          {(auth.isAuthenticated && auth.user._id === profile.user) ? (
          <div className="profButtonContainer">
          <Link
            className="profFButtons"
            to="/profile/followers"
          >
            Followers
          </Link>
            <Link
              className="profFButtons"
              to="/profile/following"
            >
              Following
            </Link>
            <Link
              className="profFButtons"
              to="/chat"
            >
              Private
              <br />
              Messages
            </Link>
          </div>) : (
            <button className="profFButtons" onClick={e => {
              followUser(profile._id)
              .then(success => {
                console.log(success);
              })
              .catch(alert => console.log(alert))
            }}>
              Follow
              <br />
              this profile
            </button>
          )
        }
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  followUser: PropTypes.func.isRequired,
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, {followUser, getProfileById })(Profile);
