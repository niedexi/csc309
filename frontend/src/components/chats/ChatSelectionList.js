import React from "react";

import "../resources/UserIDSelectionList.css";

/*
Not much about this one really.
Simply a visual list, which allows the user to select ONE element therein (at
a time). Will execute a provided "onSelection" function, as well.

Important props:
onSelection: A bound function. To be executed on change of selection.
defaultScreen: Custom element to be displayed in the list area, when empty.
input: Input list (of User objects) to be displayed.
title: Custom title/text above the list.

Note: Any images/etc. passed in User.profPic must also be in the resources
directory. This is not a problem that would occur with a real server, but
a problem that plagues this testing.
As such, UISDL can only take local images (i.e. "./someImage").
Sorry for the inconvenience.
Please take a note of this, if adding custom images for testing.
*/

class CSL extends React.Component {
  constructor(props) {
    super(props);
    this.defaultScreen =
    (
      <div key="-1" id="defPanel">
      You currently have no active chats
    </div>
    );
    this.selectedID = null;
    this.changeSelected = this.changeSelected.bind(this);
    this.deleteSelected = this.deleteSelected.bind(this);
    this.emptyList = !this.props.input || this.props.input.length === 0 ? 1 : 0;
    //If no input list was given, use the default screen.
    const input = this.emptyList ? [ this.defaultScreen ] :
      this.generateList(this.props.input)

    this.state = {
      userList: input,
      selected: null,
    };
  }

  /*
  Adds a User (object, as degined in Followers, Following and similar to ChatUser
  in Chat) to the list.

  If the default screen was being displayed, this replaces it and marks the list
  as no longer empty.
  */
  addEntry(user) {
    const newUser = this.generateListing(user);
    const userListing = this.state.userList;
    if (this.emptyList) {
      userListing.pop();
      this.emptyList = 0;
    }
    userListing.push(newUser);
    this.setState({
      userList: userListing,
      selected: this.state.selected
    });
  }

  delSel = () => this.deleteSelected();

  /*
  Removes the currently selected object from the dispalyed listDiv.
  In particular, deletes the object that is referred to be the .selected
  property of state.

  Note: This does NOT remove from the server, that is done elsewhere.
  */
  deleteSelected() {
    const fList = this.state.userList;
    const pos = fList.findIndex(input => {
      if (input !== null) {
        return Number(input.key) === this.selectedID;
      }
      return 0;
    });
    if (pos !== -1) {
      fList.splice(pos, 1);
    }

    this.selectedID = null;

    if (fList.length === 0) {
      fList.push(this.defaultScreen);
      this.emptyList = 1;
    }

    this.setState({
      userList: fList,
      selected: null,
    });
  }

  /*
  Clears the current selection (only used in Chat)
  */
  deselect() {
    const unSelect = this.state.selected;
    if (unSelect !== null) {
      //De-select
      unSelect.className = "uidslListing";
      this.setState({
        selected: unSelect,
        userList: this.state.userList
      });
      this.setState({
        selected: null,
        userList: this.state.userList
      });
    }
  }

  /*
  Changes the currently selected item to the newSelection & adjustes the
  appearances of the selected item and the previous item, accordingly.

  Takes newSelection (which should be the e.currentTarget of the selected/clicked-on
  item; must not be null/undefined).
  */
  changeSelected(newSelection) {
    const unSelect = this.state.selected;
    if (unSelect !== null) {
      //De-select
      unSelect.className = "uidslListing";
      this.setState({
        selected: unSelect,
        userList: this.state.userList
      });
    }
    newSelection.className = "uidslSelectedListing";
    return newSelection;
  }

  /*
  Legacy code. Allows for selection by ID.
  Deprecated.
  */
  selectByID(target) {
    const pos = this.state.userList.find((user) => {
      return Number(user.key) === target.id;
    });
    if (pos !== undefined) {
      this.setState({
        userList: this.state.userList,
        selected: pos
      });
      this.changeSelected(pos);
      this.props.onSelection(target);
    }
    return pos;
  }

  stringCutter(string, maxSize) {
    if (string === null || string.length < maxSize) {
      return string;
    }
    return string.slice(0, maxSize - 4) + "...";
  }

  /*
  Creates a single item in the list, given a User object.

  Created along with it is its click-on behaviour.
  */
  generateListing(chat) {
    //const image = !chat.prof.photo ? require("./default.jpg") : chat.prof.photo;
    const image = require("./default.jpg");
    return (
      <div
        key={chat._id}
        className="uidslListing"
        onClick={e => {
          this.setState({
            selected: this.changeSelected(e.currentTarget),
            userList: this.state.userList
          });
          this.selectedID = chat._id;
          this.props.onSelection(chat);
        }}>
        <div className="uidslSelectionCover"/>
        <img
          src={image}
          className="uidslUserPic"
          alt={`${chat.prof.name}'s profile.`}
        />
            {this.stringCutter(chat.prof.name, 24)}
      </div>
    );
  }

  /*
  Creates and returns the list of Users to be displayed.

  Takes input (of Type: List of User objects).
  */
  generateList(input) {
    const x = [];
    for (let i = 0; i < input.length; i++) {
      x.push(this.generateListing(input[i]));
    }
    return x;
  }

  render() {
    return (
      <React.Fragment>
        <div className="uidslListDiv">
          <h1 id="uidslMainName">
            Your Chats
          </h1>
          <div className="uidslUserList">{this.state.userList}</div>
        </div>
      </React.Fragment>
    );
  }
}

export default CSL;
