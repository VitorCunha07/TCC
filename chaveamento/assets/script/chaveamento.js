
        let tournamentBracket;
        let teamsList = [];

        function initializeTournament() {
            tournamentBracket = new TournamentBracket('bracket-container');
            updateTeamList();
        }

        function addTeam() {
            const teamInput = document.getElementById('team-input');
            const teamName = teamInput.value.trim();
            if (teamName) {
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

            const randomize = document.getElementById('randomize-checkbox').checked;
            const shuffledTeams = randomize ? shuffleArray([...teamsList]) : [...teamsList];

            tournamentBracket.createBracket(shuffledTeams);

            document.getElementById('round-controls').style.display = 'block';
            document.getElementById('champion-display').style.display = 'none';
            document.getElementById('confirm-btn').disabled = true;
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function confirmWinners() {
            tournamentBracket.confirmRound();
        }

        function resetTournament() {
            teamsList = [];
            updateTeamList();
            tournamentBracket.clearBracket();
            document.getElementById('round-controls').style.display = 'none';
            document.getElementById('champion-display').style.display = 'none';
        }

        function displayChampion(name) {
            document.getElementById('champion-name').textContent = name;
            document.getElementById('champion-display').style.display = 'block';
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

                let currentRound = this.createMatches(teams);
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

            isRoundComplete() {
                return this.rounds[this.currentRound].every(match => {
                    const matchEl = this.container.querySelectorAll('.round')[this.currentRound].querySelectorAll('.match')[Array.from(this.rounds[this.currentRound]).indexOf(match)];
                    return matchEl.querySelector('.team.selected') !== null;
                });
            }

            confirmRound() {
                const currentMatches = this.container.querySelectorAll('.round')[this.currentRound].querySelectorAll('.match');
                const winners = [];

                currentMatches.forEach(matchEl => {
                    const selected = matchEl.querySelector('.team.selected');
                    winners.push(selected ? selected.textContent : '');
                });

                this.currentRound++;
                if (this.currentRound < this.rounds.length) {
                    this.rounds[this.currentRound] = this.createMatches(winners);
                    this.render();
                    document.getElementById('confirm-btn').disabled = true;
                } else {
                    displayChampion(winners[0]);
                    document.getElementById('confirm-btn').disabled = true;
                }
            }

            clearBracket() {
                this.container.innerHTML = '';
                this.rounds = [];
                this.currentRound = 0;
            }
        }
