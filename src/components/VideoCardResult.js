import { useState } from 'react';
import { useSelector } from 'react-redux';

const VideoCardResult = props => {
  const video = props.video
  const hours = new Date(video.created_at).getHours();
  const currentUser = useSelector(state => state.userState.currentUser);


  let date;

  if(hours/24 <= 1){
    date = 'Less than an hour'
  }else if(hours/24 > 1) {
    date = Math.floor(hours) + ' hours';
  }else if(hours/24 < 30){
    date = Math.floor(hours/24) + ' days';
  }

// Methods
  const showDeleteButton = () => {
    if(!currentUser){return} //No one is logged in
  }

  return (
    <div
      onMouseOver={() => showDeleteButton(true)}
      className="video-card-result"
    >
      <a href={`/videos/${video.id}`}>
        <img
          className="video-thumbnails"
          src={video.thumbnail}
        />
      </a>
      <div className="information">
        <p className="video-title">
          <a href={`/videos/${video.id}`}><b> {video.name} </b></a>
        </p>
        <div className="subtext">
          <div className="user-information">
            <a href={`/users/${video.user.id}`}>
              <img
                className="pfp"
                src={video.user.profile_picture}
              />
              <p><a href={`/users/${video.user.id}`}><b>{video.user.username}</b></a></p>
            </a>
          </div>
          <p> {video.likes.length} Likes ∘ {date} ago </p>
          <p className="description"> {video.description} </p>
        </div>
      </div>
    </div>
  );
}

export default VideoCardResult;
