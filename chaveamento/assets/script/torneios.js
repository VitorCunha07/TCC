// torneios.js
// Sistema de Torneios - Allian's Arena
let filteredTournaments = [];

// Função para formatar data no formato "DD/MM"
function formatDateDDMM(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
}

// Dados de exemplo para torneios com chaveamentos específicos
const sampleTournaments = [
    {
        id: 1,
        name: `Torneio ${formatDateDDMM(new Date())}`,
        teams: 20,
        status: "em-andamento",
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        createdBy: "Usuário",
        currentRound: "Quartas de Final",
        champion: null,
        teamsList: [
            "Flamengo", "Palmeiras", "São Paulo", "Corinthians", "Santos",
            "Grêmio", "Internacional", "Atlético-MG", "Cruzeiro", "Fluminense",
            "Botafogo", "Vasco", "Bahia", "Sport", "Fortaleza",
            "Athletico-PR", "Ceará", "Goiás", "Coritiba", "Bragantino"
        ],
        bracketData: {
            rounds: [
                {
                    name: "Oitavas de Final",
                    matches: [
                        { team1: "Flamengo", team2: "Bahia", winner: "Flamengo", played: true },
                        { team1: "Palmeiras", team2: "Sport", winner: "Palmeiras", played: true },
                        { team1: "São Paulo", team2: "Fortaleza", winner: "São Paulo", played: true },
                        { team1: "Corinthians", team2: "Athletico-PR", winner: "Corinthians", played: true },
                        { team1: "Grêmio", team2: "Ceará", winner: "Grêmio", played: true },
                        { team1: "Internacional", team2: "Goiás", winner: "Internacional", played: true },
                        { team1: "Atlético-MG", team2: "Coritiba", winner: "Atlético-MG", played: true },
                        { team1: "Cruzeiro", team2: "Bragantino", winner: "Cruzeiro", played: true }
                    ]
                },
                {
                    name: "Quartas de Final",
                    matches: [
                        { team1: "Flamengo", team2: "Palmeiras", winner: null, played: false },
                        { team1: "São Paulo", team2: "Corinthians", winner: null, played: false },
                        { team1: "Grêmio", team2: "Internacional", winner: null, played: false },
                        { team1: "Atlético-MG", team2: "Cruzeiro", winner: null, played: false }
                    ]
                },
                {
                    name: "Semifinal",
                    matches: [
                        { team1: "", team2: "", winner: null, played: false },
                        { team1: "", team2: "", winner: null, played: false }
                    ]
                },
                {
                    name: "Final",
                    matches: [
                        { team1: "", team2: "", winner: null, played: false }
                    ]
                }
            ]
        }
    },
    {
        id: 2,
        name: `Torneio ${formatDateDDMM(new Date(new Date().setMonth(new Date().getMonth() - 1)))}`,
        teams: 16,
        status: "finalizado",
        startDate: new Date(new Date().setDate(new Date().getDate() - 90)),
        endDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        createdBy: "Usuário",
        currentRound: "Final",
        champion: "Flamengo",
        teamsList: [
            "Flamengo", "Palmeiras", "São Paulo", "Corinthians",
            "Grêmio", "Internacional", "Atlético-MG", "Cruzeiro",
            "Fluminense", "Botafogo", "Vasco", "Bahia",
            "Fortaleza", "Athletico-PR", "Ceará", "Bragantino"
        ],
        bracketData: {
            rounds: [
                {
                    name: "Oitavas de Final",
                    matches: [
                        { team1: "Flamengo", team2: "Bragantino", winner: "Flamengo", played: true },
                        { team1: "Palmeiras", team2: "Ceará", winner: "Palmeiras", played: true },
                        { team1: "São Paulo", team2: "Athletico-PR", winner: "São Paulo", played: true },
                        { team1: "Corinthians", team2: "Fortaleza", winner: "Corinthians", played: true },
                        { team1: "Grêmio", team2: "Bahia", winner: "Grêmio", played: true },
                        { team1: "Internacional", team2: "Vasco", winner: "Internacional", played: true },
                        { team1: "Atlético-MG", team2: "Botafogo", winner: "Atlético-MG", played: true },
                        { team1: "Cruzeiro", team2: "Fluminense", winner: "Cruzeiro", played: true }
                    ]
                },
                {
                    name: "Quartas de Final",
                    matches: [
                        { team1: "Flamengo", team2: "Cruzeiro", winner: "Flamengo", played: true },
                        { team1: "Palmeiras", team2: "Atlético-MG", winner: "Palmeiras", played: true },
                        { team1: "São Paulo", team2: "Internacional", winner: "São Paulo", played: true },
                        { team1: "Corinthians", team2: "Grêmio", winner: "Corinthians", played: true }
                    ]
                },
                {
                    name: "Semifinal",
                    matches: [
                        { team1: "Flamengo", team2: "Corinthians", winner: "Flamengo", played: true },
                        { team1: "Palmeiras", team2: "São Paulo", winner: "Palmeiras", played: true }
                    ]
                },
                {
                    name: "Final",
                    matches: [
                        { team1: "Flamengo", team2: "Palmeiras", winner: "Flamengo", played: true }
                    ]
                }
            ]
        }
    },
    {
        id: 3,
        name: `Torneio ${formatDateDDMM(new Date(new Date().setDate(new Date().getDate() + 15)))}`,
        teams: 8,
        status: "planejado",
        startDate: new Date(new Date().setDate(new Date().getDate() + 15)),
        endDate: new Date(new Date().setDate(new Date().getDate() + 45)),
        createdBy: "Usuário",
        currentRound: "Não Iniciado",
        champion: null,
        teamsList: [
            "São Paulo", "Corinthians", "Santos", "Palmeiras",
            "Flamengo", "Fluminense", "Botafogo", "Vasco"
        ],
        bracketData: {
            rounds: [
                {
                    name: "Quartas de Final",
                    matches: [
                        { team1: "São Paulo", team2: "Vasco", winner: null, played: false },
                        { team1: "Corinthians", team2: "Botafogo", winner: null, played: false },
                        { team1: "Santos", team2: "Fluminense", winner: null, played: false },
                        { team1: "Palmeiras", team2: "Flamengo", winner: null, played: false }
                    ]
                },
                {
                    name: "Semifinal",
                    matches: [
                        { team1: "", team2: "", winner: null, played: false },
                        { team1: "", team2: "", winner: null, played: false }
                    ]
                },
                {
                    name: "Final",
                    matches: [
                        { team1: "", team2: "", winner: null, played: false }
                    ]
                }
            ]
        }
    },
    {
        id: 4,
        name: `Torneio ${formatDateDDMM(new Date(new Date().setDate(new Date().getDate() - 7)))}`,
        teams: 32,
        status: "em-andamento",
        startDate: new Date(new Date().setDate(new Date().getDate() - 60)),
        endDate: new Date(new Date().setDate(new Date().getDate() + 60)),
        createdBy: "Usuário",
        currentRound: "Oitavas de Final",
        champion: null,
        teamsList: [
            "Flamengo", "Palmeiras", "São Paulo", "Corinthians", "Santos",
            "Grêmio", "Internacional", "Atlético-MG", "Cruzeiro", "Fluminense",
            "Botafogo", "Vasco", "Bahia", "Sport", "Fortaleza", "Athletico-PR",
            "River Plate", "Boca Juniors", "Nacional", "Peñarol", "Olimpia",
            "Cerro Porteño", "Universidad de Chile", "Colo-Colo", "Independiente",
            "Racing Club", "San Lorenzo", "Estudiantes", "Libertad", "Emelec",
            "Barcelona SC", "Alianza Lima"
        ],
        bracketData: {
            rounds: [
                {
                    name: "Oitavas de Final",
                    matches: [
                        { team1: "Flamengo", team2: "Alianza Lima", winner: "Flamengo", played: true },
                        { team1: "Palmeiras", team2: "Barcelona SC", winner: "Palmeiras", played: true },
                        { team1: "São Paulo", team2: "Emelec", winner: "São Paulo", played: true },
                        { team1: "Corinthians", team2: "Libertad", winner: "Corinthians", played: true },
                        { team1: "River Plate", team2: "Athletico-PR", winner: "River Plate", played: true },
                        { team1: "Boca Juniors", team2: "Fortaleza", winner: "Boca Juniors", played: true },
                        { team1: "Nacional", team2: "Sport", winner: "Nacional", played: true },
                        { team1: "Peñarol", team2: "Bahia", winner: "Peñarol", played: true },
                        { team1: "Grêmio", team2: "Vasco", winner: "Grêmio", played: true },
                        { team1: "Internacional", team2: "Botafogo", winner: "Internacional", played: true },
                        { team1: "Atlético-MG", team2: "Fluminense", winner: "Atlético-MG", played: true },
                        { team1: "Cruzeiro", team2: "Santos", winner: "Cruzeiro", played: true },
                        { team1: "Olimpia", team2: "Cerro Porteño", winner: "Olimpia", played: true },
                        { team1: "Universidad de Chile", team2: "Colo-Colo", winner: "Universidad de Chile", played: true },
                        { team1: "Independiente", team2: "Racing Club", winner: "Independiente", played: true },
                        { team1: "San Lorenzo", team2: "Estudiantes", winner: "San Lorenzo", played: true }
                    ]
                },
                {
                    name: "Quartas de Final",
                    matches: [
                        { team1: "Flamengo", team2: "San Lorenzo", winner: null, played: false },
                        { team1: "Palmeiras", team2: "Independiente", winner: null, played: false },
                        { team1: "São Paulo", team2: "Universidad de Chile", winner: null, played: false },
                        { team1: "Corinthians", team2: "Olimpia", winner: null, played: false },
                        { team1: "River Plate", team2: "Cruzeiro", winner: null, played: false },
                        { team1: "Boca Juniors", team2: "Atlético-MG", winner: null, played: false },
                        { team1: "Nacional", team2: "Internacional", winner: null, played: false },
                        { team1: "Peñarol", team2: "Grêmio", winner: null, played: false }
                    ]
                },
                {
                    name: "Semifinal",
                    matches: [
                        { team1: "", team2: "", winner: null, played: false },
                        { team1: "", team2: "", winner: null, played: false },
                        { team1: "", team2: "", winner: null, played: false },
                        { team1: "", team2: "", winner: null, played: false }
                    ]
                },
                {
                    name: "Final",
                    matches: [
                        { team1: "", team2: "", winner: null, played: false }
                    ]
                }
            ]
        }
    }
];

// Função para formatar datas completas
function formatDate(date) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
}

// Função para obter texto do status
function getStatusText(status) {
    const statusMap = {
        'em-andamento': 'Em Andamento',
        'finalizado': 'Finalizado',
        'planejado': 'Planejado'
    };
    return statusMap[status] || status;
}

// Função para aplicar filtros
function applyFilters() {
    const statusFilter = document.getElementById('status-filter').value;
    
    filteredTournaments = sampleTournaments.filter(tournament => {
        const statusMatch = !statusFilter || tournament.status === statusFilter;
        return statusMatch;
    });
    
    loadTournaments();
}

// Função para carregar os torneios
function loadTournaments() {
    const tournamentsContainer = document.getElementById('tournaments-list');
    tournamentsContainer.innerHTML = '';
    
    const tournamentsToShow = filteredTournaments.length > 0 ? filteredTournaments : sampleTournaments;
    
    if (tournamentsToShow.length === 0) {
        tournamentsContainer.innerHTML = '<div class="empty-state">Nenhum torneio encontrado com os filtros aplicados.</div>';
    } else {
        tournamentsToShow.forEach(tournament => {
            const tournamentCard = document.createElement('div');
            tournamentCard.className = `tournament-card ${tournament.status}`;
            tournamentCard.setAttribute('data-tournament-id', tournament.id);
            
            tournamentCard.innerHTML = `
                <div class="tournament-info">
                    <div class="tournament-name">${tournament.name}</div>
                    <div class="tournament-details">
                        <div class="tournament-detail">
                            <i class="fa-solid fa-users"></i>
                            <span>${tournament.teams} times</span>
                        </div>
                        <div class="tournament-detail">
                            <i class="fa-solid fa-calendar"></i>
                            <span>${formatDate(tournament.startDate)} - ${formatDate(tournament.endDate)}</span>
                        </div>
                    </div>
                    <div>
                        <span class="tournament-status status-${tournament.status}">${getStatusText(tournament.status)}</span>
                    </div>
                </div>
                <div class="tournament-actions">
                    <button class="action-btn" onclick="viewTournament(${tournament.id})">
                        <i class="fa-solid fa-eye"></i> Ver
                    </button>
                </div>
            `;
            
            tournamentsContainer.appendChild(tournamentCard);
        });
    }
}

// Função para visualizar torneio
function viewTournament(tournamentId) {
    const tournament = sampleTournaments.find(t => t.id === tournamentId);
    if (!tournament) return;
    
    const modal = document.getElementById('tournament-modal');
    const modalContent = document.getElementById('modal-content');
    
    let championHTML = '';
    if (tournament.champion) {
        championHTML = `
            <div class="modal-info-item">
                <span><strong>Campeão:</strong></span>
                <span style="font-weight: bold; color: var(--primary);">${tournament.champion}</span>
            </div>
        `;
    }
    
    // Criar HTML para a lista de times
    let teamsHTML = '';
    tournament.teamsList.forEach(team => {
        teamsHTML += `<div class="team-item">${team}</div>`;
    });
    
    modalContent.innerHTML = `
        <div class="modal-tournament-details">
            <h2 class="modal-tournament-header">${tournament.name}</h2>
            
            <div class="modal-tournament-info">
                <div class="modal-info-item">
                    <span><strong>Número de Times:</strong></span>
                    <span>${tournament.teams}</span>
                </div>
                <div class="modal-info-item">
                    <span><strong>Status:</strong></span>
                    <span class="tournament-status status-${tournament.status}">${getStatusText(tournament.status)}</span>
                </div>
                <div class="modal-info-item">
                    <span><strong>Data de Início:</strong></span>
                    <span>${formatDate(tournament.startDate)}</span>
                </div>
                <div class="modal-info-item">
                    <span><strong>Data de Término:</strong></span>
                    <span>${formatDate(tournament.endDate)}</span>
                </div>
                <div class="modal-info-item">
                    <span><strong>Rodada Atual:</strong></span>
                    <span>${tournament.currentRound}</span>
                </div>
                <div class="modal-info-item">
                    <span><strong>Criado por:</strong></span>
                    <span>${tournament.createdBy}</span>
                </div>
                ${championHTML}
            </div>
            
            <div class="teams-section">
                <h3 class="teams-title">Times Participantes</h3>
                <div class="teams-grid">
                    ${teamsHTML}
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <button class="action-btn" onclick="window.location.href='chaveamento-view.html?tournament=${tournament.id}'">
                    <i class="fa-solid fa-sitemap"></i> Ver Chaveamento
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('tournament-modal');
    modal.style.display = 'none';
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando sistema de torneios...');
    
    // Carregar torneios iniciais
    loadTournaments();
    
    // Adicionar event listeners
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    
    // Configurar modal
    const modal = document.getElementById('tournament-modal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Verificar autenticação
    if (typeof checkAuth === 'function') {
        if (!checkAuth()) {
            console.log('Usuário não autenticado, redirecionando...');
            return;
        }
    }
    
    console.log('Sistema de torneios inicializado com sucesso!');
    console.log('Torneios carregados:', sampleTournaments.length);
});