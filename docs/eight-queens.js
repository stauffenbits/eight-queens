importScripts(['https://cdn.jsdelivr.net/npm/js-combinatorics@0.5'])

var Field = class {
  constructor(i){
    
    this.index = i;
    
    // every field has between three and eight neighbors. 
    this.neighbors = {
      'up': Math.floor(i / 8) > 0 ? i - 8 : undefined,
      'down': Math.floor(i / 8) < 7 ? i + 8 : undefined,
      'left': i % 8 > 0 ? i - 1 : undefined,
      'right': i % 8 < 7 ? i + 1 : undefined,
      'up-left': (Math.floor(i / 8) > 0) && (i % 8 > 0) ? i - 9 : undefined,
      'up-right': (Math.floor(i / 8) > 0) && (i % 8 < 7) ? i - 7 : undefined,
      'down-left': (Math.ceil(i / 8) < 7) && (i % 8 > 0) ? i + 7 : undefined,
      'down-right': (Math.ceil(i / 8) < 7) && (i % 8 < 7) ? i + 9 : undefined
    }
  }
}

var range = function(from, till, what_fn){
  var arr = [];
  for(var i=from; i<=till; i++){
    arr.push(what_fn(i));
  }

  return arr;
}

var Board = class {
  constructor(){
    this.fields = range(0, 63, (i) => {
      return new Field(i)
    })
  }
  
  traverse(index, direction){
    var path = [];
    
    while(index !== undefined){
      path.push(index);
      index = this.fields[index].neighbors[direction];
    }
    
    return path;
  }
  
  threatened(index){
    var field = this.fields[index];
    var t = [
      ...this.traverse(index, 'up'),
      ...this.traverse(index, 'down'),
      ...this.traverse(index, 'left'),
      ...this.traverse(index, 'right'),
      ...this.traverse(index, 'up-left'),
      ...this.traverse(index, 'up-right'),
      ...this.traverse(index, 'down-left'),
      ...this.traverse(index, 'down-right')
    ];
    
    return new Set(t)
  }
}

var board = new Board()

var q0 = range(0, 27, i => i).filter(i => i % 8 < 4)
var q1 = range(4, 32, i => i).filter(i => i % 8 >= 4)
var q2 = range(32, 59, i => i).filter(i => i % 8 < 4)
var q3 = range(36, 63, i => i).filter(i => i % 8 >= 4)

Object.defineProperty(Array.prototype, 'flat', {
  value: function(depth = 1) {
    return this.reduce(function (flat, toFlatten) {
      return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
    }, []);
  }
});

var C = Combinatorics;

var q_combos = [q0, q1, q2, q3].map(q => [...C.bigCombination(q, 2).filter(fields => {
  return fields !== undefined && !board.threatened(fields[0]).has(fields[1]);
})])

var potentials = C.cartesianProduct(...q_combos).lazyFilter(potential => {
  return potential.flat().every(i => {
    return potential.flat().filter(j => j != i).every(j => {
      return !board.threatened(i).has(j)
    })
  })
})


var solutions = [];

var i = 0;
var queens;

while(queens = potentials.next()){
  queens = queens.flat();
  postMessage(queens);
}

postMessage('done')
