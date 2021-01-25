// Imports
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactPlayer from 'react-player';

// Components
import Comment from '../components/Comment';
import CommentForm from '../components/CommentForm';

// CSS Imports
import '../stylesheets/VideoPage.css';

// Adapters
import VideoAdapter from '../adapters/VideoAdapter';
import UserAdapter from '../adapters/UserAdapter';

const VideoPage = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.userState.currentUser);
  const currentUserSubscriptionInfo = useSelector(state => state.userState.subscriptionInfo);

  const [currentVideo, setCurrentVideo] = useState(null);
  const [videoLiked, setVideoLiked] = useState(false);
  const [videoDisliked, setVideoDisliked] = useState(false);
  const [videoSaved, setVideoSaved] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [refresh, setRefresh] = useState(null);

  let date;
  let comments;
  let description;
  let user;

  const isVideoInteractedWith = videoObject => {
    if(!currentUser){return}
    currentUser.likes.forEach(like => {
      if(like.video_id === videoObject.id){setVideoLiked(true)}
    });
    currentUser.dislikes.forEach(dislike => {
      if(dislike.video_id === videoObject.id){setVideoDisliked(true)}
    });
    currentUser.saved_videos.forEach(savedVid => {
      if(savedVid.video_id === videoObject.id){setVideoSaved(true)}
    });
  }

  // ComponentDidMount
  useEffect(() => {

    if(!currentVideo){
      VideoAdapter.GetVideo(id)
      .then(response => response.json())
      .then(setCurrentVideo);
    }

    if(currentVideo && currentVideo.user.id){
      UserAdapter.GetSubscriptionInfoOnUser(currentVideo.user.id)
      .then(response => response.json())
      .then(setSubscriptionInfo);

      isVideoInteractedWith(currentVideo);
    }
  }, [currentUser, currentVideo, refresh])

  // Methods
  const sortComments = comments => {
    return comments.sort( (a, b) => new Date(b.created_at) - new Date(a.created_at) )
  }

  const subscribe = () => {
    const subObj = {
      user_id: currentUser.id,
      subscribed_to_id: user.id,
    }

    VideoAdapter.Subscribe(subObj)
    .then(response => response.json())
    .then(setRefresh)
  }

  const unSubscribe = () => {

    const subObj = {
      user_id: currentUser.id,
      subscribed_to_id: user.id,
    }

    VideoAdapter.UnSubscribe(subObj)
    .then(setRefresh)
  }

  const handleSubscribe = () => {
    if(!currentUser || currentUser.id === user.id){ return }
    const isSubscribed = subscriptionInfo.subscribers.find(subscription => subscription.id === currentUser.id);
    if(isSubscribed){unSubscribe()}else{subscribe()};
  }

  const deleteComment = comment => {
    VideoAdapter.DeleteComment(comment.id)
    .then(() => {
      const newVideo = {...currentVideo};
      const allComments = currentVideo.comments;
      newVideo.comments = allComments.filter(c => c.id !== comment.id);

      setCurrentVideo(newVideo);
    });
  }

  const createComment = event => {
    const inputElement = document.querySelector("#comment-input");
    const comment = inputElement.value;
    if(comment === ""){return} //If there's an empty message
    event.target.reset();
    const commentObj = {
        user_id: currentUser.id,
        video_id: currentVideo.id,
        content: comment
    }

    VideoAdapter.PostComment(commentObj)
    .then(response => response.json())
    .then(newComment => {
      const newVideo = {...currentVideo};
      const allComments = currentVideo.comments;
      newVideo.comments = [...allComments, newComment];

      setCurrentVideo(newVideo);
    });
  }

  const unlikeVideo = newVideo => {
    const like = currentVideo.likes.find(like => like.user_id === currentUser.id);
    if(like){
      VideoAdapter.UnlikeVideo(like.id)
      .then(() => {
        newVideo.likes = newVideo.likes.filter(l => l.id !== like.id);

        setVideoLiked(false);
        setCurrentVideo(newVideo);
      } )
    }
  }

  const undislikeVideo = (newVideo) => {
    const dislike = currentVideo.dislikes.find(dislike => dislike.user_id === currentUser.id);
    if(dislike){
      VideoAdapter.UndislikeVideo(dislike.id)
      .then(() => {
        newVideo.dislikes = newVideo.dislikes.filter(l => l.id !== dislike.id);

        setVideoDisliked(false);
        setCurrentVideo(newVideo);
      } )
    }
  }

  const likeVideo = () => {
    if(!currentUser){return}
    if(videoLiked ){ unlikeVideo(currentVideo); return }
    const likeObject = {
      user_id: currentUser.id,
      video_id: currentVideo.id
    }
    VideoAdapter.LikeVideo(likeObject)
    .then(response => response.json())
    .then(like => {
      const newVideo = { ...currentVideo };
      newVideo.likes = [ ...currentVideo.likes, like ];

      setCurrentVideo(newVideo);
      setVideoLiked(true);
      undislikeVideo(newVideo);
    })
  }

  const dislikeVideo = () => {
    if(!currentUser){return}
    if(videoDisliked || !currentUser){ undislikeVideo(currentVideo); return }

    const dislikeObject = {
      user_id: currentUser.id,
      video_id: currentVideo.id
    }
    VideoAdapter.DislikeVideo(dislikeObject)
    .then(response => response.json())
    .then(dislike => {
      const newVideo = { ...currentVideo };
      newVideo.dislikes = [ ...currentVideo.dislikes, dislike ];

      setCurrentVideo(newVideo);
      setVideoDisliked(true);
      unlikeVideo(newVideo);
    })
  }

  const saveVideo = video => {
    const savedVideoObj = {
      user_id: currentUser.id,
      video_id: currentVideo.id
    }

    VideoAdapter.SaveVideo(savedVideoObj)
    .then(response => response.json())
    .then(json => {
      const newUser = { ...currentUser };
      newUser.saved_videos = [...newUser.saved_videos, json];
      dispatch({ type: "SET_USER", currentUser: newUser});
      setVideoSaved(true);
    })
  }

  const unsaveVideo = video => {
    const savedVid = currentUser.saved_videos.find(savedVid => savedVid.video_id === currentVideo.id)

    VideoAdapter.unSaveVideo(savedVid.id)
    .then(() => {
      const newUser = { ...currentUser }
      newUser.saved_videos = newUser.saved_videos.filter(v => v.id !== savedVid.id)
      dispatch({ type: "SET_USER", currentUser: newUser})
      setVideoSaved(false);
    })
  }

  const handleSave = () => {
    if( !currentUser ){ return }

    if(videoSaved){
      unsaveVideo(currentVideo)
    }else {
      saveVideo(currentVideo)
    }

  }

  if(currentVideo){
    const rawDate = new Date(currentVideo.created_at);
    date = `${rawDate.toGMTString().split(" ")[2]} ${rawDate.getDate()}, ${rawDate.getFullYear()}`

    comments = sortComments(currentVideo.comments);
    description = currentVideo.description;
    user = currentVideo.user;
  }


  return (
    <div className="video-page">
      <div className="video-content">
        <div className="video-frame">
          <ReactPlayer
            width={"2000px"}
            height={"750px"}
            playing
            pip
            controls
            url={ currentVideo ? currentVideo.video : ""}
          />
        </div>
        <div className="video-info">
          <div className="info">
            <h4> { currentVideo ? currentVideo.name : null} </h4>
            <span>{ date }</span>
          </div>
          <div className="interactive-buttons">
            <div>
              <i
                style={ videoLiked ? {color: "rgb(0, 200, 0)"} : null }
                onClick={ likeVideo }
                className="fas fa-thumbs-up like"
              >|{ currentVideo ? currentVideo.likes.length : null }
              </i>
            </div>
            <div>
              <i
                style={ videoDisliked ? {color: "rgb(200, 0, 0)"} : null }
                onClick={ dislikeVideo }
                className="fas fa-thumbs-down dislike"
              >|{currentVideo ? currentVideo.dislikes.length : null }

              </i>
            </div>
            <div>
              <i className={ videoSaved ? null : "fas fa-plus"}></i>
              <i
                style={ videoSaved ? {color: "rgb(0, 200, 0)"} : null }
                className= { videoSaved ? "fas fa-check" : "fas fa-stream" }
                onClick={ handleSave }
                >|{ videoSaved ? "SAVED" : "SAVE" } </i>
            </div>
          </div>
        </div>

        <div className="horizontal-divider"></div>


          <div className="subscribe-button-holder">
            <div className="user-info">
              <a href={ user ? `/users/${user.id}` : null}>
                <img
                  className="pfp"
                  src={ user ? user.profile_picture : '' }
                />
              </a>
              <div className="sub-sub">
                <p className="username-info"><a href={ user ? `/users/${user.id}` : null }>{user ? user.username : null}</a></p>
                <p className="subscription-info">
                  { subscriptionInfo ? subscriptionInfo.subscribers.length : 0 } subscribers <i className="fas fa-users" />
                </p>
              </div>
              <span onClick={handleSubscribe} id="subscribes-button">
                {
                  currentUser ?
                    subscriptionInfo ?
                      subscriptionInfo.subscribers.find(subscription => subscription.id === currentUser.id)
                      ?
                      <p>SUBSCRIBED <i className="fas fa-check"></i></p>
                      :
                      <p>SUBSCRIBE <i className="fas fa-bell"></i> </p>
                    :
                    null
                  :
                  <p>SUBSCRIBE <i className="fas fa-bell"></i> </p>
                }
              </span>
            </div>

          </div>



        <div className="description-holder">
          <div className="description-content">
            <p> { description ? description : null } </p>
          </div>
        </div>


      </div>

      <div className="comments-section">
        <h5>{comments ? comments.length : null} Comments</h5>

        <div className="comments">
        {currentUser ? <CommentForm  createComment={createComment}/> : null}
          {
            comments ?
              comments.length > 0 ?
                comments.map(comment => {
                  return <Comment
                    key={comment.id}
                    deleteComment={deleteComment}
                    comment={comment}
                  />
                })
                :
                <p
                  className="notify"
                > There aren't any comments. </p>
              :
              null
          }

        </div>

      </div>


    </div>
  )
}


export default VideoPage;
