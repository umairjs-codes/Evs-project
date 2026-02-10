document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    e.preventDefault();

    document.querySelector(this.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});

const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
});

cards.forEach(card => observer.observe(card));

// js naivigation
function scrollToTundra(){
  document.getElementById("tundra")
  .scrollIntoView({ behavior: "smooth" });
}



let viewer;
let audioPlayer = new Audio();
let audioEnabled = true;


/* ============================= */
/* LOAD SCENE FUNCTION */
/* ============================= */

function loadScene(scene){

  const scenes = {

    arctic: {
      image: "scenes/arctic-360.png",
      audio: "audio/arctic-ambient.mp3",
      hotspots: [
        {
          pitch: 5,
          yaw: 110,
          title: "Arctic Fox",
          img: "hotspot-images/arctic-fox.jpg",
          text: "Arctic foxes survive harsh cold using thick fur and seasonal camouflage."
        }
      ]
    },

    alpine: {
      image: "scenes/alpine-360.png",
      audio: "audio/alpine-wind.mp3",
      hotspots: [
        {
          pitch: -10,
          yaw: 40,
          title: "Tundra Plants",
          img: "hotspot-images/tundra-plants.jpg",
          text: "Low growing plants dominate alpine tundra landscapes."
        }
      ]
    }

  };

  const selected = scenes[scene];

  /* Destroy previous viewer to avoid bugs */
  if(viewer){
    viewer.destroy();
  }

  /* Play Ambient Audio */
  playAudio(selected.audio);

  viewer = pannellum.viewer('vrViewer',{
    type:"equirectangular",
    panorama:selected.image,
    autoLoad:true,

    hotSpots:selected.hotspots.map(h => ({
      pitch:h.pitch,
      yaw:h.yaw,
      type:"custom",
      createTooltipFunc: hotspotPreview,
      createTooltipArgs: h
    }))
  });

}


/* ============================= */
/* HOTSPOT PREVIEW CARD */
/* ============================= */

function hotspotPreview(div, data){

  div.classList.add("hotspot-preview");

  div.innerHTML = `
    <img src="${data.img}">
    <span>${data.title}</span>
  `;

  div.onclick = () => openModal(data);
}


/* ============================= */
/* MODAL CONTROL */
/* ============================= */

function openModal(data){

  document.getElementById("modalImage").src = data.img;
  document.getElementById("modalTitle").textContent = data.title;
  document.getElementById("modalText").textContent = data.text;

  document.getElementById("infoModal").style.display = "block";
}

function closeModal(){
  document.getElementById("infoModal").style.display = "none";
}


/* ============================= */
/* AUDIO SYSTEM */
/* ============================= */

function playAudio(file){

  if(!audioEnabled) return;

  audioPlayer.pause();
  audioPlayer = new Audio(file);
  audioPlayer.loop = true;

  audioPlayer.play().catch(()=>{});
}


/* ============================= */
/* AUDIO TOGGLE BUTTON */
/* ============================= */

function toggleAudio(){

  audioEnabled = !audioEnabled;
  const btn = document.getElementById("audioBtn");

  if(audioEnabled){
    audioPlayer.play();
    btn.textContent = "🔊 Audio On";
  }
  else{
    audioPlayer.pause();
    btn.textContent = "🔇 Audio Off";
  }
}

// Carousel Logic
const slides = document.querySelector(".abiotic-slides");
const slideItems = document.querySelectorAll(".abiotic-slide");
const prevBtn = document.querySelector(".abiotic-prev");
const nextBtn = document.querySelector(".abiotic-next");

let currentIndex = 0;

function updateCarousel(){
  slides.style.transform = `translateX(-${currentIndex * 100}%)`;
}

nextBtn.addEventListener("click", ()=>{
  currentIndex = (currentIndex + 1) % slideItems.length;
  updateCarousel();
});

prevBtn.addEventListener("click", ()=>{
  currentIndex = (currentIndex - 1 + slideItems.length) % slideItems.length;
  updateCarousel();
});
