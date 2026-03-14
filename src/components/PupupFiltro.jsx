import { useState, useEffect } from "react";
import Select from "react-select";
import "./css/popupfiltro.css";

export default function PopupFiltro({ aberto, onClose, onFiltrar, imoveis }) {
  const [cidade, setCidade] = useState(null);
  const [tipo, setTipo] = useState(null);

  const [precoMax, setPrecoMax] = useState(0);
  const [limiteMaximo, setLimiteMaximo] = useState(0);

  const customSelectStyles = {
      control: (base, state) => ({
        ...base,
        backgroundColor: 'white',
        borderRadius: 8,
        border: state.isFocused ? "1.8px solid #c1473d" : "1.8px solid #ccc",
        minHeight: 46,
        fontSize: "1rem",
        boxShadow: state.isFocused ? "0 0 6px rgba(193, 71, 61, 0.5)" : "none",
        "&:hover": { borderColor: state.isFocused ? "#c1473d" : "#ccc" },
        cursor: 'pointer',
      }),
      valueContainer: (base) => ({
        ...base,
        padding: "0 12px",
        display: 'flex',
        alignItems: 'center',
      }),
      placeholder: (base) => ({ 
        ...base, 
        fontSize: "1rem", 
        color: "#555",
        opacity: 1,
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
      }),
      singleValue: (base) => ({ 
        ...base, 
        fontSize: "1rem", 
        color: "#333",
        opacity: 1,
        position: 'relative',
      }),
      input: (base) => ({
        ...base,
        fontSize: "1rem",
        color: "#333",
        padding: 0,
        margin: 0,
      }),
      menu: (base) => ({
        ...base,
        borderRadius: 8,
        zIndex: 9999,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        backgroundColor: 'white',
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? "rgba(193, 71, 61, 0.1)" : "white",
        color: "#333",
        cursor: "pointer",
        fontSize: "1rem",
        padding: "10px 12px",
        "&:hover": { backgroundColor: "rgba(193, 71, 61, 0.1)" },
      }),
      dropdownIndicator: (base) => ({ 
        ...base, 
        padding: "0 8px",
        color: "#ccc",
        "&:hover": { color: "#c1473d" },
      }),
      indicatorSeparator: (base) => ({ ...base, display: "none" }),
      clearIndicator: (base) => ({ ...base, padding: "0 8px" }),
    };
    function gerarOpcoesUnicas(imoveis, campo) {
  const mapa = new Map();

  imoveis.forEach((item) => {
    let original = item[campo];

    if (!original || typeof original !== "string") return;

    const normalizado = original
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") 
      .toLowerCase();

    if (!mapa.has(normalizado)) {
      mapa.set(normalizado, original.trim());
    }
  });

  return [...mapa.values()].map((v) => ({
    label: v,
    value: v,
  }));
}


  const cidades = gerarOpcoesUnicas(imoveis, "cidade");

  const tipos = gerarOpcoesUnicas(imoveis, "tipo");

  useEffect(() => {
    if (!imoveis || imoveis.length === 0) {
      setLimiteMaximo(0);
      setPrecoMax(0);
      return;
    }
  
    const maior = Math.max(
      ...imoveis.map((i) => Number(i.preco) || 0)
    );
  
    setLimiteMaximo(maior);
    setPrecoMax(maior);
  }, [imoveis]);

  function aplicarFiltro() {
    onFiltrar({
      cidade: cidade?.value || "",
      tipo: tipo?.value || "",
      preco: precoMax
    });
    onClose();
  }
  function limparFiltros() {
  setCidade(null);
  setTipo(null);
  setPrecoMax(limiteMaximo);
}

  if (!aberto) return null;

  return (
    <div
  className="popup-overlay"
  onClick={(e) => {
    if (e.target.classList.contains("popup-overlay")) {
      onClose();
    }
  }}
>
      <div className="popup-container">
        <div className="popup-close" onClick={onClose}>✕</div>
        <h2 className="popup-titulo">Filtrar Imóveis</h2>

        <div className="form-group">
        <Select
        isSearchable={false}
          placeholder="Cidade"
          options={cidades}
          value={cidade}
          onChange={setCidade}
          classNamePrefix="react-select"
          styles={customSelectStyles}
        />
        </div>

        <div className="form-group">
        <Select
        isSearchable={false}
          placeholder="Tipo"
          options={tipos}
          value={tipo}
          onChange={setTipo}
          classNamePrefix="react-select"
          styles={customSelectStyles}
        />
        </div>

<div className="filtro-preco">

  <div className="preco-topo">
    <span className="preco-min">R$ 0,00</span>
    <span className="preco-max">
      R$ {precoMax.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
    </span>
  </div>

  <div className="slider-wrapper">
    <div
      className="slider-fill"
      style={{ width: `${(precoMax / limiteMaximo) * 100}%` }}
    ></div>

    <input
      type="range"
      min="0"
      max={limiteMaximo}
      value={precoMax}
      onChange={(e) => setPrecoMax(Number(e.target.value))}
      className="slider-input"
    />
  </div>
    <div className="popup-btns">
    <button className="btn-limpar" onClick={limparFiltros}>Limpar</button>
    <button className="btn-filtrar" onClick={aplicarFiltro}>Filtrar</button> </div> </div>
</div>

      </div>
  );
}
