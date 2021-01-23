// Variables
const headerKey = "Authorization";
const contentType = {"Content-Type": "application/json"}

// Header for JWT Authentication
const header = {
  "Content-Type": "application/json",
  [headerKey]: localStorage.getItem("auth_key")
}

// Routes
const URL = "http://localhost:3001";
const VideosRoute = URL + '/videos';
const CommentsRoute = URL + '/comments';
const LikesRoute = URL + '/likes';
const DislikeRoute = URL + '/dislikes';
const SubscriptionRoute = URL + '/subscriptions';
const UnSubscribeRoute = URL + '/subscriptions_remove';

class VideoAdapter{
  static GetVideo(videoId){
    return fetch(VideosRoute+`/${videoId}`)
  }

  static GetAllVideos(){
    return fetch(VideosRoute)
  }

  static PostComment(commentObj){
    return fetch(CommentsRoute, {
      method: "POST",
      headers: header,
      body: JSON.stringify({comment: commentObj})
    })
  }

  static DeleteComment(commentId){
    return fetch(CommentsRoute+`/${commentId}`, {
      method: "DELETE",
      headers: header
    })
  }

  static CreateVideo(videoObject){
    return fetch(VideosRoute, {
      method: "POST",
      headers: {  [headerKey]: localStorage.getItem("auth_key") },
      body: videoObject
    })
  }

  static DeleteVideo(videoId){
    return fetch(VideosRoute+`/${videoId}`, {
      method: "DELETE",
      headers: header,
    })
  }

  static UpdateVideo(videoObject){
    return fetch(VideosRoute+`/${videoObject.id}`, {
      method: "PATCH",
      headers: header,
      body: JSON.stringify({video: videoObject})
    })
  }

  static LikeVideo(likeObject){
    return fetch(LikesRoute, {
      method: "POST",
      headers: header,
      body: JSON.stringify({like: likeObject})
    })
  }

  static DislikeVideo(dislikeObject){
    return fetch(DislikeRoute, {
      method: "POST",
      headers: header,
      body: JSON.stringify({dislike: dislikeObject})
    })
  }

  static UnlikeVideo(likeId){
    return fetch(LikesRoute+`/${likeId}`, {
      method: "DELETE",
      headers: header
    })
  }

  static UndislikeVideo(dislikeId){
    return fetch(DislikeRoute+`/${dislikeId}`, {
      method: "DELETE",
      headers: header
    })
  }

  static Subscribe(subscriptionObj){
    return fetch(SubscriptionRoute, {
      method: "POST",
      headers: header,
      body: JSON.stringify({subscription: subscriptionObj})
    })
  }

  static UnSubscribe(subscriptionObj){
    return fetch(UnSubscribeRoute, {
      method: "POST",
      headers: header,
      body: JSON.stringify({subscription: subscriptionObj})
    })
  }

}

export default VideoAdapter;
