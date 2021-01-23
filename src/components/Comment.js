// Imports
import { useState } from 'react';
import { useSelector } from 'react-redux';
const Comment = (props) => {

  const [ showButton, setShowButton ] = useState(false)

  // Variables
  const comment = props.comment;
  const username = comment.user.username;
  const currentUser = useSelector(state => state.userState.currentUser);

  // Methods

  const showDeleteButton = () => {
    if(!currentUser){return} //No one is logged in
    if(currentUser.id === comment.user.id){
      setShowButton(true)
    }
  }

  return (
    <div
      onMouseLeave={() => setShowButton(false)}
      onMouseOver={() => showDeleteButton(true)}
      className="comment"
    >
      <div className="first-section">
        <img
          className="profile-picture"
          src="https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"
        />
      </div>
      <div className="second-section">
        <p className="username"> <b><a href={`/users/${comment.user.id}`}> {username}</a></b></p>
        <p> {comment.content} </p>
      </div>
      {showButton ?
        <div className="mod-buttons">
          <span className="delete" onClick={() => props.deleteComment(comment)}>
            <i className="fas fa-trash-alt"></i>
          </span>
        </div>
           : null}
    </div>
  )

}

export default Comment
