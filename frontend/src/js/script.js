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
//Option de Login visivel
let optionLoginVisible = false;
//Option de Cadastro visivel
let optionRegisterVisible = false;
//Botão de copiar
const btnCopy = getElement('.main__group-form__group-input__btn-copy');
// Input senha personalizada
let inputPasswordPersoVisible = false;

document.addEventListener('DOMContentLoaded', () => {
  //criando e inicializando objetos de status do usuário no localstorage
  localStorage.setItem('userLogged', false);
  localStorage.setItem('userRegistered', false);
  localStorage.setItem('token', '');

  //iniciar texto do select com o array
  selectTipoCaracteresSenha.innerHTML = htmlOptionsSelect[0];

  //Logica para remover o input de senha personalizada
  selectTipoSenha.addEventListener('change', () => {
    const textOptionSelect = selectTipoSenha.value;
    if (textOptionSelect !== 'personalized') {
      hiddeInputPasswordPersonalized();
    }
    fillSelectOptions(textOptionSelect);
  });

  //chamada da função de encher select
  fillSelectOptions();

  //chamada da função de iniciar o valor do input range
  initValueInputRange();

  //chamada da função de prevenir o envio do formulário
  preventSubmitForms([
    '.main__form__group-form__form',
    '.option__group-primary__form'
  ]);

  //Chamada da função de abrir e fechar menu
  openClosedMenu(btnMenu, listMenu);

  //Chamada para função de fechar os options
  closeMultipleOptions([
    { buttonSelector: '.closed-option-login', closeSelector: '.groupOption-login' },
    { buttonSelector: '.closed-option-cadastro', closeSelector: '.groupOption-cadastro' }
  ]);

  //Logica de gerar senha quando clicar no botao
  btnGerarSenha.addEventListener('click', async (event) => {
    event.preventDefault();

    try {
      if (localStorage.getItem('userLogged') === 'true') {
        const token = localStorage.getItem('token');
        let senhaCriada = '';
        const typeSenha = document.getElementById('tipo-senha').value

        if (typeSenha === 'personalized') {
          const caracteres = document.getElementById('input-password-personalized').value;
          console.log(caracteres);
          const length = document.getElementById('input-range').value;
          senhaCriada = await createPasswordPersonalized(length, token, caracteres);
        } else {
          senhaCriada = await createPassword({
            type: document.getElementById('tipo-senha').value,
            length: document.getElementById('input-range').value,
            variation: document.getElementById('tipo-caracteres-senha').value
          }, token);
        }

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

  //Lógica de logar e registra usuários
  document.getElementById('btn-entrar').addEventListener('click', async () => {

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    validateData(username, password, '.text-status-user');

    try {
      const token = await requestsUser('http://localhost:3000/auth/login', username, password, 'Erro no login do usuário', '.text-status-user');
      if (token.error) {
        statusUser('Erro no login do usuário!', 'red', '.text-status-user');
        throw new Error('Erro na requisição');
      }

      localStorage.setItem('token', token.token);
      toogleUserLocalStorage('userLogged');
      hideElement('.nav__list-menu__item--login');
      hideElement('.nav__list-menu__item--cadastro');
      statusUser('Usuário logado com sucesso!', 'green', '.text-status-user');
    } catch (error) {
      statusUser('Erro no login do usuário!', 'red');
      throw new Error('Erro na requisição', '.text-status-user');
    }
  });

  //Chamada para a função de abrir options pelo menu
  openMultipleOptions([
    { buttonSelector: '.item-login-register', message: 'Registre-se no CodePass', openSelector: '.groupOption-cadastro' },
    { buttonSelector: '.item-login-login', message: 'Faça login', openSelector: '.groupOption-login' }
  ]);

  //Logica de click
  document.getElementById('btn-register').addEventListener('click', async () => {
    const username = document.getElementById('username-cadastro').value;
    const password = document.getElementById('password-cadastro').value;
    validateData(username, password, '.text-status-user-cadastro');

    try {
      const result = await requestsUser('http://localhost:3000/auth/register', username, password, 'Erro ao registrar usuário', '.text-status-user-cadastro');

      if (result.error) {
        statusUser('Erro no cadastro do usuário', 'red', '.text-status-user-cadastro');
        throw new Error('Erro no registro');
      }
      toogleUserLocalStorage('userRegistered');
      hideElement('.nav__list-menu__item--cadastro');
      statusUser('Usuário registrado com sucesso!', 'green', '.text-status-user-cadastro');
    } catch (error) {
      statusUser('Erro no cadastro do usuário', 'red', '.text-status-user-cadastro');
      throw new Error(`Erro no cadastro do usuário: ${error.message}`);
    }
  });

  //Lógica para abrir options pelo link dos options
  toggleMultipleOptions([
    { linkSelector: '.link-cadastro', closeSelector: '.groupOption-login', message: 'Registre-se no CodePass', openSelector: '.groupOption-cadastro' },
    { linkSelector: '.link-login', closeSelector: '.groupOption-cadastro', message: 'Faça login', openSelector: '.groupOption-login' }
  ]);

  //Chamada da função de mostrar e ocultar senha
  eventSeePassword([
    { classBtn: '.ver-senha-login', idInput: 'password' },
    { classBtn: '.ver-senha-cadastro', idInput: 'password-cadastro' }
  ]);

  //Chamada da função de ajustar a vizibilidade do menu de acordo com o tamanho da tela
  adjustMenuOnResize();

  //Lógica de copiar senha para a área de transferencia
  btnCopy.addEventListener('click', event => {
    event.preventDefault();

    const text = document.getElementById('input-invalid').value;
    const icon = btnCopy.firstChild;
    navigator.clipboard.writeText(text).then(() => {
      toogleClassIcon(btnCopy, icon, 'bi-copy', 'bi-check-circle-fill', '#57677a', 'green');
    }).catch(err => {
      toogleClassIcon(btnCopy, icon, 'bi-copy', 'bi-x-circle-fill', '#57677a', 'red');
    });
  });
});

//Função que verifica se o token está inválido
function handleApiError(status, errorMessage) {
  if (status === 401) {
    if (errorMessage.includes('Token inválido')) {
      localStorage.setItem('token', '');
      getElement('.nav__list-menu__item--login').style.display = 'list-item';
      showOption('Faça login novamente', '.groupOption-login');
    } else {
      throw new Error('Acesso negado. Você não está autorizado a realizar essa ação.');
    }
  } else {
    throw new Error('Ocorreu um erro: ' + errorMessage);
  }
}

//Função responsável por alterar os icones quando algo for copiado para area de transferencia
function toogleClassIcon(elementParent, element, classInit, newClasse, colorInit, newColor) {
  element.classList.remove(classInit);
  element.classList.add(newClasse);
  elementParent.style.color = newColor;
  setTimeout(() => {
    element.classList.remove(newClasse);
    element.classList.add(classInit);
    elementParent.style.color = colorInit;
  }, 2000);
}

//Função responsável por ajustar a vizibilidade do menu de acordo com o tamanho da tela
function adjustMenuOnResize() {
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 769) {
      listMenu.style.display = 'flex';
      menuVisible = true;
      document.body.style.overflow = 'auto';
    } else {
      menuVisible = false;
      listMenu.style.display = 'none';
    }
  });
}

//Função responsável por abrir os options a partir do menu
function openMultipleOptions(configs) {
  configs.forEach(({ buttonSelector, message, openSelector }) => {
    getElement(buttonSelector).addEventListener('click', (event) => {
      event.preventDefault();
      showOption(message, openSelector);
    });
  });
}

//Função responsável por trocar de option a partir do link do option atual
function toggleMultipleOptions(configs) {
  configs.forEach(({ linkSelector, closeSelector, message, openSelector }) => {
    getElement(linkSelector).addEventListener('click', (event) => {
      event.preventDefault();
      closedOption(closeSelector);
      setTimeout(() => {
        showOption(message, openSelector);
      }, 500);
    });
  });
}

//Função responsável por mostrar e ocultar a senha dos forms dos options com o click do usuário
function eventSeePassword(elements) {
  elements.forEach(({ classBtn, idInput }) => {
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
  });
}

//Função para validar dados passados pelo usuário
function validateData(username, password, classElement) {
  if (typeof username !== 'string' || username.trim() === '' || !isNaN(username) ||
    typeof password !== 'string' || password.trim() === '') {
    statusUser('Credenciais inválidas', 'red', classElement);
    console.error('Credenciais do usuário inválidas');
    throw new Error('Credenciais do usuário inválidas')
  }
}

//função responsável por escrever mensagem nos status do usuario login
function statusUser(text, color, classElement) {
  getElement(classElement).textContent = text;
  getElement(classElement).style.color = color;
  setTimeout(() => {
    getElement(classElement).textContent = 'Insira seu usuário e sua senha acima';
    getElement(classElement).style.color = 'black';
  }, 5000);
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
      const errorData = await response.json();
      handleApiError(response.status, errorData.error);
      return;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Erro na requisição');
  }
}

async function createPasswordPersonalized(length, token, characters) {
  try {
    const response = await fetch(`http://localhost:3000/password/personalized/${length}/personalizada`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        characters: characters
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      handleApiError(response.status, errorData.error);
      return;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Erro na requisição');
  }
}

//Função genérica usada para ocultar um elemento
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
function preventSubmitForms(formsArray) {
  formsArray.forEach(selector => {
    const forms = getElement(selector, true);
    forms.forEach(form => {
      form.addEventListener('submit', event => {
        event.preventDefault();
      });
    });
  });
}

//Função responsável por fechar options com o click
function closeMultipleOptions(configs) {
  configs.forEach(({ buttonSelector, closeSelector }) => {
    getElement(buttonSelector).addEventListener('click', (event) => {
      event.preventDefault();
      closedOption(closeSelector);
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
function fillSelectOptions() {
  const element = document.getElementById('tipo-caracteres-senha');
  selectTipoSenha.addEventListener('change', () => {
    const textOptionSelect = selectTipoSenha.value;
    switch (textOptionSelect) {
      case 'simple':
        hiddeInputPasswordPersonalized();
        element.innerHTML = htmlOptionsSelect[0];
        break;
      case 'alphanumeric':
        element.innerHTML = htmlOptionsSelect[1];
        break;
      case 'complex':
        element.innerHTML = htmlOptionsSelect[2];
        break;
      case 'personalized':
        createInputPasswordPersonalized();
        break;
    }
  });
}

function hiddeInputPasswordPersonalized() {
  if (inputPasswordPersoVisible) {
    const input = document.getElementById('input-password-personalized');
    input.remove();
    document.getElementById('tipo-caracteres-senha').style.display = 'inline-block';
    inputPasswordPersoVisible = toogleVisibility(inputPasswordPersoVisible);
  }
}

function createInputPasswordPersonalized() {
  if (!inputPasswordPersoVisible) {
    const inputText = document.createElement('input');
    inputText.setAttribute('type', 'text');
    inputText.setAttribute('id', 'input-password-personalized');
    inputText.setAttribute('placeholder', 'Caracteres desejados na senha');
    inputText.classList.add(('input-personalized'));
    document.getElementById('tipo-caracteres-senha').style.display = 'none';
    getElement('.group-selects__group--personalized').appendChild(inputText);
    inputPasswordPersoVisible = toogleVisibility(inputPasswordPersoVisible);
  }
}


//Função responsável por fazer requests de registro e login para a API
//'http://localhost:3000/auth/login'
// 'http://localhost:3000/auth/register'
async function requestsUser(url, username, password, msgError, classMensagem) {
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
      statusUser('Erro na requizição!', 'red', classMensagem);
      throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    statusUser(msgError, 'red', classMensagem);
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
    getElement(classOption).style.display = 'flex';
    getElement(classText).textContent = text;
  }, 500);
}

//função responsável por fechar o option
function closedOption(classOption) {
  hideElement(classOption);
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
