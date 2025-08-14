import { CONFIG } from "./CONFIG.js";

export class HighScoreManager {
  constructor() {
    this.storageKey = 'minesweeper-highscores';
    this.createHighScoreDisplay();
  }

  // Generate a unique key for the current game configuration
  getConfigKey() {
    return `${CONFIG.CELLSACROSS}x${CONFIG.CELLSDOWN}-${CONFIG.MINES}mines`;
  }

  // Generate display title with difficulty rating
  getDisplayTitle() {
    return `Top 5 Times ${CONFIG.CELLSACROSS} x ${CONFIG.CELLSDOWN} ${CONFIG.MINES} mines<br>(difficulty: ${CONFIG.DIFFICULTY})`;
  }

  // Get all high scores from localStorage
  getAllHighScores() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : {};
  }

  // Get high scores for current configuration
  getHighScores() {
    const allScores = this.getAllHighScores();
    const configKey = this.getConfigKey();
    return allScores[configKey] || [];
  }

  // Add a new score with optional name
  addScore(timeInMs, playerName = "Anonymous") {
    const allScores = this.getAllHighScores();
    const configKey = this.getConfigKey();
    
    if (!allScores[configKey]) {
      allScores[configKey] = [];
    }

    const newScore = {
      time: timeInMs,
      name: playerName.trim() || "Anonymous",
      date: new Date().toISOString(),
      config: {
        width: CONFIG.CELLSACROSS,
        height: CONFIG.CELLSDOWN,
        mines: CONFIG.MINES
      }
    };

    allScores[configKey].push(newScore);
    
    // Sort by time (fastest first) and keep only top 5
    allScores[configKey].sort((a, b) => a.time - b.time);
    allScores[configKey] = allScores[configKey].slice(0, 5);

    localStorage.setItem(this.storageKey, JSON.stringify(allScores));
    
    this.updateHighScoreDisplay();
    
    // Return the rank (1-5) if it made the leaderboard, or null if not
    const rank = allScores[configKey].findIndex(score => 
      score.time === timeInMs && score.date === newScore.date
    );
    return rank >= 0 ? rank + 1 : null;
  }

  // Format time for display
  formatTime(timeInMs) {
    const totalSeconds = timeInMs / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const hundredths = Math.floor((timeInMs % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
  }

  // Create the high score display element
  createHighScoreDisplay() {
    const gameContainer = document.getElementById('game-container');
    
    const highScoreContainer = document.createElement('div');
    highScoreContainer.id = 'highscore-container';
    highScoreContainer.innerHTML = `
      <h3>${this.getDisplayTitle()}</h3>
      <ol id="highscore-list"></ol>
    `;
    
    gameContainer.appendChild(highScoreContainer);
    this.updateHighScoreDisplay();
  }

  // Update the high score display
  updateHighScoreDisplay() {
    const titleElement = document.querySelector('#highscore-container h3');
    const listElement = document.getElementById('highscore-list');
    
    if (!titleElement || !listElement) return;

    // Update title with current config and difficulty
    titleElement.innerHTML = this.getDisplayTitle();
    
    const scores = this.getHighScores();
    
    if (scores.length === 0) {
      listElement.innerHTML = '<li class="no-scores">No scores yet!</li>';
    } else {
      listElement.innerHTML = scores.map((score, index) => {
        const date = new Date(score.date).toLocaleDateString();
        const name = score.name || "Anonymous";
        return `<li><span class="score-time">${this.formatTime(score.time)}</span> <span class="score-name">${name}</span> <span class="score-date">(${date})</span></li>`;
      }).join('');
    }
  }

  // Show name input modal and add score
  async showNameInput(timeInMs) {
    return new Promise((resolve) => {
      // Create modal overlay
      const overlay = document.createElement('div');
      overlay.className = 'name-input-overlay';
      
      // Create modal content
      const modal = document.createElement('div');
      modal.className = 'name-input-modal';
      modal.innerHTML = `
        <h2>New High Score!</h2>
        <p>Time: ${this.formatTime(timeInMs)}</p>
        <input type="text" id="player-name-input" placeholder="name" maxlength="16" autocomplete="off">
        <div class="modal-buttons">
          <button id="save-score-btn" class="primary">OK</button>
        </div>
      `;
      
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      
      // Focus input and select any existing text
      const input = document.getElementById('player-name-input');
      if (input) {
        input.focus();
      }
      
      const handleSave = () => {
        const name = input.value.trim() || "Anonymous";
        const rank = this.addScore(timeInMs, name);
        cleanup();
        resolve(rank);
      };
      
      const cleanup = () => {
        document.body.removeChild(overlay);
      };
      
      // Event listeners
      const saveButton = document.getElementById('save-score-btn');
      if (saveButton) {
        saveButton.addEventListener('click', handleSave);
      }
      
      // Enter key saves, Escape closes with anonymous
      if (input) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            handleSave(); // Changed from handleSkip to handleSave
          }
        });
      }
      
      // Close on overlay click (outside modal)
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          handleSkip();
        }
      });
    });
  }

  // Clear all high scores (for testing or reset purposes)
  clearAllScores() {
    localStorage.removeItem(this.storageKey);
    this.updateHighScoreDisplay();
  }

  // Clear scores for current configuration only
  clearCurrentConfigScores() {
    const allScores = this.getAllHighScores();
    const configKey = this.getConfigKey();
    delete allScores[configKey];
    localStorage.setItem(this.storageKey, JSON.stringify(allScores));
    this.updateHighScoreDisplay();
  }
}
