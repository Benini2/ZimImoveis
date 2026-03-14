import './css/rodape.css';
import { FaFacebook } from "react-icons/fa";
import { AiFillInstagram  } from "react-icons/ai";
import { IoLogoWhatsapp } from "react-icons/io";

function Rodape() {
  return (
    <div className="rodape">
        <div className="icons">
        <a href="https://www.facebook.com/zimimoveis"><FaFacebook size={35} className="icon" /></a>
        <a href="https://web.whatsapp.com/"><IoLogoWhatsapp  size={35} className="icon" /></a>
        <a href="https://www.instagram.com/zimimoveis/"><AiFillInstagram size={35} className="icon" /></a>
        <p className='creci-detalhes'>CRECI 5581J</p>
        </div>
    </div>
  );
}

export default Rodape;