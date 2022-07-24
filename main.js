import './style.css'
import $ from "jquery";
// sfb = Shooting Flappy Bird

// Main Variables defining game state
const game = {};
game.score = 0;
game.birdAlive = true;
game.sfb_upDelta = 1; // sfb position Inc with Up arrow use
game.sfb_dnDelta = 1; // sfb position Dec with Down arrow use
game.rockMoveRate = 0.5; // Rock speed (%screen / 0.01s)
game.genRockTimePeriod = 100; // Total count of 0.01s before Rock Generation
game.genRockTimeCount = 0;
game.sfb_pos = [25, 50];
game.rock_pos = [[90, 10], [75, 75]]


// RENDER function (defining state of Game) ---------------------------
const render = () => {
  $('.rock').remove();
  if (game.birdAlive) {$('#scoreHolder').text("Score: "+ Math.round(game.score))}
  else {$('#scoreHolder').text("Game Over! Final Score: "+ Math.round(game.score))}
  let rPos = game.rock_pos[0]
  for (rPos of game.rock_pos){
      const $div = $('<div>').addClass('rock');
      $('.container_game').append($div);
      $div.css({'left': ((rPos[0])+"%"), 'top':(rPos[1]+"%")})
  }
  $('#SFB').css({'left': ((game.sfb_pos[0])+"%"), 'top':(game.sfb_pos[1]+"%")})
}



// Time Step Function ----------------------------------
const time_step = () => {
  
  // Move Rocks
  game.rock_pos.forEach( (item, idx, arr) => {
    arr[idx][0]-=game.rockMoveRate;
    if (arr[idx][0] < 0){
      arr.splice(idx,1)
    }
  })

  // Increment Score
  game.score += 0.01

  // Check if Game Over
  crashCheck();
  
  if (!(game.birdAlive)) {
    clearInterval(game.timeStep);
    gameOver();
  }

  // Generate New Rocks
  game.genRockTimeCount +=1
  if (game.genRockTimeCount > game.genRockTimePeriod){
    game.genRockTimeCount = 0;
    let sfbPosFrac = (parseFloat($('#SFB').css('top'))/parseFloat($('.container_game').css('height')));
    game.rock_pos.push([97, (100*sfbPosFrac*(1 + Math.random()*0.1))-10])
  }

  complexityInc();
  render();
}

//Crash Check ------------------------------------------------
const crashCheck = () => {
  let sfbTop = parseFloat($('#SFB').css("top"));
  let sfbLeft = parseFloat($('#SFB').css("left"));
  let sfbHeight = parseFloat($('#SFB').css("height"));
  let sfbWidth = parseFloat($('#SFB').css("width"));
  let containerHeight = parseFloat($('.container_game').css("height"));
  console.log(containerHeight);

  for (let i in game.rock_pos){
    let rockTop = parseFloat($('.rock').eq(i).css("top"));
    let rockLeft = parseFloat($('.rock').eq(i).css("left"));
    let rockHeight = parseFloat($('.rock').eq(i).css("height"));
    let rockWidth = parseFloat($('.rock').eq(i).css("width"));

    let pt1Collide = ((sfbTop > rockTop) & (sfbTop < (rockTop+rockHeight)) & (sfbLeft > rockLeft) & (sfbLeft < (rockLeft+rockWidth)))
    let pt2Collide = (((sfbTop+sfbHeight) > rockTop) & ((sfbTop+sfbHeight) < (rockTop+rockHeight)) & (sfbLeft > rockLeft) & (sfbLeft < (rockLeft+rockWidth)))
    let pt3Collide = ((sfbTop > rockTop) & (sfbTop < (rockTop+rockHeight)) & ((sfbLeft+sfbWidth) > rockLeft) & ((sfbLeft+sfbWidth) < (rockLeft+rockWidth)))
    let pt4Collide = (((sfbTop+sfbHeight) > rockTop) & ((sfbTop+sfbHeight) < (rockTop+rockHeight)) & ((sfbLeft+sfbWidth) > rockLeft) & ((sfbLeft+sfbWidth) < (rockLeft+rockWidth)))
    let borderCollide = (sfbTop < 1) || (sfbTop > 0.95*containerHeight);

    if (pt1Collide || pt2Collide || pt3Collide || pt4Collide || borderCollide) {
      game.birdAlive = false;
      gameOver();
      return;
    }
  }
}


// Complexity Increase (Rock Speed & Gen Rate)-------------------
const complexityInc = () => {
  console.log("Complexity Inc");
  game.rockMoveRate += 0.0001;
  game.genRockTimePeriod -= 0.01;
}

// Game Over Display Handling ---------------------------------
const gameOver = () => {
  console.log("Game Over Display Change")
  $('#startStop').text("START");
  game.rock_pos = [[100,0]];
  $('#scoreHolder').text(" GAME OVER!!   FINAL SCORE:"+game.score);
}


// Up and Down Actions ----------------------------------------------
const sfb_up = () => {
  if (game.sfb_pos[1]>0) {game.sfb_pos[1]-=1}
  render();
}
const sfb_dn = () => {
  if (game.sfb_pos[1]<97) {game.sfb_pos[1]+=1}
  render();
}


// Initialize Game -----------------------------------------------------
const Initialize = () => { 

  if (game.timeStep) {clearInterval(game.timeStep);}
  game.timeStep = setInterval(time_step, 10);
  game.birdAlive = true;
  game.score = 0;
  game.rockMoveRate = 0.1; // Rock speed (%screen / 0.01s)
  game.genRockTimePeriod = 300; // Total count of 0.01s before Rock Generation
  game.genRockTimeCount = 0;
  game.sfb_pos = [25, 50];
  game.rock_pos = [[90, 10], [75, 75]]
  $('#startStop').text("RESET")
  }


// MAIN FUNCTION --------------------------------------------------
const main = () => { 
  $('#SFB').css({'top': '80%', 'left':'25%'});
  $('.button_UP').on('click', sfb_up);
  $('.button_DN').on('click', sfb_dn);

  $('body').on("keydown", (event) => {
     if ((event.code === "ArrowUp")){sfb_up()}
    if ((event.code === "ArrowDown")){sfb_dn()}
  })
  
  $('#startStop').on("click", Initialize)
  render();  
}

$(main);