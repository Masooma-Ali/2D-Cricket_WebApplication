# 🏏 Cricket 


## Project Structure

```
2D-Cricket_WebApplication/
├── public/
│   └── index.html                  # HTML entry point
├── src/
│   ├── index.js                    # React DOM entry point
│   ├── App.jsx                     # Root component (layout & orchestration)
│   │
│   ├── components/                 # UI Components
│   │   ├── CricketField.jsx        # Canvas-based 2D field + animations
│   │   ├── Scoreboard.jsx          # Live match scoreboard
│   │   ├── PowerBar.jsx            # Probability power bar + slider
│   │   ├── BattingStyleSelector.jsx# Aggressive / Defensive toggle
│   │   ├── Commentary.jsx          # Dynamic commentary display
│   │   └── GameOver.jsx            # End-of-match summary screen
│   │
│   ├── hooks/                      # Custom React Hooks
│   │   ├── useGameState.js         # All game state + phase machine
│   │   └── usePowerBar.js          # Animated slider logic 
│   │
│   ├── utils/                      # Logic
│   │   ├── gameConstants.js        # Probabilities, rules, commentary
│   │   └── gameLogic.js            # Outcome resolution, formatting
│   │
│   └── styles/                     # CSS Modules (one per component)
│       ├── globals.css             # CSS variables, reset, fonts
│       ├── App.module.css
│       ├── Scoreboard.module.css
│       ├── PowerBar.module.css
│       ├── BattingStyleSelector.module.css
│       ├── Commentary.module.css
│       └── GameOver.module.css
│
└── package.json
```

---

## How to Run

### Prerequisites
- **Node.js** v16 or higher — download from https://nodejs.org
- **npm** v7+ (bundled with Node)

### Steps

```bash
# 1. Navigate into the project folder
cd cricket-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open automatically at **http://localhost:3000**

### Build for Production

```bash
npm run build
```
Output goes to the `build/` folder — ready to deploy.

---

## Game Rules

| Rule         | Value       |
|-------------|-------------|
| Total Overs  | 2 (12 balls)|
| Total Wickets| 2           |
| Styles       | Aggressive, Defensive |

### Probability Tables

**Aggressive**
| Outcome | Probability | Bar % |
|---------|-------------|-------|
| Wicket  | 0.40        | 40%   |
| 0 Runs  | 0.10        | 10%   |
| 1 Run   | 0.10        | 10%   |
| 2 Runs  | 0.10        | 10%   |
| 3 Runs  | 0.05        | 5%    |
| 4 Runs  | 0.10        | 10%   |
| 6 Runs  | 0.15        | 15%   |

**Defensive**
| Outcome | Probability | Bar % |
|---------|-------------|-------|
| Wicket  | 0.15        | 15%   |
| 0 Runs  | 0.30        | 30%   |
| 1 Run   | 0.25        | 25%   |
| 2 Runs  | 0.15        | 15%   |
| 3 Runs  | 0.05        | 5%    |
| 4 Runs  | 0.07        | 7%    |
| 6 Runs  | 0.03        | 3%    |

---

## Features Checklist

- ✅ 2D cricket ground rendered on HTML5 Canvas
- ✅ Batsman + bowler sprites with animations
- ✅ Live scoreboard (Runs / Wickets / Overs / Strike Rate)
- ✅ Aggressive and Defensive batting styles
- ✅ Probability-based power bar (segments proportional to probabilities)
- ✅ Animated ping-pong slider — outcome determined by click position
- ✅ Bowling animation (ball travels from bowler to batsman)
- ✅ Batting swing animation on shot
- ✅ Boundary particle explosion (4s and 6s)
- ✅ Game progression (fixed overs, limited wickets)
- ✅ Restart game resets all state
- ✅ Dynamic commentary system (4 lines per outcome)
- ✅ Game Over screen with full innings summary
- ✅ Mobile responsive layout
- ✅ Modular file structure (components / hooks / utils / styles)
- ✅ CSS Modules for scoped styling
- ✅ All probabilities sum to 1.00

---

