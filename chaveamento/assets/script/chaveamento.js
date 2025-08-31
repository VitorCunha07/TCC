
/* --------- Tournament logic (autocontido) --------- */
class TournamentBracket {
  constructor(containerId){
    this.container = document.getElementById(containerId);
    this.statusEl = document.getElementById('status-message');
    this.championEl = document.getElementById('champion-display');
    this.championNameEl = document.getElementById('champion-name');
    this.controlsEl = document.getElementById('round-controls');
    this.confirmBtn = document.getElementById('confirm-btn');

    this.teams = [];
    this.rounds = [];
    this.currentRound = 0;
    this.selected = {}; // selected winners per match (temp)
    this.completed = false;
  }

  setTeams(teamNames, randomize=false){
    this.teams = [...teamNames];
    if(randomize) this.teams = this.shuffle(this.teams);
    this.buildBracket();
  }

  shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()* (i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  buildBracket(){
    this.container.innerHTML = '';
    this.rounds = [];
    this.currentRound = 0;
    this.selected = {};
    this.completed = false;
    this.championEl.style.display = 'none';

    const n = this.teams.length;
    if(n < 2){
      this.statusEl.textContent = 'Adicione pelo menos 2 times para começar';
      this.controlsEl.style.display = 'none';
      return;
    }

    // next power of two
    const bracketSize = Math.pow(2, Math.ceil(Math.log2(n)));
    const roundsCount = Math.log2(bracketSize);

    // initialize rounds
    for(let r=0;r<roundsCount;r++){
      this.rounds.push({matches: [], completed:false});
    }

    // pad teams array up to bracketSize with empty strings (byes)
    const padded = [...this.teams];
    while(padded.length < bracketSize) padded.push('');

    // first round matches
    for(let i=0;i<bracketSize/2;i++){
      const t1 = padded[i*2] ?? '';
      const t2 = padded[i*2+1] ?? '';
      this.rounds[0].matches.push({
        team1: {name:t1, active: !!t1},
        team2: {name:t2, active: !!t2},
        winner: null
      });
    }

    // subsequent rounds empty matches
    for(let r=1;r<roundsCount;r++){
      const prevMatches = this.rounds[r-1].matches.length;
      for(let m=0;m<Math.ceil(prevMatches/2);m++){
        this.rounds[r].matches.push({
          team1: {name:'', active:false},
          team2: {name:'', active:false},
          winner: null
        });
      }
    }

    this.controlsEl.style.display = 'flex';
    this.updateStatus();
    this.render();
  }

  render(){
    this.container.innerHTML = '';
    const bracketEl = document.createElement('div');
    bracketEl.className = 'bracket';

    this.rounds.forEach((round, rIdx) => {
      const roundEl = document.createElement('div');
      roundEl.className = 'round';
      const title = document.createElement('h3');
      title.textContent = (rIdx === this.rounds.length - 1) ? 'Final' : `Rodada ${rIdx+1}`;
      roundEl.appendChild(title);

      round.matches.forEach((match, mIdx) => {
        // skip match if both empty and no winner
        if(!match.team1.name && !match.team2.name && !match.winner) return;

        const matchEl = document.createElement('div');
        matchEl.className = 'match';

        const team1 = document.createElement('div');
        team1.className = 'team-box' + (match.team1.active ? '' : ' empty') + ((this.selected[`${rIdx}-${mIdx}`] === match.team1.name) ? ' selected' : '');
        team1.textContent = match.team1.name || '—';
        if(rIdx === this.currentRound && match.team1.active && match.team1.name && !this.rounds[rIdx].completed){
          team1.onclick = () => this.toggleSelect(rIdx, mIdx, 'team1');
        }
        matchEl.appendChild(team1);

        const team2 = document.createElement('div');
        team2.className = 'team-box' + (match.team2.active ? '' : ' empty') + ((this.selected[`${rIdx}-${mIdx}`] === match.team2.name) ? ' selected' : '');
        team2.textContent = match.team2.name || '—';
        if(rIdx === this.currentRound && match.team2.active && match.team2.name && !this.rounds[rIdx].completed){
          team2.onclick = () => this.toggleSelect(rIdx, mIdx, 'team2');
        }
        matchEl.appendChild(team2);

        roundEl.appendChild(matchEl);
      });

      bracketEl.appendChild(roundEl);
    });

    this.container.appendChild(bracketEl);
    // update confirm button state
    this.checkSelectionsForCurrentRound();
  }

  toggleSelect(roundIndex, matchIndex, which){
    if(this.completed) return;
    if(roundIndex !== this.currentRound) return;

    const match = this.rounds[roundIndex].matches[matchIndex];
    const chosen = match[which].name;
    if(!chosen) return;

    this.selected[`${roundIndex}-${matchIndex}`] = chosen;
    this.render();
  }

  checkSelectionsForCurrentRound(){
    const round = this.rounds[this.currentRound];
    const allSelected = round.matches.every((m, i) => {
      if(!m.team1.name && !m.team2.name) return true;
      return this.selected[`${this.currentRound}-${i}`] !== undefined;
    });
    this.confirmBtn.disabled = !allSelected;
  }

  confirmWinners(){
    const round = this.rounds[this.currentRound];
    round.matches.forEach((m, i) => {
      const key = `${this.currentRound}-${i}`;
      if(this.selected[key]) {
        m.winner = this.selected[key];
      } else {
        // if only one team present, auto-advance
        if(m.team1.name && !m.team2.name) m.winner = m.team1.name;
        if(!m.team1.name && m.team2.name) m.winner = m.team2.name;
      }
    });

    round.completed = true;

    // advance winners to next round
    if(this.currentRound < this.rounds.length - 1){
      const next = this.rounds[this.currentRound + 1];
      round.matches.forEach((m, idx) => {
        if(m.winner){
          const nextIdx = Math.floor(idx/2);
          const pos = (idx % 2 === 0) ? 'team1' : 'team2';
          next.matches[nextIdx][pos] = { name: m.winner, active: true };
        }
      });
      // reset temporary selections and go to next round (but keep UI control to user)
      this.selected = {};
      this.currentRound++;
      this.updateStatus();
      this.render();
    } else {
      // final -> winner set
      this.completed = true;
      this.showChampion();
    }
  }

  nextRound(){
    if(this.currentRound < this.rounds.length - 1){
      // if current round not marked completed, try to confirm automatically if possible
      if(!this.rounds[this.currentRound].completed){
        // if there are matches without opponent auto-advance them
        this.confirmWinners();
        return;
      }
      this.currentRound++;
      this.updateStatus();
      this.render();
    }
  }

  showChampion(){
    const final = this.rounds[this.rounds.length -1].matches[0];
    const winner = final && final.winner ? final.winner : '—';
    this.championNameEl.textContent = winner;
    this.championEl.style.display = 'block';
    this.controlsEl.style.display = 'none';
    this.statusEl.textContent = 'Torneio concluído!';
    this.fireConfetti();
  }

  updateStatus(){
    if(this.completed) {
      this.statusEl.textContent = 'Torneio concluído!';
      return;
    }
    const roundName = (this.currentRound === this.rounds.length -1) ? 'Final' : `Rodada ${this.currentRound+1}`;
    const totalMatches = this.rounds[this.currentRound].matches.filter(m => m.team1.name || m.team2.name).length;
    const selectedCount = Object.keys(this.selected).length;
    this.statusEl.textContent = `Selecione os vencedores da ${roundName} (${selectedCount}/${totalMatches} selecionados)`;
  }

  reset(){
    this.buildBracket();
  }

  fireConfetti(){
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';
    const colors = [ '#ff6600','#ffd166','#ffb4a2','#fff','rgba(255,102,0,0.6)' ];
    for(let i=0;i<80;i++){
      const c = document.createElement('div');
      c.style.position='absolute';
      c.style.left = (20 + Math.random()*60) + 'vw';
      c.style.top = '-10vh';
      c.style.width = (6 + Math.random()*10) + 'px';
      c.style.height = (6 + Math.random()*10)+ 'px';
      c.style.background = colors[Math.floor(Math.random()*colors.length)];
      c.style.opacity = 0.95;
      c.style.transform = `rotate(${Math.random()*360}deg)`;
      c.style.borderRadius = Math.random()>0.5 ? '50%' : '0';
      c.style.transition = 'transform 2.5s linear, top 2.5s linear, opacity 2.5s linear';
      container.appendChild(c);

      // animate
      setTimeout(()=> {
        c.style.top = (80 + Math.random()*20) + 'vh';
        c.style.transform = `translateY(0) rotate(${Math.random()*720}deg)`;
        c.style.opacity = 0;
      }, 20 + Math.random()*300);

      setTimeout(()=> c.remove(), 3000 + Math.random()*1000);
    }
  }
}

/* --------- UI hookup --------- */
let bracket;
let teamList = [];

function $(id){ return document.getElementById(id) }

function initialize(){
  bracket = new TournamentBracket('bracket-container');
  updateTeamListUI();

  // elements
  $('add-btn').addEventListener('click', addTeamFromInput);
  $('team-input').addEventListener('keydown', (e)=> { if(e.key === 'Enter'){ addTeamFromInput(); e.preventDefault(); }});
  $('generate-btn').addEventListener('click', () => {
    const rnd = $('randomize-checkbox').checked;
    if(teamList.length < 2){ alert('Adicione pelo menos 2 times.'); return; }
    bracket.setTeams(teamList, rnd);
  });
  $('clear-btn').addEventListener('click', ()=>{
    if(!confirm('Limpar todos os times?')) return;
    teamList = [];
    updateTeamListUI();
    bracket = new TournamentBracket('bracket-container');
    $('bracket-container').innerHTML = '';
    $('status-message').textContent = 'Adicione pelo menos 2 times para começar';
    $('round-controls').style.display = 'none';
    $('champion-display').style.display = 'none';
    $('confetti-container').innerHTML = '';
  });

  $('confirm-btn').addEventListener('click', ()=>{
    bracket.confirmWinners();
    bracket.updateStatus();
    // show/hide controls depending state
    if(bracket.completed){
      $('round-controls').style.display = 'none';
    } else {
      $('round-controls').style.display = 'flex';
    }
  });

  $('next-btn').addEventListener('click', ()=> {
    bracket.nextRound();
  });

  $('reset-btn').addEventListener('click', ()=> {
    if(!bracket) return;
    bracket.reset();
  });

  // observe confirm button enabling from bracket logic using a small interval
  setInterval(()=> {
    if(bracket) bracket.checkSelectionsForCurrentRound();
  }, 200);
}

function addTeamFromInput(){
  const inp = $('team-input');
  const name = inp.value.trim();
  if(!name) return;
  teamList.push(name);
  inp.value = '';
  updateTeamListUI();
  inp.focus();
}

function removeTeam(idx){
  teamList.splice(idx,1);
  updateTeamListUI();
}

function updateTeamListUI(){
  const el = $('team-list');
  el.innerHTML = '';
  if(teamList.length === 0){
    el.innerHTML = '<div style="color:var(--muted); text-align:center; padding:18px">Nenhum time adicionado</div>';
    return;
  }
  teamList.forEach((t,i) => {
    const item = document.createElement('div');
    item.className = 'team-item';
    item.innerHTML = `<div class="name">${escapeHtml(t)}</div>
                      <div style="display:flex; gap:8px; align-items:center">
                        <div style="font-size:13px; color:var(--muted)">${i+1}</div>
                        <div class="remove-team" title="Remover" onclick="removeTeam(${i})">✕</div>
                      </div>`;
    el.appendChild(item);
  });
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* start */
document.addEventListener('DOMContentLoaded', initialize);
