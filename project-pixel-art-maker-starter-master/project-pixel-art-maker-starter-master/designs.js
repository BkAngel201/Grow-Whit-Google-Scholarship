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
