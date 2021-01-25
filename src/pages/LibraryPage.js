// CSS
import '../stylesheets/LibraryPage.css';

// Imports
// import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// Components
import VideoCardResult from '../components/VideoCardResult';

// adapters
import UserAdapter from '../adapters/UserAdapter';

const LibraryPage = () => {

  const currentUser = useSelector(state => state.userState.currentUser);
  let savedVideos;

  // Loading variables
  if(currentUser){
    savedVideos = currentUser.saved_videos;
    console.log(savedVideos)
  }

  return (

    <div className="library-page">
      <div className='pf-info'>
        <div>
          <h1> Your Saved Videos </h1>
        </div>
        <div className="pfl">
          <img className="pf-img" src={currentUser ? currentUser.profile_picture : null} />
          <h2> {currentUser ? currentUser.username : null} </h2>
          <p> { savedVideos ? savedVideos.length : 0} saved videos </p>
        </div>
      </div>

      <div className="saved-videos">
      {
        savedVideos ?
          savedVideos.length > 0 ?
            savedVideos.map(result => {
              console.log(result)
              if(result.video){
                return <VideoCardResult
                  key={result.id}
                  video={result.video}
                />
              }})
            :
            <h4> You don't have any saved videos. </h4>
          :
          null
      }
      </div>

    </div>
  )
}

export default LibraryPage;
