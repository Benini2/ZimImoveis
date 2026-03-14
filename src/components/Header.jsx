import './css/header.css'
import logo from "../assets/Logo_oficial";

function Header () {
    return (
    <div className='logo-home'>
        <img src={logo} alt="logo" className='img-logo' />
        <div className="logo-titulo">
        <h1>zim imóveis</h1>
        <p className='creci'>CRECI 5581J</p></div>
    </div>
    );
}


export default Header