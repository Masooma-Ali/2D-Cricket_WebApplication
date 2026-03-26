// =============================================================
// Commentary.jsx
// Displays dynamic commentary after each delivery.
// =============================================================

import React, { useEffect, useState } from 'react';
import { OUTCOMES } from '../utils/gameConstants';
import styles from '../styles/Commentary.module.css';

const OUTCOME_CATEGORY = {
  [OUTCOMES.WICKET]: 'wicket',
  [OUTCOMES.DOT]:    'dot',
  [OUTCOMES.ONE]:    'single',
  [OUTCOMES.TWO]:    'two',
  [OUTCOMES.THREE]:  'three',
  [OUTCOMES.FOUR]:   'boundary',
  [OUTCOMES.SIX]:    'six',
};

export default function Commentary({ text, outcome, visible }) {
  const [displayed, setDisplayed] = useState('');
  const [show, setShow]           = useState(false);

  useEffect(() => {
    if (visible && text) {
      setDisplayed(text);
      setShow(true);
    } else {
      setShow(false);
    }
  }, [visible, text, outcome]);

  const category = outcome ? OUTCOME_CATEGORY[outcome] : '';

  return (
    <div className={`${styles.box} ${show ? styles.visible : ''} ${styles[category] || ''}`}>
      <span className={styles.mic}>🎙️</span>
      <span className={styles.text}>{displayed}</span>
    </div>
  );
}
