import { useState, useRef } from "react";
import "./css/card.css";
import { FiTrash } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";

function normalizarImagem(img) {
  if (!img) return "";

  if (typeof img === "object") {
    img = img.url || img.src || "";
  }

  if (typeof img !== "string") return "";

  if (img.startsWith("data:image")) return img;

  return img;
}

export default function Card({ 
  id, 
  preco, 
  img, 
  imagens,
  quartos, 
  suites, 
  vagas, 
  area,
  bairro,
  tipo,
  onDelete,
  onEdit
}) {
  function converterImagens(imagens, img) {
    if (!imagens) return img ? [img] : [];
  
    // se já for array
    if (Array.isArray(imagens)) return imagens;
  
    // se vier string do banco
    if (typeof imagens === "string") {
      try {
        const parsed = JSON.parse(imagens);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
  
    return img ? [img] : [];
  }
  
  const listaFotosRaw = converterImagens(imagens, img);

const listaFotos = listaFotosRaw.map(normalizarImagem);
  
  const temCarrossel = listaFotos.length > 1 && !onDelete;
  const [indiceAtual, setIndiceAtual] = useState(0);
  function proximaFoto(e) {
    e.preventDefault();
    e.stopPropagation();
    setIndiceAtual((i) => (i === listaFotos.length - 1 ? 0 : i + 1));
  }
  
  function fotoAnterior(e) {
    e.preventDefault();
    e.stopPropagation();
    setIndiceAtual((i) => (i === 0 ? listaFotos.length - 1 : i - 1));
  }
  const touchStartX = useRef(0);
  const didSwipeRef = useRef(false);

  const fotoPrincipal = listaFotos[temCarrossel ? indiceAtual : 0] || listaFotos[0];

  function handleTouchStart(e) {
    if (!temCarrossel) return;
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchMove(e) {
    if (!temCarrossel) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      didSwipeRef.current = true;
      if (delta > 0) {
        setIndiceAtual((i) => (i === 0 ? listaFotos.length - 1 : i - 1));
      } else {
        setIndiceAtual((i) => (i === listaFotos.length - 1 ? 0 : i + 1));
      }
      touchStartX.current = e.touches[0].clientX;
    }
  }

  function handleCardClick(e) {
    if (didSwipeRef.current) {
      e.preventDefault();
      e.stopPropagation();
      didSwipeRef.current = false;
    }
  }

  return (
    <div className="card" data-id={id} onClick={handleCardClick}>
      
      <div 
        className="card-img-wrapper"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <span className="price-badge">VENDA R$ {preco ? Number(preco).toLocaleString("pt-BR") : "-"}</span>
        {listaFotos.length > 1 && onDelete && <span className="card-fotos-badge">+{listaFotos.length - 1} {listaFotos.length - 1 === 1 ? "foto" : "fotos"}</span>}
        <img src={fotoPrincipal} alt="Imóvel" className="card-img" />
        {temCarrossel && (
  <>
    <button
      className="card-arrow left"
      onClick={fotoAnterior}
      type="button"
      aria-label="Foto anterior"
    >
      ❮
    </button>

    <button
      className="card-arrow right"
      onClick={proximaFoto}
      type="button"
      aria-label="Próxima foto"
    >
      ❯
    </button>
  </>
)}

{temCarrossel && (
  <div className="card-dots">
    {listaFotos.map((_, i) => (
      <button
        key={i}
        type="button"
        className={`card-dot ${i === indiceAtual ? "ativo" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIndiceAtual(i);
        }}
        aria-label={`Foto ${i + 1} de ${listaFotos.length}`}
      />
    ))}
  </div>
)}
        {onEdit && (
          <button className="btn-edit-card" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(id); }} type="button" aria-label="Editar imóvel">
            <FiEdit size={20} className="edit-icon" />
          </button>
        )}
        {onDelete && (
          <button className="btn-delete-card" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(id); }} type="button" aria-label="Excluir imóvel">
            <FiTrash size={24} className="trash-icon" />
          </button>
        )}
      </div>

      {(tipo || bairro) && (
        <div className="card-meta">
          {[tipo, bairro].filter(Boolean).join(" • ")}
        </div>
      )}

      <div className="card-info">
        <div className="info-item">
          <span className="label">QUARTOS</span>
          <span className="value red">{quartos}</span>
        </div>

        <div className="divider" />

        <div className="info-item">
          <span className="label">SUÍTES</span>
          <span className="value red">{suites}</span>
        </div>

        <div className="divider" />

        <div className="info-item">
          <span className="label">VAGAS</span>
          <span className="value red">{vagas}</span>
        </div>

        <div className="divider" />

        <div className="info-item">
          <span className="label">ÁREA</span>
          <span className="value red">
          {area ? `${area}m²` : "-"}
</span>
        </div>
      </div>
    </div>
  );
}
