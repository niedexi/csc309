import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";

import { deletePost } from "../../actions/post";

const PostItem = ({
  deletePost,
  auth,
  post: { _id, user, text, teach, learn, time },
  showActions
}) => (
  <div className="post bg-white p-1 my-1">
    <div>
      <Link to={`/profile/${user}`}>
        <img
          className="round-img"
          src={require("../profile/default.jpg")}
          alt=""
        />
      </Link>
    </div>
    <div>
      <p>
        <strong>I Know: </strong> {teach} &nbsp;
        <strong>I'm Learning: </strong> {learn}
      </p>
      <p className="my-1">{text}</p>
      <p className="post-date">
        <Moment format="YYYY/MM/DD hh:mm a">{time}</Moment>
      </p>

      {showActions && (
        <Fragment>
          {!auth.loading && user === auth.user._id && (
            <button
              onClick={() => deletePost(_id)}
              type="button"
              className="btn btn-danger"
            >
              <i className="fas fa-times" />
            </button>
          )}
        </Fragment>
      )}
    </div>
  </div>
);

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  showActions: PropTypes.bool
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deletePost })(PostItem);
