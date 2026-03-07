// 1. Função para extrair o ID real do YouTube
function obterVideoID(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// 2. LISTA DE VÍDEOS REAIS
// Cada objeto: { url, cat, title, channel }
// Categorias: frontend | backend | mobile | data | tools

const meusVideos = [
  // ---------- TOOLS / GERAL ----------
  { 
    url: "https://youtu.be/6LMQjWcgdH8",
    cat: "tools",
    title: "OS ERROS QUE ESTÃO A MATAR A TUA EVOLUÇÃO(🧑🏽‍💻+⚠️)!",
    channel: "DevLab AO"
  }, // [web:36]
  { 
    url: "https://youtu.be/C41mfMeqy8U",
    cat: "tools",
    title: "Os 5 Maiores Desafios que todo Desenvolvedor Júnior Enfrenta em Angola🇦🇴!",
    channel: "DevLab AO"
  }, // [web:37]
  { 
    url: "https://youtu.be/f75ynGURn5U",
    cat: "tools",
    title: "Hello, World! Bem-vindo ao DevLab 🚀.",
    channel: "DevLab AO"
  }, // [web:38]
  { 
    url: "https://www.youtube.com/watch?v=x_H2GgqjCZI",
    cat: "tools",
    title: "Aprenda APIs em 10 minutos",
    channel: "Diego Napoli"
  }, // [web:38]
  { 
    url: "https://www.youtube.com/watch?v=N6g2Sl0xAds&t=76s",
    cat: "tools",
    title: " Como adotar IA e obter benefícios reais?",
    channel: "Elemar Júnior"
  }, // [web:32]
  { 
    url: "https://www.youtube.com/watch?v=T8_2kJpp6Hk&pp=ygUOYXBpIGV4cGVyaWVuY2U%3D",
    cat: "tools",
    title: "API Experience na prática",
    channel: "Filipe Deschamps"
  }, // [web:35]
  { 
    url: "https://www.youtube.com/watch?v=oC78PqlJHOM",
    cat: "tools",
    title: "Estratégias de SEO para Desenvolvedores Front End",
    channel: "Curso em Vídeo"
  }, // [web:23][web:26]
  { 
    url: "https://www.youtube.com/watch?v=kB5e-gTAl_s",
    cat: "tools",
    title: "Git e GitHub COMPLETO (playlist resumida)",
    channel: "Curso em Vídeo"
  }, // [web:21][web:26]
  // ---------- FRONTEND ----------
  { 
    url: "https://www.youtube.com/watch?v=Ejkb_YpuHWs",
    cat: "frontend",
    title: "Curso de HTML5 e CSS3 - Aula 01",
    channel: "Curso em Vídeo"
  }, // [web:20]
  { 
    url: "https://www.youtube.com/watch?v=jgQjeqGRdgA",
    cat: "frontend",
    title: "O que vamos aprender no módulo 1? (HTML5+CSS3)",
    channel: "Curso em Vídeo"
  }, // [web:27]
  { 
    url: "https://www.youtube.com/watch?v=reFQrqxOzsg",
    cat: "frontend",
    title: "Criando um exemplo real (HTML5+CSS3)",
    channel: "Curso em Vídeo"
  }, // [web:14]
  { 
    url: "https://www.youtube.com/watch?v=gqrySQQzvvQ",
    cat: "frontend",
    title: "Desafio: um site com vídeos (HTML5+CSS3)",
    channel: "Curso em Vídeo"
  }, // [web:17]
  { 
    url: "https://www.youtube.com/watch?v=vl0eatPehLs",
    cat: "frontend",
    title: "Vídeo responsivo no portfólio (HTML5+CSS3)",
    channel: "Curso em Vídeo"
  }, // [web:24]
  { 
    url: "https://www.youtube.com/watch?v=HN1UjzRSdBk",
    cat: "frontend",
    title: "CSS Flexbox - Guia Completo",
    channel: "Origamid"
  }, // [web:11]
  { 
    url: "https://www.youtube.com/watch?v=8mei6uVttho",
    cat: "frontend",
    title: "Como o CSS funciona?",
    channel: "Curso em Vídeo"
  }, // [web:11]
  { 
    url: "https://www.youtube.com/watch?v=7A4UQGrFU9Q",
    cat: "frontend",
    title: "Iniciando no ReactJS",
    channel: "Rocketseat"
  }, // [web:37]
  { 
    url: "https://www.youtube.com/watch?v=Cg0LoRgAWsI",
    cat: "frontend",
    title: "React 19 RC para iniciantes",
    channel: "Rocketseat"
  }, // [web:34]

  // ---------- BACKEND ----------
  { 
    url: "https://www.youtube.com/watch?v=6kf_CKwyHG0",
    cat: "backend",
    title: "O que é API?",
    channel: "Celso Kitamura"
  }, // [web:32]
  { 
    url: "https://www.youtube.com/watch?v=3osAasD7rQ4",
    cat: "backend",
    title: "Sistema Legado (O Pior Pesadelo dos Programadores) // Dicionário do Programador",
    channel: "Código Fonte TV"
  }, // [web:35]
  { 
    url: "https://www.youtube.com/watch?v=5BYm7UdCrX0",
    cat: "backend",
    title: "Criando o primeiro repositório (Git e GitHub)",
    channel: "Curso em Vídeo"
  }, // [web:23]
  { 
    url: "https://www.youtube.com/watch?v=kB5e-gTAl_s",
    cat: "backend",
    title: "Curso de Git e GitHub COMPLETO",
    channel: "Curso em Vídeo"
  }, // [web:21]
  { 
    url: "https://www.youtube.com/watch?v=roP93FA-NgU",
    cat: "backend",
    title: "Próximos passos em JavaScript (curso)",
    channel: "Curso em Vídeo"
  }, // [web:30]
  { 
    url: "https://www.youtube.com/watch?v=OmmJBfcMJA8",
    cat: "backend",
    title: "Criando seu primeiro script em JavaScript",
    channel: "Curso em Vídeo"
  }, // [web:39]

  // ---------- MOBILE ----------
  { 
    url: "https://www.youtube.com/watch?v=B-fJFHUj1Jk",
    cat: "mobile",
    title: "Diferença entre desenvolvedor web e mobile. Qual eu devo escolher?",
    channel: "Front Bignners"
  }, // [web:27]

  // ---------- DATA / IA ----------
  { 
    url: "https://www.youtube.com/watch?v=F608hzn_ygo",
    cat: "data",
    title: "Python para Análise de Dados (Aula 1)",
    channel: "Hashtag Programação"
  }, // [web:18]
  { 
    url: "https://www.youtube.com/watch?v=kCMaqla6Grs",
    cat: "data",
    title: "Introdução à Análise de Dados com Python",
    channel: "Hashtag Programação"
  }, // [web:22]
  { 
    url: "https://www.youtube.com/watch?v=BxMtSb2w9Sk",
    cat: "data",
    title: "Curso Python para Iniciantes",
    channel: "Hashtag Programação"
  }, // [web:28]

];

// 3. ELEMENTOS DA PÁGINA
const container = document.getElementById('video-container');
const modal = document.getElementById('videoModal');
const iframe = document.getElementById('videoIframe');
const closeBtn = document.querySelector('.close-modal');
const filterButtons = document.querySelectorAll('.filter-btn');

// 4. RENDERIZAÇÃO DA GALERIA
function renderGallery(filter = 'all') {
  if (!container) return;
  container.innerHTML = '';

  const filtrados = filter === 'all' 
    ? meusVideos 
    : meusVideos.filter(v => v.cat === filter);

  filtrados.forEach((v, index) => {
    const videoID = obterVideoID(v.url);
    if (!videoID) return;

    const card = document.createElement('div');
    card.className = 'video-item';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';

    card.innerHTML = `
      <div class="thumb-wrapper">
        <img src="https://img.youtube.com/vi/${videoID}/maxresdefault.jpg"
             onerror="this.src='https://img.youtube.com/vi/${videoID}/mqdefault.jpg'"
             alt="${v.title}" loading="lazy">
        <div class="play-overlay">▶</div>
      </div>
      <div class="video-info">
        <span class="channel-tag">${v.channel}</span>
        <h3>${v.title}</h3>
      </div>
    `;

    card.onclick = () => abrirModal(v.url);
    container.appendChild(card);

    setTimeout(() => {
      card.style.transition = 'all 0.4s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 20);
  });
}

// 5. FILTRO PELOS BOTÕES DE CATEGORIA
if (filterButtons && filterButtons.length) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.filter-btn.active')?.classList.remove('active');
      btn.classList.add('active');
      const category = btn.getAttribute('data-category');
      renderGallery(category);
    });
  });
}

// 6. FUNÇÕES DO MODAL
function abrirModal(url) {
  const id = obterVideoID(url);
  const origin = window.location.origin === 'null' ? '*' : window.location.origin;
  iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&enablejsapi=1&origin=${origin}`;
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function fecharModal() {
  modal.style.display = "none";
  iframe.src = "";
  document.body.style.overflow = "auto";
}

if (closeBtn) {
  closeBtn.onclick = fecharModal;
}

window.onclick = (e) => {
  if (e.target === modal) fecharModal();
};

// 7. INICIALIZA GALERIA
renderGallery();
