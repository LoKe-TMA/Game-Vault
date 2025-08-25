// Demo: banner carousel
const banners = [
  { img: "https://picsum.photos/seed/game1/600/200", href: "#" },
  { img: "https://picsum.photos/seed/game2/600/200", href: "#" }
];

const bannerContainer = document.getElementById('banners');
banners.forEach(b => {
  const a = document.createElement('a');
  a.href = b.href;
  a.target = "_blank";
  const img = document.createElement('img');
  img.src = b.img;
  a.appendChild(img);
  bannerContainer.appendChild(a);
});

// Demo: Games Section
const gamesSection = document.getElementById('games');
const games = [
  { name: "PUBG MOBILE", type: "UC Store", img: "https://i.imgur.com/2kYw2Jq.png" },
  { name: "MLBB", type: "Diamond Store", img: "https://i.imgur.com/g3Qm2Is.png" }
];
games.forEach(g => {
  const div = document.createElement('div');
  div.className = 'game-card';
  div.innerHTML = `
    <img src="${g.img}" alt="${g.name}">
    <h4>${g.name}</h4>
    <p>${g.type}</p>
  `;
  gamesSection.appendChild(div);
});
