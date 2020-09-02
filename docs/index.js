var board = document.querySelector('#board');

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
var worker = new Worker('eight-queens.js');

document.querySelector('#status').textContent = "Searching...";

worker.onmessage = function(e){
  var message = e.data;

  if(message != 'done'){
    console.log(e.data);

    var queens = e.data;

    drawTable(queens);
    solutionCount++;

    setTimeout(function(){
      var li = document.createElement('li');
      var a = document.createElement('a');

      a.href = '#';
      a.onclick = drawTable.bind(drawTable, queens);
      a.text = queens.join(', ');
      li.appendChild(a);
      document.querySelector('#solutions').append(li);

      document.querySelector('#status').textContent = `Searching... ${solutionCount} solutions so far.`;
    }, 0)
  }else{
    document.querySelector('#status').textContent = `Done searching. ${solutionCount} solutions found.`;
  }
}