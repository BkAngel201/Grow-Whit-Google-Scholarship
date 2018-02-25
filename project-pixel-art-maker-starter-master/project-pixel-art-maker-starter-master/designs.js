//setting the starter value of the variables
const colorPickerElement = $('#colorPicker');
const gridHeightElement = $('#input_height');
const gridWidthElement = $('#input_width');
const pixelCanvasElement = $('#pixel_canvas');
let colorPickerValue = colorPickerElement.val();
let gridHeightValue = gridHeightElement.val();
let gridWidthValue = gridWidthElement.val();
let backColorPickerValue = $('#backColorPicker').val();
let gridColorPickerValue = $('#gridColorPicker').val();
let cellHeightAndWidth = 10;
let toolSelected;



//TODO: fix the height and width of the cell if the grid is biger than the scrwwn size to prevent overflowing
function calcCellDimention() {
  //calculate if body's height - 10px of padding top and bottom is less than all the heigh of the grid, actual size + 2px of border x cant cells on the y axis + 2 to get some extra space
if(parseInt($('body').height() - 20) < ((cellHeightAndWidth + 1) * gridHeightValue + 2)) {
  // set the actual cell size to height space available on body divided by the cant of cells in the y axis - 2 to get some extra space
  cellHeightAndWidth = (parseInt(($('body').height() - 20) / gridHeightValue)) - 1;
}
// the same of above but in the width or x axis
if (parseInt($('body').width() - 20) < ((cellHeightAndWidth + 1) * gridWidthValue + 2)) {
  cellHeightAndWidth = (parseInt(($('body').width() - 20) / gridWidthValue)) - 2;
}

}


//TODO: create the structure of the grid according to the width and height given
function makeGrid() {
  pixelCanvasElement.empty();
  const table = document.getElementById("pixel_canvas");
  for(let i = 1; i <= gridHeightValue; i++) {
    //opening table's row
    const row = table.insertRow(i-1);
    for(let j = 1; j <= gridWidthValue; j++) {
      //adding all table's cols
      row.insertCell(j-1);
    }
  }
calcCellDimention();
$("table").css('background-color', backColorPickerValue);
$("td").css('border-color', gridColorPickerValue);
pixelCanvasElement.find('td').attr('backgroundColor', backColorPickerValue);
$('#pixel_canvas td').css("height", cellHeightAndWidth + "px");
$('#pixel_canvas td').css("width", cellHeightAndWidth + "px");
}



//******************************//
//                              //
//       EVENTS LISTENERS       //
//                              //
//******************************//

//listen for click event on submit button
$('#sizePicker').submit(function(event) {
  //prevent submitting the form
  event.preventDefault();
  $(this).parents('.popup-window').toggleClass('visible');
    gridHeightValue = gridHeightElement.val();
    gridWidthValue = gridWidthElement.val();
  //calling the makeGrid function to draw our table
  makeGrid();
  //if the width or height were corrected, show the information to the user
});

pixelCanvasElement.on("mousedown mouseover", "td", function(event){
  event.preventDefault();
  if (event.buttons == 1) {
    if (toolSelected === "brush") {
      $(event.target).attr('backgroundColor', colorPickerValue);
      $(event.target).css('background-color', colorPickerValue);

    } else if (toolSelected === "eraser") {
      $(event.target).css('background-color', backColorPickerValue);
    }
    if (toolSelected === "dropper") {
      colorPickerElement.val($(event.target).attr('backgroundColor'));
      colorPickerValue = $(event.target).attr('backgroundColor');
      $(".fa-paint-brush").parent().click();
    }
  }
});


//Style behavior
//open and close the tool bar
$(".toggle-pos-button").on('click',function(){
  $(this).parent().toggleClass('closed');
  $(this).children('i').toggleClass('fa-angle-double-right');
});

//tools button selection and set the selected tool
$(".tools-button").on('click',function(){
  let url = "";
  $(".tools-button").removeClass('selected');
  $(this).toggleClass('selected');
  toolSelected = $(this).attr('tool')
  if(toolSelected === "brush") {
    url = "https://s26.postimg.org/cv9eddj4p/brush.png";
  } else if(toolSelected === "eraser") {
    url = "https://s26.postimg.org/thqyn1c8p/eraser.png";
  } else if(toolSelected === "dropper") {
    url = "https://s26.postimg.org/w0cnn5d89/dropper.png";
  }
  $("body").css("cursor","url(" + url + "), default");
});

//behavior of popup text on tools and file buttons
//when the mouse is over a button show the popup text
$("a[alt=popup]").on('mouseover', function(event){
  //change the text in the text on the popup, since file and tools button use different attributes to define what they do
  if($(this).hasClass("tools-button")) {
    $(".popup-info-text").html($(this).attr("tool") + " tool (" + $(this).attr("Key") + ")");
  } else if($(this).hasClass("file-button")) {
    $(".popup-info-text").html($(this).attr("action") + " grid");
  }
  //place the popup text in the right place calculating the position using the trigger position and the dimentions of the elements
  $('.popup-info-text').css({
    "top" : parseInt($(this).offset().top + ($(this).height() - $(".popup-info-text").height())) + "px",
    "left" : parseInt($(this).offset().left + $(this).width() + 5) + "px"
  });
  //set the popup text visible
  $(".popup-info-text").addClass('visible');
});

//when the mouse leave a button hidde the popup text
$("a[alt=popup]").on('mouseout', function(event){
  //set the popup text not visible
  $(".popup-info-text").removeClass('visible');
});

//open the popup windows for the specific file button
$(".file-button").on('click',function(){
  if($(this).attr('action') === "create") {
    $('#'+$(this).attr('action')).toggleClass('visible');
  } else if($(this).attr('action') === "reset") {
    $('#'+$(this).attr('action')).toggleClass('visible');
  }
});

//close the popup window with the x button
$('.popup-window-close').on('click',function(){
  $(this).parents('.popup-window').toggleClass('visible');
});

//cancel and accept the reset grid function
$('button.cancel').on('click',function(){
  $(this).parents('.popup-window').toggleClass('visible');
});
$('button.accept').on('click',function(){
  $(this).parents('.popup-window').toggleClass('visible');
  $('td').css('background-color', backColorPickerValue);
});


$('input[type=color]').change(function(){
  if($(this).attr('id') === "backColorPicker") {
    //setting the background color of the table
    //setting the backColorPickerValue when the input type=color change
    $("table").css('background-color', $(this).val());
    backColorPickerValue = $(this).val();
  } else if($(this).attr('id') === "gridColorPicker") {
    //setting the border color of the table
    //setting the gridColorPickerValue when the input type=color change
    $("td").css('border-color', $(this).val());
    gridColorPickerValue = $(this).val();
  } else if($(this).attr('id') === "colorPicker") {
    //setting the colorPickerValue when the #colorPicker change
    colorPickerValue = colorPickerElement.val();
  }
});


$('.about-button').on('click',function(){
  $('.popup-window#about').toggleClass('visible');
});

//event listener for keydown to select tools with specific keys
$(document).on("keydown", function(event){
  //prevent select any tool if the popup windows is visible
  if(!$('.popup-window').hasClass("visible")){
    if (event.which == 66) {
      $(".tools-button[tool=brush]").click();
    } else if (event.which == 69) {
      $(".tools-button[tool=eraser]").click();
    } else if (event.which == 68) {
      $(".tools-button[tool=dropper]").click();
    }
  }

});
