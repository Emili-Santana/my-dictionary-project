import React, { useState } from "react";
import "./Dictionary.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Results from "./Results";
import Photos from "./Photos";

export default function Dictionary(props) {
  let [keyword, setkeyword] = useState(props.defaultKeyword);
  let [results, setresults] = useState(null);
  let [loaded, setLoaded] = useState(false);
 let [error, setError] = useState(null);
 let [photos, setPhotos] = useState(null);

  //Call Api answer
  function handleDictionaryResponse(response) {
    if (response.data && response.data.length > 0) {
    setresults(response.data[0]);
    setLoaded(true);
    setError(null);
  } else {
    handleError();
  }
  }
//Call Api Photos
  function handlePexelsResponse(response) {
    console.log(response.data);
    setPhotos(response.data.photos);
  }
  // call the function in case of erro
  function handleError(error) {
    setLoaded(true);
    setError(
      `Sorry, we couldn't find the word "${keyword}".`
    );
  }

  //Call when the form is submitted
  function search(event) {
   
      if (event) event.preventDefault();
  
      
      if (!keyword.trim()) {
        setError("Please enter a word to search.");
        return;
      }

    // API URL for Dictionary
    let apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${keyword}`; 
    axios.get(apiUrl).then(handleDictionaryResponse).catch(handleError); 


        // API URL for Photos
    let pexelsApiKey =
      "c2Q3rdAdCGUrX7zBuGXKQEKmmFVBWF6PZcP6mAoxN29jYgQCqh2Z17MB"; 
    let pexelsApiUrl = `https://api.pexels.com/v1/search?query=${keyword}&per_page=3`;
    axios.get(pexelsApiUrl, { headers: { Authorization: pexelsApiKey } }) 
      .then(handlePexelsResponse)
      .catch(handleError); // call the function in case of erro
  }

  //Change the word
  function handleKeyChange(event) {
    setkeyword(event.target.value);
  }

 // Reset all the states to clear the search
 function resetSearch() {
  setkeyword("");  
  setresults(null);
  setPhotos(null);
  setError(null);
  setLoaded(false);
}
   // Handle form submission
  function handleSubmit(event) {
    event.preventDefault();
    search(event);
  }
  

  
    return (
      <div className="Dictionary">
        <form onSubmit={handleSubmit}>
          <label htmlFor="searchInput" className="form-search mt-3 mb-3 fs-3">
            What word do you want to look up?
          </label>
          <input
            type="search"
            className="form-control w-25 mx-auto"
            placeholder="Type the word"
            onChange={handleKeyChange}
          value={keyword} 
          />
        </form>
        <p className="example-form">Ex.: Paris, wine, yoga, coding</p>
        <button className="btn-clear-search btn-secondary mt-3" onClick={resetSearch}>Clear Search</button>

       
    
        {error && <p className="text-erro">{error}</p>}
        {/* show the erro mensage, if is the case */}
        
        {loaded && results && (
          <div>
        <Results results={results} />
        {/* show the results, if is the case */}

        <Photos photos={photos} />
        </div>
      )}
    </div>
  );
}