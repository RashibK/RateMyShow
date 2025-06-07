import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { malOauth, exchangeCodeForRefreshToken } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import AnimeToggle from '../components/AnimeToggle';

function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
 
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
                try {
                      const userData = await browser.runtime.sendMessage({type: 'start_mal_auth'})
                    navigate('/');

                }catch(error) {
                    console.log('Error:', error)
                }
              
            }
        }

    }

  return (
    <div className='h-[calc(600px-48px)] flex justify-center items-center w-full'>
        <div className='grid grid-rows-3 gap-4 h-[90%] w-[90%]'>
            <section className="anime-card border border-border bg-[#1c1f24] flex flex-col rounded-xl p-4 gap-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-border pb-2">
                    <div className="provider-type text-white font-semibold text-sm">
                        Anime
                    </div>

                        < AnimeToggle />

                </div>
                <div className="main-card flex gap-4">
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 mt-2">
                        <div className="bg-white w-10 h-10 overflow-hidden border border-border rounded-full"> 
                            <img src='https://cdn.myanimelist.net/s/common/userimages/0b067390-6d23-45f0-959c-226fc16bf87b_225w?s=1ed5cee1e64005f9a9b1070eeb3ec927' className='w-full h-full rounded-full cursor-pointer' />
                            </div>


                            <span className='text-white text-sm'>Connected as <span className='font-medium cursor-pointer'>poke1</span></span>
                        <div className='flex'>
                            <button className='mb-0.5 px-4 py-1 text-xs bg-red-700 hover:bg-red-600 text-white rounded-lg transition-all'>Disconnect</button>
                        </div>
                    </div>


                   
                </div>
            </section>
            <section className="movie-card border border-border bg-[#1c1f24] flex flex-col rounded-xl p-4 gap-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-border pb-2">
                    <div className="provider-type text-white font-semibold text-sm">
                        Movie
                    </div>



                </div>
                <div className="main-card flex gap-4">
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 mt-2">
                        <div className="bg-white w-10 h-10 overflow-hidden border border-border rounded-full"> 
                            <img src='https://cdn.myanimelist.net/s/common/userimages/0b067390-6d23-45f0-959c-226fc16bf87b_225w?s=1ed5cee1e64005f9a9b1070eeb3ec927' className='w-full h-full rounded-full cursor-pointer' />
                            </div>


                            <span className='text-white text-sm'>Connected as <span className='font-medium cursor-pointer'>poke1</span></span>
                        <div className='flex'>
                            <button className='mb-0.5 px-4 py-1 text-xs bg-red-700 hover:bg-red-600 text-white rounded-lg transition-all'>Disconnect</button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="tv-shows-card border border-border bg-[#1c1f24] flex flex-col rounded-xl p-4 gap-4 shadow-sm ">
                TV Shows
            </section>
        </div>

    </div>


  )
}

export default Login
{/* <div>
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
    </div> */}
    