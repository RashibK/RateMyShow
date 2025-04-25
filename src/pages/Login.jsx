import React from 'react';
import { useState } from 'react';

function Login() {

    const data = {
        anime: ['MyAnimeList', 'AniList'],
        movie: ['LetterBoxd', 'Trakt'],
        tvshow: ['Trakt']
    }

    const [selectedFirstOption, setSelectedFirstOption] = useState('');
    const [selectSecondOption, setSelectSecondOption] = useState([]);

    function getProvider(event) {
        setSelectedFirstOption(event.target.value);
        setSelectSecondOption(data[event.target.value] || []);
    }

  return (
    <div>
        <div className="title">Log In</div>
        <div className="category">
            <label for='select-category'>Category</label>
            <select name="content-category" id="select-category" value={selectedFirstOption} onChange={getProvider}>
                <option>Select a Category</option>
                <option value='anime'>Anime</option>
                <option value='movie'>Movie</option>
                <option value='tvshow'>TV Show</option> 
            </select>
        </div>
        <div className="provider">
            <label for='select-provider'>Provider</label>
            <select name="provider-options" id="select-provider" >
                {selectSecondOption.map(element => (
                    <option key={element.toLowerCase()} value={element.toLowerCase()}>{element}</option>
                ))}

            </select>
        </div>
        <button>Authenticate</button>
    </div>
  )
}

export default Login

{/* 
                <option value=''>Select a Provider</option>
                <option value={mal}>MyAnimeList</option>
                <option value={anilist}>AniList</option>
                <option value={letterboxd}>LetterBoxd</option>
                <option value={trakt}>Trakt</option> */}