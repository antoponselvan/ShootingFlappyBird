import './style.css'
import $ from "jquery";
// sfb = Shooting Flappy Bird

// Main Variables defining game state
const game = {};
game.score = 0;
game.birdAlive = true;
game.sfb_upDelta = 1; // sfb position Inc with Up arrow use
game.sfb_dnDelta = 1; // sfb position Dec with Down arrow use
game.refreshRate = 100;
game.sfb_pos = [25, 50];
// game.rock_pos = [['0%', '65%'], ['20%', '90%']]
game.rock_pos = [[90, 0], [75, 75]]
game.first_render = true;

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
  if (game.first_render) {
    const timeStep = setInterval(time_step, game.refreshRate);
    game.first_render = false;
  }
  if (!(game.birdAlive)) {clearInterval(timeStep)}

}

// Time Step Function ----------------------------------
const time_step = () => {
  let rPos = game.rock_pos[0]
  game.rock_pos.forEach( (item, idx, arr) => {
    arr[idx][0]-=1;
    if (arr[idx][0] < 0){
      arr.splice(idx,1)
    }
  })
  game.score += 0.1
  render();
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


// MAIN FUNCTION --------------------------------------------------
const main = () => { 
  $('#SFB').css({'top': '80%', 'left':'25%'});
  $('.button_UP').on('click', sfb_up);
  $('.button_DN').on('click', sfb_dn);

  $('body').on("keydown", (event) => {
     if ((event.code === "ArrowUp")){sfb_up()}
    if ((event.code === "ArrowDown")){sfb_dn()}
  })
  render();
}

$(main);