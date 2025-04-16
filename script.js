// Configuração da data de início do relacionamento
const startDate = new Date('2024-04-17T00:00:00-04:00'); // Data inicial no fuso de Manaus

// Elementos do timer
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');

// Atualiza o timer a cada segundo
function updateTimer() {
    // Obtém a data atual no fuso horário de Manaus (UTC-4)
    const now = new Date();
    const manausTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Manaus' }));
    
    const diff = manausTime - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysElement.textContent = String(days).padStart(2, '0');
    hoursElement.textContent = String(hours).padStart(2, '0');
    minutesElement.textContent = String(minutes).padStart(2, '0');
    secondsElement.textContent = String(seconds).padStart(2, '0');
}

// Atualiza o timer imediatamente e depois a cada segundo
updateTimer();
setInterval(updateTimer, 1000);

// Gerenciamento da revelação dos checkpoints
let currentCheckpoint = 0;
const totalCheckpoints = 4;

function revealCheckpoint(checkpointNumber) {
    const checkpointBtn = document.querySelector(`.checkpoint-btn[data-checkpoint="${checkpointNumber}"]`);
    const checkpointContent = document.getElementById(`checkpoint-${checkpointNumber}`);
    
    if (checkpointNumber === currentCheckpoint + 1) {
        checkpointBtn.classList.add('revealed');
        checkpointBtn.querySelector('.checkpoint-icon').textContent = '✅';
        currentCheckpoint++;
        
        // Adiciona efeito sonoro
        const audio = new Audio('sounds/reveal.mp3');
        audio.play().catch(e => console.log('Erro ao tocar áudio:', e));
        
        // Se todos os checkpoints foram revelados, permite abrir o baú
        if (currentCheckpoint === totalCheckpoints) {
            document.querySelector('.treasure-btn').classList.add('unlocked');
            document.querySelector('.treasure-icon').textContent = '💎';
        }
    }
}

// Adiciona evento de clique aos botões dos checkpoints
document.querySelectorAll('.checkpoint-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const checkpointNumber = parseInt(btn.getAttribute('data-checkpoint'));
        const content = document.getElementById(`checkpoint-${checkpointNumber}`);
        
        if (checkpointNumber <= currentCheckpoint + 1) {
            content.style.display = 'block';
            revealCheckpoint(checkpointNumber);
        }
    });
});

// Adiciona evento de clique ao baú do tesouro
document.querySelector('.treasure-btn').addEventListener('click', () => {
    const treasureContent = document.querySelector('.treasure-content');
    
    if (currentCheckpoint === totalCheckpoints) {
        treasureContent.style.display = 'block';
        
        // Adiciona efeito sonoro
        const audio = new Audio('sounds/treasure.mp3');
        audio.play().catch(e => console.log('Erro ao tocar áudio:', e));
    } else {
        // Mostra mensagem de que precisa completar os checkpoints
        alert('Você precisa descobrir todos os checkpoints antes de abrir o baú do tesouro!');
    }
});

// Adiciona evento de clique aos botões de fechar
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.checkpoint-content, .treasure-content').style.display = 'none';
    });
});

// Fecha o conteúdo quando clica fora dele
document.querySelectorAll('.checkpoint-content, .treasure-content').forEach(content => {
    content.addEventListener('click', (e) => {
        if (e.target === content) {
            content.style.display = 'none';
        }
    });
});

// Efeito de scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Efeito de parallax simplificado
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelector('.treasure-map').style.transform = `translateY(${scrolled * 0.1}px)`;
});

// Configuração do player de música
const playlist = [
    {
        title: "TÓPAZ - Uma Palavra (ÄCELUMDISPERILOSIUOSO)",
        src: "./assets/musics/TÓPAZ - Uma Palavra (ÄCELUMDISPERILOSIUOSO).mp3"
    },
    {
        title: "I Fell in Love With Princess Peach",
        src: "./assets/musics/I Fell in Love With Princess Peach.mp3"
    },
    {
        title: "Zimbra - Eu Te Amo e Nem Sei",
        src: "./assets/musics/Zimbra - Eu Te Amo e Nem Sei (Áudio Oficial).mp3"
    },
    {
        title: "Story Of The Year - Real Life",
        src: "./assets/musics/Story Of The Year - Real Life.mp3"
    },
    {
        title: "CPM 22  - Não Sei Viver Sem Ter Você",
        src: "./assets/musics/CPM 22  - Não Sei Viver Sem Ter Você (Ao Vivo no Rock in Rio).mp3"
    },
    {
        title: "Dance Gavin Dance - We Own The Night",
        src: "./assets/musics/Dance Gavin Dance - We Own The Night (Official Music Video).mp3"
    },
    {
        title: "yun li - A Cidade Sem Você",
        src: "./assets/musics/yun li - A Cidade Sem Você (prod liwan, hakuro & yun li).mp3"
    },
];

let currentSongIndex = 0;
const audio = new Audio();
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeSlider = document.getElementById('volumeSlider');
const currentSongDisplay = document.getElementById('currentSong');
const progressBar = document.querySelector('.progress');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');

// Configuração inicial
audio.volume = 0.2; // Volume inicial em 20%
volumeSlider.value = 20; // Atualiza o slider para refletir o volume inicial

// Função para formatar o tempo em minutos:segundos
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Função para atualizar a barra de progresso e o tempo
function updateProgress() {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
    durationDisplay.textContent = formatTime(audio.duration);
}

// Função para carregar a música atual
function loadSong(index) {
    if (index >= 0 && index < playlist.length) {
        currentSongIndex = index;
        audio.src = playlist[currentSongIndex].src;
        currentSongDisplay.textContent = playlist[currentSongIndex].title;
        
        // Reset da barra de progresso
        progressBar.style.width = '0%';
        currentTimeDisplay.textContent = '0:00';
        durationDisplay.textContent = '0:00';
        
        // Adiciona evento para atualizar a duração quando os metadados forem carregados
        audio.addEventListener('loadedmetadata', () => {
            durationDisplay.textContent = formatTime(audio.duration);
        });
    }
}

// Função para tocar a música atual
function playCurrentSong() {
    audio.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

// Função para pausar a música atual
function pauseCurrentSong() {
    audio.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
}

// Evento de play/pause
playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        playCurrentSong();
    } else {
        pauseCurrentSong();
    }
});

// Evento de próxima música
nextBtn.addEventListener('click', () => {
    loadSong((currentSongIndex + 1) % playlist.length);
    playCurrentSong();
});

// Evento de música anterior
prevBtn.addEventListener('click', () => {
    loadSong((currentSongIndex - 1 + playlist.length) % playlist.length);
    playCurrentSong();
});

// Evento de controle de volume
volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});

// Evento quando a música termina
audio.addEventListener('ended', () => {
    loadSong((currentSongIndex + 1) % playlist.length);
    playCurrentSong();
});

// Atualiza a barra de progresso a cada segundo
audio.addEventListener('timeupdate', updateProgress);

// Permite clicar na barra de progresso para pular para um ponto específico
document.querySelector('.progress-bar').addEventListener('click', (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.offsetX / progressBar.offsetWidth;
    audio.currentTime = clickPosition * audio.duration;
});

// Carrega a primeira música (começa pausada)
loadSong(0); 