// Configuração do Supabase
const supabaseUrl = "https://SEU-PROJETO.supabase.co";
const supabaseKey = "SUA-CHAVE-ANON";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Função de cadastro
async function register() {
  const nome = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const senha = document.getElementById("register-password").value;
  const role = document.getElementById("register-role").value;

  const { error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: { data: { nome, role } }
  });

  if (error) {
    document.getElementById("register-error").textContent =
      "Erro ao cadastrar: " + error.message;
  } else {
    alert("Cadastro realizado com sucesso!");
    window.location.href = "login.html";
  }
}

// Carregar funções do banco Supabase
async function loadRoles() {
  const select = document.getElementById("register-role");
  if (select) {
    const { data, error } = await supabase.from("funcoes").select("*");
    if (!error) {
      select.innerHTML = '<option value="">Selecione a função</option>';
      data.forEach(funcao => {
        select.innerHTML += `<option value="${funcao.nome}">${funcao.nome}</option>`;
      });
    }
  }
}
