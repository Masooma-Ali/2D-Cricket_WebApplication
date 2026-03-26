// =============================================================
// App.jsx
// Root component — wires together all game components and logic.
// =============================================================

import React, { useEffect, useRef } from 'react';
import useGameState, { GAME_PHASE } from './hooks/useGameState';
import CricketField           from './components/CricketField';
import Scoreboard             from './components/Scoreboard';
import BattingStyleSelector   from './components/BattingStyleSelector';
import PowerBar               from './components/PowerBar';
import Commentary             from './components/Commentary';
import GameOver               from './components/GameOver';
import styles                 from './styles/App.module.css';
import './styles/globals.css';

export default function App() {
  const { state, derived, actions } = useGameState();
  const resultTimerRef = useRef(null);

  // Auto-advance from RESULT → IDLE after a short delay
  useEffect(() => {
    if (state.phase === GAME_PHASE.RESULT) {
      resultTimerRef.current = setTimeout(() => {
        actions.acknowledgeResult();
      }, 1800);
    }
    return () => clearTimeout(resultTimerRef.current);
  }, [state.phase, actions]);

  const isBowling   = state.phase === GAME_PHASE.BOWLING;
  const isBatting   = state.phase === GAME_PHASE.BATTING;
  const isResult    = state.phase === GAME_PHASE.RESULT;
  const isGameOver  = state.phase === GAME_PHASE.GAME_OVER;
  const canBowl     = state.phase === GAME_PHASE.IDLE && !isGameOver;

  return (
    <div className={styles.app}>
      {/* ── Header ─────────────────────────────────────────── */}
      <header className={styles.header}>
        <h1 className={styles.title}>🏏 CRICKET BLITZ</h1>
        <p className={styles.subtitle}>2D Cricket Web Application &nbsp;·&nbsp; CS-4032</p>
      </header>

      {/* ── Main layout ────────────────────────────────────── */}
      <main className={styles.layout}>

        {/* Field Canvas */}
        <div className={styles.fieldArea}>
          <CricketField
            phase={state.phase}
            lastOutcome={state.lastOutcome}
            onBowlingComplete={actions.onBowlingComplete}
          />
        </div>

        {/* Scoreboard (right column, spans 2 rows) */}
        <div className={styles.scoreArea}>
          <Scoreboard
            runs={state.runs}
            wickets={state.wickets}
            ballsBowled={state.ballsBowled}
            oversDisplay={derived.oversDisplay}
            strikeRate={derived.strikeRate}
            bestScore={state.bestScore}
          />
        </div>

        {/* Batting style + Bowl button row */}
        <div className={styles.styleArea}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <BattingStyleSelector
              selected={state.battingStyle}
              onChange={actions.selectBattingStyle}
              disabled={isBowling || isBatting}
            />

            <div className={styles.bowlRow}>
              <button
                className={styles.bowlBtn}
                onClick={actions.startDelivery}
                disabled={!canBowl}
              >
                {isBowling ? '⚾ Bowling…' : isBatting ? '🏏 Bat Now!' : '⚾ BOWL'}
              </button>
              <button
                className={styles.restartSmallBtn}
                onClick={actions.restartGame}
              >
                🔄 Restart
              </button>
            </div>
          </div>
        </div>

        {/* Power Bar */}
        <div className={styles.powerArea}>
          <PowerBar
            battingStyle={state.battingStyle}
            phase={state.phase}
            onShot={actions.playShot}
          />
        </div>

        {/* Commentary */}
        <div className={styles.commentaryArea}>
          <Commentary
            text={state.commentary}
            outcome={state.lastOutcome}
            visible={isResult || isGameOver}
          />
        </div>

      </main>

      {/* ── Game Over overlay ───────────────────────────────── */}
      {isGameOver && (
        <GameOver
          runs={state.runs}
          wickets={state.wickets}
          ballsBowled={state.ballsBowled}
          strikeRate={derived.strikeRate}
          bestScore={state.bestScore}
          onRestart={actions.restartGame}
        />
      )}
    </div>
  );
}
