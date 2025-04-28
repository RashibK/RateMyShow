import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { malRefreshAccessToken } from "../features/auth/authSlice";
import { fetchUserData } from "../features/user/userSlice";

function PrivateRoutes() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const dispatch = useDispatch();

    useEffect(() => {
        async function getUserData() {
            try {
                const result = await browser.storage.session.get('user_data');
                console.log('inside the private route:', result.user_data.name)
                setUserData(result.user_data);


            }catch(error) {
                await dispatch(malRefreshAccessToken());
                await dispatch(fetchUserData());
            }finally{
                setLoading(false)
            }
        }
        getUserData();
    }, [])

    if(loading) return (<div>Loading...</div>)
        
    return (
        (!userData || (Object.keys(userData).length === 0))  ? <Navigate to='/login' /> :  <Outlet />
    )

}

export default PrivateRoutes