const API_URL = "https://mock-api.driven.com.br/api/v6/uol/",
      PARTICIPANTS_URL = `${API_URL}participants`,
      STATUS_URL = `${API_URL}status`,
      MESSAGES_URL = `${API_URL}messages`;

const user = {},
      connectionInterval = 5000,
      reloadInterval = 3000;



function login() {
    const username = prompt("Qual seu nome de usuário?");
    user.name = username;
    const promise = axios.post(PARTICIPANTS_URL, user);
    promise.then(() => {
        console.log("Tudo certo");
        checkConnection();
    });
    promise.catch(loginError);
}

function loginSuccess() {
    console.log("Tudo certo!");
}

function loginError() {
    alert("O nome já está sendo usado ou é inválido, tente novamente.");
    login();
}

function checkConnection() {
    setInterval(() => {
        axios.post(STATUS_URL, user);
    }, connectionInterval)
}

function getMessages() {
    const promise = axios.get(MESSAGES_URL);
    promise.then(displayMessages);
    promise.catch(() => alert("deu ruim"));
}

function displayMessages() {
    switch(messages.type) {

    }
}

login();