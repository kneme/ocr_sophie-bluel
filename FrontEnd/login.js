async function fetchPostLogin(stringifiedBody) {
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: stringifiedBody
    }).catch(() => {console.error("Could not fetch resource (POST /users/login).");});
    return response;
};
function displayMsg(aClass, message) {
    const displayedMsg = document.getElementById("login-message");
    if (!!displayedMsg) {
        displayedMsg.remove();
    };
    const messageSpan = document.createElement("span");
    messageSpan.id = "login-message";
    messageSpan.innerText = message;
    messageSpan.className = aClass;
    const loginSection = document.getElementById("login");
    const parent = document.getElementById("loginForm");
    loginSection.insertBefore(messageSpan, parent);
};
async function adminLogin() {
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const input = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        };
        fetchPostLogin(JSON.stringify(input))
        .then(resp => resp.json().then(data => {
            switch (true) {
                case resp.status === 200:
                    sessionStorage.setItem("token", data.token);
                    window.location.href = "./index.html";
                    return displayMsg("login-success",
                                    "Connexion réussie. Redirection...");
                case resp.status === 401 || resp.status === 404:
                    return displayMsg("login-failure",
                                    "Erreur dans l'identifiant ou le mot de passe");
                default:
                    return displayMsg("login-failure",
                                    "La connexion a échoué");
            };
        }));
    });
};
adminLogin();

