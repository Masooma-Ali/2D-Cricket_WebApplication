// =============================================================
// CricketField.jsx
// Canvas-based 2D cricket field with bowling + batting animations.
// =============================================================

import React, { useRef, useEffect, useCallback } from 'react';
import { GAME_PHASE } from '../hooks/useGameState';
import { OUTCOMES } from '../utils/gameConstants';

const FIELD_W = 700;
const FIELD_H = 320;

export default function CricketField({ phase, lastOutcome, onBowlingComplete }) {
  const canvasRef   = useRef(null);
  const stateRef    = useRef({
    ballX: 580, ballY: 110,      // bowling start (bowler side)
    ballVisible: false,
    bowlingActive: false,
    batAngle: 0,                 // batting swing angle
    batSwinging: false,
    batSwingDir: 1,
    particles: [],               // boundary particles
  });
  const rafRef = useRef(null);

  // ── Draw helpers ─────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s   = stateRef.current;

    // ── Background sky ──────────────────────────────────
    const skyGrad = ctx.createLinearGradient(0, 0, 0, FIELD_H * 0.45);
    skyGrad.addColorStop(0, '#87CEEB');
    skyGrad.addColorStop(1, '#c8e8f0');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, FIELD_W, FIELD_H * 0.45);

    // ── Outfield ─────────────────────────────────────────
    const grassGrad = ctx.createLinearGradient(0, FIELD_H * 0.42, 0, FIELD_H);
    grassGrad.addColorStop(0, '#2d7a27');
    grassGrad.addColorStop(1, '#1a5e15');
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, FIELD_H * 0.42, FIELD_W, FIELD_H);

    // ── Pitch strip ──────────────────────────────────────
    ctx.fillStyle = '#c8a96e';
    ctx.fillRect(180, FIELD_H * 0.55, 340, 70);
    // Pitch crease lines
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    [195, 505].forEach(x => {
      ctx.beginPath(); ctx.moveTo(x, FIELD_H * 0.55);
      ctx.lineTo(x, FIELD_H * 0.55 + 70); ctx.stroke();
    });

    // ── Crowd (simple silhouettes) ────────────────────────
    drawCrowd(ctx);

    // ── Stumps (batsman end) ──────────────────────────────
    drawStumps(ctx, 200, FIELD_H * 0.55 + 5, 50);

    // ── Stumps (bowler end) ───────────────────────────────
    drawStumps(ctx, 490, FIELD_H * 0.55 + 5, 50);

    // ── Batsman sprite ────────────────────────────────────
    drawBatsman(ctx, 220, FIELD_H * 0.55 - 10, s.batAngle);

    // ── Bowler sprite ─────────────────────────────────────
    drawBowler(ctx, 510, FIELD_H * 0.55 - 10);

    // ── Ball ─────────────────────────────────────────────
    if (s.ballVisible) {
      ctx.save();
      const ballGrad = ctx.createRadialGradient(s.ballX - 3, s.ballY - 3, 1, s.ballX, s.ballY, 9);
      ballGrad.addColorStop(0, '#ff6b6b');
      ballGrad.addColorStop(1, '#c0392b');
      ctx.fillStyle = ballGrad;
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, 9, 0, Math.PI * 2);
      ctx.fill();
      // seam
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, 6, 0.3, Math.PI - 0.3);
      ctx.stroke();
      ctx.restore();
    }

    // ── Boundary particles ────────────────────────────────
    s.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // ── Phase overlay text ────────────────────────────────
    if (phase === GAME_PHASE.RESULT && lastOutcome) {
      drawResultOverlay(ctx, lastOutcome);
    }
  }, [phase, lastOutcome]);

  // ── Crowd ─────────────────────────────────────────────────
  function drawCrowd(ctx) {
    const colors = ['#e74c3c','#3498db','#f39c12','#2ecc71','#9b59b6','#1abc9c'];
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = colors[i % colors.length];
      const x = (i * 12) % FIELD_W;
      const row = Math.floor((i * 12) / FIELD_W);
      const y = 10 + row * 22;
      ctx.beginPath();
      ctx.arc(x + 5, y + 10, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(x + 2, y + 14, 6, 10);
    }
  }

  // ── Stumps ────────────────────────────────────────────────
  function drawStumps(ctx, x, y, h) {
    ctx.strokeStyle = '#f5deb3';
    ctx.lineWidth = 3;
    [-8, 0, 8].forEach(offset => {
      ctx.beginPath();
      ctx.moveTo(x + offset, y);
      ctx.lineTo(x + offset, y + h);
      ctx.stroke();
    });
    // bails
    ctx.strokeStyle = '#f5deb3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 10, y + 3);
    ctx.lineTo(x + 10, y + 3);
    ctx.stroke();
  }

  // ── Batsman ───────────────────────────────────────────────
  function drawBatsman(ctx, x, y, batAngle) {
    ctx.save();
    ctx.translate(x, y);

    // Body
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(-10, 0, 20, 35);

    // Helmet
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.arc(0, -10, 14, Math.PI, 0);
    ctx.fill();
    // Visor
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(-8, -5, 16, 6);

    // Pads
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(-12, 28, 8, 22);
    ctx.fillRect(4, 28, 8, 22);

    // Bat (rotates on swing)
    ctx.save();
    ctx.translate(12, 20);
    ctx.rotate((batAngle * Math.PI) / 180);
    ctx.fillStyle = '#a0522d';
    ctx.fillRect(-3, 0, 6, 30);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-3, 0, 6, 8);
    ctx.restore();

    ctx.restore();
  }

  // ── Bowler ────────────────────────────────────────────────
  function drawBowler(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(-1, 1); // mirror to face left

    // Body
    ctx.fillStyle = '#2980b9';
    ctx.fillRect(-10, 0, 20, 35);
    // Head
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.arc(0, -10, 12, 0, Math.PI * 2);
    ctx.fill();
    // Cap
    ctx.fillStyle = '#2980b9';
    ctx.beginPath();
    ctx.arc(0, -15, 12, Math.PI, 0);
    ctx.fill();

    ctx.restore();
  }

  // ── Result overlay ────────────────────────────────────────
  function drawResultOverlay(ctx, outcome) {
    const labels = {
      [OUTCOMES.WICKET]: { text: 'OUT!',   color: '#e74c3c' },
      [OUTCOMES.DOT]:    { text: 'DOT',    color: '#95a5a6' },
      [OUTCOMES.ONE]:    { text: '1 RUN',  color: '#f39c12' },
      [OUTCOMES.TWO]:    { text: '2 RUNS', color: '#2ecc71' },
      [OUTCOMES.THREE]:  { text: '3 RUNS', color: '#1abc9c' },
      [OUTCOMES.FOUR]:   { text: 'FOUR!',  color: '#3498db' },
      [OUTCOMES.SIX]:    { text: 'SIX!',   color: '#9b59b6' },
    };
    const info = labels[outcome] || { text: '', color: '#fff' };
    ctx.save();
    ctx.font = 'bold 52px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = info.color;
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 10;
    ctx.fillText(info.text, FIELD_W / 2, FIELD_H / 2 + 20);
    ctx.restore();
  }

  // ── Animation loop ────────────────────────────────────────
  useEffect(() => {
    const s = stateRef.current;
    let startTime = null;

    const loop = (ts) => {
      if (!startTime) startTime = ts;

      // ── Particle decay ──────────────────────────────────
      s.particles = s.particles
        .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.2, alpha: p.alpha - 0.02 }))
        .filter(p => p.alpha > 0);

      // ── Bat swing ───────────────────────────────────────
      if (s.batSwinging) {
        s.batAngle += s.batSwingDir * 8;
        if (s.batAngle > 80)  s.batSwingDir = -1;
        if (s.batAngle < -10) { s.batSwinging = false; s.batAngle = 0; }
      }

      draw();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  // ── Bowling animation trigger ─────────────────────────────
  useEffect(() => {
    if (phase !== GAME_PHASE.BOWLING) return;

    const s     = stateRef.current;
    s.ballX     = 490;
    s.ballY     = FIELD_H * 0.55 + 25;
    s.ballVisible = true;

    const targetX = 220;
    const targetY = FIELD_H * 0.55 + 25;
    const duration = 900; // ms
    const startX = s.ballX;
    const startY = s.ballY;
    const startT = performance.now();

    const animate = (now) => {
      const t = Math.min((now - startT) / duration, 1);
      // parabolic arc
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      s.ballX = startX + (targetX - startX) * eased;
      // slight arc upward
      const arcY = -30 * Math.sin(Math.PI * t);
      s.ballY = startY + (targetY - startY) * eased + arcY;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        s.ballVisible = false;
        onBowlingComplete && onBowlingComplete();
      }
    };
    requestAnimationFrame(animate);
  }, [phase, onBowlingComplete]);

  // ── Batting animation + particles on result ───────────────
  useEffect(() => {
    if (phase !== GAME_PHASE.RESULT || !lastOutcome) return;
    const s = stateRef.current;
    s.batSwinging = true;
    s.batSwingDir = 1;
    s.batAngle    = 0;

    // Spawn particles for boundaries
    if (lastOutcome === OUTCOMES.FOUR || lastOutcome === OUTCOMES.SIX) {
      const colors = ['#f1c40f','#e74c3c','#3498db','#2ecc71','#9b59b6'];
      for (let i = 0; i < 30; i++) {
        s.particles.push({
          x:     220 + Math.random() * 40 - 20,
          y:     FIELD_H * 0.55,
          vx:    (Math.random() - 0.5) * 8,
          vy:    -(Math.random() * 8 + 4),
          r:     Math.random() * 5 + 3,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }
  }, [phase, lastOutcome]);

  return (
    <canvas
      ref={canvasRef}
      width={FIELD_W}
      height={FIELD_H}
      style={{ width: '100%', borderRadius: '12px', display: 'block' }}
    />
  );
}
