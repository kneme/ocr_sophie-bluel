// Clears & Displays images in gallery div
function displayWorks(works){
    document.querySelector(".gallery").innerHTML = "";
    const sectionPortfolio = document.querySelector("#portfolio");
    const divGallery = document.querySelector(".gallery");
    for (let i = 0; i < works.length; i++) {
        const article = works[i];
        const workElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = article.imageUrl;
        imageElement.alt = alternateTexts[works[i].id];
        const nomElement = document.createElement("figcaption");
        nomElement.innerText = article.title;
        sectionPortfolio.appendChild(divGallery);
        divGallery.appendChild(workElement)
        workElement.appendChild(imageElement);
        workElement.appendChild(nomElement);
    };
};
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();
const alternateTexts = {1:"Abajour suspension bleu turquoise",
                        2:"Chambre lumineuse thème blanc doré avec plantes",
                        3:"Restaurant vitré, charpente en bois avec plantes",
                        4:"Chambre béton brut qui contraste aux coussins",
                        5:"Effet sandwich de demi-cercles laissant apparaître des formes",
                        6:"Cuisine design minimaliste",
                        7:"Chambre couleurs bleu cambridge, blanc, doré avec plantes monstera",
                        8:"Salon minimaliste blanc, noir, bois",
                        9:"Chambre couleurs cacao, lait, bleu turquoise, avec lit deux places",
                        10:"Bar comptoir cyan, tabourets bois couleur rouille",
                        11:"Couloir de restauration carrelage blanc, emeraude"};
displayWorks(works)


// FILTER BUTTONS
// Calls displayWorks() with: Filtered list of works that have an id = id of clicked button 
//                            or
//                            All works if button has no numeral id
export async function filterWorks(){
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json();
    // Create one button to show all works
    createTOUSBtn();
    // Create category buttons
    categories.forEach(category => createFilterBtn(category.name, category.id));
    // Filter works by category when button is clicked
    [...document.querySelectorAll(".filter-btn")].forEach((button) => {
        button.addEventListener("click", function (){
            const activeBtnId = Number(button.id);
            if (activeBtnId){
                displayWorks(works.filter((work) => {
                    return work.categoryId === activeBtnId;
                }));
            }
            else
                displayWorks(works);
        });
    });
};
const filtersForm = document.querySelector(".filtres")

function createFilterBtn(categoryName, categoryId){
    const label = document.createElement("label");
    label.htmlFor = categoryId;
    label.innerText = categoryName;
    const input = document.createElement("input");
    input.className = "filter-btn";
    input.type = "button";
    input.id = categoryId;
    input.name = categoryName;
    input.value = categoryName;
    filtersForm.appendChild(label);
    filtersForm.appendChild(input);
};

function createTOUSBtn(){
    const showAllLabel = document.createElement("label");
    showAllLabel.htmlFor = "tous";
    showAllLabel.innerText = "Tous";
    const showAllInput = document.createElement("input");
    showAllInput.className = "filter-btn";
    showAllInput.type = "button";
    showAllInput.id = "tous";
    showAllInput.name = "tous";
    showAllInput.value = "Tous";
    filtersForm.appendChild(showAllLabel);
    filtersForm.appendChild(showAllInput);
}