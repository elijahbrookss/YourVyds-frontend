import { Button, Form } from 'semantic-ui-react'
import { useSelector } from 'react-redux';


const CommentForm = props => {

  const currentUser = useSelector(state => state.userState.currentUser);


  return (
    <div className="comment">
      <div className="first-section">
        <img
          className="profile-picture"
          src={currentUser ? currentUser.profile_picture : "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"}
        />
      </div>
      <div className="second-section">
        <Form onSubmit={props.createComment}>
          <Form.Field>
            <input
             autocomplete="off"
             placeholder="Leave a comment"
             id="comment-input"
            />
          </Form.Field>
        </Form>
        <div className="comment-divider"> </div>
      </div>

    </div>
  )

}

export default CommentForm
