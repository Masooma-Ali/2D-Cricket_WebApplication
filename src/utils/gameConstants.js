// =============================================================
// gameConstants.js
// Central config for game rules, probabilities, and commentary.
// =============================================================

// ── Match Rules ───────────────────────────────────────────────
export const TOTAL_OVERS = 2;
export const BALLS_PER_OVER = 6;
export const TOTAL_BALLS = TOTAL_OVERS * BALLS_PER_OVER; // 12
export const TOTAL_WICKETS = 2;

// ── Outcome Keys ─────────────────────────────────────────────
export const OUTCOMES = {
  WICKET: 'WICKET',
  DOT: 'DOT',
  ONE: 'ONE',
  TWO: 'TWO',
  THREE: 'THREE',
  FOUR: 'FOUR',
  SIX: 'SIX',
};

// ── Batting Styles ────────────────────────────────────────────
export const BATTING_STYLES = {
  AGGRESSIVE: 'AGGRESSIVE',
  DEFENSIVE: 'DEFENSIVE',
};

// ── Probability Distributions ────────────────────────────────
// Each array entry: { outcome, probability, label, color }
// Probabilities must sum exactly to 1.00 for each style.

export const PROBABILITIES = {
  [BATTING_STYLES.AGGRESSIVE]: [
    { outcome: OUTCOMES.WICKET, probability: 0.40, label: 'W',  color: '#e74c3c' },
    { outcome: OUTCOMES.DOT,    probability: 0.10, label: '0',  color: '#95a5a6' },
    { outcome: OUTCOMES.ONE,    probability: 0.10, label: '1',  color: '#f39c12' },
    { outcome: OUTCOMES.TWO,    probability: 0.10, label: '2',  color: '#2ecc71' },
    { outcome: OUTCOMES.THREE,  probability: 0.05, label: '3',  color: '#1abc9c' },
    { outcome: OUTCOMES.FOUR,   probability: 0.10, label: '4',  color: '#3498db' },
    { outcome: OUTCOMES.SIX,    probability: 0.15, label: '6',  color: '#9b59b6' },
  ],
  [BATTING_STYLES.DEFENSIVE]: [
    { outcome: OUTCOMES.WICKET, probability: 0.15, label: 'W',  color: '#e74c3c' },
    { outcome: OUTCOMES.DOT,    probability: 0.30, label: '0',  color: '#95a5a6' },
    { outcome: OUTCOMES.ONE,    probability: 0.25, label: '1',  color: '#f39c12' },
    { outcome: OUTCOMES.TWO,    probability: 0.15, label: '2',  color: '#2ecc71' },
    { outcome: OUTCOMES.THREE,  probability: 0.05, label: '3',  color: '#1abc9c' },
    { outcome: OUTCOMES.FOUR,   probability: 0.07, label: '4',  color: '#3498db' },
    { outcome: OUTCOMES.SIX,    probability: 0.03, label: '6',  color: '#9b59b6' },
  ],
};

// ── Slider Speed ─────────────────────────────────────────────
// Time in ms for slider to travel full bar width (one pass)
export const SLIDER_SPEED_MS = 5000;

// ── Commentary Lines ──────────────────────────────────────────
export const COMMENTARY = {
  [OUTCOMES.WICKET]: [
    ' Clean bowled! Timber! That\'s out!',
    ' Edge and caught! Walking back to the pavilion!',
    ' Plumb LBW! That\'s stone dead! OUT!',
    ' Caught behind! The keeper celebrates!',
  ],
  [OUTCOMES.DOT]: [
    ' Defended solidly. No run.',
    ' Beaten on the outside edge! Dot ball.',
    ' Soft hands, ball to covers. Dot.',
  ],
  [OUTCOMES.ONE]: [
    ' Pushed to mid-off, come back for one.',
    ' Quick single to fine leg!',
    ' Nudged off the pads — one run.',
  ],
  [OUTCOMES.TWO]: [
    ' Driven hard, they run two!',
    ' Good running between the wickets — two runs!',
    ' Placed well, deep fielder cuts it off. Two!',
  ],
  [OUTCOMES.THREE]: [
    ' Played into the gap! Three all the way!',
    ' Three runs! Great placement past mid-wicket!',
    ' Brilliant running — three runs taken!',
  ],
  [OUTCOMES.FOUR]: [
    ' FOUR! Crashing through the covers!',
    ' Beautifully driven — races away to the boundary!',
    ' FOUR! Smashed through mid-wicket!',
  ],
  [OUTCOMES.SIX]: [
    ' SIX! Absolutely LAUNCHED over long-on!',
    ' MAXIMUM! That\'s gone into the stands!',
    ' SIX! Enormous hit over the rope!',
  ],
};

// ── Outcome Run Values ────────────────────────────────────────
export const OUTCOME_RUNS = {
  [OUTCOMES.WICKET]: 0,
  [OUTCOMES.DOT]:    0,
  [OUTCOMES.ONE]:    1,
  [OUTCOMES.TWO]:    2,
  [OUTCOMES.THREE]:  3,
  [OUTCOMES.FOUR]:   4,
  [OUTCOMES.SIX]:    6,
};
