import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Login from "../auth/Login";
import Register from "../auth/Register";
import Profile from "../profile/Profile";

import ALogin from "../admin/ALogin";
import ADashboard from "../admin/ADashboard";
import Followers from "../profile/Followers";
import Following from "../profile/Following";

// Dashboard
import Dashboard from "../dashboard/Dashboard";
import CreateProfile from "../dashboard/CreateProfile";
import EditProfile from "../dashboard/EditProfile";
import Uploader from "../dashboard/Uploader";

import Posts from "../post/Posts";
import CreatePost from "../post/CreatePost";

import Chat from "../chats/Chat";

import Alert from "../layout/Alert";

// Private route
import Private from "../routing/Private";

import { alogout } from "../../actions/admin";

const Routes = () => {
  return (
    <section className="container">
      <Alert />
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/admin/login" component={ALogin} />
        <Route
          exact
          path="/admin/dashboard"
          component={ADashboard}
          onLeave={alogout}
        />
        <Redirect from="/admin" to="/admin/login" />

        <Private exact path="/dashboard" component={Dashboard} />
        <Private exact path="/create-profile" component={CreateProfile} />
        <Private exact path="/edit-profile" component={EditProfile} />
        <Private exact path="/upload" component={Uploader} />

        <Private exact path="/profile/followers" component={Followers} />
        <Private exact path="/profile/following" component={Following} />
        <Private exact path="/profile/:id" component={Profile} />
        <Private exact path="/chat" component={Chat} />

        <Private exact path="/posts" component={Posts} />
        <Private exact path="/compose" component={CreatePost} />

        <Redirect from="/" to="/" />
      </Switch>
    </section>
  );
};

export default Routes;
