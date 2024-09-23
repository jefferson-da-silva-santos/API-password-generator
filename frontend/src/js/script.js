const inputText = document.getElementById('input-value');
const inputRange = document.getElementById('input-range');
//menu variaveis
const btnMenu = getElement('.menu');
const listMenu = getElement('.nav__list-menu');
const divSeparator = getElement('.separator');
let menuVisible = false;
//select
const htmlOptionsSelect = [
  "<option value='maiusculas'>Letras maiúsculas</option> <option value='minusculas'>Letras minúsculas</option> <option value='numeros'>Números</option>", "<option value='maiusculas e numeros'>Letras maiúsculas e números</option> <option value='minusculas e numeros'>Letras minúsculas e números</option> <option value='minusculas e maiusculas'>Letras maiúsculas e minúsculas</option> <option value='minusculas maiusculas e numeros'>Letras maiúsculas, minusculas e números</option>", "<option value='minusculas maiusculas numeros e caracteres especiais'>Letras maiúsculas, minúsculas, números e caracteres especiais</option>"
]
const selectTipoSenha = document.getElementById('tipo-senha');
const selectTipoCaracteresSenha = document.getElementById('tipo-caracteres-senha');
//Formulario
const form = getElement('.main__form__group-form__form');
//Status usuario
const btnGerarSenha = document.getElementById('btnGerarSenha');
//Option de Login
let optionLoginVisible = false;
//Option de Cadastro
let optionRegisterVisible = false;


document.addEventListener('DOMContentLoaded', () => {
  localStorage.setItem('userLogged', false);
  localStorage.setItem('userRegistered', false);
  localStorage.setItem('token', '');

  //iniciar texto do select
  selectTipoCaracteresSenha.innerHTML = htmlOptionsSelect[0];
  
  //chamada da função de encher select
  fillSelectOptions(selectTipoCaracteresSenha);

  //chamada da função de iniciar o valor do input range
  initValueInputRange();

  //chamada da função de prevenir o envio do formulário
  preventSubmitForms(getElement('.main__form__group-form__form', true));
  preventSubmitForms(getElement('.option__group-primary__form', true));

  //Chamada da função de abrir e fechar menu
  openClosedMenu(btnMenu, listMenu);

  //Logica para fechar o option de login
  getElement('.closed-option-login').addEventListener('click', (event) => {
    event.preventDefault();
    closedOption('.groupOption-login');
  });
  getElement('.closed-option-cadastro').addEventListener('click', (event) => {
    event.preventDefault();
    closedOption('.groupOption-cadastro');
  });


  //Logica de gerar senha quando clicar no botao
  btnGerarSenha.addEventListener('click', async (event) => {
    event.preventDefault();

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
        showOption('Faça login', '.groupOption-login');
      }
    } catch (error) {
      throw new Error(`Erro na requisição: ${error}`);
    }
  });

  document.getElementById('btn-entrar').addEventListener('click', async () => {

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const token = await requestsUser('http://localhost:3000/auth/login', username, password);
      if (token.error) {
        statusUser('Erro no login do usuário!', 'red', '.text-status-user');
        throw new Error('Erro na requisição');
      }

      localStorage.setItem('token', token.token);
      toogleUserLocalStorage('userLogged');
      hideElement('.nav__list-menu__item--login');
      statusUser('Usuário logado com sucesso!', 'green', '.text-status-user');
    } catch (error) {
      statusUser('Erro no login do usuário!', 'red');
      throw new Error('Erro na requisição', '.text-status-user');
    }
  });

  //Logica para abrir o option de cadastro pelo menu
  getElement('.item-login-register').addEventListener('click', (event) => {
    event.preventDefault();
    showOption('Registre-se no CodePass', '.groupOption-cadastro');
  });

  //Logica para abrir o option de login pelo menu
  getElement('.item-login-login').addEventListener('click', (event) => {
    event.preventDefault();
    showOption('Faça login', '.groupOption-login');
  })

  //Logica de click
  document.getElementById('btn-register').addEventListener('click', async () => {
    const username = document.getElementById('username-cadastro').value;
    const password = document.getElementById('password-cadastro').value;

    try {
      const result = await requestsUser('http://localhost:3000/auth/register', username, password);

      if (result.error) {
        statusUser('Erro no cadastro do usuário', 'red', '.text-status-user-cadastro');
        throw new Error('Erro no registro');
      }
      toogleUserLocalStorage('userRegistered');
      hideElement('.nav__list-menu__item--cadastro');
      statusUser('Usuário registrado com sucesso!', 'green', '.text-status-user-cadastro');
    } catch (error) {
      statusUser('Erro no cadastro do usuário', 'red', '.text-status-user-cadastro');
      throw new Error(`Erro no cadastro do usuário: ${error.message}`)
    }
  });

  getElement('.link-cadastro').addEventListener('click', (event) => {
    event.preventDefault();
    closedOption('.groupOption-login');
    setTimeout(() => {
      showOption('Registre-se no CodePass', '.groupOption-cadastro');
    }, 500);
  });

  getElement('.link-login').addEventListener('click', (event) => {
    event.preventDefault();
    closedOption('.groupOption-cadastro');
    setTimeout(() => {
      showOption('Faça login', '.groupOption-login');
    }, 500);
  });


  //Chamada da função de mostrar e ocultar senha
  eventSeePassword('.ver-senha-login', 'password');
  eventSeePassword('.ver-senha-cadastro', 'password-cadastro');
});

//Função responsável por mostrar e ocultar a senha dos forms dos options com o click do usuário
function eventSeePassword(classBtn, idInput) {
  getElement(classBtn).addEventListener('click', (event) => {
    event.preventDefault();
    const input = document.getElementById(idInput);
    if (input.classList.contains('hidden')) {
      input.classList.remove('hidden');
      input.classList.add('visible');
      input.setAttribute('type', 'text');
    } else {
      input.classList.remove('visible');
      input.classList.add('hidden');
      input.setAttribute('type', 'password');
    }
  });
}

//função responsável por escrever mensagem nos status do usuario login
function statusUser(text, color, classElement) {
  document.querySelector(classElement).textContent = text;
  document.querySelector(classElement).style.color = color;
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
    return data;
  } catch (error) {
    throw new Error('Erro na requisição');
  }
}

function hideElement(classElement) {
  getElement(classElement).style.display = 'none';
}

/* Função responsável por abrir e fechar o menu mobile com o click do usuário*/
function openClosedMenu(btn, menu) {
  btn.addEventListener('click', () => {
    menu.style.display = !menuVisible ? 'flex' : 'none';
    menuVisible = toogleVisibility(menuVisible);
    document.body.style.overflow = !menuVisible ? 'auto' : 'hidden';
  });
}

//função para submeter o formulário
function preventSubmitForms(forms) {
  forms.forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
    });
  });
}

//função generica para alternar entre valores booleanos
function toogleVisibility(variable) {
  return !variable;
}

//Função responsável por iniciar o texto do input range com o seu valor inicial 4
function initValueInputRange() {
  inputText.value = inputRange.value;
}

//Função usado no oninput do input range para atualizar o texto com o seu valor
function updateValueRange() {
  inputText.value = inputRange.value;
}

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

//Função responsável por fazer requests de registro e login para a API
//'http://localhost:3000/auth/login'
// 'http://localhost:3000/auth/register'
async function requestsUser(url, username, password) {
  try {
    const response = await fetch(url, {
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

// Função para alternar entre os estados de atributos do localstorage
// para registro: 'userRegistered', para login 'userLogged'
function toogleUserLocalStorage(value) {
  const status = localStorage.getItem(value);
  if (status === 'false') {
    localStorage.setItem(value, true);
  } else {
    localStorage.setItem(value, false);
  }
}

//função responsável por abrir o option
function showOption(text, classOption) {
  let classText;
  if (classOption === '.groupOption-login') {
    optionLoginVisible = toogleVisibility(optionLoginVisible);
    classText = '.option__group-primary__title-login';
  } else if (classOption === '.groupOption-cadastro') {
    optionRegisterVisible = toogleVisibility(optionRegisterVisible);
    classText = '.option__group-primary__title-cadastro';
  }
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Faz o scroll suave, você pode remover se quiser um scroll instantâneo
  });

  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    document.querySelector(classOption).style.display = 'flex';
    document.querySelector(classText).textContent = text;
  }, 500);
}

//função responsável por fechar o option
function closedOption(classOption) {
  document.querySelector(classOption).style.display = 'none';
  document.body.style.overflow = 'auto';
  
  if (classOption === '.groupOption-login') {
    optionLoginVisible = toogleVisibility(optionLoginVisible);
  } else if (classOption === '.groupOption-cadastro') {
    optionRegisterVisible = toogleVisibility(optionRegisterVisible);
  }
}

function getElement(select, multiple = false) {
  return multiple ? document.querySelectorAll(select) : document.querySelector(select);
}
