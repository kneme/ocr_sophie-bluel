import {filterWorks} from "./works.js";

if (sessionStorage.getItem("token")){
    // Display 'logout' instead of 'login'
    const logoutBtn = document.createElement("a");
    logoutBtn.innerText = "logout";
    document.getElementById("loginBtn").replaceWith(logoutBtn);
    // Display edit button
    const editBtn = document.createElement("button");
    editBtn.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> modifier`;
    document.querySelector(".portfolioTitle").appendChild(editBtn);
    // Remove token from sessionStorage (logout)
    logoutBtn.addEventListener("click", function (){
        sessionStorage.removeItem("token");
        window.location.href = "../Frontend/index.html"
    });
}
else {
    // Show filter buttons
    filterWorks();
}