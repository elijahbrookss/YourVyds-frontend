// Variables
const URL = "http://localhost:3001";
const userExistsRoute = URL+"/userexists";
const usersRoute = URL+"/users";
const loginRoute = URL+'/login';
const currentUserRoute = URL+'/current_user'
const subscriptionInfoRoute = URL+'/subscription_info'

// JWT Authorization
const headerKey = "Authorization";
const contentType = {"Content-Type": "application/json"}


class UserAdapter{

  static checkIfUserExists(username) {
    return fetch(userExistsRoute, {
      method: "POST",
      headers: contentType,
      body: JSON.stringify({username})
    })
  }

  static getCurrentUser(){
    return fetch(currentUserRoute, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        [headerKey]: localStorage.getItem("auth_key")
      }
    })
  }

  static CreateUser(userCredentials){
    return fetch(usersRoute, {
      method: "POST",
      headers: contentType,
      body: JSON.stringify(userCredentials)
    })
  }

  static LoginUser(userCredentials){
    return fetch(loginRoute, {
      method: "POST",
      headers: contentType,
      body: JSON.stringify(userCredentials)
    })
  }

  static GetSubscriptionInfo(){
    return fetch(subscriptionInfoRoute, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        [headerKey]: localStorage.getItem("auth_key")
      }
    })
  }

  static GetSubscriptionInfoOnUser(id){
    return fetch(subscriptionInfoRoute+`/${id}`, {
      method: "GET",
      headers: contentType
    })
  }

  static LogoutUser(){
    localStorage.setItem('auth_key', null);
  }

  static GetUser(userId){
    return fetch(usersRoute+`/${userId}`)
  }

  static UpdateUser(userObj, id){
    return fetch(usersRoute+`/${id}`, {
      method: "PATCH",
      headers: {  [headerKey]: localStorage.getItem("auth_key") },
      body: userObj
    })
  }
}


export default UserAdapter
