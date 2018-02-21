$(".toggle-pos-button").on('click',function(){
  $(this).parent().toggleClass('closed');
  $(this).children('i').toggleClass('fa-angle-double-right');
});
$(".tools-button").on('click',function(){
  $(".tools-button").removeClass('selected');
  $(this).toggleClass('selected');
});
$(".file-button").on('click',function(){

  if($(this).children('i.fa-file')) {
    $('.popup-window').toggleClass('visible');

  }
});

$('.popup-window').on('click',function(){
  $(this).toggleClass('visible');
});

















//setting the starter value of the variables
const colorPickerElement = $('#colorPicker');
const gridHeightElement = $('#input_height');
const gridWidthElement = $('#input_width');
const pixelCanvasElement = $('#pixel_canvas');
var colorPickerValue = colorPickerElement.val();
var gridHeightValue = gridHeightElement.val();
var gridWidthValue = gridWidthElement.val();


//TODO: create the structure of the grid according to the width and height given
function makeGrid() {
  pixelCanvasElement.empty();
  const table = document.getElementById("pixel_canvas");
  for(let i = 1; i <= gridHeightValue; i++) {
    //opening table's row
    const row = table.insertRow(i-1);
    for(let j = 1; j <= gridWidthValue; j++) {
      //adding all table's cols
      const cell = row.insertCell(j-1);
      cell.innerHTML = "&nbsp;";
      cell.addEventListener('click', function(){
        $(this).css('background-color', colorPickerValue);
      });
    }
  }

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

//setting the colorPickerValue when the #colorPicker change
colorPickerElement.change(function(){
  colorPickerValue = colorPickerElement.val();
});

// //changing the td background for colorPickerValue
// pixelCanvasElement.on('click','td', function() {
//   $(this).css('background-color', colorPickerValue);
// });
