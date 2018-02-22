//setting the starter value of the variables
const colorPickerElement = $('#colorPicker');
const gridHeightElement = $('#input_height');
const gridWidthElement = $('#input_width');
const pixelCanvasElement = $('#pixel_canvas');
var colorPickerValue = colorPickerElement.val();
var gridHeightValue = gridHeightElement.val();
var gridWidthValue = gridWidthElement.val();
var backColorPickerValue = $('#backColorPicker').val();
var gridColorPickerValue = $('#gridColorPicker').val();
var toolSelected;

//Style behavior
//open and close the tool bar
$(".toggle-pos-button").on('click',function(){
  $(this).parent().toggleClass('closed');
  $(this).children('i').toggleClass('fa-angle-double-right');
});

//tools button selection and set the selected tool
$(".tools-button").on('click',function(){
  $(".tools-button").removeClass('selected');
  $(this).toggleClass('selected');
  toolSelected = $(this).attr('tool');
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
    //setting the backColorPickerValue when the #colorPicker change
    $("table").css('background-color', $(this).val());
    backColorPickerValue = $(this).val();
  } else if($(this).attr('id') === "gridColorPicker") {
    //setting the border color of the table
    //setting the gridColorPickerValue when the #colorPicker change
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
$("table").css('background-color', backColorPickerValue);
$("td").css('border-color', gridColorPickerValue);
}

//******************************//
//                              //
//       EVENTS LISTENERS       //
//                              //
//******************************//

//listen for click event on submit button
$('#sizePicker').submit(function(event) {
  var alertText= "";
  //prevent submitting the form
  event.preventDefault();
  $(this).parents('.popup-window').toggleClass('visible');
  //looking if the grid size are grater than 30 for height and 70 for width to prevent overflow on the page
  //looking for the height
  if (gridHeightElement.val() > 30) {
    alertText += "Grid Heigth changed from " + gridHeightElement.val() + " to 30.\n";
    gridHeightValue = 30;
    gridHeightElement.val(30);
  } else {
    gridHeightValue = gridHeightElement.val();
  }
  //looking for the width
  if (gridWidthElement.val() > 60) {
    alertText += "Grid Width changed from " + gridWidthElement.val() + " to 60.";
    gridWidthValue = 60;
    gridWidthElement.val(60);
  } else {
    gridWidthValue = gridWidthElement.val();
  }
  //calling the makeGrid function to draw our table
  makeGrid();
  //if the width or height were corrected, show the information to the user
  if (alertText !== "") {
    alert("Some changes has being done for prevent overflowing the Drawing Area:\n" + alertText);
  }
});

pixelCanvasElement.on("click mousedown mouseover", "td", function(event){
  event.preventDefault();
  if (event.buttons == 1) {
    if (toolSelected === "brush") {
      $(event.target).css('background-color', colorPickerValue);
    } else if (toolSelected === "eraser") {
      $(event.target).css('background-color', backColorPickerValue);
    }
  }
});


// //changing the td background for colorPickerValue
// pixelCanvasElement.on('click','td', function() {
//   $(this).css('background-color', colorPickerValue);
// });
