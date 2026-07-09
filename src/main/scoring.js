export const calculateFinalScore = ({
  playerHealth,
  shotsFired,
  successfulShotsFired,
  timer,
  level,
}) => {
  const healthBonus = playerHealth * 1000;

  const accuracyPercent = shotsFired ? successfulShotsFired / shotsFired : 0;
  const accuracyBonus = Math.round(accuracyPercent * 10000);

  const elapsedSeconds = Math.floor(timer / 1000);
  const rushBonus = Math.max(0, 30000 - elapsedSeconds * 500);

  const spiceBonus = level * 20000;

  const finalScore = healthBonus + accuracyBonus + rushBonus + spiceBonus;

  return {
    healthBonus,
    accuracyBonus,
    accuracyPercent,
    rushBonus,
    elapsedSeconds,
    spiceBonus,
    finalScore,
  };
};
