const wave0 = [
  {
    height: 29,
    width: 50,
    left: 580,
    top: 35,
    health: 1,
    type: "ufo",
    moveTimer: Math.random(),
    shootTimer: Math.random(),
  },
  {
    height: 29,
    width: 50,
    left: 580,
    top: 155,
    health: 1,
    type: "ufo",
    moveTimer: Math.random(),
    shootTimer: Math.random(),
  },
  {
    height: 29,
    width: 50,
    left: 580,
    top: 275,
    health: 1,
    type: "ufo",
    moveTimer: Math.random(),
    shootTimer: Math.random(),
  },
  {
    height: 50,
    width: 35,
    left: 530,
    top: 295,
    health: 1,
    type: "girl",
    moveTimer: Math.random(),
    shootTimer: Math.random(),
  },
  {
    height: 50,
    width: 34,
    left: 530,
    top: 15,
    health: 1,
    type: "ironman",
    moveTimer: Math.random(),
    shootTimer: Math.random(),
  },
];
const wave1 = [
  {
    height: 29,
    width: 50,
    left: 555,
    top: 35,
    health: 2,
    type: "ufo",
    moveTimer: Math.random(),
    shootTimer: Math.random(),
  },
  {
    height: 29,
    width: 50,
    left: 555,
    top: 155,
    health: 2,
    type: "ufo",
    moveTimer: Math.random(),
    shootTimer: Math.random(),
  },
  {
    height: 29,
    width: 50,
    left: 555,
    top: 275,
    health: 2,
    type: "ufo",
    moveTimer: Math.random(),
    shootTimer: Math.random(),
  },
  {
    height: 50,
    width: 35,
    left: 530,
    top: 295,
    health: 2,
    type: "girl",
    moveTimer: Math.random(),
    shootTimer: Math.random(),
  },
  {
    height: 50,
    width: 34,
    left: 530,
    top: 15,
    health: 2,
    type: "ironman",
    moveTimer: Math.random(),
    shootTimer: Math.random(),
  },
];
const wave2 = [
  {
    height: 29,
    width: 50,
    left: 530,
    top: 35,
    health: 3,
    type: "ufo",
    moveTimer: Math.random(),
    shootTimer: Math.random(),
  },
  {
    height: 29,
    width: 50,
    left: 530,
    top: 155,
    health: 3,
    type: "ufo",
    moveTimer: Math.random(),
    shootTimer: Math.random(),
  },
  {
    height: 29,
    width: 50,
    left: 530,
    top: 275,
    health: 3,
    type: "ufo",
    moveTimer: Math.random(),
    shootTimer: Math.random(),
  },
  {
    height: 50,
    width: 35,
    left: 530,
    top: 295,
    health: 3,
    type: "girl",
    moveTimer: Math.random(),
    shootTimer: Math.random(),
  },
  {
    height: 50,
    width: 34,
    left: 530,
    top: 15,
    health: 3,
    type: "ironman",
    moveTimer: Math.random(),
    shootTimer: Math.random(),
  },
];

const wave3 = false;

const wave4 = false;

const generateWaves = () => ({
  wave0: wave0.slice(),
  wave1: wave1.slice(),
  wave2: wave2.slice(),
  wave3,
  wave4,
});

let waves = generateWaves();

export const useWave = (number) => {
  const wave = waves[`wave${number}`];
  waves[`wave${number}`] = false;
  return wave;
};

export const resetLevel = () => {
  waves = generateWaves();
};

export default {
  useWave,
  resetLevel,
}
