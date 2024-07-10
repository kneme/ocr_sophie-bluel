import { filterWorks  } from "./works.js";
import { openCloseModal } from "./modals.js";

if (sessionStorage.getItem("token")){
    // Display 'logout' instead of 'login'
    const logoutBtn = document.createElement("a");
    logoutBtn.innerText = "logout";
    document.getElementById("loginBtn").replaceWith(logoutBtn);
    // Remove token from sessionStorage (logout)
    logoutBtn.addEventListener("click", function (){
        sessionStorage.removeItem("token"); 
        window.location.href = "./index.html";
    });
    // Display modal edit button
    const editBtn = document.createElement("button");
    editBtn.id = "modalBtn";
    editBtn.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> modifier`;
    document.querySelector(".portfolioTitle").appendChild(editBtn);
    // Generate modal
    openCloseModal();
}
else {
    // Show filter buttons
    filterWorks();
}

