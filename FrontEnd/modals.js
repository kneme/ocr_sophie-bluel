import {
  fetchGetWorks,
  createWorksElements,
  displayWorks,
  fetchGetCategories,
} from "./works.js";

// Show modal & arial-modal = true
// Hide modal & arial-modal = false
// Updates homepage gallery when called
export async function openCloseModal() {
  const works = await fetchGetWorks();
  const modal = document.getElementById("modal");
  modal.setAttribute("aria-labelledby", "modalTitle");
  modal.role = "dialog";
  const editBtns = document.querySelectorAll("#modalBtn");
  [...editBtns].forEach((button) => {
    button.onclick = function () {
      generateGalleryModal();
      modal.style.display = "block";
      button.ariaModal = "true";
    };
  });
  displayWorks(createWorksElements(works)); // update gallery
  const closeBtn = document.querySelector(".closeModal");
  if (closeBtn) {
    const editBtn = document.querySelector("#modalBtn[aria-modal='true']");
    closeBtn.onclick = function () {
      modal.style.display = "none";
      editBtn.ariaModal = "false";
    };
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
        editBtn.ariaModal = "false";
      }
    };
    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape" || event.key === "Esc") {
        modal.style.display = "none";
        editBtn.ariaModal = "false";
      }
    });
  }
}

// -------- FIRST VIEW OF MODAL: Gallery & Option to delete works --------
function createRows(listOfElements) {
  const galleryModal = document.querySelector(".galleryModal");
  const rowOfFive = document.createElement("div");
  rowOfFive.className = "workRow";
  for (let i = 0; i < listOfElements.length; i++) {
    switch (true) {
      case i > 0 && i % 5 === 0:
        galleryModal.appendChild(rowOfFive);
        return createRows(listOfElements.slice(i));
      case listOfElements.length <= 5:
        listOfElements.forEach((element) => {
          rowOfFive.appendChild(element);
        });
        galleryModal.appendChild(rowOfFive);
        listOfElements = [];
        break;
      default:
        rowOfFive.appendChild(listOfElements[i]);
    }
  }
}

// Delete image (no warning, click = deleted)
function deleteImg(listOfFigures) {
  listOfFigures.forEach((figure) => {
    const image = figure.querySelector("img");
    const overlayBtn = document.createElement("button");
    overlayBtn.className = "overlay";
    overlayBtn.id = image.id;
    const trashIcon = document.createElement("i");
    trashIcon.className = "fa-solid fa-trash-can";
    overlayBtn.appendChild(trashIcon);
    figure.appendChild(overlayBtn);
  });
  [...document.querySelectorAll(".overlay")].forEach((button) => {
    button.onclick = function () {
      const bearer = `Bearer ${sessionStorage.getItem("token")}`;
      fetchDeleteWorks(bearer, button.id);
    };
  });
}

async function fetchDeleteWorks(bearer, id) {
  await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: { Authorization: bearer },
  }).catch(() => {
    console.error("Could not fetch resource (DELETE /works/{id}).");
  });
  return generateGalleryModal();
}

async function generateGalleryModal() {
  const works = await fetchGetWorks();
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
  createRows(workElements);
  deleteImg(workElements);
  openCloseModal();
  document.getElementById("addPicture").onclick = generateAddPicsModal;
}

// -------- SECOND VIEW OF (SAME) MODAL: Add work to gallery --------
function createOption(name, id) {
  const optionList = document.createElement("option");
  optionList.value = id;
  optionList.innerText = name;
  document.getElementById("categories").appendChild(optionList);
}

function imageError(msg) {
  if (!document.getElementById("imageTooBig")) {
    const selectPic = document.querySelector(".selectPic");
    const errorSpan = document.createElement("span");
    errorSpan.id = "imageTooBig";
    errorSpan.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${msg}`;
    selectPic.appendChild(errorSpan);
  }
}

async function fetchPostWorks(bearer, formData) {
  await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: { Authorization: bearer },
    body: formData,
  }).catch(() => {
    console.error("Could not fetch resource (POST /works).");
  });
  return generateGalleryModal();
}

async function generateAddPicsModal() {
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

  const categories = await fetchGetCategories();
  categories.forEach((category) => createOption(category.name, category.id));
  const imgInput = document.getElementById("addWork");
  imgInput.onchange = function () {
    const [image] = imgInput.files;
    switch (true) {
      case image.size > 4000000:
        document.getElementById("addWork").value = ""; // block validate button
        return imageError("L'image dépasse 4mo");
      case image.type !== "image/jpeg" && image.type !== "image/png":
        document.getElementById("addWork").value = "";
        return imageError("L'image doit être au format jpg ou png");
      default:
        const selectPic = document.querySelector(".selectPic");
        selectPic.innerHTML = "";
        const newImg = document.createElement("img");
        newImg.title = image.name;
        newImg.src = URL.createObjectURL(image);
        newImg.className = "newImg";
        selectPic.appendChild(newImg);
        const validate = document.getElementById("validate");
        validate.addEventListener("click", function (event) {
          event.preventDefault();
          const formData = new FormData();
          formData.append("image", image);
          formData.append("title", document.getElementById("titre").value);
          formData.append(
            "category",
            document.getElementById("categories").value
          );
          const bearer = `Bearer ${sessionStorage.getItem("token")}`;
          fetchPostWorks(bearer, formData);
        });
    }
  };
  openCloseModal();
  document.querySelector(".goBack").onclick = generateGalleryModal;
}
