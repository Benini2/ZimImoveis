import { Link } from 'react-router-dom';
import './css/logo.css';
import logo from "../assets/Logo_oficial";

function Logo() {
  return (
    <div>
        <Link to="/home">
        <img src={logo} alt="logo" className='logo' />
            </Link>
    </div>
  );
}

export default Logo;
