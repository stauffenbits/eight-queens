var drawQueen = function(sel){
  setTimeout(function(){
    board.querySelector(sel).classList.add('queen');
  }, 0)
}

var board = document.querySelector('#board');
var drawTable = function(queens){
  document.querySelectorAll('td.queen').forEach(field => {
    field.classList.remove('queen');
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
  if(e.data != 'done'){
    console.log(e.data);
    drawTable(e.data);
    solutionCount++;

    setTimeout(function(){
      var li = document.createElement('li');
      li.textContent = JSON.stringify(e.data);
      document.querySelector('#solutions').prepend(li);

      document.querySelector('#status').textContent = `Searching... ${solutionCount} solutions so far.`
    }, 0)
  }else{
    document.querySelector('#status').textContent = `Done searching. ${solutionCount} solutions found.`
  }
}