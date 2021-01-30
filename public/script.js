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
let settings = {loop:true, dots:false, slideBy:1};
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

  $("#Czech_warning").addClass("hidden");
  $("#German_warning").addClass("hidden");

  $('button[name="subject"].selectedButton').each(function( index ) {
    if($(this).attr('data-value') == "cestina"){
      if(lvl == "1-2střední" || lvl == "3-4střední"){
        $("#Czech_warning").removeClass("hidden");
      }
    }
    if($(this).attr('data-value') == "nemina"){
      if(lvl == "3-4střední"){
        $("#German_warning").removeClass("hidden");
      }
    }
  });
});

$("form").submit(function(e){
  e.preventDefault();
  if (!$("#CheckboxWarning").hasClass("hidden")){
    scrollToElement("#SubjectsDiv");
    return;
  }else if(!$("#German_warning").hasClass("hidden") || !$("#Czech_warning").hasClass("hidden")){
    scrollToElement("#SubjectsDiv");
    return;
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
  $("#FAQ1").addClass("selectedButton");
  $(".FAQanswer").addClass("hidden");
  $("#Answer1").removeClass("hidden");

}

function getFormData(){
  let str = "<p>name: " + $('input[name="name"]').val() + "<br>" +
    "e-mail: " + $('input[name="email"]').val() + "<br>" +
    "subject: " + $('button[name="subject"].selectedButton').attr('data-value') + "<br>" +
    "lvl: " + $('button[name="lvl"].selectedButton').attr('data-value') + "<br>" +
    "frequency: " + $('button[name="frequency"].selectedButton').attr('data-value') + "<br>" +
    "time-note: " + $('input[name="time_note"]').val() + "<br>" +
    "lection_type: " + $('button[name="lessonType"].selectedButton').attr('data-value') + "<br>" +
    "notes: " + $('input[name="notes"]').val() + "<br></p>";
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
