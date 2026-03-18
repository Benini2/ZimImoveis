async function salvarNoBackend() {
  const token = localStorage.getItem("token");
  const BASE_URL = "https://zimimoveis-production.up.railway.app";
  const url = editandoId ? `${BASE_URL}/imoveis/${editandoId}` : `${BASE_URL}/imoveis`;
  const method = editandoId ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      ...form,
      preco: Number(form.preco.replace(/\D/g, "")),
      area: Number(form.area.toString().replace(/\D/g, "")),
      estado: form.estado?.value,
      tipo: form.tipo?.value,
      // imagens agora podem conter Base64, backend transforma em URLs
    }),
  });

  if (!response.ok) throw new Error("Erro ao salvar no backend");

  const data = await response.json();

  // Atualizar imagens com URLs retornadas pelo backend
  if (data.imagens) setForm({ ...form, imagens: data.imagens });

  return data;
}