import '../stylesheets/VideoForm.css';
import { Button, Form } from 'semantic-ui-react'
import { useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router';


import VideoAdapter from '../adapters/VideoAdapter';

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
  const [previewImg, setPreviewImg] = useState('https://journavel.com/wp-content/uploads/2014/11/img-placeholder-dark.jpg');
  const [loading, setLoadingScreen] = useState(false);

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
      })

    }

  }, [])

  const setUpImg = (e) => {
    const thisImg = e.target.files[0];
    if(thisImg){
      const reader = new FileReader();
      reader.addEventListener('load', (e) => setPreviewImg(e.target.result));
      reader.readAsDataURL(thisImg);
      setImg(thisImg)
      setImgName(thisImg.name)
    }
  }

  const formSubmit = () => {
    setLoadingScreen(true);
    let errorStates = [];
    if(name===''){ errorStates = [...errorStates, 'name'] }
    if(!img){ errorStates = [...errorStates, 'img'] }
    if(!video){ errorStates = [...errorStates, 'video'] }
    if(desc===''){ errorStates = [...errorStates, 'desc'] }

    if(errorStates.length === 0){ //There aren't any errors
      setErrors(null); setName(''); setImg(''); setVideo(''); setDesc(''); //Resetting the form

      const videoObject = new FormData();

      videoObject.append('name', name);
      videoObject.append('video', video);
      videoObject.append('description', desc);
      videoObject.append('thumbnail', img);

      if(id){videoObject.append('id', id)}

      const adapterMethod = id ? VideoAdapter.UpdateVideo : VideoAdapter.CreateVideo
      adapterMethod(videoObject)
      .then(response => response.json())
      .then(setRedirectUser);

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


  return (
    <>
    { redirectUser ? <Redirect to={`/videos/${redirectUser.id}`}/> : null }
    { loading ? <LoadingScreen /> :

      <div className="video-form">
        <Form onSubmit={formSubmit} >
          <h3> Create a new video </h3>
          <input
            style={isInvalid('name')}
            className="title-stuff"
            onChange={e => setName(e.target.value)}
            value={name}
            placeholder="Enter title of video" />
          <div className="form-content">

            <img id="preview-img" src={previewImg} />

            <div className="form-input-fields">
              <Form.Field>
                <input
                  id='img'
                  className="file-field img-field"
                  type='file'
                  onChange={ setUpImg }/>
                <label
                  style={isInvalid('img')}
                  for='img'> {imgName} </label>
                <input
                  className="file-field video-field"
                  type='file'
                  id='vid'
                  onChange={e => {setVideo(e.target.files[0]); setVidName(e.target.files[0].name)}}/>
                <label
                  style={isInvalid('video')}
                  for='vid'> {vidName} </label>
                <textarea
                  style={isInvalid('desc')}
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  id="description"
                  placeholder="Enter description"/>
              </Form.Field>
            </div>
          </div>

          <div className="buttons">
            <button id="submit">Submit</button>
            <a id='cancel' href="/profile">Cancel</a>
          </div>
        </Form>
      </div>

     }
    </>
  )
}

export default VideoForm;
