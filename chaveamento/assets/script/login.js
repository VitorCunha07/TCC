// Configuração do Supabase
const supabaseUrl = "https://SEU-PROJETO.supabase.co";
const supabaseKey = "SUA-CHAVE-ANON";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Função de login
async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    document.getElementById("login-error").textContent =
      "Email ou senha incorretos. Tente novamente.";
  } else {
    window.location.href = "index.html"; // redireciona após login
  }
}
