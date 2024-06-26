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

// Clears & Displays images in gallery div
function displayWorks(works){
    document.querySelector(".gallery").innerHTML = "";
    for (let i = 0; i < works.length; i++) {
        const article = works[i];
        const sectionPortfolio = document.querySelector("#portfolio");
        const divGallery = document.querySelector(".gallery")
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
    }
}
displayWorks(works)


// FILTER BUTTONS
// Calls displayWorks() with: Filtered list of works that have an id = id of clicked button 
//                            or
//                            All works if button has no id
function filterWorks(){
    [...document.querySelectorAll(".filter-btn")].forEach((button) => {
        button.addEventListener("click", function (){
            const activeBtnId = button.id;
            if (activeBtnId){
                displayWorks(works.filter((work) => {
                    return work.categoryId == activeBtnId;
                }));
            } 
            else
                return displayWorks(works);
        });
    }); 
};
filterWorks()

