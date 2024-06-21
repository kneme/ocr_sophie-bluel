const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();

function displayWorks(works){
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