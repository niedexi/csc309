import React, { Fragment, useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProfile, getCurrentProfile } from "../../actions/profile";

const EditProfile = ({
  profile: { profile, loading },
  createProfile,
  getCurrentProfile,
  history
}) => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    nationality: "",
    location: "",
    bio: "",
    teach: "",
    learn: ""
  });

  useEffect(() => {
    getCurrentProfile();

    setFormData({
      name: loading || !profile.name ? "" : profile.name,
      gender: loading || !profile.gender ? "" : profile.gender,
      age: loading || !profile.age ? "" : profile.age,
      nationality: loading || !profile.nationality ? "" : profile.nationality,
      location: loading || !profile.location ? "" : profile.location,
      bio: loading || !profile.bio ? "" : profile.bio,
      teach: loading || !profile.teach ? "" : profile.teach.join(","),
      learn: loading || !profile.learn ? "" : profile.learn.join(",")
    });
  }, [loading, getCurrentProfile]);

  const {
    name,
    gender,
    age,
    nationality,
    location,
    bio,
    teach,
    learn
  } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    createProfile(formData, history, true);
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Edit Profile</h1>
      <p className="lead">
        <i className="fas fa-user" /> Let's get some information
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Name"
            name="name"
            value={name}
            onChange={e => onChange(e)}
            required
          />
          <small className="form-text">Your Name</small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Gender"
            name="gender"
            value={gender}
            onChange={e => onChange(e)}
            required
          />
          <small className="form-text">Your Gender</small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Age"
            name="age"
            value={age}
            onChange={e => onChange(e)}
            required
          />
          <small className="form-text">Your Age</small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Nationality"
            name="nationality"
            value={nationality}
            onChange={e => onChange(e)}
            required
          />
          <small className="form-text">Your Nationality</small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Location"
            name="location"
            value={location}
            onChange={e => onChange(e)}
            required
          />
          <small className="form-text">Your Location</small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Languages You Know"
            name="teach"
            value={teach}
            onChange={e => onChange(e)}
            required
          />
          <small className="form-text">
            Please use comma separated values (eg.
            English,French,Chinese,Japanese)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Languages You Want to Learn"
            name="learn"
            value={learn}
            onChange={e => onChange(e)}
            required
          />
          <small className="form-text">
            Please use comma separated values (eg.
            English,French,Chinese,Japanese)
          </small>
        </div>
        <div className="form-group">
          <textarea
            placeholder="A short bio of yourself"
            name="bio"
            value={bio}
            onChange={e => onChange(e)}
          />
          <small className="form-text">Tell us a little about yourself</small>
        </div>

        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  withRouter(EditProfile)
);
