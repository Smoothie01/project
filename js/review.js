window.addEventListener('DOMContentLoaded',()=>{
    let infoLink = document.querySelectorAll('.info-link'),
       infoContent = document.querySelectorAll('.info-content');

       for(let i = 0; i< infoLink.length; i++){
        infoContent[i].style = 'display:none;';
        infoLink[i].classList.remove("active-info");
    }

    infoContent[0].style = 'display:block';
    infoLink[0].classList.add("active-info");


    infoLink[0].addEventListener('click',()=>{
        for(let i = 0; i< infoLink.length; i++){
            infoContent[i].style = 'display:none;'
            infoLink[i].classList.remove("active-info");
        }
        infoContent[0].style = 'display:block';
        infoLink[0].classList.add("active-info");
    })

    infoLink[1].addEventListener('click',()=>{
        for(let i = 0; i< infoLink.length; i++){
            infoContent[i].style = 'display:none;';
            infoLink[i].classList.remove("active-info");
        }
        infoContent[1].style = 'display:block';
        infoLink[1].classList.add("active-info");
    })

    infoLink[2].addEventListener('click',()=>{
        for(let i = 0; i< infoLink.length; i++){
            infoContent[i].style = 'display:none;';
            infoLink[i].classList.remove("active-info");
        }
        infoContent[2].style = 'display:block';
        infoLink[2].classList.add("active-info");
    })
    
})