const inputText = document.getElementById('input-value');
const inputRange = document.getElementById('input-range');
//menu variaveis
const btnMenu = document.querySelector('.menu');
const listMenu = document.querySelector('.nav__list-menu');
const divSeparator = document.querySelector('.separator');
let menuVisible = false;
//select
const htmlOptionsSelect = [
  "<option value='maiusculas'>Letras maiúsculas</option> <option value='minusculas'>Letras minúsculas</option> <option value='numeros'>Números</option>", "<option value='maiusculas e numeros'>Letras maiúsculas e números</option> <option value='minusculas e numeros'>Letras minúsculas e números</option> <option value='minusculas e maiusculas'>Letras maiúsculas e minúsculas</option> <option value='minusculas maiusculas e numeros'>Letras maiúsculas, minusculas e números</option>", "<option value='minusculas maiusculas numeros e caracteres especiais'>Letras maiúsculas, minúsculas, números e caracteres especiais</option>"
]
const selectTipoSenha = document.getElementById('tipo-senha');
const selectTipoCaracteresSenha = document.getElementById('tipo-caracteres-senha');
//Formulario
const form = document.querySelector('.main__form__group-form__form');
//Status usuario
const btnGerarSenha = document.getElementById('btnGerarSenha');

document.addEventListener('DOMContentLoaded', () => {
  localStorage.setItem('userLogged', false);
  localStorage.setItem('userRegistered', false);
  localStorage.setItem('token', '');
  //iniciar texto do select
  if (selectTipoCaracteresSenha) {
    selectTipoCaracteresSenha.innerHTML = htmlOptionsSelect[0];
  } else {
    console.error("Elemento selectTipoCaracteresSenha não encontrado.");
  }
  //chamada da função de iniciar o valor do input range
  initValueInputRange();
  //chamada da função de prevenir o envio do formulário
  preventSubmitForm(form);
  //chamada da função de encher select
  fillSelectOptions(selectTipoCaracteresSenha);
  //Chamada da função de abrir e fechar menu
  openClosedMenu(btnMenu, listMenu);

  //Logica para fechar o option de login
  document.querySelector('.closed-option').addEventListener('click', (event) => {
    event.preventDefault();
    closedOption();
  })


  //Logica de gerar senha quando clicar no botao
  btnGerarSenha.addEventListener('click', async (event) => {
    event.preventDefault();
    console.log('Clicou');

    const objectSenha = {
      type: document.getElementById('tipo-senha').value,
      length: document.getElementById('input-range').value,
      variation: document.getElementById('tipo-caracteres-senha').value
    }

    try {
      if (localStorage.getItem('userLogged') === 'true') {
        const token = localStorage.getItem('token');
        const senhaCriada = await createPassword(objectSenha, token);

        if (senhaCriada.error) {
          throw new Error(`Erro na requisição: ${error}`);
        }

        document.getElementById('input-invalid').value = senhaCriada.password;
      } else {
        showOption('Faça login')
      }
    } catch (error) {
      throw new Error(`Erro na requisição: ${error}`);
    }
  });

  document.querySelector('.option__group-primary__form').addEventListener('submit', (event) => {
    event.preventDefault();
  })

  document.getElementById('btn-entrar').addEventListener('click', async () => {

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const token = await loginUser(username, password);
      if (token.error) {
        statusUser('Erro no login do usuário!', 'red');
        throw new Error('Erro na requisição');
      }

      localStorage.setItem('token', token.token);
      localStorage.setItem('userLogged', true);
      statusUser('Usuário logado com sucesso!', 'green');
    } catch (error) {
      statusUser('Erro no login do usuário!', 'red');
      throw new Error('Erro na requisição');
    }

  });

});

//função responsável por escrever mensagem nos status do usuario login
function statusUser(text, color) {
  document.querySelector('.text-status-user').textContent = text;
  document.querySelector('.text-status-user').style.color = color;
}

//função para criar senha
async function createPassword(objectSenha, token) {
  const { type, length, variation } = objectSenha;

  try {
    const response = await fetch(`http://localhost:3000/password/${type}/${length}/${variation}`, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erro na requisição');
    }

    const data = await response.json();
    return data; // Retorna o objeto JavaScript
  } catch (error) {
    throw new Error('Erro na requisição');
  }
}

/* Função responsável por abrir e fechar o menu mobile com o click do usuário*/
function openClosedMenu(btn, menu) {
  btn.addEventListener('click', () => {
    menu.style.display = !menuVisible ? 'flex' : 'none';
    toogleMenuVisible();
    document.body.style.overflow = !menuVisible ? 'auto' : 'hidden';
  });
}

//função para submeter o formulário
function preventSubmitForm(element) {
  if (element) {
    element.addEventListener('submit', (event) => {
      event.preventDefault();
    });
  } else {
    console.error("Elemento não encontrado:", element);
  }
}

//Função responsável por alternar o estao da visibilidade do menu
function toogleMenuVisible() {
  menuVisible = !menuVisible;
}

//Função responsável por iniciar o texto do input range com o seu valor inicial 4
function initValueInputRange() {
  inputText.value = inputRange.value;
}

//Função usado no oninput do input range para atualizar o texto com o seu valor
function updateValueRange() {
  inputText.value = inputRange.value;
}
window.updateValueRange = updateValueRange;

/*Função responsável por preencher o select com options do array 'htmlOptionsSelect'
de acordo com o tipo de senha escolhido pelo usuário */
function fillSelectOptions(element) {
  selectTipoSenha.addEventListener('change', () => {
    const textOptionSelect = selectTipoSenha.value;
    switch (textOptionSelect) {
      case 'simple':
        element.innerHTML = htmlOptionsSelect[0];
        break;
      case 'alphanumeric':
        element.innerHTML = htmlOptionsSelect[1];
        break;
      case 'complex':
        element.innerHTML = htmlOptionsSelect[2];
        break;
      case 'personalized':
        break;
    }
  });
}

//função para alternar o valor do userRegistered do localStorage true/false
function toogleUserRegistered() {
  const status = localStorage.getItem('userRegistered');
  if (status === 'false') {
    localStorage.setItem('userRegistered', true);
  } else {
    localStorage.setItem('userRegistered', false);
  }
}

//função para alternar o valor do userLogged do localStorage true/false
function toogleUserLogged() {
  const status = localStorage.getItem('userLogged');
  if (status === 'false') {
    localStorage.setItem('userLogged', true);
  } else {
    localStorage.setItem('userLogged', false);
  }
}

//função responsável por registrar um usuário na API
async function registerUser(username, password) {
  try {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    throw new Error('Erro ao registrar usuário');
  }
}

//função responsável por logar usuário
async function loginUser(username, password) {
  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`Usuário logado, token: ${data}`);
    return data;
  } catch (error) {
    console.error(error.message);
    throw new Error('Erro ao registrar usuário');
  }
}

//função responsável por alternar na propriedade userRegitered
function toogleUserRegistered() {
  const status = localStorage.getItem('userRegistered');
  if (status === 'false') {
    localStorage.setItem('userRegistered', true);
  } else {
    localStorage.setItem('userRegistered', false);
  }
}

//função responsável por alternar na propriedade userLogged
function toogleUserLogged() {
  const status = localStorage.getItem('userLogged');
  if (status === 'false') {
    localStorage.setItem('userLogged', true);
  } else {
    localStorage.setItem('userLogged', false);
  }
}

//função responsável por previnir a submissão de elementos
function preventSubmitForm(element) {
  element.addEventListener('submit', (event) => {
    event.preventDefault();
  });
}

//função responsável por abrir o option
function showOption(text) {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Faz o scroll suave, você pode remover se quiser um scroll instantâneo
  });

  setTimeout(() => {
    document.querySelector('.groupOption').style.display = 'flex';
    document.querySelector('.option__group-primary__title').textContent = text;
    document.body.style.overflow = 'hidden';
  }, 500);
}

//função responsável por fechar o option
function closedOption() {
  document.querySelector('.groupOption').style.display = 'none';
  document.body.style.overflow = 'auto';
}