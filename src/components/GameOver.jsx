// =============================================================
// GameOver.jsx
// End-of-match summary screen with restart button.
// =============================================================

import React from 'react';
import styles from '../styles/GameOver.module.css';
import { TOTAL_BALLS, TOTAL_WICKETS } from '../utils/gameConstants';

export default function GameOver({ runs, wickets, ballsBowled, strikeRate, bestScore, onRestart }) {
  const allOut    = wickets >= TOTAL_WICKETS;
  const headline  = allOut ? 'ALL OUT!' : 'INNINGS COMPLETE!';
  const emoji     = runs >= 40 ? '🏆' : runs >= 20 ? '👏' : '😓';

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.emoji}>{emoji}</div>
        <h1 className={styles.headline}>{headline}</h1>

        <div className={styles.scoreBlock}>
          <span className={styles.bigRuns}>{runs}</span>
          <span className={styles.bigSep}>/</span>
          <span className={styles.bigWickets}>{wickets}</span>
        </div>
        <div className={styles.oversLine}>in {Math.ceil(ballsBowled / 6)}.{ballsBowled % 6} overs ({ballsBowled} balls)</div>

        <div className={styles.stats}>
          <div className={styles.statRow}>
            <span>Strike Rate</span>
            <strong>{strikeRate}</strong>
          </div>
          <div className={styles.statRow}>
            <span>Session Best</span>
            <strong>🏆 {bestScore}</strong>
          </div>
          <div className={styles.statRow}>
            <span>Balls Faced</span>
            <strong>{ballsBowled} / {TOTAL_BALLS}</strong>
          </div>
          <div className={styles.statRow}>
            <span>Wickets Lost</span>
            <strong>{wickets} / {TOTAL_WICKETS}</strong>
          </div>
        </div>

        <button className={styles.restartBtn} onClick={onRestart}>
          🔄 Play Again
        </button>
      </div>
    </div>
  );
}
