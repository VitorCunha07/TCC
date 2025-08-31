//vitinho aqui se não sabe usa o chat gpt pra saber onde pega no supa base o resto é com você
const supabaseUrl = "https://SEU-PROJETO.supabase.co"
const supabaseKey = "SUA-CHAVE-ANON"
const supabase = supabase.createClient(supabaseUrl, supabaseKey)

// parte do login
async function login() {
  const email = document.getElementById("loginEmail").value
  const senha = document.getElementById("loginSenha").value

  const { error } = await supabase.auth.signInWithPassword({ email, password: senha })

  if (error) {
    alert("Você não possui cadastro ou os dados estão incorretos. Faça o cadastro primeiro.")
  } else {
    window.location.href = "index.html" // para onde vai depois de logar
  }
}

// parte do cadastro
async function cadastrar() {
  const nome = document.getElementById("cadNome").value
  const email = document.getElementById("cadEmail").value
  const senha = document.getElementById("cadSenha").value
  const senha2 = document.getElementById("cadConfirmSenha").value
  const funcao = document.getElementById("cadFuncao").value

  if (senha !== senha2) {
    alert("As senhas não coincidem.")
    return
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: {
        nome,
        funcao
      }
    }
  })

  if (error) {
    alert("Erro ao cadastrar: " + error.message)
  } else {
    alert("Cadastro realizado com sucesso!")
    window.location.href = "login.html"
  }
}

// carregar funções do banco Supabase
document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("cadFuncao")
  if (select) {
    const { data, error } = await supabase.from("funcoes").select("*")
    if (!error) {
      select.innerHTML = '<option value="">Selecione a função</option>'
      data.forEach(funcao => {
        select.innerHTML += `<option value="${funcao.nome}">${funcao.nome}</option>`
      })
    }
  }
})
