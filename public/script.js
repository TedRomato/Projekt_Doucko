$(".FAQquestion").click(function(event) {
  $(".FAQanswer").addClass("hidden");
  $('.FAQquestion').removeClass("selectedFaq");
  if(event.target.id == "FAQ1"){
    $("#Answer1").removeClass("hidden");
    $("#FAQ1").addClass("selectedFaq");
  }
  if(event.target.id == "FAQ2"){
    $("#Answer2").removeClass("hidden");
    $("#FAQ2").addClass("selectedFaq");
  }
  if(event.target.id == "FAQ3"){
    $("#Answer3").removeClass("hidden");
    $("#FAQ3").addClass("selectedFaq");
  }
  if(event.target.id == "FAQ4"){
    $("#Answer4").removeClass("hidden");
    $("#FAQ4").addClass("selectedFaq");
  }
  if(event.target.id == "FAQ5"){
    $("#Answer5").removeClass("hidden");
    $("#FAQ5").addClass("selectedFaq");
  }
});

/*carousels*/
let settings = {loop:true, dots:true, nav:true,dotsEach:true};
$(document).ready(function(){
  $("#Ref-owl-carousel").owlCarousel(settings);
  $("#Lector-owl-carousel").owlCarousel(settings);
});

$('[name="lvl"]').change(function(){
  displayCheckboxWarning();
});


function displayCheckboxWarning(){
  if($('input[name="subject"]:checkbox').filter(':checked').length < 1){
    $("#CheckboxWarning").removeClass("hidden");
  }else{
    $("#CheckboxWarning").addClass("hidden");
  }
  if($("input[value|='Čeština']").is(":checked") && ($("[name='lvl']").children("option:selected").val() == "3-4střední" || $("[name='lvl']").children("option:selected").val() == "1-2střední")){
    $("#Czech_warning").removeClass("hidden");
  }else{
    $("#Czech_warning").addClass("hidden");
  }
  if($("input[value|='Německý jazyk']").is(":checked") && $("[name='lvl']").children("option:selected").val() == "3-4střední"){
    $("#German_warning").removeClass("hidden");
  }else{
    $("#German_warning").addClass("hidden");
  }
}

$("form").submit(function(e){
  e.preventDefault();
  if ($('[name="subject"]:checkbox').filter(':checked').length < 1){
    scrollToElement("#SubjectsDiv");
    $("#CheckboxWarning").removeClass("hidden");;
    return;
  }else if($("#German_warning").hasClass("hidden") || $("#Czech_warning").hasClass("hidden")){
    scrollToElement("#SubjectsDiv");
    return;
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
