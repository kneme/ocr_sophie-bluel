function adminLogin() {
    const loginForm = document.getElementById("loginForm");
    // Send user login inputs
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const userInput = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        };
        const stringUserInput = JSON.stringify(userInput);
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: stringUserInput
        }).then(resp => resp.json().then(data => ({status: resp.status, body: data})))
        .then((obj) => loginOrError((obj.status === 200), (obj.body.token)));
    });
};
adminLogin()

function loginOrError(loginSuccess, token){
    // Only display one login message
    const displayedMsg = document.getElementById("login-message");
    if (!!displayedMsg) {
        displayedMsg.remove();
    };
    // Create message
    const messageSpan = document.createElement("span");
    messageSpan.id = "login-message";
    if (loginSuccess){
        messageSpan.innerText = "Connexion réussie. Redirection...";
        messageSpan.className = "login-success";
        // Save login token
        sessionStorage.setItem("token", token);
        // Redirect
        window.location.href = "../Frontend/index.html";
    } else {
        messageSpan.innerText = "Erreur dans l'identifiant ou le mot de passe";
        messageSpan.className = "login-failure";
    };
    const loginSection = document.getElementById("login");
    const parent = document.getElementById("loginForm");
    loginSection.insertBefore(messageSpan, parent);
}

