// Sistema de Partidas - Allian's Arena
let filteredMatches = [];

// URLs das BANDEIRAS reais dos times brasileiros (baseado no estado de origem)
const teamFlags = {
    "Flamengo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flamengo_braz_logo.svg/970px-Flamengo_braz_logo.svg.png",
    "Palmeiras": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Palmeiras_logo.svg/250px-Palmeiras_logo.svg.png",
    "São Paulo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Bandeira_do_estado_de_S%C3%A3o_Paulo.svg/250px-Bandeira_do_estado_de_S%C3%A3o_Paulo.svg.png",
    "Corinthians": "https://upload.wikimedia.org/wikipedia/pt/b/b4/Corinthians_simbolo.png",
    "Santos": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Bandeira_do_estado_de_S%C3%A3o_Paulo.svg/250px-Bandeira_do_estado_de_S%C3%A3o_Paulo.svg.png",
    "Grêmio": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Gremio_logo.svg/1007px-Gremio_logo.svg.png",
    "Internacional": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/SC_Internacional_Brazil_Logo.svg/250px-SC_Internacional_Brazil_Logo.svg.png",
    "Atlético-MG": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3VOz8Ue2HvfTwnVVlHku3eMBtPYpwenKlNg&s",
    "Cruzeiro": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Cruzeiro_Esporte_Clube_%28logo%29.svg/250px-Cruzeiro_Esporte_Clube_%28logo%29.svg.png",
    "Fluminense": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Bandeira_do_estado_do_Rio_de_Janeiro.svg/250px-Bandeira_do_estado_do_Rio_de_Janeiro.svg.png",
    "Botafogo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Bandeira_do_estado_do_Rio_de_Janeiro.svg/250px-Bandeira_do_estado_do_Rio_de_Janeiro.svg.png",
    "Vasco": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Bandeira_do_estado_do_Rio_de_Janeiro.svg/250px-Bandeira_do_estado_do_Rio_de_Janeiro.svg.png",
    "Bahia": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Bandeira_da_Bahia.svg/250px-Bandeira_da_Bahia.svg.png",
    "Sport": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Bandeira_de_Pernambuco.svg/250px-Bandeira_de_Pernambuco.svg.png",
    "Fortaleza": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Bandeira_do_Ceará.svg/250px-Bandeira_do_Ceará.svg.png",
    "Athletico-PR": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Bandeira_do_Paraná.svg/250px-Bandeira_do_Paraná.svg.png",
    "Ceará": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Bandeira_do_Ceará.svg/250px-Bandeira_do_Ceará.svg.png",
    "Goiás": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Flag_of_Goiás.svg/250px-Flag_of_Goiás.svg.png",
    "Coritiba": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Bandeira_do_Paraná.svg/250px-Bandeira_do_Paraná.svg.png",
    "Bragantino": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Bandeira_do_estado_de_S%C3%A3o_Paulo.svg/250px-Bandeira_do_estado_de_S%C3%A3o_Paulo.svg.png"
};

// URLs dos ESCUDOS reais dos times (para referência)
const teamBadges = {
    "Flamengo": "https://upload.wikimedia.org/wikipedia/pt/thumb/2/2e/Flamengo_braz_logo.svg/250px-Flamengo_braz_logo.svg.png",
    "Palmeiras": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Palmeiras_logo.svg/250px-Palmeiras_logo.svg.png",
    "São Paulo": "https://upload.wikimedia.org/wikipedia/pt/thumb/4/49/Sao_Paulo_Futebol_Clube.png/250px-Sao_Paulo_Futebol_Clube.png",
    "Corinthians": "https://upload.wikimedia.org/wikipedia/pt/thumb/b/b4/Corinthians_simbolo.png/250px-Corinthians_simbolo.png",
    "Santos": "https://upload.wikimedia.org/wikipedia/pt/thumb/3/35/Santos_logo.svg/250px-Santos_logo.svg.png",
    "Grêmio": "https://upload.wikimedia.org/wikipedia/pt/thumb/3/3a/Gremio_logo.svg/250px-Gremio_logo.svg.png",
    "Internacional": "https://upload.wikimedia.org/wikipedia/pt/thumb/f/f1/Internacional.png/250px-Internacional.png",
    "Atlético-MG": "https://upload.wikimedia.org/wikipedia/pt/thumb/2/27/Atletico_mineiro_2019.png/250px-Atletico_mineiro_2019.png",
    "Cruzeiro": "https://upload.wikimedia.org/wikipedia/pt/thumb/5/52/Cruzeiro_1968.png/250px-Cruzeiro_1968.png",
    "Fluminense": "https://upload.wikimedia.org/wikipedia/pt/thumb/a/a7/Fluminense_FC_escudo.svg.png/250px-Fluminense_FC_escudo.svg.png",
    "Botafogo": "https://upload.wikimedia.org/wikipedia/pt/thumb/4/42/Botafogo_de_Futebol_e_Regatas.png/250px-Botafogo_de_Futebol_e_Regatas.png",
    "Vasco": "https://upload.wikimedia.org/wikipedia/pt/thumb/8/87/Vasco_da_Gama.png/250px-Vasco_da_Gama.png",
    "Bahia": "https://upload.wikimedia.org/wikipedia/pt/thumb/6/6d/Esporte_Clube_Bahia.svg/250px-Esporte_Clube_Bahia.svg.png",
    "Sport": "https://upload.wikimedia.org/wikipedia/pt/thumb/4/41/Sport_Club_do_Recife.svg/250px-Sport_Club_do_Recife.svg.png",
    "Fortaleza": "https://upload.wikimedia.org/wikipedia/pt/thumb/5/5e/Fortaleza_2020.svg/250px-Fortaleza_2020.svg.png",
    "Athletico-PR": "https://upload.wikimedia.org/wikipedia/pt/thumb/0/05/Athletico_Paranava%C3%AD.png/250px-Athletico_Paranava%C3%AD.png",
    "Ceará": "https://upload.wikimedia.org/wikipedia/pt/thumb/5/5c/Cear%C3%A1_Sporting_Club.svg/250px-Cear%C3%A1_Sporting_Club.svg.png",
    "Goiás": "https://upload.wikimedia.org/wikipedia/pt/thumb/6/6b/Goi%C3%A1s_Esporte_Clube.png/250px-Goi%C3%A1s_Esporte_Clube.png",
    "Coritiba": "https://upload.wikimedia.org/wikipedia/pt/thumb/5/5b/Coritiba.png/250px-Coritiba.png",
    "Bragantino": "https://upload.wikimedia.org/wikipedia/pt/thumb/4/4c/Red_Bull_Bragantino.png/250px-Red_Bull_Bragantino.png"
};

// Fallback com cores das bandeiras
const teamColors = {
    "Flamengo": "#C20C26",
    "Palmeiras": "#006437",
    "São Paulo": "#FF0000",
    "Corinthians": "#000000",
    "Santos": "#000000",
    "Grêmio": "#0F6EB5",
    "Internacional": "#C20C26",
    "Atlético-MG": "#000000",
    "Cruzeiro": "#0F6EB5",
    "Fluminense": "#8B0000",
    "Botafogo": "#000000",
    "Vasco": "#000000",
    "Bahia": "#0F6EB5",
    "Sport": "#FF0000",
    "Fortaleza": "#0F6EB5",
    "Athletico-PR": "#C20C26",
    "Ceará": "#000000",
    "Goiás": "#006437",
    "Coritiba": "#006437",
    "Bragantino": "#C20C26"
};

// Dados de exemplo para partidas com estatísticas
const sampleMatches = [
    {
        id: 1,
        team1: "Flamengo",
        team2: "Palmeiras",
        score1: 3,
        score2: 1,
        date: new Date(new Date().setDate(new Date().getDate() - 1)),
        time: "19:00",
        location: "Allian's Arena",
        tournament: "Campeonato",
        status: "finalizado",
        stats: {
            possession: { team1: 58, team2: 42 },
            shots: { team1: 15, team2: 8 },
            shotsOnTarget: { team1: 7, team2: 3 },
            passes: { team1: 542, team2: 387 },
            passAccuracy: { team1: 85, team2: 78 },
            fouls: { team1: 12, team2: 18 },
            yellowCards: { team1: 2, team2: 4 },
            redCards: { team1: 0, team2: 1 },
            corners: { team1: 6, team2: 3 },
            offsides: { team1: 2, team2: 1 }
        }
    },
    {
        id: 2,
        team1: "São Paulo",
        team2: "Corinthians",
        score1: null,
        score2: null,
        date: new Date(new Date().setDate(new Date().getDate() + 1)),
        time: "20:30",
        location: "Allian's Arena",
        tournament: "Campeonato",
        status: "agendado",
        stats: null
    },
    {
        id: 3,
        team1: "Grêmio",
        team2: "Internacional",
        score1: 1,
        score2: 1,
        date: new Date(),
        time: "16:00",
        location: "Allian's Arena",
        tournament: "Campeonato",
        status: "em-andamento",
        stats: {
            possession: { team1: 52, team2: 48 },
            shots: { team1: 10, team2: 9 },
            shotsOnTarget: { team1: 4, team2: 4 },
            passes: { team1: 423, team2: 398 },
            passAccuracy: { team1: 82, team2: 80 },
            fouls: { team1: 14, team2: 16 },
            yellowCards: { team1: 3, team2: 2 },
            redCards: { team1: 0, team2: 0 },
            corners: { team1: 5, team2: 4 },
            offsides: { team1: 1, team2: 3 }
        }
    },
    {
        id: 4,
        team1: "Atlético-MG",
        team2: "Cruzeiro",
        score1: 2,
        score2: 0,
        date: new Date(new Date().setDate(new Date().getDate() - 3)),
        time: "18:00",
        location: "Allian's Arena",
        tournament: "Campeonato",
        status: "finalizado",
        stats: {
            possession: { team1: 62, team2: 38 },
            shots: { team1: 18, team2: 5 },
            shotsOnTarget: { team1: 8, team2: 2 },
            passes: { team1: 612, team2: 345 },
            passAccuracy: { team1: 88, team2: 75 },
            fouls: { team1: 8, team2: 15 },
            yellowCards: { team1: 1, team2: 3 },
            redCards: { team1: 0, team2: 0 },
            corners: { team1: 7, team2: 2 },
            offsides: { team1: 0, team2: 2 }
        }
    },
    {
        id: 5,
        team1: "Fluminense",
        team2: "Botafogo",
        score1: 2,
        score2: 1,
        date: new Date(new Date().setDate(new Date().getDate() - 2)),
        time: "21:00",
        location: "Allian's Arena",
        tournament: "Campeonato",
        status: "finalizado",
        stats: {
            possession: { team1: 55, team2: 45 },
            shots: { team1: 12, team2: 7 },
            shotsOnTarget: { team1: 6, team2: 3 },
            passes: { team1: 489, team2: 412 },
            passAccuracy: { team1: 83, team2: 79 },
            fouls: { team1: 10, team2: 14 },
            yellowCards: { team1: 2, team2: 3 },
            redCards: { team1: 0, team2: 0 },
            corners: { team1: 5, team2: 2 },
            offsides: { team1: 1, team2: 2 }
        }
    },
    {
        id: 6,
        team1: "Fortaleza",
        team2: "Ceará",
        score1: null,
        score2: null,
        date: new Date(new Date().setDate(new Date().getDate() + 3)),
        time: "19:30",
        location: "Allian's Arena",
        tournament: "Campeonato",
        status: "agendado",
        stats: null
    }
];

// Função para formatar datas
function formatDate(date) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
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

// Função para criar elemento de BANDEIRA com fallback
function createTeamFlag(teamName, isModal = false) {
    const flagUrl = teamFlags[teamName];
    const teamColor = teamColors[teamName] || '#666666';
    const className = isModal ? 'modal-team-flag' : 'team-flag';
    
    const flagDiv = document.createElement('div');
    flagDiv.className = `${className} flag-loading`;
    flagDiv.setAttribute('data-team', teamName);
    flagDiv.style.backgroundColor = teamColor + '20';
    
    if (flagUrl) {
        const img = new Image();
        img.onload = function() {
            flagDiv.style.backgroundImage = `url('${flagUrl}')`;
            flagDiv.classList.remove('flag-loading');
            flagDiv.style.backgroundColor = 'transparent';
        };
        img.onerror = function() {
            flagDiv.innerHTML = `<div class="flag-fallback" style="background-color: ${teamColor}"></div>`;
            flagDiv.classList.remove('flag-loading');
            flagDiv.style.backgroundImage = 'none';
        };
        img.src = flagUrl;
    } else {
        flagDiv.innerHTML = `<div class="flag-fallback" style="background-color: ${teamColor}"></div>`;
        flagDiv.classList.remove('flag-loading');
        flagDiv.style.backgroundImage = 'none';
    }
    
    return flagDiv;
}

// Função para aplicar filtros
function applyFilters() {
    const statusFilter = document.getElementById('status-filter').value;
    
    filteredMatches = sampleMatches.filter(match => {
        const statusMatch = !statusFilter || match.status === statusFilter;
        return statusMatch;
    });
    
    loadMatches();
}

// Função para carregar as partidas
function loadMatches() {
    const matchesContainer = document.getElementById('matches-list');
    matchesContainer.innerHTML = '';
    
    const matchesToShow = filteredMatches.length > 0 ? filteredMatches : sampleMatches;
    
    if (matchesToShow.length === 0) {
        matchesContainer.innerHTML = '<div class="empty-state">Nenhuma partida encontrada com os filtros aplicados.</div>';
    } else {
        matchesToShow.forEach(match => {
            const matchCard = document.createElement('div');
            matchCard.className = `match-card ${match.status}`;
            matchCard.setAttribute('data-match-id', match.id);
            
            const showScore = match.status === 'finalizado' || match.status === 'em-andamento';
            const score1 = showScore ? match.score1 : '-';
            const score2 = showScore ? match.score2 : '-';
            
            matchCard.innerHTML = `
                <div class="match-header">
                    <div class="match-tournament">${match.tournament}</div>
                    <span class="match-status status-${match.status}">${getStatusText(match.status)}</span>
                </div>
                <div class="match-content">
                    <div class="team">
                        <div class="team-flag-placeholder-${match.id}-1"></div>
                        <div class="team-name">${match.team1}</div>
                    </div>
                    <div class="match-vs">VS</div>
                    <div class="team">
                        <div class="team-flag-placeholder-${match.id}-2"></div>
                        <div class="team-name">${match.team2}</div>
                    </div>
                </div>
                <div class="match-score">
                    <span>${score1}</span>
                    <span>X</span>
                    <span>${score2}</span>
                </div>
                <div class="match-footer">
                    <div class="match-date">
                        <i class="fa-solid fa-calendar"></i>
                        ${formatDate(match.date)} - ${match.time}
                    </div>
                    <div class="match-location">
                        <i class="fa-solid fa-map-marker-alt"></i>
                        ${match.location}
                    </div>
                </div>
            `;
            
            const flagPlaceholder1 = matchCard.querySelector(`.team-flag-placeholder-${match.id}-1`);
            const flagPlaceholder2 = matchCard.querySelector(`.team-flag-placeholder-${match.id}-2`);
            
            if (flagPlaceholder1 && flagPlaceholder2) {
                const flag1 = createTeamFlag(match.team1);
                const flag2 = createTeamFlag(match.team2);
                
                flagPlaceholder1.replaceWith(flag1);
                flagPlaceholder2.replaceWith(flag2);
            }
            
            matchCard.addEventListener('click', () => openMatchModal(match.id));
            matchesContainer.appendChild(matchCard);
        });
    }
}

// Função para criar barras de estatísticas
function createStatBar(statName, team1Value, team2Value) {
    const total = team1Value + team2Value;
    const team1Percent = total > 0 ? (team1Value / total) * 100 : 50;
    
    return `
        <div class="stat-bar-container">
            <div class="stat-bar-label">
                <span>${team1Value}</span>
                <span>${statName}</span>
                <span>${team2Value}</span>
            </div>
            <div class="stat-bar">
                <div class="stat-bar-fill team1-fill" style="width: ${team1Percent}%"></div>
            </div>
        </div>
    `;
}

// Função para abrir o modal com detalhes da partida
function openMatchModal(matchId) {
    const match = sampleMatches.find(m => m.id === matchId);
    if (!match) return;
    
    const modal = document.getElementById('match-modal');
    const modalContent = document.getElementById('modal-content');
    
    const showScore = match.status === 'finalizado' || match.status === 'em-andamento';
    const score1 = showScore ? match.score1 : '-';
    const score2 = showScore ? match.score2 : '-';
    
    let statsHTML = '';
    
    if (match.stats) {
        statsHTML = `
            <div class="match-stats">
                <h3 class="stats-title">Estatísticas da Partida</h3>
                
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Posse de Bola</span>
                        <span class="stat-value">${match.stats.possession.team1}% - ${match.stats.possession.team2}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Finalizações</span>
                        <span class="stat-value">${match.stats.shots.team1} - ${match.stats.shots.team2}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Finalizações no Gol</span>
                        <span class="stat-value">${match.stats.shotsOnTarget.team1} - ${match.stats.shotsOnTarget.team2}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Passes</span>
                        <span class="stat-value">${match.stats.passes.team1} - ${match.stats.passes.team2}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Precisão de Passes</span>
                        <span class="stat-value">${match.stats.passAccuracy.team1}% - ${match.stats.passAccuracy.team2}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Faltas</span>
                        <span class="stat-value">${match.stats.fouls.team1} - ${match.stats.fouls.team2}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Cartões Amarelos</span>
                        <span class="stat-value">${match.stats.yellowCards.team1} - ${match.stats.yellowCards.team2}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Cartões Vermelhos</span>
                        <span class="stat-value">${match.stats.redCards.team1} - ${match.stats.redCards.team2}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Escanteios</span>
                        <span class="stat-value">${match.stats.corners.team1} - ${match.stats.corners.team2}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Impedimentos</span>
                        <span class="stat-value">${match.stats.offsides.team1} - ${match.stats.offsides.team2}</span>
                    </div>
                </div>
                
                <div class="stats-bars">
                    <h4 class="stats-title">Comparativo</h4>
                    ${createStatBar('Posse de Bola', match.stats.possession.team1, match.stats.possession.team2)}
                    ${createStatBar('Finalizações', match.stats.shots.team1, match.stats.shots.team2)}
                    ${createStatBar('Finalizações no Gol', match.stats.shotsOnTarget.team1, match.stats.shotsOnTarget.team2)}
                    ${createStatBar('Precisão de Passes', match.stats.passAccuracy.team1, match.stats.passAccuracy.team2)}
                </div>
            </div>
        `;
    } else {
        statsHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-chart-line"></i>
                <p>Estatísticas disponíveis após o início da partida</p>
            </div>
        `;
    }
    
    modalContent.innerHTML = `
        <div class="modal-match-details">
            <h2 class="modal-match-header">Detalhes da Partida</h2>
            
            <div class="modal-match-teams">
                <div class="modal-team">
                    <div id="modal-flag-1"></div>
                    <div class="modal-team-name">${match.team1}</div>
                </div>
                <div class="modal-vs">VS</div>
                <div class="modal-team">
                    <div id="modal-flag-2"></div>
                    <div class="modal-team-name">${match.team2}</div>
                </div>
            </div>
            
            <div class="modal-match-score">
                <span>${score1}</span>
                <span>X</span>
                <span>${score2}</span>
            </div>
            
            ${statsHTML}
            
            <div class="modal-match-info">
                <div class="modal-info-item">
                    <span><strong>Torneio:</strong></span>
                    <span>${match.tournament}</span>
                </div>
                <div class="modal-info-item">
                    <span><strong>Status:</strong></span>
                    <span class="match-status status-${match.status}">${getStatusText(match.status)}</span>
                </div>
                <div class="modal-info-item">
                    <span><strong>Data:</strong></span>
                    <span>${formatDate(match.date)}</span>
                </div>
                <div class="modal-info-item">
                    <span><strong>Horário:</strong></span>
                    <span>${match.time}</span>
                </div>
                <div class="modal-info-item">
                    <span><strong>Local:</strong></span>
                    <span>${match.location}</span>
                </div>
            </div>
        </div>
    `;
    
    const modalFlag1 = document.getElementById('modal-flag-1');
    const modalFlag2 = document.getElementById('modal-flag-2');
    
    if (modalFlag1 && modalFlag2) {
        const flag1 = createTeamFlag(match.team1, true);
        const flag2 = createTeamFlag(match.team2, true);
        
        modalFlag1.replaceWith(flag1);
        modalFlag2.replaceWith(flag2);
    }
    
    modal.style.display = 'block';
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('match-modal');
    modal.style.display = 'none';
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando sistema de partidas...');
    
    // Carregar partidas iniciais
    loadMatches();
    
    // Adicionar event listeners
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    
    // Configurar modal
    const modal = document.getElementById('match-modal');
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
    
    console.log('Sistema de partidas inicializado com sucesso!');
    console.log('Partidas carregadas:', sampleMatches.length);
});

// Função para debug (pode ser removida em produção)
function debugMatches() {
    console.log('=== DEBUG PARTIDAS ===');
    console.log('Total de partidas:', sampleMatches.length);
    sampleMatches.forEach(match => {
        console.log(`Partida ${match.id}: ${match.team1} vs ${match.team2} - ${match.status}`);
    });
    console.log('=== FIM DEBUG ===');
}

// Exportar funções para uso global (se necessário)
window.partidasModule = {
    loadMatches,
    applyFilters,
    openMatchModal,
    closeModal,
    debugMatches
};