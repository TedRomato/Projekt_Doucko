$(".FAQquestion").click(function(event) {
  $(".FAQanswer").addClass("hidden");
  if(event.target.id == "FAQ1"){
    $("#Answer1").removeClass("hidden");
  }
  if(event.target.id == "FAQ2"){
    $("#Answer2").removeClass("hidden");
  }
  if(event.target.id == "FAQ3"){
    $("#Answer3").removeClass("hidden");
  }
  if(event.target.id == "FAQ4"){
    $("#Answer4").removeClass("hidden");
  }
  if(event.target.id == "FAQ5"){
    $("#Answer5").removeClass("hidden");
  }
});

/*carousels*/
let settings = {loop:true, dots:true, nav:true,dotsEach:true};
$(document).ready(function(){
  $("#Ref-owl-carousel").owlCarousel(settings);
  $("#Lector-owl-carousel").owlCarousel(settings);
});


function displayCheckboxWarning(){
  if($('input[name="subject"]:checkbox').filter(':checked').length < 1){
    $("#CheckboxWarning").removeClass("hidden");
  }else{
    $("#CheckboxWarning").addClass("hidden");
  }
}

$("form").submit(function(e){
  e.preventDefault();
  if ($('[name="subject"]:checkbox').filter(':checked').length < 1){
    scrollToElement("#SubjectsDiv");
    $("#CheckboxWarning").removeClass("hidden");;
    return false;
  }else{

    $.ajax({
       type: $(this).attr('method'),
       url: $(this).attr('action'),
       data : $(this).serialize(),
       success : function(response) {
         showSuccessfulForm();
       },
       error : function(response) {
           //write your code here
       }
    });
  }
});


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
