import './css/header.css'

function Header () {
    return (
    <div className='logo-home'>
        <img src="../public/Logo_oficial.svg" alt="" className='img-logo' />
        <div className="logo-titulo">
        <h1>zim imóveis</h1>
        <p className='creci'>CRECI 5581J</p></div>
    </div>
    );
}


export default Header