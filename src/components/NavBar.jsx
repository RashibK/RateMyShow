import { ChevronLeft } from 'lucide-react';
import { UserRoundCog } from 'lucide-react';
import { useSelector } from 'react-redux'
import Settings from '../pages/Settings'
import { Link } from 'react-router-dom'

function NavBar() {
    const userData = useSelector((state) => (state.user.userData))
    console.log('userData from navbar:', userData)
  return (
    <div>
      {/* {userData && <Settings />} */}
          <nav className='navbar'>
          <ul>
      <li>
          <ChevronLeft  width={32} height={32} color='white'
          className='left-button'/>
      </li>
      <li>
        <Link to={<Settings />} ><UserRoundCog  width={32} height={32} color='white' className='user-settings' /></Link> 
      </li>
  </ul>
  
</nav>

    </div>
  )
}

export default NavBar