export const MOVES = {
  U: {
    axis: "y",
    value: 1,
    direction: -1,
    turns: 1
  },

  "U'": {
    axis: "y",
    value: 1,
    direction: 1,
    turns: 1
  },

  U2: {
    axis: "y",
    value: 1,
    direction: -1,
    turns: 2
  },

  D: {
    axis: "y",
    value: -1,
    direction: 1,
    turns: 1
  },

  "D'": {
    axis: "y",
    value: -1,
    direction: -1,
    turns: 1
  },

  D2: {
    axis: "y",
    value: -1,
    direction: -1,
    turns: 2
  },

  R: {
    axis: "x",
    value: 1,
    direction: -1,
    turns: 1
  },

  "R'": {
    axis: "x",
    value: 1,
    direction: 1,
    turns: 1
  },

  R2: {
    axis: "x",
    value: 1,
    direction: -1,
    turns: 2
  },

  L: {
    axis: "x",
    value: -1,
    direction: 1,
    turns: 1
  },

  "L'": {
    axis: "x",
    value: -1,
    direction: -1,
    turns: 1
  },

  L2: {
    axis: "x",
    value: -1,
    direction: -1,
    turns: 2
  },

  F: {
    axis: "z",
    value: 1,
    direction: -1,
    turns: 1
  },

  "F'": {
    axis: "z",
    value: 1,
    direction: 1,
    turns: 1
  },

  F2: {
    axis: "z",
    value: 1,
    direction: -1,
    turns: 2
  },

  B: {
    axis: "z",
    value: -1,
    direction: 1,
    turns: 1
  },

  "B'": {
    axis: "z",
    value: -1,
    direction: -1,
    turns: 1
  },

  B2: {
    axis: "z",
    value: -1,
    direction: -1,
    turns: 2
  }
};

export const MOVE_NAMES = [
  "R","R'","R2",
  "U","U'","U2",
  "F","F'","F2",
  "D","D'","D2",
  "L","L'","L2",
  "B","B'","B2"
];