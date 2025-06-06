import { ChevronLeft } from 'lucide-react';
import { UserRoundCog } from 'lucide-react';
import { useSelector } from 'react-redux'
import Settings from '../pages/Settings'
import { Link } from 'react-router-dom'
import { motion } from "motion/react";


function NavBar() {
    const userData = useSelector((state) => (state.user.userData))
    console.log('userData from navbar:', userData)
  return (
    <div>
      {/* {userData && <Settings />} */}
         
           <nav className='navbar bg-[#1a2024] h-12 w-full'>
         <ul className="flex justify-between items-center w-full pr-4 pl-2 h-full">
      <li className='list-none'>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.8 }}
            className=''
            >
            <ChevronLeft  width={32} height={32} color='white'
          className='left-button cursor-pointer'/>
          </motion.div>

      </li>
      <li>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.8 }}
        >
 <Link to={<Settings />} ><UserRoundCog  width={32} height={32} color='white' className='user-settings cursor-pointer' /></Link> 
        </motion.div> 
      </li>
  </ul>
  
</nav>

    </div>
  )
}

export default NavBar