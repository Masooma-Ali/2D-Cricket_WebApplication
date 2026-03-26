// =============================================================
// Scoreboard.jsx
// Dynamically updated scoreboard panel showing all match stats.
// =============================================================

import React from 'react';
import { TOTAL_BALLS, TOTAL_WICKETS } from '../utils/gameConstants';
import styles from '../styles/Scoreboard.module.css';

export default function Scoreboard({ runs, wickets, ballsBowled, oversDisplay, strikeRate, bestScore }) {
  const ballsLeft = Math.max(0, TOTAL_BALLS - ballsBowled);

  return (
    <div className={styles.scoreboard}>
      {/* Main score */}
      <div className={styles.mainScore}>
        <span className={styles.runs}>{runs}</span>
        <span className={styles.sep}>/</span>
        <span className={styles.wickets}>{wickets}</span>
      </div>
      <div className={styles.subLabel}>RUNS / WICKETS</div>

      <div className={styles.divider} />

      {/* Stats grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={styles.statVal}>{oversDisplay}</span>
          <span className={styles.statLbl}>OVERS</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statVal}>{ballsLeft}</span>
          <span className={styles.statLbl}>BALLS LEFT</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statVal}>{strikeRate}</span>
          <span className={styles.statLbl}>STRIKE RATE</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statVal}>{TOTAL_WICKETS - wickets}</span>
          <span className={styles.statLbl}>WICKETS LEFT</span>
        </div>
      </div>

      {/* Best score */}
      <div className={styles.bestScore}>
        🏆 Best: <strong>{bestScore}</strong>
      </div>

      {/* Balls remaining mini-bar */}
      <div className={styles.ballsBar}>
        {Array.from({ length: TOTAL_BALLS }, (_, i) => (
          <div
            key={i}
            className={`${styles.ball} ${i < ballsBowled ? styles.ballUsed : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
