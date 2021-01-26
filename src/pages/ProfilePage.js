import '../stylesheets/ProfilePage.css';
import VideoCard from '../components/VideoCard';
import UserAdapter from '../adapters/UserAdapter';
import VideoAdapter from '../adapters/VideoAdapter';
// React Imports
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

const ProfilePage = () => {
  const [videos, setVideos] = useState([]);
  const [trendingVideos, setTrendingVideos] = useState(null);
  const [subscriptionVideos, setSubscriptionVideos] = useState(null);
  const [profileImg, setProfileImg] = useState('https://res.cloudinary.com/dxftl1qzu/image/upload/v1611617383/default_image_wqbtcu.png')
  const [ bannerImg, setBannerImg ] = useState('https://www.acurax.com/wp-content/themes/acuraxsite/images/inner_page_bnr.jpg?x67877');

  const dispatch = useDispatch();
  // ComponentDidMount
  // I know this is messy, get off my case, I coded this at 3am.
  useEffect(() => {
    UserAdapter.getCurrentUser()
    .then(response=>response.json())
    .then(data => {
      if(!data.message){
        setVideos(data.videos);
        if(data.banner_picture && data.banner_picture!==''){setBannerImg(data.banner_picture)}
        if(data.profile_picture && data.profile_picture!==''){setProfileImg(data.profile_picture)}
        dispatch({type: "SET_USER", currentUser: data})
      }
    })

    VideoAdapter.GetAllVideos()
    .then(response => response.json())
    .then(videosObject => {
      videosObject = videosObject.sort((a, b) => b.likes.length - a.likes.length);

      let trendingVideos = [];
      for (var i = 0; i < 8; i++) {
        if(videosObject[i]){  trendingVideos = [ ...trendingVideos, videosObject[i]] }
      }

      setTrendingVideos(trendingVideos);
    });

    UserAdapter.GetSubscriptionInfo()
    .then(response => response.json())
    .then(subInfo => {
      const subscriptions = subInfo.subscriptions;
      let videosArray = [];

      subscriptions.forEach(subscription => {
        const latestVideo = subscription.videos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
        if(latestVideo){videosArray = [...videosArray, latestVideo]}
      });

      setSubscriptionVideos(videosArray);
      dispatch({type: "SET_SUB_INFO", subInfo})
    })

  }, [])

  const userState = useSelector(state => state.userState);
  // User Variables
  const currentUser = userState.currentUser;
  const subscriptionInfo = userState.subscriptionInfo;

  let subscribers;
  let subscriptions;

  if (subscriptionInfo){
    subscribers = subscriptionInfo.subscribers;
    subscriptions = subscriptionInfo.subscriptions;
  }

  // Methods
  const deleteVideo = (video) => {
    VideoAdapter.DeleteVideo(video.id)
    .then(() => setVideos(videos.filter(v => video.id !== v.id)))
  }

  const setUpImg = (e) => {
    if(!currentUser){ return }
    const thisImg = e.target.files[0];
    if(thisImg){
      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        setProfileImg(e.target.result)

        const userObject = new FormData();

        userObject.append('id', currentUser.id);
        userObject.append('profile_picture', thisImg);
        UserAdapter.UpdateUser(userObject, currentUser.id)
      });
      reader.readAsDataURL(thisImg);

    }
  }

    const setUpBanner = (e) => {
      if(!currentUser){ return }
      const thisImg = e.target.files[0];
      if(thisImg){
        const reader = new FileReader();
        reader.addEventListener('load', (e) => {
          setBannerImg(e.target.result)
          const userObject = new FormData();

          userObject.append('id', currentUser.id);
          userObject.append('banner_picture', thisImg);
          UserAdapter.UpdateUser(userObject, currentUser.id)
        });
        reader.readAsDataURL(thisImg);

      }

  }

  return (
    <div className="main-holder">
      <div className="banner">
        <input
          id='banner-img-field'
          type='file'
          className="f1le-field"
          onChange={ setUpBanner }
        />
        <label for='banner-img-field' id='banner-img'>
          <img src={bannerImg}/>
        </label>
      </div>
      <input
        id='profile-img-field'
        className="f1le-field"
        type='file'
        onChange={ setUpImg }
      />
      <label for='profile-img-field' id='profile-img'>
        <img
          src={profileImg}
        />
      </label>
      <span className="banner-attach"></span>

      <h1 id="profile-name">{currentUser ? currentUser.username : null}</h1>

      <div className="profile-stats">
        <div className="info">
          <h4>{subscribers ? subscribers.length : 0}</h4>
          <p className="info-text" >Subscribers </p>
        </div>
        <span className="d1"></span>
        <div className="info">
          <h4> {videos ? videos.length : 0} </h4>
          <p className="info-text" >Videos</p>
        </div>
        <span className="d1" ></span>
        <div className="info">
          <h4>{subscriptions ? subscriptions.length : 0}</h4>
          <p className="info-text" >Subscriptions</p>
        </div>
      </div>
      <a
        href="/video/new"
        className="sidebar-button1"
      ><i className="fas fa-video"> New Video </i></a>
      <div className="content-holder">

        <div className="content">
          <div className= "title-holder">
            <h3>🔥 Trending Videos 🔥</h3>
          </div>
          <div className="content-context">
          {
            trendingVideos ?
              trendingVideos.length > 0 ?
               trendingVideos.map(video => {
                return <VideoCard
                          key = {video.id}
                          deleteVideo={deleteVideo}
                          video={video} />
              })
               :
               <p> There aren't any videos trending right now. </p>
               :
               <p> There aren't any videos trending right now. </p>
          }

          </div>
        </div>
        <div className="content">
          <div className= "title-holder">
            <h3>Your Videos</h3>

          </div>
          <div className="content-context">
            {
              videos ?
                videos.length > 0 ?

                    videos.map(video => {
                      return <VideoCard
                        key={video.id}
                        deleteVideo={deleteVideo}
                        video={video}
                      />
                    })

                  :
                  <p> You don't have any videos. </p>
                :
                <p> You don't have any videos. </p>
            }

          </div>
        </div>
        <div className="content">
          <div className= "title-holder">
            <h3>Subscriptions</h3>
          </div>
          <div className="content-context">
          {
            subscriptionVideos ?
              subscriptionVideos.length > 0 ?

                  subscriptionVideos.map(video => {
                    return <VideoCard
                      key={video.id}
                      deleteVideo={deleteVideo}
                      video={video}
                    />
                  })

                :
                <p> There aren't any videos from your subscriptions </p>
              :
              <p> There aren't any videos from your subscriptions </p>
          }
          </div>
        </div>

      </div>

    </div>
  )

}
export default ProfilePage
