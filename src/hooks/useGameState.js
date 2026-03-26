// =============================================================
// useGameState.js
// Central React hook managing all game state and transitions.
// =============================================================

import { useState, useCallback } from 'react';
import {
  BATTING_STYLES,
  TOTAL_BALLS,
  TOTAL_WICKETS,
  OUTCOMES,
} from '../utils/gameConstants';
import {
  resolveOutcome,
  getRunsForOutcome,
  isWicket,
  getCommentary,
  formatOvers,
  isGameOver,
  ballsRemaining,
} from '../utils/gameLogic';

// ── Phase Enum ────────────────────────────────────────────────
export const GAME_PHASE = {
  IDLE:       'IDLE',       // waiting for style selection
  BOWLING:    'BOWLING',    // ball travel animation
  BATTING:    'BATTING',    // power-bar slider active
  RESULT:     'RESULT',     // brief result flash
  GAME_OVER:  'GAME_OVER',  // match finished
};

function buildInitialState() {
  return {
    phase:        GAME_PHASE.IDLE,
    battingStyle: BATTING_STYLES.AGGRESSIVE,
    runs:         0,
    wickets:      0,
    ballsBowled:  0,
    lastOutcome:  null,
    lastRuns:     null,
    commentary:   '',
    bestScore:    0,          // persists across restarts within session
  };
}

export default function useGameState() {
  const [state, setState] = useState(buildInitialState());

  // ── Select batting style ──────────────────────────────────
  const selectBattingStyle = useCallback((style) => {
    setState((prev) => {
      if (prev.phase === GAME_PHASE.IDLE || prev.phase === GAME_PHASE.RESULT) {
        return { ...prev, battingStyle: style };
      }
      return prev;
    });
  }, []);

  // ── Start delivery (called after user confirms ready) ─────
  const startDelivery = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== GAME_PHASE.IDLE && prev.phase !== GAME_PHASE.RESULT) return prev;
      if (isGameOver(prev.ballsBowled, prev.wickets)) return prev;
      return { ...prev, phase: GAME_PHASE.BOWLING };
    });
  }, []);

  // ── Bowling animation complete → enable power bar ─────────
  const onBowlingComplete = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: GAME_PHASE.BATTING,
    }));
  }, []);

  // ── User clicks power bar (slider position 0..1) ──────────
  const playShot = useCallback((sliderPosition) => {
    setState((prev) => {
      if (prev.phase !== GAME_PHASE.BATTING) return prev;

      const outcome  = resolveOutcome(sliderPosition, prev.battingStyle);
      const runs     = getRunsForOutcome(outcome);
      const wicket   = isWicket(outcome);
      const commentary = getCommentary(outcome);

      const newRuns    = prev.runs + runs;
      const newWickets = prev.wickets + (wicket ? 1 : 0);
      const newBalls   = prev.ballsBowled + 1;
      const newBest    = Math.max(prev.bestScore, newRuns);
      const gameEnded  = isGameOver(newBalls, newWickets);

      return {
        ...prev,
        runs:        newRuns,
        wickets:     newWickets,
        ballsBowled: newBalls,
        lastOutcome: outcome,
        lastRuns:    runs,
        commentary,
        bestScore:   newBest,
        phase:       gameEnded ? GAME_PHASE.GAME_OVER : GAME_PHASE.RESULT,
      };
    });
  }, []);

  // ── After result flash, return to IDLE ───────────────────
  const acknowledgeResult = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== GAME_PHASE.RESULT) return prev;
      return { ...prev, phase: GAME_PHASE.IDLE };
    });
  }, []);

  // ── Restart game ─────────────────────────────────────────
  const restartGame = useCallback(() => {
    setState((prev) => ({
      ...buildInitialState(),
      bestScore: prev.bestScore,
    }));
  }, []);

  // ── Derived values (computed, not stored in state) ────────
  const derived = {
    ballsRemaining: ballsRemaining(state.ballsBowled),
    oversDisplay:   formatOvers(state.ballsBowled),
    strikeRate:     state.ballsBowled > 0
      ? ((state.runs / state.ballsBowled) * 100).toFixed(1)
      : '0.0',
    gameOver: state.phase === GAME_PHASE.GAME_OVER,
    canPlay:  state.phase === GAME_PHASE.IDLE || state.phase === GAME_PHASE.RESULT,
  };

  return {
    state,
    derived,
    actions: {
      selectBattingStyle,
      startDelivery,
      onBowlingComplete,
      playShot,
      acknowledgeResult,
      restartGame,
    },
  };
}
