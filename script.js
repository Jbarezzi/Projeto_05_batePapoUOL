const API_URL = "https://mock-api.driven.com.br/api/v6/uol/",
      PARTICIPANTS_URL = `${API_URL}participants`,
      STATUS_URL = `${API_URL}status`,
      MESSAGES_URL = `${API_URL}messages`;

const user = {},
      connectionInterval = 5000,
      reloadInterval = 3000;

let lastMessageSaved, lastMessage;

function login() {
    const username = prompt("Qual seu nome de usuário?");
    user.name = username;
    const promise = axios.post(PARTICIPANTS_URL, user);
    promise.then(checkConnection);
    promise.catch(() => {
        alert("O nome já está sendo usado ou é inválido, tente novamente.");
        login();
    });
}

function checkConnection() {
    setInterval(() => {
        const promise = axios.post(STATUS_URL, user);
        promise.catch(handleError);
    }, connectionInterval);
}

function handleError(error) {
    console.log("Status code: " + error.status);
    console.log("Mensagem de Erro: " + error.data);
}

function getMessages() {
    const promise = axios.get(MESSAGES_URL);
    promise.then((response) => {
        lastMessageSaved = document.querySelector("ul").lastElementChild;
        cleanMessages();
        response.data.map((message) => {
            if(message.to === "Todos" || message.to === user.name) {
                displayMessages(message);
            }
        });
        lastMessage = document.querySelector("ul").lastElementChild;
        scrollMessages();
    });
    promise.catch(handleError);
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
    document.querySelector("ul").innerHTML += `<li class="status-messages"><p><span class="time">(${message.time})</span> <strong>${message.from}</strong> entra na sala...</p></li>`;
}

function displayNormalMessages(message) {
    document.querySelector("ul").innerHTML += `<li class="normal-messages"><p><span class="time">(${message.time})</span>  <strong>${message.from}</strong> para <strong>${message.to}</strong>:  ${message.text}</p></li>`;
}

function displayPrivateMessages(message) {
    document.querySelector("ul").innerHTML += `<li class="private-messages"><p><span class="time">(${message.time})</span>  <strong>${message.from}</strong> reservadamente para <strong>${message.to}</strong>:  ${message.text}</p></li>`;
}

function reloadMessages() {
    setInterval(getMessages, reloadInterval);
}

function scrollMessages() {
    const lastMessageIntoView = document.querySelector("ul").lastElementChild;
    if (lastMessageSaved !== lastMessage) {
        lastMessageIntoView.scrollIntoView();
    }
}

function cleanMessages() {
    const messageList = document.querySelector("ul");
    messageList.innerHTML = "";
}

function sendMessage(message) {
    const sendedMessage = {from: user.name, to: "Todos", text: message.children[0].value, type: "message"};
    const promise = axios.post(MESSAGES_URL, sendedMessage);
    message.children[0].value = "";
    promise.then(getMessages);
    promise.catch(() => {
        alert("Houve algum problema de conexão, clique em OK para entrar de novo na sala.");
        window.location.reload();
    })
}

login();
getMessages();
reloadMessages();