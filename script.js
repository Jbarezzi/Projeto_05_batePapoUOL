function login() {
    const username = prompt("Qual su nome de usuário?");
    const user = { name : username};
    const requisition = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user);

    requisition.then(alert("deu"))
    requisition.catch(alert("não deu"))
}

login();