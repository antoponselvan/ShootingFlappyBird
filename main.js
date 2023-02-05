
import './style.css'
import $ from "jquery";

// Import Images - 
import missileInhibitImg from './img/imgMissileIconButtonInhibit.png'
import missileActiveImg from './img/imgMissileIconButton_v2.png'

// Main Variables defining game state ---------------------------------------------------------------------
const game = {};
// Programmer Tuning Varaibles
game.birdUpDelta = 4; // Bird position Inc with Up arrow use
game.birdDnDelta = 4; // Bird position Dec with Down arrow use
game.missileMoveRate = 0.5; // Missile speed (%screen / 0.01s)
game.genMissileTimePeriod = 500; // Total count of 0.01s before Rock Generation
game.rockMoveRateInc = 0.0001; // Complexity Increase - Rate of inc in rock speed (%screen / 0.01s)
game.genRockTimePeriodDec = 0.02; // Complexity Increase - Rate of dec in rock gen time period (Count of 0.01s before new rock gen)

// Initialize Game --------------------------------------------------------------------------------
const Initialize = () => { 
  
  if (game.upButtonFn) {clearInterval(game.upButtonFn)}
  if (game.dwnButtonFn) {clearInterval(game.dwnButtonFn)}
  if (game.timeStep) {clearInterval(game.timeStep);}
  game.timeStep = setInterval(timeStep, 10);
  
  // Initialize Score and time count
  game.score = 0;
  game.timePassed = 0;
  if (game.upButtonFn) {clearInterval(game.upButtonFn);}
  // while (game.upButtonFn){
  //   clearInterval(game.upButtonFn);
  // }
  if (game.dwnButtonFn) {clearInterval(game.dwnButtonFn);}

  // Initialize position & status of items on game board (Rock, Missile, Bird)
  game.genRockTimeCount = 0; // Cuurent count since last rock generation
  game.genMissileTimeCount = game.genMissileTimePeriod; // Time count since last missile generated
  game.birdPos = [25, 50]; // Position of Bird (left, top)
  game.birdFallRate = 0.025 // Bird speed of natural fall
  game.rockPos = [[90, 10], [75, 75]] // Position of Rocks (left, top)
  game.grndRockStartPos = 0;
  game.missilePosHt = [-1, -1, 0]; //left, top, Height
  game.missileActive = false;
  game.birdAlive = true;

  // Initialize Complexity Level
  game.rockMoveRate = 0.3; // Rock speed (%screen / 0.01s)
  game.genRockTimePeriod = 160; // Total count of 0.01s before Rock Generation

  console.log("upbutton", game.upButtonFn)
}


// RENDER function (defining state of Game) ------------------------------------------------------
const render = () => {

  // Score display
  if (game.birdAlive) {
    $('#scoreHolder').text("Score: "+ Math.round(game.score));
    $('#scoreHolder').css("color","white");
    $('#startStop').text("RESET");
    if (game.score < 0.1){
      $('#bgMusic')[0].load();
      $('#bgMusic')[0].play();
      $('#bird').css("animation-iteration-count","infinite");
    }
  } else {
    if (game.score > 0.1){
      $('#scoreHolder').text("Game Over! Final Score: "+ Math.round(game.score))
    }
    $('#scoreHolder').css("color","rgb(255,250,0)")
    $('#startStop').text("START");
    $('#bgMusic')[0].pause();
    $('#gameOverMusic')[0].play();
    $('#bird').css("animation-iteration-count","0");

  }
  
  // Rock display
  $('.rock').remove();
  let rPos = game.rockPos[0]
  for (rPos of game.rockPos){
      const $div = $('<div>').addClass('rock');
      $('.containerGame').append($div);
      $div.css({'left': ((rPos[0])+"%"), 'top':(rPos[1]+"%")})
  }

  // bird & Missile display
  $('#bird').css({'left': ((game.birdPos[0])+"%"), 'top':(game.birdPos[1]+"%")})
  $('#missile').css({'left': ((game.missilePosHt[0])+"%"), 'top':(game.missilePosHt[1]+"%"), 'height':(game.missilePosHt[2]+"%")})
  if (game.missileActive){
    $('#bgMusic')[0].pause();
    $('#missileLaunchMusic')[0].play();
  } else if (game.birdAlive & !(game.missileActive)) {
    $('#bgMusic')[0].play();
  }

  // Missile Inhibit time display
  let missileInhbitTime = Math.round((game.genMissileTimePeriod - game.genMissileTimeCount)/100)
  $('.missileTime').remove();
  if (missileInhbitTime <= 0) {
    missileInhbitTime = 0;
    $('.buttonMissile').children("img").attr('src',missileActiveImg);
  }  
  else {
    $('.buttonMissile').append($('<h3 class="missileTime">').text(missileInhbitTime));
    $('.buttonMissile').children("img").attr('src',missileInhibitImg);
  }

  //Ground Rock Animation
  let groundRockEndLeft = game.grndRockStartPos;
  $('.groundRock').remove();
  while (groundRockEndLeft < 100) {
    let $grndRock = $('<div>').addClass('groundRock').css("left", groundRockEndLeft+"%")
    $('.containerGame').append($grndRock);
    groundRockEndLeft +=5;
  }
}


// Time Step Function ---------------------------------------------------------------------------------
const timeStep = () => {
  
  // Move Rocks
  game.rockPos.forEach( (item, idx, arr) => {
    arr[idx][0]-=game.rockMoveRate;
    if (arr[idx][0] < 0){
      arr.splice(idx,1)
    }
  })

  // Move Ground Rock
  game.grndRockStartPos -= game.rockMoveRate;
  if (game.grndRockStartPos < -5) {game.grndRockStartPos = 0}

  // Move Missile
  if (game.missileActive){game.missilePosHt[0] += game.missileMoveRate;}
  game.genMissileTimeCount += 1;

  // Generate New Rocks
  game.genRockTimeCount +=1
  if (game.genRockTimeCount > game.genRockTimePeriod){
    game.genRockTimeCount = 0;
    let birdPosFrac = (parseFloat($('#bird').css('top'))/parseFloat($('.containerGame').css('height')));
    let rockPosFrac = birdPosFrac +(Math.random()-0.5)*0.8;
    if (rockPosFrac > 0.9) {rockPosFrac = 0.9;}
    if (rockPosFrac < 0) {rockPosFrac = 0;}
    game.rockPos.push([97, (100*rockPosFrac)]);
  }

  // Move Bird down
  game.birdPos[1] +=game.birdFallRate;
  game.birdFallRate *= 1.03 

  // Increment Score & Time passed
  game.score += (game.rockMoveRate)*0.1
  game.timePassed += 0.01; // Time passed in sec

  // Check if Game Over or missile Hit
  birdHitCheck();
  missileHitCheck();  
  if (!(game.birdAlive)) {clearInterval(game.timeStep)}

  complexityInc();
  render();
}

//Bird Crash Check ------------------------------------------------------------------
const birdHitCheck = () => {
  let birdTop = parseFloat($('#bird').css("top"));
  let birdLeft = parseFloat($('#bird').css("left"));
  let birdHeight = parseFloat($('#bird').css("height"));
  let birdWidth = parseFloat($('#bird').css("width"));
  let containerHeight = parseFloat($('.containerGame').css("height"));

  let borderCollide = (birdTop < 1) || (birdTop > 0.95*containerHeight);
  if (borderCollide) {
    game.birdAlive = false;
    game.rockPos = [[100,0]];
    return;
  }

  for (let i in game.rockPos){
    let rockTop = parseFloat($('.rock').eq(i).css("top"));
    let rockLeft = parseFloat($('.rock').eq(i).css("left"));
    let rockHeight = parseFloat($('.rock').eq(i).css("height"));
    let rockWidth = parseFloat($('.rock').eq(i).css("width"));

    let pt1Collide = ((birdTop > rockTop) & (birdTop < (rockTop+rockHeight)) & (birdLeft > rockLeft) & (birdLeft < (rockLeft+rockWidth)))
    let pt2Collide = (((birdTop+birdHeight) > rockTop) & ((birdTop+birdHeight) < (rockTop+rockHeight)) & (birdLeft > rockLeft) & (birdLeft < (rockLeft+rockWidth)))
    let pt3Collide = ((birdTop > rockTop) & (birdTop < (rockTop+rockHeight)) & ((birdLeft+birdWidth) > rockLeft) & ((birdLeft+birdWidth) < (rockLeft+rockWidth)))
    let pt4Collide = (((birdTop+birdHeight) > rockTop) & ((birdTop+birdHeight) < (rockTop+rockHeight)) & ((birdLeft+birdWidth) > rockLeft) & ((birdLeft+birdWidth) < (rockLeft+rockWidth)))
    
    if (pt1Collide || pt2Collide || pt3Collide || pt4Collide) {
      game.birdAlive = false;
      game.rockPos = [[100,0]];
      return;
    }
  }
  
}

//Missile Hit Check -------------------------------------------------------------------
const missileHitCheck = () => {
  let missileTop = parseFloat($('#missile').css("top"));
  let missileLeft = parseFloat($('#missile').css("left"));
  let missileHeight = parseFloat($('#missile').css("height"));
  let missileWidth = parseFloat($('#missile').css("width"));
  let containerWidth = parseFloat($('.containerGame').css("width"));

  let borderCollide = (missileLeft > 0.95*containerWidth);
  if (borderCollide) {
    game.missileActive = false;
    game.missilePosHt = [-1, -1, 0];
    return;
  }

  for (let i in game.rockPos){
    let rockTop = parseFloat($('.rock').eq(i).css("top"));
    let rockLeft = parseFloat($('.rock').eq(i).css("left"));
    let rockHeight = parseFloat($('.rock').eq(i).css("height"));
    let rockWidth = parseFloat($('.rock').eq(i).css("width"));

    let pt1Collide = ((missileTop > rockTop) & (missileTop < (rockTop+rockHeight)) & (missileLeft > rockLeft) & (missileLeft < (rockLeft+rockWidth)))
    let pt2Collide = (((missileTop+missileHeight) > rockTop) & ((missileTop+missileHeight) < (rockTop+rockHeight)) & (missileLeft > rockLeft) & (missileLeft < (rockLeft+rockWidth)))
    let pt3Collide = ((missileTop > rockTop) & (missileTop < (rockTop+rockHeight)) & ((missileLeft+missileWidth) > rockLeft) & ((missileLeft+missileWidth) < (rockLeft+rockWidth)))
    let pt4Collide = (((missileTop+missileHeight) > rockTop) & ((missileTop+missileHeight) < (rockTop+rockHeight)) & ((missileLeft+missileWidth) > rockLeft) & ((missileLeft+missileWidth) < (rockLeft+rockWidth)))    

    if (pt1Collide || pt2Collide || pt3Collide || pt4Collide) {
      game.missileActive = false;
      game.missilePosHt = [-1, -1, 0];
      game.rockPos.splice(i,1);
      return;
    }
  }
  
}

// Complexity Increase (Rock Speed & Gen Rate)-----------------------------------------------------
const complexityInc = () => {
  game.rockMoveRate += game.rockMoveRateInc;
  game.genRockTimePeriod -= game.genRockTimePeriodDec;
}

//!User Actions (Up, Down, Missile-Launch) --------------------------------------------------------
const birdMoveUp = () => {
  if (game.birdAlive === false) {return}
  if (game.birdPos[1]>0) {game.birdPos[1]-=game.birdUpDelta}
  game.birdFallRate = 0.025;
  render();
}
const birdMoveDn = () => {
  if (game.birdAlive === false) {return}
  if (game.birdPos[1]<97) {game.birdPos[1]+=game.birdDnDelta}
  render();
}
const missileLaunch = () => {
  if (game.birdAlive === false) {return}
  if ((game.missileActive === true)||(game.genMissileTimeCount < game.genMissileTimePeriod)) {return;}
  game.missileActive = true;
  game.missilePosHt = [(game.birdPos[0]+5), game.birdPos[1], 5];
  game.genMissileTimeCount = 0;
  render();
}
// const birdUpButtonMouseDown = () => {
//   if (game.birdAlive === false) {return}
//   if (!game.upButtonFn) {game.upButtonFn = setInterval(birdMoveUp, 25*game.birdUpDelta);}
//   if (game.dwnButtonFn) {clearInterval(game.dwnButtonFn);}
//   console.log("upbutton",game.upButtonFn)
// }
// const birdUpButtonMouseOutRelease = () => {
//   if (game.birdAlive === false) {return}
//   if (game.upButtonFn) {clearInterval(game.upButtonFn);}
// }
// const birdDnButtonMouseDown = () => {
//   if (game.birdAlive === false) {return}
//   game.dwnButtonFn = setInterval(birdMoveDn, 25*game.birdDnDelta);
//   if (game.upButtonFn) {clearInterval(game.upButtonFn);}
// }
// const birdDnButtonMouseOutRelease = () => {
//   if (game.birdAlive === false) {return}
//   if (game.dwnButtonFn) {clearInterval(game.dwnButtonFn);}
// }



// MAIN FUNCTION --------------------------------------------------
const main = () => { 
  $('#bird').css({'top': '80%', 'left':'25%'});
  $('.buttonUP').on('mousedown', birdMoveUp);
  // $('.buttonUP').on('mousedown', birdUpButtonMouseDown);
  // $('.buttonUP').on('mouseout', birdUpButtonMouseOutRelease);  
  // $('.buttonUP').on('mouseup', birdUpButtonMouseOutRelease);
  $('.buttonUP').on('touchstart', birdMoveUp);
  // $('.buttonUP').on('touchstart', birdUpButtonMouseDown);
  // $('.buttonUP').on('touchend', birdUpButtonMouseOutRelease); 
  // $('.containerGame').on('touchstart', birdUpButtonMouseDown);
  // $('.containerGame').on('touchend', birdUpButtonMouseOutRelease);  
  $('.containerGame').on('touchstart', birdMoveUp);
  // $('.containerGame').on('touchend', birdUpButtonMouseOutRelease);  

  $('.buttonDN').on('mousedown', birdMoveDn);
  // $('.buttonDN').on('mousedown', birdDnButtonMouseDown);
  // $('.buttonDN').on('mouseout', birdDnButtonMouseOutRelease);  
  // $('.buttonDN').on('mouseup', birdDnButtonMouseOutRelease);
  
  $('.buttonMissile').on('click', missileLaunch)

  $('body').on("keydown", (event) => {
    if ((event.code === "ArrowUp")){birdMoveUp()}
    if ((event.code === "ArrowDown")){birdMoveDn()}
    if ((event.code === "ArrowRight")){missileLaunch()}
  })
  
  $('#startStop').on("click", Initialize);
  Initialize();
  game.birdAlive = false;
  render(); 
}

$(main);