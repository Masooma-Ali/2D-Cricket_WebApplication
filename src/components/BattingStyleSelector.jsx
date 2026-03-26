// =============================================================
// BattingStyleSelector.jsx
// Toggle between Aggressive and Defensive batting styles.
// =============================================================

import React from 'react';
import { BATTING_STYLES } from '../utils/gameConstants';
import styles from '../styles/BattingStyleSelector.module.css';

const STYLE_META = {
  [BATTING_STYLES.AGGRESSIVE]: {
    icon:    '⚔️',
    label:   'Aggressive',
    tagline: 'High Risk · High Reward',
    desc:    '40% wicket / 25% boundary',
    accent:  '#e74c3c',
  },
  [BATTING_STYLES.DEFENSIVE]: {
    icon:    '🛡️',
    label:   'Defensive',
    tagline: 'Low Risk · Steady Runs',
    desc:    '15% wicket / 10% boundary',
    accent:  '#3498db',
  },
};

export default function BattingStyleSelector({ selected, onChange, disabled }) {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>🏏 Batting Style</div>
      <div className={styles.cards}>
        {Object.values(BATTING_STYLES).map(style => {
          const meta = STYLE_META[style];
          const isSelected = selected === style;
          return (
            <button
              key={style}
              className={`${styles.card} ${isSelected ? styles.selected : ''}`}
              style={{ '--accent': meta.accent }}
              onClick={() => !disabled && onChange(style)}
              disabled={disabled}
              aria-pressed={isSelected}
            >
              <span className={styles.icon}>{meta.icon}</span>
              <span className={styles.label}>{meta.label}</span>
              <span className={styles.tagline}>{meta.tagline}</span>
              <span className={styles.desc}>{meta.desc}</span>
              {isSelected && <div className={styles.activeBadge}>ACTIVE</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
