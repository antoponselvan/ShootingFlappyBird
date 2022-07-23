import './style.css'
import $ from "jquery";
// sfb = Shooting Flappy Bird

// Main Variables defining game state
const game = {};
game.score = 0;
game.birdAlive = true;
game.sfb_upDelta = 1; // sfb position Inc with Up arrow use
game.sfb_dnDelta = 1; // sfb position Dec with Down arrow use
game.rockMoveRate = 0.1; // Rock speed (%screen / 0.01s)
game.genRockTimePeriod = 300; // Total count of 0.01s before Rock Generation
game.genRockTimeCount = 0;
game.sfb_pos = [25, 50];
game.rock_pos = [[90, 0], [75, 75]]


// RENDER function (defining state of Game) ---------------------------
const render = () => {
  $('.rock').remove();
  $('#scoreHolder').text("Score: "+ Math.round(game.score))
  let rPos = game.rock_pos[0]
  for (rPos of game.rock_pos){
      const $div = $('<div>').addClass('rock');
      $('.container_game').append($div);
      $div.css({'left': ((rPos[0])+"%"), 'top':(rPos[1]+"%")})
      console.log($('.container_game').css("height"))
  }
  $('#SFB').css({'left': ((game.sfb_pos[0])+"%"), 'top':(game.sfb_pos[1]+"%")})
  console.log(game.first_render);
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
    game.rock_pos.push([97, Math.random()*100])
  }

  complexityInc();
  render();
}

//Crash Check ------------------------------------------------
const crashCheck = () => {
  console.log("CrashChk")
}


// Complexity Increase (Rock Speed & Gen Rate)-------------------
const complexityInc = () => {
  console.log("Complexity Inc")
}

// Game Over Display Handling ---------------------------------
const gameOver = () => {
  console.log("Game Over Display Change")
}


// Up and Down Actions ----------------------------------------------
const sfb_up = () => {
  if (game.sfb_pos[1]>0) {game.sfb_pos[1]-=1}
  render();
}
const sfb_dn = () => {
  if (game.sfb_pos[1]<97) {game.sfb_pos[1]+=1}
  game.birdAlive = false;
  render();
}


// Initialize Game -----------------------------------------------------
const Initialize = () => { 
  game.timeStep = setInterval(time_step, 10);
  game.birdAlive = true;
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