import axios from "axios";

export const getChats = () => { return new Promise((resolve, reject) => {
  const res = axios.get("/api/chat");
  res.then((chats) => {
    if (!chats.data) reject("Data Loss");
    else resolve(chats.data);
  }, e => reject(e.response.data));
});
}

export const getChat = (chat_id) => { return new Promise((resolve, reject) => {
  const res = axios.get(`/api/chat/${chat_id}`);
  res.then((chat) => {
    if (!chat.data) reject("Data Loss");
    else resolve(chat.data);
  }, e => reject(e.response.data));
});
}

// export const makeChat = (userData) => { return new Promise((resolve, reject) => {
//   const res = axios.post("/api/chat");
//   const config = {headers: { "Content-Type": "application/json" } };
//   const body = JSON.stringify({"message": message});
// })
// }

// export const newMessage = (chat_id, message) => {
//   return new Promise((resolve, reject) => {
//   const config = {headers: { "Content-Type": "application/json" } };
//   const body = JSON.stringify({ message });
//
//   const res = axios.post(`/api/chat/a/${chat_id}`, body, config);
//   res.then(rep => {
//     if (!rep.data) reject("Data Loss");
//     else resolve();
//   }, e => reject(e.response.data));
// });
// }
//
// export const messageStandby = (chat_id) => {
//   return new Promise((resolve, reject) => {
//     const result = axios.get(`/api/chat/a/${chat_id}`);
//     result.then(ret => {
//       if (!ret.data) reject(null);
//       else resolve(JSON.parse(ret.data));
//     }, e => reject(e))
//   });
// }

export const sendMessage = (chatID, message) => {
  console.log(chatID);
  return new Promise((resolve, reject) => {
    const config = {headers: { "Content-Type": "application/json" } };
    const body = JSON.stringify({"message": message});
    console.log("?")
    axios.post(`/api/chat/${chatID}/send`, body, config)
    .then(res => {
      console.log(res);
      resolve(res.data);
    })
    .catch(err => {
      if (err.response.status === 500) {
        reject(err.response.data);
      }
      else reject(null);
    });
  });
}

export const getActiveMessages = (chatID) => {
  return new Promise((resolve, reject) => {
    axios.get(`/api/chat/${chatID}/getActive`)
    .then(res => {
      console.log(res);
      if (res.status === 205) resolve({});
      else if (res.status === 204) resolve([]);
      else resolve(res.data);
    })
    .catch(() => reject("Connection failure"))
  });
}

export const openActiveChat = (chatID) => {
  return new Promise((resolve, reject) => {
    const res = axios.post(`/api/chat/${chatID}/openActive`);
    res.then(() => resolve("Chat opened"))
    .catch((e) => reject("Connection failure"));
  });
}

export const closeActiveChat = (chatID) => {
  const res = axios.post(`/api/chat/${chatID}/closeActive`);
  res.catch(e => console.log("Log close unsuccessful. Continuing..."))
}
