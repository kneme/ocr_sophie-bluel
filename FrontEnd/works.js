const filtersForm = document.querySelector(".filtres");
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


// Return list of works from API
export async function getWorks() {
    const getWorks = await fetch("http://localhost:5678/api/works");
    const works = await getWorks.json();
    return works
};
// Return list of works ready for DOM manipulations
export function createWorksElements(works) {
    const listOfWorks = [];
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        const workElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.id = work.id;
        imageElement.src = work.imageUrl;
        const alternate = alternateTexts[work.id];
        imageElement.alt = alternate ? alternateTexts[work.id] :
                                       "pas de description pour le moment";
        const nomElement = document.createElement("figcaption");
        nomElement.innerText = work.title;
        workElement.appendChild(imageElement);
        workElement.appendChild(nomElement);
        listOfWorks.push(workElement);
    };
    return listOfWorks;
};
// Display works (images) in homepage gallery
export function displayWorks(works){
    const divGallery = document.querySelector(".gallery");
    divGallery.innerHTML = "";
    for (let i = 0; i < works.length; i++) {
        divGallery.appendChild(works[i]);
    };
};
displayWorks(createWorksElements(await getWorks()));


// -------- FILTER BUTTONS --------
// Calls displayWorks(createWorksElements()) with
//   Filtered list of works that have an id = id of clicked button 
//                   Or
//   All works if button has no numeral id
export async function filterWorks(){
    const getCategories = await fetch("http://localhost:5678/api/categories");
    const categories = await getCategories.json();
    const works = await getWorks();
    // Create one button to show all works
    createTOUSBtn();
    // Create category buttons
    categories.forEach(category => createFilterBtn(category.name, category.id));
    // Filter works by category when button is clicked
    [...document.querySelectorAll(".filter-btn")].forEach(button => {
        button.addEventListener("click", function (){
            const activeBtnId = Number(button.id);
            if (activeBtnId){
                displayWorks(createWorksElements(works.filter((work) => {
                    return work.categoryId === activeBtnId;
                })));
            }
            else
                displayWorks(createWorksElements(works));
        });
    });
};
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

