import React, { use, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteUserData } from '../features/user/userSlice';

function Settings() {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logOut = async function () {
        const response = await browser.runtime.sendMessage({type: 'logout'})
        if (response.message === 'tokens_deleted') {
            dispatch(deleteUserData());
            navigate('/login');   
        }
    }

  return (
    <div>
        <button onClick={logOut}>Log Out</button>
    </div>
  )
}

export default Settings