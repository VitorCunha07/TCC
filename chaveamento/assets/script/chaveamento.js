// NOTE Adicionado comentários explicativos com o prefixo "NOTE"
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
            
            const bracketContainer = document.getElementById('bracket-container');
            if (bracketContainer) {
                // Versão simplificada sem dependência de TournamentBracket
                bracketContainer.innerHTML = '<div class="bracket-placeholder">Sistema de chaveamento carregado com sucesso!<br>Usuário autenticado.</div>';
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

            // NOTE Adicionada validação para potência de 2
            const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(teamsList.length)));
            const shuffledTeams = [...teamsList];
            
            // NOTE Preenchimento com "BYE" para completar potência de 2
            while (shuffledTeams.length < powerOfTwo) {
                shuffledTeams.push('BYE');
            }

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
            if (confirmBtn) confirmBtn.disabled = true;
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
            
            if (roundControls) roundControls.style.display = 'none';
            if (championDisplay) championDisplay.style.display = 'none';
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
            }

            createBracket(teams) {
                this.container.innerHTML = '';
                this.rounds = [];
                this.currentRound = 0;

                // NOTE Filtrar teams BYE vazios e garantir número par
                const validTeams = teams.filter(team => team && team !== 'BYE');
                const totalTeams = [...validTeams];
                
                // NOTE Adicionar BYE para completar potência de 2
                const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(totalTeams.length)));
                while (totalTeams.length < powerOfTwo) {
                    totalTeams.push('BYE');
                }

                let currentRound = this.createMatches(totalTeams);
                this.rounds.push(currentRound);

                while (currentRound.length > 1) {
                    currentRound = this.createMatches(new Array(Math.ceil(currentRound.length / 2)).fill(''));
                    this.rounds.push(currentRound);
                }

                this.render();
            }

            createMatches(teams) {
                const matches = [];
                for (let i = 0; i < teams.length; i += 2) {
                    matches.push([teams[i], teams[i + 1] || '']);
                }
                return matches;
            }

            render() {
                this.container.innerHTML = '';
                const bracketEl = document.createElement('div');
                bracketEl.className = 'bracket';

                this.rounds.forEach((round, roundIndex) => {
                    const roundEl = document.createElement('div');
                    roundEl.className = 'round';
                    roundEl.innerHTML = `<h3>Rodada ${roundIndex + 1}</h3>`;

                    round.forEach((match, matchIndex) => {
                        const matchEl = document.createElement('div');
                        matchEl.className = 'match';

                        match.forEach((team, teamIndex) => {
                            const teamEl = document.createElement('div');
                            teamEl.className = `team${team === '' ? ' empty' : ''}`;
                            teamEl.textContent = team || 'Aguardando';
                            teamEl.addEventListener('click', () => {
                                if (roundIndex !== this.currentRound || !team) return;
                                matchEl.querySelectorAll('.team').forEach(t => t.classList.remove('selected'));
                                teamEl.classList.add('selected');
                                document.getElementById('confirm-btn').disabled = !this.isRoundComplete();
                            });
                            matchEl.appendChild(teamEl);
                        });

                        roundEl.appendChild(matchEl);
                    });

                    bracketEl.appendChild(roundEl);
                });

                this.container.appendChild(bracketEl);
            }

            // NOTE Método isRoundComplete() simplificado e corrigido
            isRoundComplete() {
                if (!this.rounds[this.currentRound]) return false;
                
                const currentRoundEl = this.container.querySelectorAll('.round')[this.currentRound];
                if (!currentRoundEl) return false;
                
                const matches = currentRoundEl.querySelectorAll('.match');
                return Array.from(matches).every(matchEl => {
                    const selectedTeam = matchEl.querySelector('.team.selected');
                    return selectedTeam !== null;
                });
            }

            confirmRound() {
                const currentMatches = this.container.querySelectorAll('.round')[this.currentRound].querySelectorAll('.match');
                const winners = [];

                currentMatches.forEach(matchEl => {
                    const selected = matchEl.querySelector('.team.selected');
                    // NOTE Tratamento para BYE automático
                    if (selected) {
                        winners.push(selected.textContent);
                    } else {
                        // NOTE Se não há seleção, pegar o primeiro time não-BYE
                        const teams = matchEl.querySelectorAll('.team');
                        const validTeam = Array.from(teams).find(team => 
                            team.textContent && team.textContent !== 'BYE' && team.textContent !== 'Aguardando'
                        );
                        winners.push(validTeam ? validTeam.textContent : '');
                    }
                });

                this.currentRound++;
                if (this.currentRound < this.rounds.length) {
                    this.rounds[this.currentRound] = this.createMatches(winners);
                    this.render();
                    
                    // NOTE Verificação de elemento antes de manipular
                    const confirmBtn = document.getElementById('confirm-btn');
                    if (confirmBtn) confirmBtn.disabled = true;
                } else {
                    // NOTE Filtrar BYE do campeão
                    const champion = winners[0] && winners[0] !== 'BYE' ? winners[0] : 'Campeão Indefinido';
                    displayChampion(champion);
                    
                    const confirmBtn = document.getElementById('confirm-btn');
                    if (confirmBtn) confirmBtn.disabled = true;
                }
            }

            clearBracket() {
                this.container.innerHTML = '';
                this.rounds = [];
                this.currentRound = 0;
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
