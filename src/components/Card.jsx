import { useState, useRef } from "react";
import "./css/card.css";
import { FiTrash, FiEdit } from "react-icons/fi";

function normalizarImagem(img) {
  if (!img) return "";
  if (typeof img === "object") return img.url || img.src || "";
  if (typeof img !== "string") return "";
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
  const listaFotosRaw = Array.isArray(imagens)
    ? imagens
    : imagens
      ? JSON.parse(imagens || "[]")
      : img
        ? [img]
        : [];

  const listaFotos = listaFotosRaw.map(normalizarImagem);
  const temCarrossel = listaFotos.length > 1 && !onDelete;

  const [indiceAtual, setIndiceAtual] = useState(0);
  const touchStartX = useRef(0);
  const didSwipeRef = useRef(false);

  const fotoPrincipal = listaFotos[temCarrossel ? indiceAtual : 0] || listaFotos[0] || "";

  // Navegação do carrossel
  const proximaFoto = (e) => { e.preventDefault(); e.stopPropagation(); setIndiceAtual(i => (i === listaFotos.length - 1 ? 0 : i + 1)); };
  const fotoAnterior = (e) => { e.preventDefault(); e.stopPropagation(); setIndiceAtual(i => (i === 0 ? listaFotos.length - 1 : i - 1)); };

  const handleTouchStart = (e) => { if (temCarrossel) touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove = (e) => {
    if (!temCarrossel) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      didSwipeRef.current = true;
      delta > 0 ? fotoAnterior(e) : proximaFoto(e);
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleCardClick = (e) => {
    if (didSwipeRef.current) {
      e.preventDefault();
      e.stopPropagation();
      didSwipeRef.current = false;
    }
  };

  return (
    <div className="card" data-id={id} onClick={handleCardClick}>
      <div
        className="card-img-wrapper"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <span className="price-badge">VENDA R$ {preco ? Number(preco).toLocaleString("pt-BR") : "-"}</span>

        {listaFotos.length > 1 && onDelete && (
          <span className="card-fotos-badge">+{listaFotos.length - 1} {listaFotos.length - 1 === 1 ? "foto" : "fotos"}</span>
        )}

        <img src={fotoPrincipal} alt={`Imóvel ${tipo || ""} em ${bairro || ""}`} className="card-img" />

        {temCarrossel && (
          <>
            <button className="card-arrow left" onClick={fotoAnterior} type="button" aria-label="Foto anterior">❮</button>
            <button className="card-arrow right" onClick={proximaFoto} type="button" aria-label="Próxima foto">❯</button>

            <div className="card-dots">
              {listaFotos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`card-dot ${i === indiceAtual ? "ativo" : ""}`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIndiceAtual(i); }}
                  aria-label={`Foto ${i + 1} de ${listaFotos.length}`}
                />
              ))}
            </div>
          </>
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
        <div className="card-meta">{[tipo, bairro].filter(Boolean).join(" • ")}</div>
      )}

      <div className="card-info">
        <div className="info-item"><span className="label">QUARTOS</span><span className="value red">{quartos || "-"}</span></div>
        <div className="divider" />
        <div className="info-item"><span className="label">SUÍTES</span><span className="value red">{suites || "-"}</span></div>
        <div className="divider" />
        <div className="info-item"><span className="label">VAGAS</span><span className="value red">{vagas || "-"}</span></div>
        <div className="divider" />
        <div className="info-item"><span className="label">ÁREA</span><span className="value red">{area ? `${area}m²` : "-"}</span></div>
      </div>
    </div>
  );
}