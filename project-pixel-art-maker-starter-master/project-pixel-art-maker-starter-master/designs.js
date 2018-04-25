$(function(){
  makeGrid();
  $("[tool=brush]").click();
});
//setting the starter value of the variables
const colorPickerElement = $('#colorPicker');
const gridHeightElement = $('#input_height');
const gridWidthElement = $('#input_width');
const pixelCanvasElement = $('#pixel_canvas');
const backColorPickerElement= $('#backColorPicker');
const gridColorPickerElement = $('#gridColorPicker');

let colorPickerValue = colorPickerElement.val();
let gridHeightValue = gridHeightElement.val();
let gridWidthValue = gridWidthElement.val();
let backColorPickerValue = $('#backColorPicker').val();
let gridColorPickerValue = $('#gridColorPicker').val();
let cellHeightAndWidth = 15;
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
//change all visial properties to match with the design selected
$("table").css('background-color', backColorPickerValue);
$("td").css('border-color', gridColorPickerValue);
pixelCanvasElement.find('td').attr('backgroundColor', backColorPickerValue);
$('#pixel_canvas td').css("height", cellHeightAndWidth + "px");
$('#pixel_canvas td').css("width", cellHeightAndWidth + "px");
}

//TODO: create a Jquery Object to export all necessary elements to save the grid work
function saveGridJSON() {
  //save the global variables like colors width and height into output
  let output = {
    tableProperties: {
      "gridWidth": gridWidthValue,
      "gridHeight": gridHeightValue,
      "backgroundColor" : backColorPickerValue,
      "gridColor": gridColorPickerValue,
      "cellHeightAndWidth" : cellHeightAndWidth,
    },
    "rows": [],
  };
  //look every col in every row so extract his actual color
  $.each($('#pixel_canvas tr'), function(index, value) {
    let cols = {};
    $.each(this.cells, function(subindex, subval) {
      if ($(subval).attr("backgroundColor") !== backColorPickerValue) {
        cols[subindex] = $(subval).attr("backgroundColor");
      }
    });
    output["rows"][index] = cols;
  });
  //export the output var into text form
return JSON.stringify(output, null, '\t');
}

//TODO: Set every var to the loaded values and print the loaded grid
function loadGridJSON(fileContent) {
  let JSONObject;
  //try to convert the file content value with $.parseJson, and if it can be done return false to let know it to the user
  try {
    JSONObject = $.parseJSON(fileContent);
  } catch(e) {
    return false;
  }
    // set general values
  backColorPickerValue = JSONObject.tableProperties.backgroundColor;
  gridColorPickerValue = JSONObject.tableProperties.gridColor;
  gridWidthValue = JSONObject.tableProperties.gridWidth;
  gridHeightValue = JSONObject.tableProperties.gridHeight;
  cellHeightAndWidth = JSONObject.tableProperties.cellHeightAndWidth;

  // if any of the important vars are missing, the file may be not be the original one, and then prevent of working with it
  if (backColorPickerValue == undefined || gridColorPickerValue == undefined || gridWidthValue == undefined || gridHeightValue == undefined || cellHeightAndWidth == undefined ) {
    return false;
  } else {
    //make the grid with the general variables
    makeGrid();
    //go trough every single cell and change the color if is needed
    $.each($('#pixel_canvas tr'), function(index, value) {
      $.each(this.cells, function(subindex, subval) {
        if (JSONObject.rows[index][subindex] !== undefined) {
          $(subval).attr("backgroundColor",JSONObject.rows[index][subindex]);
          $(subval).css("background-color",JSONObject.rows[index][subindex])
        }
      });
    });
    //if everything was go, return true to close the popup window
    return true;
  }
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

$("#saveGrid").submit(function(event){
  //prevent submitting the form
  event.preventDefault();
  let downloadElement = $("#downloadElement");
  // store the output of all the variables value
  let textOutput = saveGridJSON();
  let file = $("#saveFileName").val() + "." + $("#saveFileExtention").val();
  //set all the attributes in the download element
  downloadElement.attr("href", 'data:text/plain;charset=utf-8,' + encodeURIComponent(textOutput));
  downloadElement.attr("download", file);
  downloadElement.css("display","inline-block");
  $(this).css("display", "none");
});

$("#loadGrid").submit(function(event){
  event.preventDefault();
  //if all was good close the popup windows.
  if(loadGridJSON($("#loadFileContent").val())) {
    $(this).parents(".popup-window").toggleClass("visible");
  } else {
    //if not let know to the user that file is not a good one to load the grid
    $("#loadFileContent").val("");
    alert("The file you are trying to load does not contain all the parameters needed to load a previous saved Pixel Art Grid. Try it again.");
  }

});

$('#downloadElement').on("click",function(){
  $(this).parents('.popup-window').toggleClass('visible');
});

pixelCanvasElement.on("mousedown mouseover touchstart touchmove", "td", function(event){
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

$("#loadFile").on("change",function(){
  let file = $(this)[0].files[0];
  let reader = new FileReader();
  reader.onload = function(e) {
    let content = e.target.result;
    $("#loadFileContent").val(content);
  }
  reader.readAsText(file);
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
    url = "http://res.cloudinary.com/dxdktguhc/image/upload/v1523670878/brush.png";
  } else if(toolSelected === "eraser") {
    url = "http://res.cloudinary.com/dxdktguhc/image/upload/v1523671009/eraser.png";
  } else if(toolSelected === "dropper") {
    url = "http://res.cloudinary.com/dxdktguhc/image/upload/v1523670878/dropper.png";
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
    $('#'+$(this).attr('action')).toggleClass('visible');
    //reset to default visibility all elements in the save grid popup windws
    if($(this).attr('action') === "save") {
      $("#saveGrid").css("display", "block");
      $("#downloadElement").css("display", "none");
      $("#saveFileName").val("");
      $("#saveFileExtention").val("JSON");
    }
});

//open the popup windows for the about button
$('.about-button').on('click',function(){
  $('.popup-window#about').toggleClass('visible');
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
