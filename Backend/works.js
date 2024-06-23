const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();

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
        imageElement.alt = article.title;
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

