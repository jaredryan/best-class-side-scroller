import { calculateFinalScore } from './scoring';

describe('calculateFinalScore', () => {
  it('awards full bonuses for a flawless, instant, max-level win', () => {
    const result = calculateFinalScore({
      playerHealth: 10,
      shotsFired: 10,
      successfulShotsFired: 10,
      timer: 0,
      level: 3,
    });
    expect(result.healthBonus).toBe(10000);
    expect(result.accuracyBonus).toBe(10000);
    expect(result.rushBonus).toBe(30000);
    expect(result.spiceBonus).toBe(60000);
    expect(result.finalScore).toBe(110000);
  });

  it('floors the rush bonus at zero after 60 seconds', () => {
    const result = calculateFinalScore({
      playerHealth: 0,
      shotsFired: 4,
      successfulShotsFired: 2,
      timer: 90000,
      level: 1,
    });
    expect(result.elapsedSeconds).toBe(90);
    expect(result.rushBonus).toBe(0);
  });

  it('does not divide by zero when no shots were fired', () => {
    const result = calculateFinalScore({
      playerHealth: 5,
      shotsFired: 0,
      successfulShotsFired: 0,
      timer: 1000,
      level: 2,
    });
    expect(result.accuracyPercent).toBe(0);
    expect(result.accuracyBonus).toBe(0);
  });
});
