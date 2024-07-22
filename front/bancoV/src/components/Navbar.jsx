import { NavLink } from "react-router-dom";

import Styles from "./Navbar.module.css";

////////ICONS
import { FiLogOut } from "react-icons/fi";
import { TbLogin } from "react-icons/tb";
import { SiFormspree } from "react-icons/si";
import { IoHomeOutline } from "react-icons/io5";
import { IoInformationCircle } from "react-icons/io5";


const Navbar = ({handleClickLogout, user}) => {


  return (
    <header className={Styles.navbar}>
        
        <h1>BancoSabis</h1>

        {!user ? (
        <div>
            <ul>

                <li>
                    <NavLink to="/"><IoHomeOutline/></NavLink>
                </li>

                <li>
                    <NavLink to="/registro"><SiFormspree/></NavLink>
                </li>

                <li>
                    <NavLink to="/login"><TbLogin/></NavLink>
                </li>

                <li>
                    <NavLink to="/about"><IoInformationCircle/></NavLink>
                </li>

            </ul>
            
        </div>
        ) : (
        <div>

            <ul>

                <li>
                    <NavLink to="/"><IoHomeOutline/></NavLink>
                </li>
                
                <li>
                    <NavLink to="/logout" onClick={handleClickLogout}><FiLogOut/></NavLink>
                </li>

                <li>
                    <NavLink to="/about"><IoInformationCircle/></NavLink>
                </li>

            </ul>

        </div>
        )}

    </header>
  )
};

export default Navbar;