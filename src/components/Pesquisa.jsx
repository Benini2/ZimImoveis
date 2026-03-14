import './css/pesquisa.css';
import Logo from './Logo'
import { FiSearch, FiFilter } from "react-icons/fi";

function Pesquisa({ setBusca, abrirFiltro }) {
    return (
        <div className='logo-pesquisa'>
            <Logo/>

            <div className="input-container">
                <input 
                    type="text" 
                    placeholder="Bairro" 
                    className="search-input"
                    onChange={(e) => setBusca(e.target.value)}
                />
                <FiSearch size={25} className="search-icon" />
            </div>
            <FiFilter size={25} className="filter-icon" onClick={abrirFiltro} />


        </div>
    );
}

export default Pesquisa;
