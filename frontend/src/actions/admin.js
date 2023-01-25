import axios from "axios";
import { GET_USERS, CLEAR_PROFILE, ACCOUNT_DELETED, PROFILE_ERROR, USERS_ERROR } from "./types";

export const alogin = (admin, password) => {
  return new Promise((resolve, reject) => {
    const config = {headers: { "Content-Type": "application/json" } };
    const body = JSON.stringify({ id: admin, password });
    const response = axios.post("/api/admin/login", body, config);
    response.then(rep => {
      if (!rep.data.token) reject("Missing Data?");
      axios.defaults.headers.common["adminAuth"] = rep.data.token;
      resolve();
  }, (e) => {
    reject(e);
  });
});
};

export const aGetUsers = () => {
  return new Promise((resolve, reject) => {
    axios.get("/api/admin/users")
    .then(users => {
      if (!users.data) reject("Missing Data");
      else {
        resolve(users.data);
      }
    })
    .catch(e => reject(e));
  });
}

export const aConfirmAuthMarker = () => {
  return (axios.defaults.headers.common["adminAuth"]);
}

export const alogout = () => {
  delete axios.defaults.headers.common["adminAuth"];
}

//
// export const aGetUsers = () => async dispatch => {
//   const response = await axios.get("api/admin");
//   return !response.data ? null : JSON.parse(response.data);
// };
//
// export const aGetUserProfile = (user_id) => async => {
//   const response = await axios.get(`api/admin/${user_id}`);
//   return !response.data ? null : JSON.parse(response.data);
// }
//
// export const aDeleteUserProfile = (user_id) => async => {
//   const response = await axios.get(`api/admin/${user_id}`);
//   return !(!response.type);
// }
//
// export const aModifyUserProfile = (user_id, user, profile) => async => {
//   const response = await axios.patch(`api/admin/${user_id}`, { user, profile});
//   return !(!response.type);
// }
