import { getWorks, createWorksElements, displayWorks } from "./works.js";

// Show modal & arial-modal = true
// Hide modal & arial-modal = false
// Updates homepage gallery when called
export async function openCloseModal(){
    const works = await getWorks();
    const modal = document.getElementById("modal");
    modal.setAttribute("aria-labelledby", "modalTitle");
    modal.role = "dialog";
    // Open
    const editBtn = document.getElementById("modalBtn");
    editBtn.onclick = function () {
        generateGalleryModal();
        modal.style.display = "block";
        editBtn.ariaModal = "true";
    };
    // Update gallery
    displayWorks(createWorksElements(works));
    // Close modal
    const closeBtn = document.querySelector(".closeModal");
    if (closeBtn) {
        closeBtn.onclick = function () {
            modal.style.display = "none";
            editBtn.ariaModal = "false";
        };
        window.onclick = function(event) {
            if (event.target == modal) {
            modal.style.display = "none";
            editBtn.ariaModal = "false";
            };
        };
        window.addEventListener('keydown', function (event) {
            if (event.key === "Escape" ||
                event.key === "Esc") {
                modal.style.display = "none";
                editBtn.ariaModal = "false";
            };
        });
    };
};


// -------- FIRST VIEW OF MODAL: Gallery & Option to delete works --------
// Generate gallery modal's content
async function generateGalleryModal(){
    const works = await getWorks();
    const workElements = createWorksElements(works);
    const parent = document.querySelector(".modalContent");
    parent.innerHTML = `
    <div class="modalHeader">
        <button class="closeModal">&times;</button>
        <h2 id=modalTitle>Galerie photo</h2>
    </div>
    <div class="modalBody">
        <div class="galleryModal">
        </div>
    </div>
    <div class="modalFooter">
        <input id="addPicture" type="button" value="Ajouter une photo">
    </div>
    `;
    // Generate gallery
    createRows(workElements);
    // Delete images (trash can icons & onclick action)
    deleteImg(workElements);
    // Close modal
    openCloseModal();
    // Generate add picture modal (add picture button)
    document.getElementById("addPicture").onclick = generateAddPicsModal;
};
// Display images in modal
function createRows(listOfElements) {
    const galleryModal = document.querySelector(".galleryModal");
    const rowOfFive = document.createElement("div");
    rowOfFive.className = "workRow";
    for (let i = 0; i < listOfElements.length; i++) {
        switch (true) {
            case i > 0 && i%5 === 0:
                galleryModal.appendChild(rowOfFive);
                return createRows(listOfElements.slice(i));
            case listOfElements.length <= 5:
                listOfElements.forEach(element => {
                    rowOfFive.appendChild(element);
                });
                galleryModal.appendChild(rowOfFive);
                listOfElements  = [];
                break;
            default:
                rowOfFive.appendChild(listOfElements[i]);
        };
    };
};
// Delete image on click (no warning, click = deleted)
function deleteImg(listOfFigures) {
    // Display trash cans
    listOfFigures.forEach(figure => {
        const image = figure.querySelector("img");
        const overlayDiv = document.createElement("div");
        overlayDiv.className = "overlay";
        const trashIcon = document.createElement("i");
        trashIcon.className = "fa-solid fa-trash-can";
        trashIcon.id = image.id;
        overlayDiv.appendChild(trashIcon);
        figure.appendChild(overlayDiv);
    });
    // Delete image & Update modal gallery
    [...document.querySelectorAll(".overlay i")].forEach(trash => {
        trash.addEventListener("click", function (event){
            const bearer = `Bearer ${sessionStorage.getItem("token")}`;
            fetch(`http://localhost:5678/api/works/${event.target.id}`, {
                method: "DELETE",
                headers: {"Authorization": bearer}
            }).then(generateGalleryModal);
        });
    });
};


// -------- SECOND VIEW OF (SAME) MODAL: Add work to gallery --------
// Using the previous modal, replacing some elements with new ones
function generateAddPicsModal() {
    const parent = document.querySelector(".modalContent");
    parent.innerHTML = `
    <div class="modalHeader">
        <button class="goBack"><i class="fa-solid fa-arrow-left"></i></button>
        <button class="closeModal">&times;</button>
        <h2 id=modalTitle>Ajout photo</h2>
    </div>
    <div class="modalBody">
        <form id="userInputs" action="#" method="post">
            <fieldset>
                <div class="selectPic">
                    <i class="fa-regular fa-image"></i>
                    <label for="addWork" class="customInput">
                        <input type="file" id="addWork" name="work" accept="image/png, image/jpeg" required/>
                        + Ajouter photo
                    </label>
                    <p>jpg, png : 4mo max</p>
                </div>
                <label for="titre">Titre</label>
                <input type="text" name="titre" id="titre" required>
                <label for="categories">Catégorie</label>
                <select name="categories" id="categories" required>
                    <option disabled selected value></option>
                </select>
            </fieldset>
            <input id="validate" class="validate" type="submit" value="Valider">
        </form>
    </div>
    `;
    // Categories to be selected in input
    listCategories();
    // Display image preview
    const imgInput = document.getElementById("addWork");         
    imgInput.onchange = function (){
        const [image] = imgInput.files;
        if (image) {
            const selectPic = document.querySelector(".selectPic");
            selectPic.innerHTML = "";
            const newImg = document.createElement("img");
            newImg.title = image.name;
            newImg.src = URL.createObjectURL(image);
            newImg.className = "newImg";
            selectPic.appendChild(newImg);
            // Upload image & Redirect to updated gallery modal
            const validate = document.getElementById("validate");
            validate.addEventListener("click", function (event){
                event.preventDefault();
                const formData = new FormData();
                formData.append("image", image);
                formData.append("title", document.getElementById("titre").value);
                formData.append("category", document.getElementById("categories").value);
                const bearer = `Bearer ${sessionStorage.getItem("token")}`;
                fetch("http://localhost:5678/api/works", {
                    method: "POST",
                    headers: {"Authorization": bearer},
                    body: formData
                }).then(generateGalleryModal);
            });
        };
    };
    // Close modal
    openCloseModal();
    // Generate gallery modal (left arrow)
    document.querySelector(".goBack").onclick = generateGalleryModal;
};
// List categories from the API in add picture form
async function listCategories() {
    const getCategories = await fetch("http://localhost:5678/api/categories");
    const categories = await getCategories.json();
    categories.forEach(category => createOption(category.name, category.id));
};
// Create DOM ready 'option' element
function createOption(name, id) {
    const optionList = document.createElement("option");
    optionList.value = id;
    optionList.innerText = name;
    document.getElementById("categories").appendChild(optionList);
}

