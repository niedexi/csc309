import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost } from "../../actions/post";

const CreatePost = ({ addPost }) => {
  const [formData, setFormData] = useState({
    text: "",
    teach: "",
    learn: ""
  });

  const { text, teach, learn } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    addPost(formData);
  };

  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>New Post</h3>
      </div>

      <form className="form my-1" onSubmit={e => onSubmit(e)}>
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Create a post"
          value={text}
          onChange={e => onChange(e)}
          required
        />

        <p>
          <strong>Enter One language you want to teach</strong>
        </p>
        <input
          type="text"
          placeholder="Enter a language"
          name="teach"
          value={teach}
          onChange={e => onChange(e)}
          required
        />

        <p>
          <strong>Enter One language you want to learn</strong>
        </p>
        <input
          type="text"
          placeholder="Enter a language"
          name="learn"
          value={learn}
          onChange={e => onChange(e)}
          required
        />

        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

CreatePost.propTypes = {
  addPost: PropTypes.func.isRequired
};

export default connect(null, { addPost })(CreatePost);
