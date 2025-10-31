// Sistema de Ranking - Allian's Arena

// Dados de exemplo para o ranking
const rankingData = [
    { position: 1, team: "Flamengo", points: 280, wins: 14, losses: 2 },
    { position: 2, team: "São Paulo FC", points: 245, wins: 12, losses: 4 },
    { position: 3, team: "Palmeiras", points: 230, wins: 11, losses: 5 },
    { position: 4, team: "Corinthians", points: 215, wins: 10, losses: 6 },
    { position: 5, team: "Grêmio", points: 200, wins: 9, losses: 7 },
    { position: 6, team: "Internacional", points: 190, wins: 9, losses: 7 },
    { position: 7, team: "Atlético-MG", points: 185, wins: 8, losses: 8 },
    { position: 8, team: "Cruzeiro", points: 175, wins: 8, losses: 8 },
    { position: 9, team: "Fluminense", points: 170, wins: 7, losses: 9 },
    { position: 10, team: "Botafogo", points: 160, wins: 7, losses: 9 },
    { position: 11, team: "Vasco", points: 150, wins: 6, losses: 10 },
    { position: 12, team: "Bahia", points: 140, wins: 6, losses: 10 },
    { position: 13, team: "Sport", points: 130, wins: 5, losses: 11 },
    { position: 14, team: "Fortaleza", points: 120, wins: 5, losses: 11 },
    { position: 15, team: "Athletico-PR", points: 110, wins: 4, losses: 12 },
    { position: 16, team: "Ceará", points: 100, wins: 4, losses: 12 }
];

// Função para carregar os dados do ranking
function loadRankingData() {
    const tableBody = document.getElementById('ranking-table-body');
    
    if (!tableBody) {
        console.error('Elemento ranking-table-body não encontrado');
        return;
    }
    
    tableBody.innerHTML = '';

    rankingData.forEach(team => {
        const row = document.createElement('tr');
        
        // Destaque para os 3 primeiros colocados
        if (team.position <= 3) {
            row.style.backgroundColor = '#fff8e1';
        }
        
        row.innerHTML = `
            <td class="ranking-position">${team.position}º</td>
            <td class="ranking-team">${team.team}</td>
            <td class="ranking-points">${team.points}</td>
            <td class="ranking-wins">${team.wins}</td>
        `;
        tableBody.appendChild(row);
    });

    // Atualizar o pódio
    const firstPlace = document.getElementById('first-place');
    const firstPoints = document.getElementById('first-points');
    const secondPlace = document.getElementById('second-place');
    const secondPoints = document.getElementById('second-points');
    const thirdPlace = document.getElementById('third-place');
    const thirdPoints = document.getElementById('third-points');
    
    if (firstPlace && rankingData[0]) {
        firstPlace.textContent = rankingData[0].team;
        firstPoints.textContent = `${rankingData[0].points} pontos`;
    }
    
    if (secondPlace && rankingData[1]) {
        secondPlace.textContent = rankingData[1].team;
        secondPoints.textContent = `${rankingData[1].points} pontos`;
    }
    
    if (thirdPlace && rankingData[2]) {
        thirdPlace.textContent = rankingData[2].team;
        thirdPoints.textContent = `${rankingData[2].points} pontos`;
    }
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando sistema de ranking...');
    
    // Verificar autenticação
    if (typeof checkAuth === 'function') {
        if (!checkAuth()) {
            return;
        }
    }
    
    // Carregar dados iniciais
    loadRankingData();
    
    console.log('Sistema de ranking inicializado');
});