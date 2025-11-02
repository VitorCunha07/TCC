// Sistema de Agenda - Allian's Arena
let currentWeekStart = new Date();
let filteredGames = [];

// Times brasileiros reais
const brazilianTeams = [
    "Flamengo", "Palmeiras", "São Paulo", "Corinthians", "Santos",
    "Grêmio", "Internacional", "Atlético-MG", "Cruzeiro", "Fluminense",
    "Botafogo", "Vasco", "Bahia", "Sport", "Fortaleza",
    "Athletico-PR", "Ceará", "Goiás", "Coritiba", "Bragantino"
];

// Dados de exemplo com times brasileiros reais
const sampleGames = [
    { 
        id: 1, 
        team1: "Flamengo", 
        team2: "Palmeiras", 
        date: new Date(new Date().setDate(new Date().getDate() + 1)), 
        time: "19:00",
        status: "agendado"
    },
    { 
        id: 2, 
        team1: "São Paulo", 
        team2: "Corinthians", 
        date: new Date(new Date().setDate(new Date().getDate() + 2)), 
        time: "20:30",
        status: "agendado"
    },
    { 
        id: 3, 
        team1: "Grêmio", 
        team2: "Internacional", 
        date: new Date(new Date().setDate(new Date().getDate() + 3)), 
        time: "16:00",
        status: "em-andamento"
    },
    { 
        id: 4, 
        team1: "Atlético-MG", 
        team2: "Cruzeiro", 
        date: new Date(new Date().setDate(new Date().getDate() + 4)), 
        time: "18:00",
        status: "agendado"
    },
    { 
        id: 5, 
        team1: "Fluminense", 
        team2: "Botafogo", 
        date: new Date(new Date().setDate(new Date().getDate() + 5)), 
        time: "19:30",
        status: "agendado"
    },
    { 
        id: 6, 
        team1: "Vasco", 
        team2: "Bahia", 
        date: new Date(new Date().setDate(new Date().getDate() - 1)), 
        time: "21:00",
        status: "finalizado"
    },
    { 
        id: 7, 
        team1: "Sport", 
        team2: "Fortaleza", 
        date: new Date(new Date().setDate(new Date().getDate() + 7)), 
        time: "17:00",
        status: "agendado"
    },
    { 
        id: 8, 
        team1: "Athletico-PR", 
        team2: "Ceará", 
        date: new Date(new Date().setDate(new Date().getDate() + 8)), 
        time: "20:00",
        status: "agendado"
    },
    { 
        id: 9, 
        team1: "Goiás", 
        team2: "Coritiba", 
        date: new Date(new Date().setDate(new Date().getDate() + 9)), 
        time: "19:00",
        status: "agendado"
    },
    { 
        id: 10, 
        team1: "Bragantino", 
        team2: "Santos", 
        date: new Date(new Date().setDate(new Date().getDate() + 10)), 
        time: "16:30",
        status: "agendado"
    },
    { 
        id: 11, 
        team1: "Flamengo", 
        team2: "São Paulo", 
        date: new Date(new Date().setDate(new Date().getDate() + 11)), 
        time: "20:00",
        status: "agendado"
    },
    { 
        id: 12, 
        team1: "Palmeiras", 
        team2: "Corinthians", 
        date: new Date(new Date().setDate(new Date().getDate() - 2)), 
        time: "18:30",
        status: "finalizado"
    }
];

// Função para formatar datas
function formatDate(date) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
}

// Função para obter o nome do dia da semana
function getDayName(date) {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return days[date.getDay()];
}

// Função para obter o início da semana
function getWeekStart(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajuste para segunda-feira como início da semana
    return new Date(date.setDate(diff));
}

// Função para aplicar filtros
function applyFilters() {
    const statusFilter = document.getElementById('status-filter').value;
    
    filteredGames = sampleGames.filter(game => {
        const statusMatch = !statusFilter || game.status === statusFilter;
        return statusMatch;
    });
    
    loadCurrentWeekGames();
    loadUpcomingGames();
}

// Função para carregar os jogos da semana atual
function loadCurrentWeekGames() {
    const currentWeekStart = getWeekStart(new Date());
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
    
    // Atualizar o título da semana atual
    document.getElementById('current-period').textContent = 
        `Semana: ${formatDate(currentWeekStart)} a ${formatDate(currentWeekEnd)}`;
    
    // Filtrar jogos da semana atual
    const gamesToShow = filteredGames.length > 0 ? filteredGames : sampleGames;
    const currentWeekGames = gamesToShow.filter(game => {
        const gameDate = new Date(game.date);
        return gameDate >= currentWeekStart && gameDate <= currentWeekEnd;
    });
    
    // Exibir jogos da semana atual
    const gamesContainer = document.getElementById('current-week-games');
    gamesContainer.innerHTML = '';
    
    if (currentWeekGames.length === 0) {
        gamesContainer.innerHTML = '<div class="empty-state">Nenhum jogo programado para esta semana.</div>';
    } else {
        currentWeekGames.forEach(game => {
            const gameDate = new Date(game.date);
            const gameCard = document.createElement('div');
            gameCard.className = `game-card ${game.status}`;
            gameCard.innerHTML = `
                <div class="teams">${game.team1} X ${game.team2}</div>
                <div class="game-date">${formatDate(gameDate)} - ${getDayName(gameDate)}</div>
                <div class="game-info">
                    <span><i class="fa-solid fa-clock"></i> ${game.time}</span>
                    <span><i class="fa-solid fa-map-marker-alt"></i> Allian's Arena</span>
                </div>
                <div style="text-align: center; margin-top: 8px;">
                    <span class="game-status status-${game.status}">
                        ${getStatusText(game.status)}
                    </span>
                </div>
            `;
            gamesContainer.appendChild(gameCard);
        });
    }
}

// Função para obter texto do status
function getStatusText(status) {
    const statusMap = {
        'agendado': 'Agendado',
        'em-andamento': 'Em Andamento',
        'finalizado': 'Finalizado'
    };
    return statusMap[status] || status;
}

// Função para carregar os próximos jogos
function loadUpcomingGames() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const gamesToShow = filteredGames.length > 0 ? filteredGames : sampleGames;
    const upcomingGames = gamesToShow.filter(game => {
        const gameDate = new Date(game.date);
        gameDate.setHours(0, 0, 0, 0);
        return gameDate >= today;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Exibir próximos jogos na tabela
    const tableBody = document.getElementById('upcoming-games-table');
    tableBody.innerHTML = '';
    
    if (upcomingGames.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Nenhum jogo programado.</td></tr>';
    } else {
        upcomingGames.forEach(game => {
            const gameDate = new Date(game.date);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(gameDate)}</td>
                <td><strong>${game.team1} X ${game.team2}</strong></td>
                <td>${game.time}</td>
                <td><span class="game-status status-${game.status}">${getStatusText(game.status)}</span></td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Função para navegar para a semana anterior
function goToPreviousWeek() {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    loadCurrentWeekGames();
}

// Função para navegar para a próxima semana
function goToNextWeek() {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    loadCurrentWeekGames();
}

// Função para integrar com o sistema de chaveamento
function loadGamesFromBracket() {
    // Em um sistema real, isso buscaria os jogos do chaveamento
    console.log('Carregando jogos do sistema de chaveamento...');
    
    // Exemplo de integração - em produção, isso viria da API
    // const bracketGames = getGamesFromTournamentBracket();
    // sampleGames.push(...bracketGames);
    
    loadCurrentWeekGames();
    loadUpcomingGames();
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
    // Configurar data inicial
    currentWeekStart = getWeekStart(new Date());
    
    // Carregar jogos iniciais
    loadGamesFromBracket();
    
    // Adicionar event listeners
    document.getElementById('prev-week').addEventListener('click', goToPreviousWeek);
    document.getElementById('next-week').addEventListener('click', goToNextWeek);
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    
    // Aplicar filtros ao carregar a página
    applyFilters();
    
    // Verificar autenticação
    if (typeof checkAuth === 'function') {
        if (!checkAuth()) {
            return;
        }
    }
});