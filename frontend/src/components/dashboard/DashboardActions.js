import React from "react";
import { Link } from "react-router-dom";

const DashboardActions = () => {
  return (
    <div className="dash-buttons">
      <Link to="/edit-profile" className="btn btn-light">
        <i className="fas fa-user-circle text-primary" /> Edit Profile
      </Link>
      <Link to="/upload" className="btn btn-light">
        <i className="fas fa-cloud-upload-alt text-primary" /> Upload Photo
      </Link>
      <Link to="/compose" className="btn btn-light">
        <i className="fas fa-pen text-primary" /> Compose
      </Link>
    </div>
  );
};

export default DashboardActions;
