module.exports = {
  ai: {
    maxSpeed: 10,
    reaction: 0.5,
    viewRange: 0.6,
    confusion:0.7
  },

  puck: {
    speed: 1.3,
    speedup: .1,
    maxspeed: 2
  },

  player: {
    shields: 2
  },

  set: 'empty',

  extras: [
    {id: 'extralife', probability: 1},
    {id: 'multiball', probability: 2},
    {id: 'fireball', round:2, probability: 4},
    {id: 'fog', round: 3, probability: 40},
    {id: 'ghostball', round: 4, probability: 60}
  ],

  positions: [
    {x: 200, y: 200},
    {x: 200, y: 2000},
    {x: 1400, y: 200},
    {x: 1400, y: 2000}
  ]
}