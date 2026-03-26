// =============================================================
// PowerBar.jsx
// Visual probability-segmented bar with animated sliding marker.
// Clicking stops the slider and determines the shot outcome.
// =============================================================

import React, { useRef } from 'react';
import usePowerBar from '../hooks/usePowerBar';
import { buildPowerBarSegments } from '../utils/gameLogic';
import { GAME_PHASE } from '../hooks/useGameState';
import styles from '../styles/PowerBar.module.css';

export default function PowerBar({ battingStyle, phase, onShot }) {
  const isActive = phase === GAME_PHASE.BATTING;
  const { sliderPos, stopSlider } = usePowerBar(isActive);
  const segments = buildPowerBarSegments(battingStyle);
  const barRef   = useRef(null);

  const handleClick = () => {
    if (!isActive) return;
    stopSlider();
    onShot(sliderPos);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>⚡ POWER BAR — Click to Play Shot!</div>

      {/* ── Probability bar ─────────────────────────────── */}
      <div
        ref={barRef}
        className={`${styles.bar} ${isActive ? styles.active : ''}`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === ' ' && handleClick()}
        aria-label="Power bar - click to play shot"
      >
        {/* Segments */}
        {segments.map((seg) => (
          <div
            key={seg.outcome}
            className={styles.segment}
            style={{
              width:           `${seg.probability * 100}%`,
              backgroundColor: seg.color,
            }}
          >
            <span className={styles.segLabel}>{seg.label}</span>
          </div>
        ))}

        {/* Slider indicator */}
        {isActive && (
          <div
            className={styles.slider}
            style={{ left: `calc(${sliderPos * 100}% - 3px)` }}
          >
            <div className={styles.sliderArrow} />
          </div>
        )}
      </div>

      {/* ── Probability scale ───────────────────────────── */}
      <div className={styles.scale}>
        {segments.map((seg, i) => (
          <div
            key={seg.outcome}
            className={styles.scaleMark}
            style={{ left: `${seg.end * 100}%` }}
          >
            <div className={styles.scaleLine} />
            <span className={styles.scaleNum}>{seg.end.toFixed(2)}</span>
          </div>
        ))}
        <span className={styles.scaleStart}>0</span>
      </div>

      {/* ── Legend ──────────────────────────────────────── */}
      <div className={styles.legend}>
        {segments.map(seg => (
          <div key={seg.outcome} className={styles.legendItem}>
            <div className={styles.legendDot} style={{ background: seg.color }} />
            <span>{seg.label === 'W' ? 'Wicket' : `${seg.label} Run${seg.label === '1' ? '' : 's'}`}</span>
            <span className={styles.legendProb}>{(seg.probability * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>

      {!isActive && phase !== GAME_PHASE.BOWLING && (
        <div className={styles.hint}>
          {phase === GAME_PHASE.RESULT
            ? '✅ Outcome recorded!'
            : phase === GAME_PHASE.GAME_OVER
            ? '🏁 Match over!'
            : '👆 Select style & click BOWL to start'}
        </div>
      )}
    </div>
  );
}
