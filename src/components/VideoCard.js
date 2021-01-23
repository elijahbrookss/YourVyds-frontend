import { useState } from 'react';
import { useSelector } from 'react-redux';

const VideoCard = props => {
  const video = props.video
  const hours = new Date(video.created_at).getHours();
  const currentUser = useSelector(state => state.userState.currentUser);

  const [ showButton, setShowButton ] = useState(false)


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
    if(currentUser.id === video.user.id && props.deleteVideo){
      setShowButton(true)
    }
  }

  return (
    <div
      onMouseLeave={() => setShowButton(false)}
      onMouseOver={() => showDeleteButton(true)}
      className="video-card"
    >
      <a href={`/videos/${video.id}`}> <img
        className="video-thumbnail"
        src={video.thumbnail}
      />
      <p className="video-title">
        <b> {video.name} </b>
      </p>
      </a>
      <div className="subtext">
        <p><a href={`/users/${video.user.id}`}> {video.user.username} </a></p>
        <p> {video.likes.length} Likes ∘ {date} ago </p>
        { showButton ?
          <div className="modify-buttons">
            <span
              className="delete"
              onClick={() => props.deleteVideo(video)}
            >
            <i className="fas fa-trash-alt"></i>
            </span>
            <a
              className="edit"
              href={`/videos/${video.id}/edit`}
            > <i className="fas fa-edit"></i>
            </a>
          </div>
            : null
          }

      </div>
    </div>
  );
}

export default VideoCard;
