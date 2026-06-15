import type { ClassData } from '../types/class.types';

export const MOCK_CLASSES: ClassData[] = [
  {
    gradeSection: "TLE 8 - CAPISTRANO",
    subject: "TLE",
    highestPossibleScores: {
      ww1: 15,
      ww2: 15,
      ww3: 15
    },
    males: [
      { id: 1, name: "Alvarez, Ronan L.", ww1: 12, ww2: 8, ww3: 15 },
      { id: 2, name: "Amarillo, Marion Reed C.", ww1: 14, ww2: 9, ww3: 14 },
      { id: 3, name: "Apolinario, Czech Yuki R.", ww1: 13, ww2: 7, ww3: 15 },
    ],
    females: [
      { id: 4, name: "Alfonzo, Maria Leofenda A.", ww1: 15, ww2: 10, ww3: 14 },
      { id: 5, name: "Burgos, Yuna Angeliqa D.", ww1: 12, ww2: 8, ww3: 13 },
      { id: 6, name: "Calisto, Reign Solaria V.", ww1: 15, ww2: 10, ww3: 15 },
    ]
  },
  {
    gradeSection: "MATH 10 - RIZAL",
    subject: "MATH",
    highestPossibleScores: {
      ww1: 20,
      ww2: 20,
      ww3: 20
    },
    males: [
      { id: 7, name: "Bautista, Ken M.", ww1: 18, ww2: 19, ww3: 17 },
      { id: 8, name: "Casimiro, Jon N.", ww1: 15, ww2: 14, ww3: 16 },
    ],
    females: [
      { id: 9, name: "Domingo, Sarah P.", ww1: 20, ww2: 19, ww3: 20 },
      { id: 10, name: "Escobar, Ria J.", ww1: 17, ww2: 16, ww3: 18 },
    ]
  },
  {
    gradeSection: "ENG 9 - CHRYSANTHEMUM",
    subject: "ENGLISH",
    highestPossibleScores: {
      ww1: 10,
      ww2: 10,
      ww3: 10
    },
    males: [
      { id: 11, name: "Fausto, Leon B.", ww1: 9, ww2: 8, ww3: 9 },
      { id: 12, name: "Gomez, Paulo K.", ww1: 7, ww2: 9, ww3: 8 },
    ],
    females: [
      { id: 13, name: "Hernandez, Bea C.", ww1: 10, ww2: 10, ww3: 9 },
      { id: 14, name: "Ignacio, Clara M.", ww1: 8, ww2: 8, ww3: 10 },
    ]
  }
];
