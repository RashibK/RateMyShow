import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchUserData = createAsyncThunk('user/fetchUserData', async () => {
    console.log('Hey I am in fetching data thing!!!')
    // // get access_token from session storage
    let result = await browser.storage.session.get('mal_access_token');

    const malAccessToken = result.mal_access_token;

    // do a fetch call to get user's data
    let response = await fetch('https://api.myanimelist.net/v2/users/@me?fields=anime_statistics', {
        headers: {
            'Authorization': `Bearer ${malAccessToken}`
        }
    });

    const userInfo = await response.json();
    await browser.storage.session.set({user_data: userInfo});



    return userInfo;

})



const initialState = {
    userData: {}
}


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUserData.fulfilled, (state, action) => {
            state.userData = action.payload 
        })
    }
})

export default userSlice.reducer

