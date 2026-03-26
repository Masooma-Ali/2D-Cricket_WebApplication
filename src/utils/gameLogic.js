// =============================================================
// gameLogic.js
// Pure functions for outcome resolution and game state helpers.
// =============================================================

import {
  PROBABILITIES,
  OUTCOMES,
  OUTCOME_RUNS,
  COMMENTARY,
  TOTAL_BALLS,
  TOTAL_WICKETS,
  BALLS_PER_OVER,
} from './gameConstants';

/**
 * Given a sliderPosition (0..1) and a battingStyle,
 * return the outcome key whose probability segment contains the position.
 *
 * @param {number} sliderPosition - value between 0 and 1
 * @param {string} battingStyle   - AGGRESSIVE | DEFENSIVE
 * @returns {string} outcome key from OUTCOMES
 */
export function resolveOutcome(sliderPosition, battingStyle) {
  const segments = PROBABILITIES[battingStyle];
  let cumulative = 0;
  for (const seg of segments) {
    cumulative += seg.probability;
    if (sliderPosition < cumulative) {
      return seg.outcome;
    }
  }
  // Fallback (floating-point edge): return last segment outcome
  return segments[segments.length - 1].outcome;
}

/**
 * Build cumulative boundary map for the power bar rendering.
 * Returns array of { outcome, start, end, label, color }
 *
 * @param {string} battingStyle
 * @returns {Array}
 */
export function buildPowerBarSegments(battingStyle) {
  const segments = PROBABILITIES[battingStyle];
  let cum = 0;
  return segments.map((seg) => {
    const start = cum;
    cum += seg.probability;
    return {
      outcome: seg.outcome,
      start,
      end: cum,
      label: seg.label,
      color: seg.color,
      probability: seg.probability,
    };
  });
}

/**
 * Returns the runs scored for a given outcome.
 * @param {string} outcome
 * @returns {number}
 */
export function getRunsForOutcome(outcome) {
  return OUTCOME_RUNS[outcome] ?? 0;
}

/**
 * Returns true if outcome is a wicket.
 * @param {string} outcome
 * @returns {boolean}
 */
export function isWicket(outcome) {
  return outcome === OUTCOMES.WICKET;
}

/**
 * Pick a random commentary string for an outcome.
 * @param {string} outcome
 * @returns {string}
 */
export function getCommentary(outcome) {
  const lines = COMMENTARY[outcome] || ['Good ball!'];
  return lines[Math.floor(Math.random() * lines.length)];
}

/**
 * Format balls bowled into overs string e.g. "1.3"
 * @param {number} ballsBowled
 * @returns {string}
 */
export function formatOvers(ballsBowled) {
  const overs = Math.floor(ballsBowled / BALLS_PER_OVER);
  const balls = ballsBowled % BALLS_PER_OVER;
  return `${overs}.${balls}`;
}

/**
 * Returns true if the game should end.
 * @param {number} ballsBowled
 * @param {number} wickets
 * @returns {boolean}
 */
export function isGameOver(ballsBowled, wickets) {
  return ballsBowled >= TOTAL_BALLS || wickets >= TOTAL_WICKETS;
}

/**
 * Returns balls remaining.
 * @param {number} ballsBowled
 * @returns {number}
 */
export function ballsRemaining(ballsBowled) {
  return Math.max(0, TOTAL_BALLS - ballsBowled);
}
