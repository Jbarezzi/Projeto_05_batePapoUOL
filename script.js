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
    }, connectionInterval);
}

function getMessages() {
    const promise = axios.get(MESSAGES_URL);
    promise.then((response) => {
        response.data.map((message) => {
            if(message.to === "Todos" || message.to === user.name) {
                displayMessages(message);
            }
        });
    });
    promise.catch(() => console.log("Status code:" + error.response.status));
}

function displayMessages(messages) {
    switch(messages.type) {
        case "status":
            displayStatusMessages(messages);
            break;
        case "message":
            displayNormalMessages(messages);
            break;
        case "private_message":
            displayPrivateMessages(messages);
            break;
        default:
            break;
    }
}

function displayStatusMessages(message) {
    document.querySelector("ul").innerHTML += `<li class="status-messages"><p><span class="time">${message.time}</span> <span class="strong">${message.from}</span> entra na sala...</p></li>`;
}

function displayNormalMessages(message) {
    document.querySelector("ul").innerHTML += `<li class="normal-messages"><p><span class="time">${message.time}</span>  <span class="strong">${message.from}</span> para <span class="strong">${message.to}</span>:  ${message.text}</p></li>`;
}

function displayPrivateMessages(message) {
    document.querySelector("ul").innerHTML += `<li class="private-messages"><p><span class="time">${message.time}</span>  <span class="strong">${message.from}</span> reservadamente para <span class="strong">${message.to}</span>:  ${message.text}</p></li>`;
}

function scrollMessages() {
    const lastMessage = document.querySelector("ul").lastElementChild;
    lastMessage.scrollIntoView();
}



login();
getMessages();