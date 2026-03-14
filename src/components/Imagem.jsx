import { Link } from 'react-router-dom';
import './css/imagem.css';

function Imagem() {
  return (
    <div className="conteiner-img">
      <img src="../public/Imagem principal.png" className="imagem" />

      <Link to="/catalogo">
        <button className='btn-vercatalogo'>VER CATALOGO</button>
      </Link>
    </div>
  );
}

export default Imagem;
