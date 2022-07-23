import './style.css'
import $ from "jquery";
// sfb = Shooting Flappy Bird

const sfb_up_delta = 0.01*$('#SFB').parent().height(); // sfb position Inc with Up arrow use
const sfb_dn_delta = 0.01*$('#SFB').parent().height(); // sfb position Dec with Down arrow use

const sfb_up = () => {
  // alert($('#SFB').css)
  // alert(sfb_up_delta);
  // alert(($('#h1_1').height()));
  // alert(parseInt($('.container_game').css("border-top-width")))
  $('#SFB').css({top: ($('#SFB').position().top - sfb_up_delta - $('.container_game').position().top - parseInt($('.container_game').css("border-top-width")) )});
  // alert($('#SFB').position().top)
}
const sfb_dn = () => {
  $('#SFB').css({top: ($('#SFB').position().top + sfb_dn_delta - $('.container_game').position().top - parseInt($('.container_game').css("border-top-width")) )});
}
const main = () => {
  
  $('#SFB').css({'top': '50%', 'left':'25%'});
  const $up_bttn = $('.button_UP');
  $up_bttn.on('click', sfb_up);
  const $dn_bttn = $('.button_DN');
  $dn_bttn.on('click', sfb_dn);
  // $('#SFB').position().top = 5000;


  $('body').on("keydown", (event) => {
     if ((event.code === "ArrowUp")){
      sfb_up();
      console.log(event);
    }
    if ((event.code === "ArrowDown")){
      sfb_dn();
    }
});

}

$(main);