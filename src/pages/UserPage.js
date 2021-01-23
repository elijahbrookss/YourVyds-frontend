import '../stylesheets/ProfilePage.css';
import VideoCard from '../components/VideoCard';
import UserAdapter from '../adapters/UserAdapter';
import VideoAdapter from '../adapters/VideoAdapter';

// React Imports
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

const UserPage = () => {

  const thisUser = useSelector(state => state.userState.currentUser);
  const [ videos, setVideos ] = useState([]);
  const [ currentUser, setCurrentUser ] = useState(null);
  const [ subscriptionInfo, setSubscriptionInfo ] = useState(null);
  const [ refresher, setRefresher ] = useState(false);

  const { id } = useParams();

  // ComponentDidMount
  // I know this is messy, get off my case, I coded this at 3am.
  useEffect(() => {

    UserAdapter.GetSubscriptionInfoOnUser(id)
    .then(response => response.json())
    .then(setSubscriptionInfo);

    UserAdapter.GetUser(id)
    .then(response => response.json())
    .then(userObj => {

      setVideos(userObj.videos);
      setCurrentUser(userObj);
    });

  }, [refresher])



  let subscribers;
  let subscriptions;

  if (subscriptionInfo){
    subscribers = subscriptionInfo.subscribers;
    subscriptions = subscriptionInfo.subscriptions;
  }



  const subscribe = () => {
    const subObj = {
      user_id: thisUser.id,
      subscribed_to_id: currentUser.id,
    }

    VideoAdapter.Subscribe(subObj)
    .then(response => response.json())
    .then(setRefresher)
  }

  const unSubscribe = () => {

    const subObj = {
      user_id: thisUser.id,
      subscribed_to_id: currentUser.id,
    }

    VideoAdapter.UnSubscribe(subObj)
    .then(setRefresher)
  }

  const handleSubscribe = () => {
    if(!thisUser || thisUser.id === currentUser.id ){ return }
    const isSubscribed = subscriptionInfo.subscribers.find(subscription => subscription.id === thisUser.id);
    if(isSubscribed){unSubscribe()}else{subscribe()};
  }


  return (
    <div className="main-holder">
      <div className="banner">
        <img src="https://www.phdmedia.com/san-francisco/wp-content/uploads/sites/47/2017/06/Banner-2.gif" id="banner-img" />
      </div>
      <img
        id="profile-img"
        src="https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
      />
      <span className="banner-attach"></span>

      <h1 id="profile-name">{currentUser ? currentUser.username : "John Doe"}</h1>

      <div className="profile-stats">
        <div className="info">
          <span>{subscribers ? subscribers.length : 0}</span>
          <p className="info-text" >Subscribers </p>
        </div>
        <span className="d1"></span>
        <div className="info">
          <span> {videos ? videos.length : 0} </span>
          <p className="info-text" >Videos</p>
        </div>
        <span className="d1" ></span>
        <div className="info">
          <span>{subscriptions ? subscriptions.length : 0}</span>
          <p className="info-text" >Subscriptions</p>
        </div>
      </div>
      <span onClick={handleSubscribe} id="subscribesl-button">
        {
          thisUser ?
            subscriptionInfo ?
              subscriptionInfo.subscribers.find( subscription => subscription.id === thisUser.id )
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
      <div className="content-holder">
        <div className="content">
          <div className= "title-holder">
            <h3>Uploaded Videos</h3>
          </div>
          <div className="content-context">
            {
              videos ?
                videos.length > 0 ?

                    videos.map(video => {
                      return <VideoCard
                        key={video.id}
                        video={video}
                      />
                    })

                  :
                  <p> This user doesn't have any videos. </p>
                :
                <p> This user doesn't have any videos. </p>
            }

          </div>
        </div>
      </div>
    </div>
  )

}
export default UserPage
