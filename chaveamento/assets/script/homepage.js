// Redireciona para criar torneio
function irParaCriarTorneio() {
  window.location.href = "criar-torneio.html";
}

// Puxa nome do usuário via API
async function carregarUsuario() {
  try {
    const userId = localStorage.getItem("user_id") || "1";
    const response = await fetch(`http://localhost:8000/usuarios/${userId}`);
    if (!response.ok) throw new Error("Erro ao buscar usuário");

    const data = await response.json();
    document.getElementById("username").textContent = data.usuario.nome;
  } catch (error) {
    console.error(error);
    document.getElementById("username").textContent = "Usuário";
  }
}

carregarUsuario();
