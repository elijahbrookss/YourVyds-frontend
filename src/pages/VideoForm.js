import '../stylesheets/VideoForm.css';
import { Button, Form } from 'semantic-ui-react'
import { useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router';

import VideoAdapter from '../adapters/VideoAdapter';
import ReactPlayer from 'react-player';

// Pages
import LoadingScreen from '../pages/LoadingScreen';

const VideoForm = () => {

  // Variables
  const [name, setName] = useState('');
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [desc, setDesc] = useState('');
  const [errors, setErrors] = useState(null);
  const [redirectUser, setRedirectUser] = useState(false);
  const [loading, setLoadingScreen] = useState(false);

  const [previewImg, setPreviewImg] = useState('https://journavel.com/wp-content/uploads/2014/11/img-placeholder-dark.jpg');
  const [previewVid, setPreviewVid] = useState(null);

  const [showFormContent, setShowFormContent] = useState(true);

  const [vidName, setVidName] = useState('Upload Video');
  const [imgName, setImgName] = useState('Upload Thumbnail');

  const { id } = useParams();
  // Methods

  useEffect(() => {
    if(id){
      VideoAdapter.GetVideo(id)
      .then(response => response.json())
      .then(video => {
        setName(video.name);
        setImg(video.thumbnail);
        setVideo(video.video);
        setDesc(video.description);
        setPreviewImg(video.thumbnail);
        setPreviewVid(video.video);
        setVidName('Video Uploaded');
        setImgName('Thumbnail Uploaded');
      })

    }

  }, [])

  const setUpVid = e => {
    const thisVid = e.target.files[0];
    if(thisVid){
      const reader = new FileReader();
      reader.addEventListener('load', (e) => setPreviewVid(e.target.result));
      reader.readAsDataURL(thisVid);
      setVideo(thisVid);
      setVidName(thisVid.name);
      filterError('video');
    }else{
      setVidName("Upload Video");
      setVideo(null);
      setPreviewVid(null);
    }
  }

  const setUpImg = (e) => {
    const thisImg = e.target.files[0];
    if(thisImg){
      thisImg.name.toLowerCase();
      const reader = new FileReader();
      reader.addEventListener('load', (e) => setPreviewImg(e.target.result));
      reader.readAsDataURL(thisImg);
      setImg(thisImg);
      setImgName(thisImg.name)
      filterError('img');
    }else{
      setImgName("Upload Thumbnail");
      setImg(null);
      setPreviewImg('https://journavel.com/wp-content/uploads/2014/11/img-placeholder-dark.jpg')
    }
  }

  const formSubmit = () => {
    let errorStates = [];
    if(name===''){ errorStates = [...errorStates, 'name'] }
    if(!img){ errorStates = [...errorStates, 'img'] }
    if(!video){ errorStates = [...errorStates, 'video'] }
    if(desc===''){ errorStates = [...errorStates, 'desc'] }

    if(errorStates.length === 0){ //There aren't any errors
      setErrors(null); setName(''); setImg(''); setVideo(''); setDesc(''); //Resetting the form
      setLoadingScreen(true);

      const videoObject = new FormData();

      videoObject.append('name', name);
      videoObject.append('video', video);
      videoObject.append('description', desc);
      videoObject.append('thumbnail', img);

      const adapterMethod = id ? VideoAdapter.UpdateVideo : VideoAdapter.CreateVideo
      adapterMethod(videoObject, parseInt(id))
      .then(response => response.json())
      .then(f => {
        if(f.error){
          setErrors(['img', 'video']);
          setLoadingScreen(false);
          console.log(f);
         }
        else{ setRedirectUser(f) }
      })
      .catch(setErrors);

    }else{
      setErrors(errorStates);
    }
  }

  const isInvalid = (state) => {
    if(!errors){return}
    if(errors.find(s => s === state)){
      return {
        background: "rgba(75, 0, 0, .2)",
        borderColor: "rgba(200, 0, 0, .3)",
      }
    }
  }

  const filterError = (errorName) => {
    if(errors && errors.includes(errorName)){
      setErrors(errors.filter( error => error !== errorName))
    }
  }


  return (
    <>
    { redirectUser ? <Redirect to={`/videos/${redirectUser.id}`}/> : null }
    { loading ? <LoadingScreen /> :

      <div className="video-form">
        {
          showFormContent ?
            <>
            <div
              className="preview-video"
            >
              {
                video ?
                <span onClick={() => setShowFormContent(false)}
                  > Preview video <i className="fas fa-arrow-right" /> </span>
                :
                null
              }
            </div>
            <Form onSubmit={formSubmit} >
              <h3> Create a new video </h3>
              <input
                style={isInvalid('name')}
                className="title-stuff"
                onChange={e => {setName(e.target.value); filterError('name')}}
                value={name}
                placeholder="Enter title of video" />
              <div className="form-content">

                <img alt="preview immage" id="preview-img" src={previewImg} />

                <div className="form-input-fields">
                  <Form.Field>
                    <input
                      accept='.jpg, .png, .jpeg, .gif'
                      id='img'
                      className="file-field img-field"
                      type='file'
                      onChange={ setUpImg }/>
                    <label
                      style={isInvalid('img')}
                      for='img'> {imgName} </label>
                    <input
                      accept='.mov, .mp4'
                      className="file-field video-field"
                      type='file'
                      id='vid'
                      onChange={ setUpVid }/>
                    <label
                      style={isInvalid('video')}
                      for='vid'> {vidName} </label>
                    <textarea
                      style={isInvalid('desc')}
                      value={desc}
                      onChange={e => {setDesc(e.target.value); filterError('desc')} }
                      id="description"
                      placeholder="Enter description"/>
                  </Form.Field>
                </div>
              </div>

              <div className="options-holder">
                <h5
                  id="didntwork"
                  style={ errors ? {color: "rgb(150, 0, 0)"} :
                  name && video && img && desc ?
                   {color: 'rgb(0, 150, 0)'}
                  :
                   {color: 'rgb(150, 150, 150)'} }
                > {
                  errors ?
                   "There was an issue uploading the video."
                   :
                    name && video && img && desc ?
                      "Looking all good!"
                      :
                      "Please fill out all options."
                } </h5>
                <div className="buttons">
                  <button id="submit">Submit</button>
                  <a id='cancel' href="/profile">Cancel</a>
                </div>
              </div>

            </Form>
          </>
          :
          <>
          <div
            className="preview-video1"
          >
            {
              video ?
              <span onClick={() => setShowFormContent(true)} >
                <i className="fas fa-arrow-left" /> Go back </span>
              :
              null
            }
          </div>
          <div className="preview-vid-holder">
            <ReactPlayer
              width={"100%"}
              height={"500px"}
              playing
              pip
              controls
              url={ previewVid }
            />
          </div>
          </>
        }
      </div>

     }
    </>
  )
}

export default VideoForm;
