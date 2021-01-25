import { useSelector, useDispatch } from 'react-redux';
import UserAdapter from '../adapters/UserAdapter';


const SideBar = () => {

  const userState = useSelector(state => state.userState);
  const dispatch = useDispatch();

  const logout = () => {
    UserAdapter.LogoutUser()
    dispatch({type: 'SET_USER', currentUser: null});
    dispatch({type: "SET_SUB_INFO", subInfo: null});
  }

  return (
      <div className="w3-sidebar w3-bar-block" id="sidebar">
        { userState.currentUser ? <>
          <a
            href="/profile"
            className="sidebar-button">
            <i className="fas fa-home"></i>
          </a>
          <a
            href="/library"
            className="sidebar-button"
          ><i className="fa fa-film"></i></a>
          <a
            href="/video/new"
            className="sidebar-button"
          ><i className="fas fa-video"></i></a>
          <a
            href="/search"
            className="sidebar-button"
          ><i className="fas fa-search"></i></a>
          <a
            id="logout"
            onClick={logout}
            href={document.URL}
            className="sidebar-button"
          ><i className="fas fa-sign-out-alt"></i></a>
        </>
        :
        <>
          <a
            href="/"
            className="sidebar-button">
            <i className="fas fa-home"></i>
          </a>
          <a
            href="/search"
            className="sidebar-button"
          ><i className="fas fa-search"></i></a>
          <a
            href="/login"
            className="sidebar-button">
            <i className="fas fa-sign-in-alt"></i>
          </a>
        </>
      }

    </div>
  )
}

export default SideBar
