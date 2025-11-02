// chaveamento-view.js
// Sistema de Visualização de Chaveamento - Allian's Arena

// Função para formatar data no formato "DD/MM"
function formatDateDDMM(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
}

// Dados de exemplo para todos os torneios
const tournamentBrackets = {
    1: {
        id: 1,
        name: `Torneio ${formatDateDDMM(new Date())}`,
        status: "em-andamento",
        currentRound: "Quartas de Final",
        totalTeams: 20,
        champion: null,
        bracket: {
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
    2: {
        id: 2,
        name: `Torneio ${formatDateDDMM(new Date(new Date().setMonth(new Date().getMonth() - 1)))}`,
        status: "finalizado",
        currentRound: "Final",
        totalTeams: 16,
        champion: "Flamengo",
        bracket: {
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
    3: {
        id: 3,
        name: `Torneio ${formatDateDDMM(new Date(new Date().setDate(new Date().getDate() + 15)))}`,
        status: "planejado",
        currentRound: "Não Iniciado",
        totalTeams: 8,
        champion: null,
        bracket: {
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
    4: {
        id: 4,
        name: `Torneio ${formatDateDDMM(new Date(new Date().setDate(new Date().getDate() - 7)))}`,
        status: "em-andamento",
        currentRound: "Oitavas de Final",
        totalTeams: 32,
        champion: null,
        bracket: {
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
};

// Função para carregar dados do torneio
function loadTournamentData(tournamentId) {
    const tournamentData = tournamentBrackets[tournamentId];
    
    if (!tournamentData) {
        console.error('Torneio não encontrado:', tournamentId);
        document.getElementById('bracket-container').innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-exclamation-triangle"></i>
                <p>Torneio não encontrado.</p>
                <button class="voltar" onclick="window.location.href='torneios.html'" style="margin-top: 15px;">
                    Voltar para Torneios
                </button>
            </div>
        `;
        return;
    }
    
    // Atualizar informações do torneio
    document.getElementById('tournament-name').textContent = tournamentData.name;
    document.getElementById('tournament-status').textContent = getStatusText(tournamentData.status);
    document.getElementById('current-round').textContent = tournamentData.currentRound;
    document.getElementById('total-teams').textContent = tournamentData.totalTeams;
    
    if (tournamentData.champion) {
        document.getElementById('tournament-champion').textContent = tournamentData.champion;
        document.getElementById('tournament-champion').style.color = 'var(--success)';
        document.getElementById('tournament-champion').style.fontWeight = 'bold';
    } else {
        document.getElementById('tournament-champion').textContent = '-';
        document.getElementById('tournament-champion').style.color = '';
        document.getElementById('tournament-champion').style.fontWeight = '';
    }
    
    // Renderizar o chaveamento
    renderBracket(tournamentData.bracket);
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

// Função para renderizar o chaveamento
function renderBracket(bracketData) {
    const bracketContainer = document.getElementById('bracket-container');
    bracketContainer.innerHTML = '';
    
    const bracketEl = document.createElement('div');
    bracketEl.className = 'bracket';
    
    bracketData.rounds.forEach((round, roundIndex) => {
        const roundEl = document.createElement('div');
        roundEl.className = 'round';
        
        const roundHeader = document.createElement('div');
        roundHeader.className = 'round-header';
        roundHeader.textContent = round.name;
        roundEl.appendChild(roundHeader);
        
        round.matches.forEach((match, matchIndex) => {
            const matchEl = document.createElement('div');
            matchEl.className = 'match';
            
            // Time 1
            const team1El = createTeamElement(match.team1, match.winner, match.played, 1);
            matchEl.appendChild(team1El);
            
            // Time 2
            const team2El = createTeamElement(match.team2, match.winner, match.played, 2);
            matchEl.appendChild(team2El);
            
            roundEl.appendChild(matchEl);
        });
        
        bracketEl.appendChild(roundEl);
        
        // Adicionar conectores entre rodadas (exceto na última)
        if (roundIndex < bracketData.rounds.length - 1) {
            const connectorEl = document.createElement('div');
            connectorEl.className = 'connector';
            bracketEl.appendChild(connectorEl);
        }
    });
    
    bracketContainer.appendChild(bracketEl);
}

// Função para criar elemento de time
function createTeamElement(teamName, winner, played, teamPosition) {
    const teamEl = document.createElement('div');
    
    let className = 'team';
    
    if (!teamName) {
        className += ' bye';
        teamEl.textContent = 'Aguardando';
    } else {
        teamEl.textContent = teamName;
        
        if (played) {
            if (winner === teamName) {
                className += ' winner';
            } else {
                className += ' loser';
            }
        } else {
            className += ' pending';
        }
    }
    
    teamEl.className = className;
    return teamEl;
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando visualização de chaveamento...');
    
    // Verificar autenticação
    if (typeof checkAuth === 'function') {
        if (!checkAuth()) {
            return;
        }
    }
    
    // Obter ID do torneio da URL (se existir)
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('tournament');
    
    if (tournamentId) {
        console.log(`Carregando chaveamento do torneio ID: ${tournamentId}`);
        loadTournamentData(parseInt(tournamentId));
    } else {
        console.log('Nenhum ID de torneio especificado na URL');
        // Mostrar estado vazio ou redirecionar
        document.getElementById('bracket-container').innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-exclamation-triangle"></i>
                <p>Nenhum torneio selecionado para visualização.</p>
                <button class="voltar" onclick="window.location.href='torneios.html'" style="margin-top: 15px;">
                    Voltar para Torneios
                </button>
            </div>
        `;
    }
    
    console.log('Sistema de visualização de chaveamento inicializado');
});