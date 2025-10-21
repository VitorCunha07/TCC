// Sistema de chaveamento de torneio
let tournamentBracket;
let teamsList = [];

// NOTE Adicionada validação de elemento antes de inicializar
function initializeTournament() {
    console.log('Inicializando sistema de chaveamento...');
    
    // Verificar autenticação
    if (typeof checkAuth === 'function' && !checkAuth()) {
        return; // Já foi redirecionado para login
    }
    
    // Mostrar dados do usuário logado
    if (typeof getCurrentUser === 'function') {
        const user = getCurrentUser();
        if (user) {
            console.log('Usuário logado:', user.nome);
            // Mostrar nome do usuário na interface se houver elemento
            const userDisplay = document.querySelector('.user-name');
            if (userDisplay) {
                userDisplay.textContent = user.nome;
            }
        }
    }
    
    // Inicializar o bracket
    tournamentBracket = new TournamentBracket('bracket-container');
    
    const bracketContainer = document.getElementById('bracket-container');
    if (bracketContainer) {
        bracketContainer.innerHTML = '<div class="bracket-placeholder">Adicione times e gere o chaveamento para começar!</div>';
        updateTeamList();
        console.log('Sistema de chaveamento inicializado');
    } else {
        console.error('Elemento bracket-container não encontrado');
    }
}

function addTeam() {
    const teamInput = document.getElementById('team-input');
    const teamName = teamInput.value.trim();
    
    // NOTE Adicionada validação de nome duplicado
    if (teamName) {
        if (teamsList.includes(teamName)) {
            alert('Este time já foi adicionado!');
            return;
        }
        
        // NOTE Limitado número máximo de times
        if (teamsList.length >= 32) {
            alert('Máximo de 32 times permitidos!');
            return;
        }
        
        teamsList.push(teamName);
        teamInput.value = '';
        updateTeamList();
        teamInput.focus();
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addTeam();
        event.preventDefault();
    }
}

function removeTeam(index) {
    teamsList.splice(index, 1);
    updateTeamList();
}

function updateTeamList() {
    const teamListElement = document.getElementById('team-list');
    teamListElement.innerHTML = '';
    if (teamsList.length === 0) {
        teamListElement.innerHTML = '<div style="color: #999; text-align: center;">Nenhum time adicionado ainda</div>';
    } else {
        teamsList.forEach((team, index) => {
            const item = document.createElement('div');
            item.className = 'team-item';
            item.innerHTML = `
                <span>${team}</span>
                <span class="remove-team" onclick="removeTeam(${index})">&times;</span>
            `;
            teamListElement.appendChild(item);
        });
    }

    const statusMessage = document.getElementById('status-message');
    if (teamsList.length < 2) {
        statusMessage.textContent = 'Adicione pelo menos 2 times para começar.';
    } else {
        statusMessage.textContent = `${teamsList.length} times prontos para o torneio.`;
    }
}

function createNewTournament() {
    if (teamsList.length < 2) {
        alert('Adicione pelo menos 2 times para criar o chaveamento.');
        return;
    }

    // Use apenas o número de times que temos, sem preencher com vazios
    let shuffledTeams = [...teamsList];
    
    const randomize = document.getElementById('randomize-checkbox');
    if (randomize?.checked) {
        shuffleArray(shuffledTeams);
    }

    tournamentBracket.createBracket(shuffledTeams);

    // NOTE Verificação de elementos antes de manipular
    const roundControls = document.getElementById('round-controls');
    const championDisplay = document.getElementById('champion-display');
    const confirmBtn = document.getElementById('confirm-btn');
    
    if (roundControls) roundControls.style.display = 'block';
    if (championDisplay) championDisplay.style.display = 'none';
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Próxima Rodada';
        confirmBtn.style.display = 'inline-block';
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function confirmWinners() {
    // NOTE Adicionada verificação se tournamentBracket existe
    if (tournamentBracket) {
        tournamentBracket.confirmRound();
    }
}

function resetTournament() {
    teamsList = [];
    updateTeamList();
    
    // NOTE Verificação antes de chamar método
    if (tournamentBracket) {
        tournamentBracket.clearBracket();
    }
    
    // NOTE Verificação de elementos antes de manipular
    const roundControls = document.getElementById('round-controls');
    const championDisplay = document.getElementById('champion-display');
    const confirmBtn = document.getElementById('confirm-btn');
    
    if (roundControls) roundControls.style.display = 'none';
    if (championDisplay) championDisplay.style.display = 'none';
    if (confirmBtn) confirmBtn.style.display = 'inline-block';
}

function displayChampion(name) {
    // NOTE Verificação de elementos antes de manipular
    const championName = document.getElementById('champion-name');
    const championDisplay = document.getElementById('champion-display');
    
    if (championName) championName.textContent = name;
    if (championDisplay) championDisplay.style.display = 'block';
    
    // NOTE Adicionado feedback visual
    console.log(`Campeão do torneio: ${name}`);
}

class TournamentBracket {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.rounds = [];
        this.currentRound = 0;
        this.winners = [];
    }

    createBracket(teams) {
        this.container.innerHTML = '';
        this.rounds = [];
        this.currentRound = 0;
        this.winners = [];

        // Criar rodadas baseadas no número real de times
        let currentTeams = teams;
        this.rounds = [this.createMatches(currentTeams)];

        // CORREÇÃO: Criar apenas as rodadas necessárias até a final
        while (currentTeams.length > 2) {
            currentTeams = new Array(Math.ceil(currentTeams.length / 2)).fill('');
            this.rounds.push(this.createMatches(currentTeams));
        }

        console.log('Rodadas criadas:', this.rounds.length);
        this.render();
    }

    createMatches(teams) {
        const matches = [];
        for (let i = 0; i < teams.length; i += 2) {
            // Se não há time2, o time1 avança sozinho
            if (i + 1 >= teams.length) {
                matches.push({
                    team1: teams[i] || '',
                    team2: '',
                    winner: teams[i] || null
                });
            } else {
                matches.push({
                    team1: teams[i] || '',
                    team2: teams[i + 1] || '',
                    winner: null
                });
            }
        }
        return matches;
    }

    render() {
        this.container.innerHTML = '';
        const bracketEl = document.createElement('div');
        bracketEl.className = 'bracket';

        // Renderizar apenas até a rodada atual
        for (let roundIndex = 0; roundIndex <= this.currentRound && roundIndex < this.rounds.length; roundIndex++) {
            const round = this.rounds[roundIndex];
            const roundEl = document.createElement('div');
            roundEl.className = 'round';
            
            // Nome da rodada baseado no número de times
            let roundName = `Rodada ${roundIndex + 1}`;
            const numMatches = round.length;
            
            if (numMatches === 1) {
                roundName = 'Final';
            } else if (numMatches === 2) {
                roundName = 'Semifinal';
            } else if (numMatches === 4) {
                roundName = 'Quartas de Final';
            } else if (numMatches === 8) {
                roundName = 'Oitavas de Final';
            }
            
            roundEl.innerHTML = `<h3>${roundName}</h3>`;

            round.forEach((match, matchIndex) => {
                const matchEl = document.createElement('div');
                matchEl.className = 'match';
                matchEl.dataset.round = roundIndex;
                matchEl.dataset.match = matchIndex;

                // Time 1
                const team1El = this.createTeamElement(match.team1, roundIndex, matchIndex, 0);
                matchEl.appendChild(team1El);

                // Time 2
                const team2El = this.createTeamElement(match.team2, roundIndex, matchIndex, 1);
                matchEl.appendChild(team2El);

                roundEl.appendChild(matchEl);
            });

            bracketEl.appendChild(roundEl);
        }

        this.container.appendChild(bracketEl);
        this.updateConfirmButton();
    }

    createTeamElement(team, roundIndex, matchIndex, teamPosition) {
        const teamEl = document.createElement('div');
        
        // Determinar classes
        let className = 'team';
        if (!team) {
            className += ' empty';
        }
        
        teamEl.className = className;
        
        // Texto do time
        if (team) {
            teamEl.textContent = team;
        } else {
            teamEl.textContent = 'Aguardando';
        }
        
        // Adicionar evento de clique apenas para rodada atual e times válidos
        if (roundIndex === this.currentRound && team) {
            teamEl.addEventListener('click', () => {
                this.selectWinner(roundIndex, matchIndex, teamPosition, team);
            });
        }
        
        // Marcar como selecionado se for o vencedor
        if (this.winners[roundIndex] && this.winners[roundIndex][matchIndex] === team) {
            teamEl.classList.add('selected');
        }

        return teamEl;
    }

    selectWinner(roundIndex, matchIndex, teamPosition, teamName) {
        const matchEl = document.querySelector(`.match[data-round="${roundIndex}"][data-match="${matchIndex}"]`);
        if (!matchEl) return;

        // Remover seleção anterior
        matchEl.querySelectorAll('.team').forEach(team => {
            team.classList.remove('selected');
        });

        // Selecionar o time clicado
        const selectedTeam = matchEl.querySelectorAll('.team')[teamPosition];
        if (selectedTeam) {
            selectedTeam.classList.add('selected');
        }

        // Atualizar o vencedor no array de rounds
        this.rounds[roundIndex][matchIndex].winner = teamName;

        this.updateConfirmButton();
    }

    updateConfirmButton() {
        const confirmBtn = document.getElementById('confirm-btn');
        if (!confirmBtn) return;
        
        const currentRound = this.rounds[this.currentRound];
        if (!currentRound) return;
        
        const isFinal = currentRound.length === 1;
        const isRoundComplete = currentRound.every(match => match.winner !== null);
        
        if (isFinal) {
            confirmBtn.textContent = 'Decidir Campeão';
        } else {
            confirmBtn.textContent = 'Próxima Rodada';
        }
        
        confirmBtn.disabled = !isRoundComplete;
    }

    isRoundComplete() {
        const currentRound = this.rounds[this.currentRound];
        if (!currentRound) return false;
        
        return currentRound.every(match => match.winner !== null);
    }

    confirmRound() {
        if (!this.isRoundComplete()) {
            alert('Selecione todos os vencedores antes de avançar!');
            return;
        }

        const currentRound = this.rounds[this.currentRound];
        const winners = currentRound.map(match => match.winner);

        // Salvar vencedores desta rodada
        this.winners[this.currentRound] = winners;

        // Avançar para próxima rodada
        this.currentRound++;

        // CORREÇÃO: Verificar se é a última rodada (final)
        if (this.currentRound < this.rounds.length) {
            // Preencher próxima rodada com os vencedores
            const nextRound = this.rounds[this.currentRound];
            for (let i = 0; i < winners.length; i++) {
                const matchIndex = Math.floor(i / 2);
                const teamPosition = i % 2;
                
                if (nextRound[matchIndex]) {
                    if (teamPosition === 0) {
                        nextRound[matchIndex].team1 = winners[i];
                    } else {
                        nextRound[matchIndex].team2 = winners[i];
                    }
                }
            }

            this.render();
        } else {
            // Torneio finalizado - mostrar campeão
            const champion = winners[0] ? winners[0] : 'Campeão Indefinido';
            displayChampion(champion);
            
            const confirmBtn = document.getElementById('confirm-btn');
            if (confirmBtn) {
                confirmBtn.disabled = true;
                confirmBtn.style.display = 'none';
            }
        }
    }

    clearBracket() {
        this.container.innerHTML = '';
        this.rounds = [];
        this.currentRound = 0;
        this.winners = [];
    }
}

// NOTE Adicionada inicialização automática quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    initializeTournament();
    
    // NOTE Adicionado listener para Enter no campo de input
    const teamInput = document.getElementById('team-input');
    if (teamInput) {
        teamInput.addEventListener('keypress', handleKeyPress);
    }
});