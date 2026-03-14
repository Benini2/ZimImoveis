import { Link } from 'react-router-dom';
import './css/logo.css';

function Logo() {
  return (
    <div>
        <Link to="/home">
            <img className="logo" src="../public/Logo_oficial.svg" alt="logo" />
            </Link>
    </div>
  );
}

export default Logo;
