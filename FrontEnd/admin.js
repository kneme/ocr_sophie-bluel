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
    // Header edit button & Adapt margin
    const editSpan = document.createElement("span");
    editSpan.className = "editSpan";
    editSpan.innerHTML = `<button id="modalBtn" class="headerModalBtn">
                            <i class="fa-regular fa-pen-to-square"></i> Mode édition
                        </button>`;
    const header = document.querySelector("header");
    header.style.marginTop = "100px";
    const parent = document.getElementById("logoLink");
    header.insertBefore(editSpan, parent);
    // Second edit button
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

