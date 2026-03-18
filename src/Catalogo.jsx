import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./catalogo.css";
import Pesquisa from "./components/Pesquisa";
import Card from "./components/Card";
import PopupFiltro from "./components/PupupFiltro";

function Catalogo() {
  const [imoveis, setImoveis] = useState([]);
  const [busca, setBusca] = useState("");
  const [popupAberto, setPopupAberto] = useState(false);
  const [listaFiltrada, setListaFiltrada] = useState(null); 

  useEffect(() => {
    fetch("https://zimimoveis-production.up.railway.app/imoveis")
      .then(res => res.json())
      .then(data => {
        const tratados = data.map((item) => ({
          ...item,
          imagens: Array.isArray(item.imagens) ? item.imagens : [],
          img_capa: item.img_capa || (Array.isArray(item.imagens) ? item.imagens[0] : null)
        }));
        setImoveis(tratados);
      });
  }, []);

////////////////////////////////////////////////////
// � FILTRO DE POPUP
////////////////////////////////////////////////////

  function filtrarImoveis(filtro) {
    let resultado = imoveis;
  
////////////////////////////////////////////////////
// � FILTRO CIDADE
////////////////////////////////////////////////////

    if (filtro.cidade && filtro.cidade.trim() !== "") {
      resultado = resultado.filter((i) =>
        i.cidade?.toLowerCase().includes(filtro.cidade.toLowerCase())
      );
    }

////////////////////////////////////////////////////
// � FILTRO TIPO
////////////////////////////////////////////////////

    if (filtro.tipo?.value) {
      resultado = resultado.filter(
        (i) =>
          i.tipo?.toLowerCase().trim() ===
          filtro.tipo.value.toLowerCase().trim()
      );
    }
  
////////////////////////////////////////////////////
// � FILTRO PREÇO
////////////////////////////////////////////////////

    if (filtro.preco && filtro.preco > 0) {
      resultado = resultado.filter((i) => {
        const precoNum = Number(i.preco);
        return precoNum <= filtro.preco;
      });
    }
  
    if (resultado.length === 0) {
      setListaFiltrada("VAZIO");
    } else {
      setListaFiltrada(resultado);
    }
  }

////////////////////////////////////////////////////
// � FILTRO DA BARRA DE PESQUISA 
////////////////////////////////////////////////////

const base = listaFiltrada && listaFiltrada !== "VAZIO" ? listaFiltrada : imoveis;

 const baseLista =
    listaFiltrada && listaFiltrada !== "VAZIO"
      ? listaFiltrada
      : imoveis;

  const listaComBusca = baseLista.filter((item) =>
    item.bairro?.toLowerCase().includes(busca.toLowerCase())
  );

  const listaFinal =
    listaFiltrada === "VAZIO" ? [] : listaComBusca;

  return (
    <div className="catalogo">
      
      <Pesquisa setBusca={setBusca} abrirFiltro={() => setPopupAberto(true)} />

      <PopupFiltro
        aberto={popupAberto}
        onClose={() => setPopupAberto(false)}
        onFiltrar={filtrarImoveis}
        imoveis={imoveis}
      />

      {listaFinal.length === 0 ? (
        <p className="nao-encontrado">Imóvel não encontrado</p>
      ) : (
        <div className="cards-grid">
  {listaFinal.map((item) => (
    <Link
      key={item.id}
      to={`/detalhes/${item.id}`}
      className="card-link"
    >
      <Card {...item} imagens={item.imagens || [item.img_capa]} />
    </Link>
  ))}
</div>
      )}
    </div>
  );
}

export default Catalogo;