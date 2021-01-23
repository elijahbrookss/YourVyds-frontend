import { Form } from 'semantic-ui-react';
import '../stylesheets/SearchPage.css';
import VideoAdapter from '../adapters/VideoAdapter';
import VideoCardResult from '../components/VideoCardResult';

import { useState, useEffect } from 'react';

const SearchPage = () => {

  const [ allVideos, setAllVideos ] = useState(null);
  const [ searchText, setSearchText ] = useState('');
  const [ queryText, setQueryText ] = useState('');
  const [ searchResults, setSearchResults ] = useState([]);
  const [ showResults, setShowResults ] = useState(false);

  useEffect(() => {
    VideoAdapter.GetAllVideos()
    .then(response => response.json())
    .then(setAllVideos);
  }, [])


  const formSubmit = () => {
    if(searchText === ''){return}
    const query = searchText.toLowerCase();
    setQueryText(searchText);
    setSearchText(''); // Reset Form

    let searchResults = [];

    allVideos.forEach((video) => {
      if(video.name.toLowerCase().includes(query) || video.user.username.includes(query)){
        searchResults = [...searchResults, video];
      }
    })

    setShowResults(true);
    setSearchResults(searchResults);
  }

  return (
    <div className="search-page">
      <div className="navbar">
        <div className="searchbar">
          <Form onSubmit={formSubmit}>
            <input
              onChange={e => setSearchText(e.target.value)}
              value={searchText}
              placeholder="Search for a video"
              autoComplete={'off'}
            />
            <i className="fas fa-search"/>
          </Form>
        </div>
      </div>

      <div className="search-content">
        <div className="filter-options">
          { showResults ? <h4>Showing results for "{ queryText }"</h4> : null }
        </div>

        <div className="search-results">
          {
            searchResults.length > 0 ?
              searchResults.map(video => {
                return <VideoCardResult
                  key={video.id}
                  video={video}
                />
              })
              :
               showResults ?
                  <p className="no-results"> There aren't any results for "{ queryText }". </p>
                  :
                  null

          }
        </div>
      </div>

    </div>
  )
}


export default SearchPage;
