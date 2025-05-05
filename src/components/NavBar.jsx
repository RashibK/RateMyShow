import React from 'react'
import { useSelector } from 'react-redux'
import Settings from '../pages/Settings'

function NavBar() {
    const userData = useSelector((state) => (state.user.userData))
    console.log('userData from navbar:', userData)
  return (
    <div>
      {userData && <Settings />}
    </div>
  )
}

export default NavBar