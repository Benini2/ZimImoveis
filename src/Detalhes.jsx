import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import "./detalhes.css";
import Rodape from "./components/Rodape";

function Detalhes() {
  const { id } = useParams();
  const [imovel, setImovel] = useState(null);
  const [fotoAtual, setFotoAtual] = useState(0);
  const navigate = useNavigate();

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    async function buscarImovel() {
      try {
        const res = await fetch("http://localhost:3333/imoveis");
        const data = await res.json();
  
        const encontrado = data.find((item) => item.id === Number(id));
  
        setImovel(encontrado);
        setFotoAtual(0);
  
      } catch (erro) {
        console.error("Erro ao buscar imóvel:", erro);
      }
    }
  
    buscarImovel();
  }, [id]);

  if (!imovel) return <p>Imóvel não encontrado.</p>;

  const fotos = (() => {
    if (!imovel) return [];
  
    let imgs = [];
  
    if (Array.isArray(imovel.imagens)) {
      imgs = [...imovel.imagens];
    } 
    else if (typeof imovel.imagens === "string") {
      try {
        imgs = JSON.parse(imovel.imagens);
      } catch {
        imgs = [imovel.imagens];
      }
    }
  
    if (imovel.img_capa && !imgs.includes(imovel.img_capa)) {
      imgs.unshift(imovel.img_capa);
    }
  
    return imgs.filter((img) => typeof img === "string" && img !== "");
  })();

  const estruturaArray = Array.isArray(imovel.estrutura)
    ? imovel.estrutura
    : typeof imovel.estrutura === "string"
    ? imovel.estrutura.split(/[\n,]/).map((i) => i.trim()).filter(Boolean)
    : [];

  /* ===== SWIPE ===== */
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distancia = touchStartX.current - touchEndX.current;
    if (Math.abs(distancia) < 50) return;

    if (distancia > 0) {
      setFotoAtual((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
    } else {
      setFotoAtual((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
    }
  };

  return (
    <div className="detalhes">
      <Link to="/catalogo">
        <IoMdArrowRoundBack size={38} className="arrow-icon" />
      </Link>
        {/* COLUNA ESQUERDA */}
<div className="coluna-esquerda">

{/* GALERIA */}
<div className="imagem">
  {fotos.length > 0 ? (
    <>
      {/* MOBILE */}
      <div className="detalhes-galeria mobile">
        <img
          src={fotos[fotoAtual]}
          className="detalhes-img"
          alt={`Foto ${fotoAtual + 1}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {fotos.length > 1 && (
          <>
            <div className="galeria-dots">
              {fotos.map((_, i) => (
                <button
                  key={i}
                  className={`galeria-dot ${i === fotoAtual ? "ativo" : ""}`}
                  onClick={() => setFotoAtual(i)}
                />
              ))}
            </div>

            <span className="galeria-contador">
              {fotoAtual + 1} / {fotos.length}
            </span>
          </>
        )}
      </div>

      {/* DESKTOP */}
      <div className="galeria-desktop">
        <div className="galeria-grid">
          <img src={fotos[0]} className="img-principal" />
          {fotos[1] && <img src={fotos[1]} className="img-secundaria" />}
          {fotos[2] && <img src={fotos[2]} className="img-secundaria" />}
        </div>

        <button
  className="btn-ver-todas"
  onClick={() => navigate(`/galeria/${id}`)}
>
  Ver todas ({fotos.length})
</button>
      </div>
    </>
  ) : (
    <div className="detalhes-sem-foto">Sem foto</div>
  )}
</div>

{/* RODAPÉ LOGO ABAIXO DA GALERIA */}
<Rodape />

</div>


      {/* ===== COLUNA DIREITA ===== */}
      <div className="detalhes-content">
        <div className="detalhes-info-card">
          <div className="titulo-info">
            <h1>{imovel.nome}</h1>
            <p>
              {imovel.bairro} • {imovel.cidade} - {imovel.estado}
            </p>
          </div>

          <div className="linha-horizontal" />

          <div className="informacoes">
          <p>
  Preço
  <strong>
    R$ {Number(imovel.preco).toLocaleString("pt-BR")}
  </strong>
</p>
            <p>Quartos<strong>{imovel.quartos}</strong></p>
            <p>Suítes<strong>{imovel.suites}</strong></p>
            <p>Vagas<strong>{imovel.vagas}</strong></p>
            <p>Área<strong>{imovel.area}m²</strong></p>
            <p>Tipo<strong>{imovel.tipo}</strong></p>
          </div>
        </div>

        {estruturaArray.length > 0 && (
          <div className="estrutura-container">
            <h2 className="estrutura-titulo">Estrutura e comodidades</h2>

            <div className="estrutura-lista">
              {estruturaArray.map((item, i) => (
                <div key={i} className="estrutura-item">
                  <span className="check">✓</span>
                  <span className="texto">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Detalhes;
