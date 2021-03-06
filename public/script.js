$(".FAQquestion").click(function(event) {
  $(".FAQanswer").addClass("hidden");
  $('.FAQquestion').removeClass("selectedButton");
  if(event.target.id == "FAQ1"){
    $("#Answer1").removeClass("hidden");
    $("#FAQ1").addClass("selectedButton");
  }
  if(event.target.id == "FAQ2"){
    $("#Answer2").removeClass("hidden");
    $("#FAQ2").addClass("selectedButton");
  }
  if(event.target.id == "FAQ3"){
    $("#Answer3").removeClass("hidden");
    $("#FAQ3").addClass("selectedButton");
  }
  if(event.target.id == "FAQ4"){
    $("#Answer4").removeClass("hidden");
    $("#FAQ4").addClass("selectedButton");
  }
  if(event.target.id == "FAQ5"){
    $("#Answer5").removeClass("hidden");
    $("#FAQ5").addClass("selectedButton");
  }
});

/*carousels*/
let settings = {loop:true, dots:false, slideBy:1,items:3,responsive:{
      //breakpoint from 0 and up
      0 : {
         items : 1,
      },
      // add as many breakpoints as desired , breakpoint from 480 up
      480 : {
         items:1,
      },
      // breakpoint from 768 up
      768 : {
          items:2,
      },
      1080:{
          items:3,
      },
  }};
$(document).ready(function(){
  $("#Ref-owl-carousel").owlCarousel(settings);
  $("#Lector-owl-carousel").owlCarousel(settings);
});

function nextSlide(carousel){
  $(carousel).owlCarousel().trigger('next.owl.carousel');;
}

function prevSlide(carousel){
  $(carousel).owlCarousel().trigger('prev.owl.carousel');
}

function collapseNav(){
  $("#Navbar ul li").each(function( index ) {
    if(index > 0 && index < 5){
      if($(this).hasClass("hidden")){
        $(this).removeClass("hidden");
      }else{
        $(this).addClass("hidden");
      }
    }
  });
}


$( window ).resize(function() {
  if($( window ).width() > 768){
    $("#Navbar ul li").each(function( index ) {
      if(index > 0 && index < 5){
        $(this).addClass("hidden");
      }
    });
  }
});


var lastScrollTop = 0, delta = 5;
$(window).scroll(function(){
  if($( window ).width() < 768){
    var nowScrollTop = $(this).scrollTop();
    if(Math.abs(lastScrollTop - nowScrollTop) >= delta){
     if (nowScrollTop > lastScrollTop && $(window).scrollTop() > 75){
       $("#Navbar").addClass("hidden");
       $("#Navbar ul li").each(function( index ) {
         if(index > 0 && index < 5){
           $(this).addClass("hidden");
         }
       });
     } else {
       $("#Navbar").removeClass("hidden");
     }
    lastScrollTop = nowScrollTop;
    }
  }
});

$("input[name='email']").on("input", function(){
  if($(this).val().length > 0 && $(this).val().includes("@")){
    $("#Email_warning").addClass("hidden");
  }
});

$("input[name='name']").on("input", function(){
  if($(this).val().length > 0){
    $("#Name_warning").addClass("hidden");
  }
});

$(".select button").click(function(){
  if($(this).hasClass("selectedButton")){
    $(this).removeClass("selectedButton")
  }else{
    $(this).addClass("selectedButton");
  }
});

$(".radio button").click(function(){
  	$(this).parent().parent().addClass("usedRadio");
    $(".usedRadio button").removeClass("selectedButton");
    $(this).addClass("selectedButton");
    $(this).parent().parent().removeClass("usedRadio");
});

$(".radio button, .select button").click(function(){
  if($('button[name="subject"].selectedButton').length < 1){
    $("#CheckboxWarning").removeClass("hidden");
  }else{
    $("#CheckboxWarning").addClass("hidden");
  }

  let lvl = $('button[name="lvl"].selectedButton').attr('data-value');

  $("#German_warning").addClass("hidden");
  $("#Chemistry_warning").addClass("hidden");


  $('button[name="subject"].selectedButton').each(function( index ) {
    if($(this).attr('data-value') == "nemina"){
      if(lvl == "3-4střední"){
        $("#German_warning").removeClass("hidden");
      }
    }
    if($(this).attr('data-value') == "chemie"){
      if(lvl == "3-4střední"){
        $("#Chemistry_warning").removeClass("hidden");
      }
    }
  });
});

$("form").submit(function(e){
  e.preventDefault();
  if (!$("#CheckboxWarning").hasClass("hidden")){
    scrollToElement("#CheckboxWarning");
    return;
  }else if(!$("#German_warning").hasClass("hidden")){
    scrollToElement("#German_warning");
    return;
  }else if(!$("#Chemistry_warning").hasClass("hidden")){
    scrollToElement("#Chemistry_warning");
  }else if($("input[name='name']").val().length == 0){
    $("#Name_warning").removeClass("hidden");
    scrollToElement("#Name_warning");
  }else if($("input[name='email']").val().length == 0 || !$("input[name='email']").val().includes("@")){
    $("#Email_warning").removeClass("hidden");
    scrollToElement("#Email_warning");
  }else{
    $.ajax({
       type: $(this).attr('method'),
       url: $(this).attr('action'),
       data : getFormData(),
       success : function(response) {
         showSuccessfulForm();
         resetForm();
       },
       error : function(response) {
       }
    });
  }
});

function resetForm(){
  $("input:text").val("");
  $("textarea").val("");
  $(".selectedButton").removeClass("selectedButton");
  $("button[data-value='matika']").addClass("selectedButton");
  $("button[data-value='1-5zš']").addClass("selectedButton");
  $("button[data-value='once']").addClass("selectedButton");
  $("#German_warning").addClass("hidden");
  $("#Email_warning").addClass("hidden");
  $("#Name_warning").addClass("hidden");
  $("#Chemistry_warning").addClass("hidden");
  $("#FAQ1").addClass("selectedButton");
  $(".FAQanswer").addClass("hidden");
  $("#Answer1").removeClass("hidden");

}

function getFormData(){
  let subjects = getSubjectsString();
  let str = "<p>name: " + $('input[name="name"]').val() + "<br>" +
    "e-mail: " + $('input[name="email"]').val() + "<br>" +
    "subject: " + subjects + "<br>" +
    "lvl: " + $('button[name="lvl"].selectedButton').attr('data-value') + "<br>" +
    "frequency: " + $('button[name="frequency"].selectedButton').attr('data-value') + "<br>" +
    "time-note: " + $('input[name="time_note"]').val() + "<br>" +
    "lection_type: " + $('button[name="lessonType"].selectedButton').attr('data-value') + "<br>" +
    "notes: " + $('input[name="notes"]').val() + "<br></p>";
  return str;
}

function getSubjectsString(){
  let str = "";
  $('button[name="subject"].selectedButton').each(function(){
    str += $(this).attr('data-value');
    str += "; ";
  });
  return str;
}

function hideSuccessfulForm(){
  $("#SuccesfulForm").addClass("hidden");
}

function showSuccessfulForm(){
  $("#SuccesfulForm").removeClass("hidden");
}


function scrollToElement(element){
  let el = $(element);
  let elOffset = el.offset().top;
  let elHeight = el.height();
  let windowHeight = $(window).height();
  let offset;
  if (elHeight < windowHeight) {
    offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
  }
  else {
    offset = elOffset;
  }
  $('html, body').animate({scrollTop:offset}, 700);

}
