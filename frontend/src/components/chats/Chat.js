import React from "react";

import CSL from "./ChatSelectionList";

import "./Chat.css"

import { getChats, getChat, sendMessage, getActiveMessages, openActiveChat, closeActiveChat } from "../../actions/chat";



class Chat extends React.Component {

  constructor(props) {
    super(props);
    this.uRef = null;
    this.receiverIdleTicker = 0;
    this.unsentIDTicker = 0;
    this.looper = null;
    this.state = {
      chatTitle: <div></div>,
      chatLog: [],
      modalVisible: "invisible",
      //Executed when the user clicks the send button in the modal chat window.
      //A function is used, so as to avoid unnecessary trouble
      sendFunction: () => {return},
      chatListing: null,
      currentChatID: null,
      loading: 1,
      modalLoading: 1,
      inputLoading: 0
    };
    getChats()
    .then(remote => {
      this.uRef = remote.uRef;
      this.setState({chatListing: remote.chats, loading: 0})
    })
    .catch(e => console.log(e));
  }

  /*
  IF this page was reached through the "Send Message" buttons, in followers &
  Following, then the below executes.
  In particular, it looks up the ID of the other chat participant and checks if
  the user has an active chat with them open. If this is the case, then it opens
  that. Otherwise, it creates a new active chat and opens that.
  */
  // componentDidMount() {
  //   let profID = !this.props.location.chatWith ? null : this.props.location.chatWith.target;
  //   if (profID) {
  //     getChats()
  //     .then(chats => {
  //       const x = chats.chats.find(chat => chat.prof._id === profID)
  //       if (x) openChat(x);
  //       else {
  //         createChat()
  //       }
  //     })
  //     .catch(e => {
  //       setState({modalVisible: "invisible"})
  //     })
      // this.setState({modalVisible: "visible"});
      // queryChat()
      // getChat()
      // this.openChat(chatID);


      //this.state.chatListing.find((chatID) =>
      //  {return chatID === chatWith.id});
      // if (!chatLog) {
      //   chatLog  = new ChatUser(chatWith.name,
      //   chatWith.profPic,
      //   chatWith.id,
      //   new ChatLog(chatWith.id, []));
      //   NEW_CHAT(chatLog);
      //   this.refs.list.addEntry(chatLog);
      //   //this.refs.list.selectLast(chatLog);
      // } else {
      //   //this.refs.list.selectByID(chatLog)
      // }
  //   }
  // }

  componentWillUnmount() {
    if (this.looper) {
      clearTimeout(this.looper);
      this.looper = null;
    }
  }

  /*
  Creates the title bar of the modal window (consisting of the other
  participant's image and name).

  Takes user (of type User)
  */
  generateChatTitleBar(user) {
    //const photo = user.prof.photo === null ? require("./default.jpg") : user.prof.photo;
    const photo = require("./default.jpg");
    return(
      <div id="mwTitleBar">
        <img src={photo} id="mwTBPic" alt="Please update your Browser" />
        <h2 id="mwTBNameTag">{
          //Truncates the other participant's name to 26 characters, so as to
          //avoid text overflow in the titlebar.
          this.stringCutter(user.prof.name, 26)
        }</h2>
      </div>
    );
  }

  /*
    Shortens a string to rhe desired length (maxSize).
    Any strings of maxSize of shorter are no affected,
    larger stringes are shortened to 23 characters and a trailing "..." is
    appended.
    Takes string (of type String) & maxSize (integer > 4)
  */
  stringCutter(str, maxSize) {
    if (!str || str.length < maxSize) {
      return str;
    }
    return str.slice(0, maxSize - 4) + "...";
  }

  /*
    Creates the actual messages to be displaed in the chat dialog.
    Depending on the sender ID of the message provided, the messaage returned
    will be styled as a message sent by the user OR one received by hte user.

    takes message (of type Message), which provides all of the relevant
    data.
  */

  _failedMessage(message) {
    const val = (
      <div key={this.unsentIDTicker++} className="messageContainer"
      onClick={
        () => {
          const newLog = this.state.chatLog;
          const a = newLog.findIndex(i => i.key === val.key);
          if (a !== -1) {
            newLog.splice(a, 1);
            this.setState({chatLog: newLog});
          }
          this.state.sendFunction(message)
          }
      }>
        <div>
          <div className="personal failed message">
            {message}
          </div>
          <div className="personalTimeStamp">
            Failed to send. Click to retry.
          </div>
        </div>
      </div>
    )
    return val;
  }

  _messageAssigner(message, type) {
    const classMatrix = [["external message", "externalTimeStamp"],
      ["personal message", "personalTimeStamp"]]
    return(
      <div>
        <div className={classMatrix[type][0]}>
          {message.text}
        </div>
        <div className={classMatrix[type][1]}>{
          new Date(message.date).toLocaleTimeString() + " " +
          new Date(message.date).toLocaleDateString()
        }</div>
      </div>
  );
  }
  messageTyper(message) {
    //-1 is a substitute for the user's ID, here.
    if(message.sender !== this.uRef)
      return this._messageAssigner(message, 0);
    else
      return this._messageAssigner(message, 1);
  }

  /*
  Creates a structural wrapper for a chat message & calls the above method to
  generate the actual message itself (and then wraps that message with the
  aforementioned wrapper).

  Take message (of type Message)
  */
  createChatMessage(message) {
    return (
      //Once again, NEXT_MESSAGE_ID is mostly just for sanity.
      //However, in this phase, it will be also used, in place of a server call
      //to get a new ID for any message that the user sends.
      <div key={message._id} className="messageContainer">
        {this.messageTyper(message)}
      </div>
    )
  }

  /*
  Goes through the user's chat log & recreates every sent message in their
  history (and returns it as a list of divs).
  Should only be called once, whenever a chat is accessed.

  Takes messages (of type ChatLog)
  */
  populateChatLog(messages) {
    const log = [];
    for(let i = 0; i < messages.length; i++) {
      log.push(this.createChatMessage(messages[i]));
    }
    return log;
  }

  /*
  On the selection of a chat (or if a user is directed here from Followers or
  Following), this function creates the chat history, the chat titlebar
  (resulting in an assembled modal chat window) & also makes said modal chat
  window visible (& interactable with).
  Asdie from the aforementioned work delegation, this function also creates a
  sendFunction, which is responsible for sending messages (normally a server call).
  In this case that means that it updates the open chat's log & the displayed
  chat dialog accordingly.

  Takes partner (of type ChatUser)
  */
  openChat(chatGiven) {
    this.setState({modalLoading: 1, modalVisible: "visible"})
    getChat(chatGiven.id)
    .then(chat => {
    const ntBar = this.generateChatTitleBar(chatGiven);
    const log = this.populateChatLog(chat.log);
    this.setState({
      chatTitle: ntBar,
      currentChatID: chatGiven.id,
      chatLog: log,
      modalVisible: "visible",
      modalLoading: 0,
    });
    this.setState({
      sendFunction: (newMessage) => {
        //partner.chat.log.push(newMessage);
        this.setState({inputLoading: 1});
        this.receiverIdleTicker = 0;
        this.receiverPromise()
        .then(() => {
        sendMessage(this.state.currentChatID, newMessage)
        .then(message => {
          const newLog = this.state.chatLog;
          newLog.push(
            <div key={message._id} className="messageContainer">
              {this._messageAssigner(message, 1)}
            </div>
          );
          this.setState({
            chatLog: newLog,
            inputLoading: 0
          })
        })
        .catch(failed => {
          const newLog = this.state.chatLog;
          console.log(failed);
          if (failed) {
            newLog.push(this._failedMessage(failed));
          }
          this.setState({
            chatLog: newLog,
            inputLoading: 0
          });
        })
      })
      }
    });
    openActiveChat(this.state.currentChatID)
    .catch(() => console.log(this.state.currentChatID));
    this.looper = setTimeout(() => this.receiverStandby(this.state.currentChatID), 10000);
  }).catch(e => console.log(e));
  }

  receiverPromise() {
    return new Promise((resolve, reject) => {
    const preAsync = this.state.currentChatID;
    getActiveMessages(this.state.currentChatID)
    .then(messages => {
      if (messages === [] || this.state.currentChatID !== preAsync) return;
      else if (messages === {}) {
        this._idleWarning();
        if (this.looper) clearTimeout(this.looper);
      }
      else {
        // console.log("===Messages===")
        // console.log(messages);
        // console.log("===Messages===")
        const newLog = this.state.chatLog;
        for(let message of messages) {
          newLog.push(
            <div key={message._id} className="messageContainer">
              {this._messageAssigner(message, 0)}
            </div>
          );
        }
        this.setState({ chatLog: newLog });
        resolve();
    }
      // if (standby) setTimeout(() => this.receiverStandby(standby), 6000);
    })
    .catch(e => {
      console.log(e);
      resolve();
    })
  });
}

  receiver() {
    const preAsync = this.state.currentChatID;
    getActiveMessages(this.state.currentChatID)
    .then(messages => {
      if (messages === [] || this.state.currentChatID !== preAsync) return;
      else if (messages === {}) {
        this._idleWarning();
        if (this.looper) clearTimeout(this.looper);
      }
      else {
        console.log(messages);
        const newLog = this.state.chatLog;
        for(let message of messages) {
          newLog.push(
            <div key={message._id} className="messageContainer">
              {this._messageAssigner(message, 0)}
            </div>
          );
        }
        this.setState({ chatLog: newLog });
    }
      // if (standby) setTimeout(() => this.receiverStandby(standby), 6000);
    })
    .catch(e => {
      console.log(e)
    })
  }

  _idleWarning() {
    const alert = (
      <div key={this.unsentIDTicker++} className="messageContainer">
        <div className="message idleM">
          You have been disconnected for idling for too long.
          <br/>
          Reload the chat to continue.
        </div>
    </div>);
    const newLog = this.state.chatLog;
    newLog.push(alert);
    this.setState({
      chatLog: newLog,
    });
  }

  receiverStandby(targetChat) {
    console.log("tick");
    if (this.looper) {
      if (this.receiverIdleTicker < 90) {
        this.receiver(targetChat);
        this.receiverIdleTicker += 1;
        this.looper = setTimeout(() => this.receiverStandby(targetChat), 6000);
      } else {
        this._idleWarning();
      }
    }
  }



  /*
  Obviously enough, closes the modal chat window.
  Effectively, it just clears the selected element (in the active chat list) &
  resets state to default (i.e. disassembles the modal window).
  */
  closeChat() {
    if (this.looper) {
      clearTimeout(this.looper);
      this.looper = null;
    }
    this.refs.list.deselect();
    closeActiveChat(this.state.currentChatID);
    this.setState({
      chatTitle: <div></div>,
      chatLog: [],
      currentChatID: null,
      modalVisible: "invisible",
      sendFunction: () => {return}
    });
  }

  render() {
    if (this.state.loading) return(
      <React.Fragment>
        <div className="mainL loader" />
      </React.Fragment>
    )
    let value = "";
    const textArea = (<textarea form="messageComposer" id="messageIn" placeholder="Type your message here" onChange={ e => {
      value = e.target.value;
    }}></textarea>);
    return (
      <React.Fragment>
        <div id="modalWrapper" className={this.state.modalVisible} onClick={ e => {
          if (e.target.id === "mwCloseButton") {
            this.closeChat();
          }
        }}>
          <div id="modalWindowMain">
          {(this.state.modalLoading) ? (
            <div className="modalL loader" />
          ) : (
            <div>
            <span id="mwCloseButton">&times;</span>
            <div>
              {this.state.chatTitle}
            </div>
            <div id="mwChatLog">
              {this.state.chatLog}
            </div>
            <form id="messageComposer"
            onSubmit={e => {
              e.preventDefault();
              if(value.length !== 0 && !this.state.inputLoading) {
                //Creates and wends a new message with the current date & time.
                //this.setState({inputLoading: 1});
                const inv = value;
                e.currentTarget.firstElementChild.value=" ";
                e.currentTarget.firstElementChild.value="";
                this.state.sendFunction(inv);
                e.currentTarget.reset();
                //This fixes the a bug, where after reset, re-input of the
                //exact same single character fails to be dtected.

                value="";
              }
            }}>
              {
                //This is where the user types out their messages.
                (this.state.inputLoading) ? (
                  <div className="inputL loader" />
                ) : textArea
              }
              <input id="send" className="messageButton" type="submit" value="Send" />
              <input id="cancel" className="messageButton" type="reset" value="Clear" />
            </form>
            </div>
          )}
          </div>
        </div>
        {/*
        The selection list used by the user to select and open a chat window
        So its declaration for more info.
        */}
        <CSL onSelection={(chat) => this.openChat(chat)}
        input={this.state.chatListing} ref="list" />
        <div id="chatHint">
          <h2 id="chatHintTitle">Hint</h2>
          <h2 id="chatHintText">Click on one of your active chats to continue
          where you left off.
          <br/>
          <br/>
          Or, start a new chat with one of your followers, or someone that you follow!
          </h2>
        </div>
      </React.Fragment>
    );
  }
// <input id="messageIn" type="field" value="" placeholder="Type something" />
}

export default Chat;
