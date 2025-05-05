import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { malRefreshAccessToken } from "../features/auth/authSlice";

function PrivateRoutes() {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        async function getUserData() {
            
            try {
                console.log('Hello from private route');
                const response = await browser.runtime.sendMessage({type: 'send_user_data'});
                         
                console.log('second time around:', response)
                
                if (response?.name) {
                    console.log('Hello from place where there is response data');
                    setUserData(response);
                }
            }catch(error) {
                console.log(error)
            }finally {
                setLoading(false);
            }

    }        
        getUserData();
    }, [])


    if(loading) return (<div>Loading...</div>)
        
    return (
         userData ? <Outlet /> : <Navigate to="/login" />
    )

}

export default PrivateRoutes