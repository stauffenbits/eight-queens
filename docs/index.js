var board = document.querySelector('#board');
var worker = new Worker('eight-queens.js');

var board = document.querySelector('#board');

var fields = document.querySelectorAll('td');
[...fields].forEach((field, i) => {
  field.fieldIndex = i;
})

var drawQueen = function(sel){
  setTimeout(function(){
    board.querySelector(sel).classList.remove('field');
    board.querySelector(sel).classList.add('queen');
  }, 0)
}

var drawTable = function(queens){
  board.querySelectorAll('td.queen').forEach(field => {
    field.classList.remove('queen');
    field.classList.add('field');
  })

  queens.forEach(function(queen, i){
    var pos = [Math.floor(queen / 8) + 1, (queen % 8) + 1];
    var selector = `tr:nth-child(${pos[0]}) td:nth-child(${pos[1]})`;
    drawQueen(selector);
  })
}

var solutionCount = 0;

var queens = [];

var toggleQueen = function(field){
  if(field.classList.contains('field')){
    field.classList.remove('field');
    field.classList.add('queen');

    queens.push(field.fieldIndex);
  }else{
    field.classList.add('field');
    field.classList.remove('queen');

    delete queens[queens.indexOf(field.fieldIndex)];
  }

  worker.postMessage({command: 'check', potential: queens.filter(x => x)});
}

var fields = document.querySelectorAll('.field');
[...fields].map(function(field){
  field.addEventListener('click', function(e){
    toggleQueen(e.target)
  })
})

var clearBoard = function(){
  [...fields].forEach(field => {
    field.classList.remove('queen');
  })
}

var status = document.querySelector('.status-label');
status.innerHTML = `Is free of conflict: ✓`;

var complete = document.querySelector('.complete-label');
complete.innerHTML = `Is complete: ✗`;

var listSolution = function(queens){
  if(!(queens instanceof Array)) return;
  
  var li = document.createElement('li');
  var a = document.createElement('a');

  a.href = '#';
  a.onclick = drawTable.bind(drawTable, queens);
  a.text = queens.filter(x => x).join(', ');
  li.appendChild(a);
  document.querySelector('#solutions').append(li);
}

var S = window.localStorage;

var saveSolution = function(queens){
  if(!(queens instanceof Array)) return;
  
  var solutions = JSON.parse(S.getItem('solutions'));
  if(!solutions){
    solutions = [];
  }
  solutions.push(queens);
  
  S.setItem('solutions', JSON.stringify(solutions));
}

var loadSolutions = function(){
  var solutions = JSON.parse(S.getItem('solutions'));
  
  if(!solutions){
    solutions = [];
  }
  
  for(var queens of solutions){
    listSolution(queens);
  }
}

loadSolutions();

worker.onmessage = function(e){
  var status = document.querySelector('.status-label');
  status.innerHTML = `Is free of conflict: ${e.data.isSolution ? "✓" : "✗"}`;

  var complete = document.querySelector('.complete-label');
  complete.innerHTML = `Is complete: ${e.data.isComplete ? "✓" : "✗"}`;

  if(e.data.isSolution && e.data.isComplete){
    listSolution(e.data.solution.filter(x => x));
    saveSolution(e.data.solution.filter(x => x));
  }
}
