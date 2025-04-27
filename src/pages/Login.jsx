import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { malOauth, exchangeCodeForRefreshToken } from '../features/auth/authSlice';

function Login() {

    const dispatch = useDispatch();

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

     async function onSubmit(event) {
        event.preventDefault();

        const category = event.target.contentCategory.value;
        const provider = event.target.providerOptions.value;

        if (category === "anime") {
            if (provider === "myanimelist") {
                const result = await dispatch(malOauth());
                dispatch(exchangeCodeForRefreshToken(result.payload))
                
            }
        }

    }

  return (
    <div>
        <div className="title">Log In</div>
        <form onSubmit={onSubmit}>
        <div className="category">
            <label for='select-category'>Category</label>
            <select name="contentCategory" id="select-category" value={selectedFirstOption} onChange={getProvider}>
                <option>Select a Category</option>
                <option value='anime'>Anime</option>
                <option value='movie'>Movie</option>
                <option value='tvshow'>TV Show</option> 
            </select>
        </div>
        <div className="provider">
            <label for='select-provider'>Provider</label>
            <select name="providerOptions" id="select-provider" >
                {selectSecondOption.map(element => (
                    <option key={element.toLowerCase()} value={element.toLowerCase()}>{element}</option>
                ))}

            </select>
        </div>
        <button type='submit'>Authenticate</button>
        </form>
    </div>
  )
}

export default Login
