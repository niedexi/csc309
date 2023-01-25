import axios from "axios";

export const getFollowers = () => {
  console.log("Got HERE TOO");
  return new Promise((resolve, reject) => {
  axios.get("/api/follow/followers")
  .then(followers => {
    console.log("Got HERE TOO");
    if (!followers || !followers.data) return reject(null);
    resolve(followers.data)
  })
  .catch(e => {
    console.log(e);
    reject(e)
  });
})
}

export const getFollowing = () => { return new Promise((resolve, reject) => {
  axios.get("/api/follow/following")
  .then(following => {
    if (!following || !following.data) return reject({});
    resolve(following.data)
  })
  .catch(e => reject(e));
  })
}

export const followUser = (userID) => { return new Promise((resolve, reject) => {
  axios.get(`/api/follow/isFollowing/${userID}`)
  .then(() => resolve("You are already following this person!"))
  .catch(() => {
    axios.post(`/api/follow/follow/${userID}`)
    .then(() => resolve("Congratulations! You're a follower now!"))
  })
  .catch(e => reject("Something went wrong while trying to process your request." +
    " Please try again later."))
})
}

export const isUserFollowing = (userID) => { return new Promise((resolve, reject) => {
  axios.get(`/api/follow/isFollowing/${userID}`)
  .then(() => resolve(), () => reject());
})
}

export const userUnFollow = (userID) => { return new Promise((resolve, reject) => {
  axios.delete(`/api/follow/following/${userID}`)
  .then(() => resolve("You are no longer following this user"),
    () => reject("Unfortunately, the universe (and our servers) will not let " +
      "you unfollow this user just yet. Try again later."))
})
}
