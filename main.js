// sfb = Shooting Flappy Bird
import './style.css'
import $ from "jquery";

// Import Images - 
import rockImg from "./img/rock5.png"
import birdUpImg from "./img/flappyBirdUp.png"
import birdDwnImg from "./img/flappyBirdDwn.png"
import birdParallelImg from "./img/flappyBirdParallel.png"
import missileInhibitImg from './img/imgMissileIconButtonInhibit.png'
import missileActiveImg from './img/imgMissileIconButton_v2.png'

// Main Variables defining game state ---------------------------------------------------------------------
const game = {};
// Programmer Tuning Varaibles
game.sfb_upDelta = 2; // sfb position Inc with Up arrow use
game.sfb_dnDelta = 1; // sfb position Dec with Down arrow use
game.missileMoveRate = 0.5; // Rock speed (%screen / 0.01s)
game.genMissileTimePeriod = 500; // Total count of 0.01s before Rock Generation

// Initialize Game --------------------------------------------------------------------------------
const Initialize = () => { 

  if (game.timeStep) {clearInterval(game.timeStep);}
  game.timeStep = setInterval(time_step, 10);
  if (game.upButtonFn) {clearInterval(game.upButtonFn)}
  if (game.dwnButtonFn) {clearInterval(game.dwnButtonFn)}
  
  // Initialize Score and time count
  game.score = 0;
  game.timePassed = 0;
  game.upButtonPressed = false;

  // Initialize position & status of items on game board (Rock, Missile, Bird)
  game.genRockTimeCount = 0; // Cuurent count since last rock generation
  game.genMissileTimeCount = game.genMissileTimePeriod; // Time count since last missile generated
  game.sfb_pos = [25, 50]; // Position of Bird (left, top)
  game.sfb_fallRate = 0.025 // sfb speed of natural fall
  game.rock_pos = [[90, 10], [75, 75]] // Position of Rocks (left, top)
  game.grndRockStart_pos = 0;
  game.missile_posHt = [-1, -1, 0]; //left, top, Height
  game.missileActive = false;
  game.birdAlive = true;

  // Initialize Complexity Level
  game.rockMoveRate = 0.1; // Rock speed (%screen / 0.01s)
  game.genRockTimePeriod = 300; // Total count of 0.01s before Rock Generation
}


// RENDER function (defining state of Game) ------------------------------------------------------
const render = () => {

  // Score display
  if (game.birdAlive) {
    $('#scoreHolder').text("Score: "+ Math.round(game.score))
    $('#scoreHolder').css("color","white")
    $('#startStop').text("RESET")
  } else {
    if (game.score > 0.1){
      $('#scoreHolder').text("Game Over! Final Score: "+ Math.round(game.score))
    }
    $('#scoreHolder').css("color","rgb(255,250,0)")
    $('#startStop').text("START")
  }
  
  // Rock display
  $('.rock').remove();
  let rPos = game.rock_pos[0]
  for (rPos of game.rock_pos){
      const $div = $('<div>').addClass('rock');
      $div.append(($('<img>').addClass("imgRock")).attr("src",rockImg))
      $('.container_game').append($div);
      $div.css({'left': ((rPos[0])+"%"), 'top':(rPos[1]+"%")})
  }

  // bird display
  $('#SFB').css({'left': ((game.sfb_pos[0])+"%"), 'top':(game.sfb_pos[1]+"%")})
  $('#missile').css({'left': ((game.missile_posHt[0])+"%"), 'top':(game.missile_posHt[1]+"%"), 'height':(game.missile_posHt[2]+"%")})

  // bird animation
  if ((game.score*10)%10 < 2.5) {$(".imgSFB").attr('src',birdUpImg)}
  else if ((game.score*10)%10 < 5) {$(".imgSFB").attr('src',birdParallelImg)}
  else if ((game.score*10)%10 < 7.5) {$(".imgSFB").attr('src',birdDwnImg)}
  else {$(".imgSFB").attr('src',birdParallelImg)}

  // Missile Inhibit time display
  let missileInhbitTime = Math.round((game.genMissileTimePeriod - game.genMissileTimeCount)/100)
  $('.missileTime').remove();
  if (missileInhbitTime <= 0) {
    missileInhbitTime = 0;
    $('.button_M').children("img").attr('src',missileActiveImg);
  }  
  else {
    $('.button_M').append($('<h3 class="missileTime">').text(missileInhbitTime));
    $('.button_M').children("img").attr('src',missileInhibitImg);
  }

  //Ground Rock Animation
  let groundRockEndLeft = game.grndRockStart_pos;
  $('.groundRock').remove();
  while (groundRockEndLeft < 100) {
    let $grndRock = $('<div>').addClass('groundRock').css("left", groundRockEndLeft+"%")
    $('.container_game').append($grndRock);
    groundRockEndLeft +=5;
  }
}


// Time Step Function ---------------------------------------------------------------------------------
const time_step = () => {
  
  // Move Rocks
  game.rock_pos.forEach( (item, idx, arr) => {
    arr[idx][0]-=game.rockMoveRate;
    if (arr[idx][0] < 0){
      arr.splice(idx,1)
    }
  })

  // Move Ground Rock
  game.grndRockStart_pos -= game.rockMoveRate;
  if (game.grndRockStart_pos < -5) {game.grndRockStart_pos = 0}

  // Move Missile
  if (game.missileActive){game.missile_posHt[0] += game.missileMoveRate;}
  game.genMissileTimeCount += 1;

  // Generate New Rocks
  game.genRockTimeCount +=1
  if (game.genRockTimeCount > game.genRockTimePeriod){
    game.genRockTimeCount = 0;
    let sfbPosFrac = (parseFloat($('#SFB').css('top'))/parseFloat($('.container_game').css('height')));
    let rockPosFrac = sfbPosFrac +(Math.random()-0.5)*0.8;
    if (rockPosFrac > 0.9) {rockPosFrac = 0.9;}
    if (rockPosFrac < 0) {rockPosFrac = 0;}
    game.rock_pos.push([97, (100*rockPosFrac)]);
  }

  // Move SFB down
  game.sfb_pos[1] +=game.sfb_fallRate;
  game.sfb_fallRate *= 1.03 

  // Increment Score & Time passed
  game.score += (game.rockMoveRate)*0.1
  game.timePassed += 0.01; // Time passed in sec

  // Check if Game Over or missile Hit
  crashCheck();
  missileHitCheck();  
  if (!(game.birdAlive)) {clearInterval(game.timeStep)}

  complexityInc();
  render();
}

//SFB Crash Check ------------------------------------------------------------------
const crashCheck = () => {
  let sfbTop = parseFloat($('#SFB').css("top"));
  let sfbLeft = parseFloat($('#SFB').css("left"));
  let sfbHeight = parseFloat($('#SFB').css("height"));
  let sfbWidth = parseFloat($('#SFB').css("width"));
  let containerHeight = parseFloat($('.container_game').css("height"));

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
      game.rock_pos = [[100,0]];
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
  let containerWidth = parseFloat($('.container_game').css("width"));

  for (let i in game.rock_pos){
    let rockTop = parseFloat($('.rock').eq(i).css("top"));
    let rockLeft = parseFloat($('.rock').eq(i).css("left"));
    let rockHeight = parseFloat($('.rock').eq(i).css("height"));
    let rockWidth = parseFloat($('.rock').eq(i).css("width"));

    let pt1Collide = ((missileTop > rockTop) & (missileTop < (rockTop+rockHeight)) & (missileLeft > rockLeft) & (missileLeft < (rockLeft+rockWidth)))
    let pt2Collide = (((missileTop+missileHeight) > rockTop) & ((missileTop+missileHeight) < (rockTop+rockHeight)) & (missileLeft > rockLeft) & (missileLeft < (rockLeft+rockWidth)))
    let pt3Collide = ((missileTop > rockTop) & (missileTop < (rockTop+rockHeight)) & ((missileLeft+missileWidth) > rockLeft) & ((missileLeft+missileWidth) < (rockLeft+rockWidth)))
    let pt4Collide = (((missileTop+missileHeight) > rockTop) & ((missileTop+missileHeight) < (rockTop+rockHeight)) & ((missileLeft+missileWidth) > rockLeft) & ((missileLeft+missileWidth) < (rockLeft+rockWidth)))    
    let borderCollide = (missileLeft > 0.95*containerWidth);

    if (pt1Collide || pt2Collide || pt3Collide || pt4Collide || borderCollide) {
      game.missileActive = false;
      game.missile_posHt = [-1, -1, 0];
      game.rock_pos.splice(i,1);
      return;
    }
  }
}

// Complexity Increase (Rock Speed & Gen Rate)-----------------------------------------------------
const complexityInc = () => {
  game.rockMoveRate += 0.0001*(100/(100+game.score));
  game.genRockTimePeriod -= 0.05*(100/(100+game.score));
}

// User Actions (Up, Down, Missile-Launch) --------------------------------------------------------
const sfb_up = () => {
  if (game.birdAlive === false) {return}
  if (game.sfb_pos[1]>0) {game.sfb_pos[1]-=game.sfb_upDelta}
  game.sfb_fallRate = 0.025;
  render();
}
const sfb_dn = () => {
  if (game.birdAlive === false) {return}
  if (game.sfb_pos[1]<97) {game.sfb_pos[1]+=game.sfb_dnDelta}
  render();
}
const missile_launch = () => {
  if (game.birdAlive === false) {return}
  if ((game.missileActive === true)||(game.genMissileTimeCount < game.genMissileTimePeriod)) {return;}
  game.missileActive = true;
  game.missile_posHt = [(game.sfb_pos[0]+5), game.sfb_pos[1], 5];
  game.genMissileTimeCount = 0;
  render();
}
const sfbUpButtonMouseDown = () => {
  if (game.birdAlive === false) {return}
  game.upButtonFn = setInterval(sfb_up, 25*game.sfb_upDelta);
}
const sfbUpButtonMouseOutRelease = () => {
  if (game.birdAlive === false) {return}
  if (game.upButtonFn) {clearInterval(game.upButtonFn);}
}
const sfbDwnButtonMouseDown = () => {
  if (game.birdAlive === false) {return}
  game.dwnButtonFn = setInterval(sfb_dn, 25*game.sfb_dnDelta);
}
const sfbDwnButtonMouseOutRelease = () => {
  if (game.birdAlive === false) {return}
  if (game.dwnButtonFn) {clearInterval(game.dwnButtonFn);}
}



// MAIN FUNCTION --------------------------------------------------
const main = () => { 
  $('#SFB').css({'top': '80%', 'left':'25%'});
  $('.button_UP').on('mousedown', sfbUpButtonMouseDown);
  $('.button_UP').on('mouseout', sfbUpButtonMouseOutRelease);  
  $('.button_UP').on('mouseup', sfbUpButtonMouseOutRelease);
  $('.button_UP').on('touchstart', sfbUpButtonMouseDown);
  $('.button_UP').on('touchend', sfbUpButtonMouseOutRelease); 
  $('.container_game').on('touchstart', sfbUpButtonMouseDown);
  $('.container_game').on('touchend', sfbUpButtonMouseOutRelease);  


  $('.button_DN').on('mousedown', sfbDwnButtonMouseDown);
  $('.button_DN').on('mouseout', sfbDwnButtonMouseOutRelease);  
  $('.button_DN').on('mouseup', sfbDwnButtonMouseOutRelease);
  
  $('.button_M').on('click', missile_launch)

  $('body').on("keydown", (event) => {
    if ((event.code === "ArrowUp")){sfb_up()}
    if ((event.code === "ArrowDown")){sfb_dn()}
    if ((event.code === "ArrowRight")){missile_launch()}
  })
  
  $('#startStop').on("click", Initialize);
  Initialize();
  game.birdAlive = false;
  render(); 
}

$(main);