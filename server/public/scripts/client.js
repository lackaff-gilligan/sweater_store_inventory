console.log('hello from client.js');
$(document).ready(onReady);

var editing = false;
var editingId;

function onReady(){
    refreshSweaters();
    $('#submitBtn').on('click', submitBtnClicked);
    //$('#sweaterList').on('click', '.editBtn', editBtnClicked);
}

function submitBtnClicked(){
    var sweaterName = $('#sweaterNameIn').val();
    var sweaterSize = $('#sizeIn').val();
    var sweaterPrice = $('#priceIn').val();
    var sweater = {
        name: sweaterName,
        size: sweaterSize,
        price: sweaterPrice
    };
    // clear input fields
    $('input').val('');
    if(editing){
        // switch back to add new product mode
        editing = false;
       $('#sweaterSubheading').text('Add New Sweater');
       //call function that makes PUT request
       updateSweater(sweater);
    } else {
        addNewSweater(sweater);
    }
}

//GET request
function refreshSweaters(){
    $.ajax({
        method: 'GET',
        url: '/sweater'
    }).done(function(response){
        console.log('response from GET req:', response);
        //response is my sweater array
        var sweaterList = response;
        appendSweatersToDom(sweaterList);
    }).fail(function(error){
        console.log('something went wrong in GET req:', error); 
    })
}

// function updateSweater(sweaterToUpdate) {

// }

// POST a new sweater
function addNewSweater(sweaterToSend) {
   $.ajax({
       method: 'POST',
       url: '/sweater',
       data: sweaterToSend
   }).done(function(response){
       console.log('response from POST request:', response);
       refreshSweaters();
   }).fail(function(error){
       console.log('something went wrong in POST request:', error); 
   });
}

// function editBtnClicked(){

// }

function appendSweatersToDom(arrOfSweaters){
    for(var i = 0; i < arrOfSweaters.length; i += 1){
        var sweater = arrOfSweaters[i];
      var $tr = $('<tr></tr>');
      $tr.data('sweater', sweater);
      $tr.append('<td>' + sweater.name + '</td>');
      $tr.append('<td>' + sweater.size + '</td>');
      $tr.append('<td>' + sweater.price + '</td>');
      $tr.append('<td><button data-id="' + sweater.id + '" class="btn btn-info editBtn">Edit</button></td>');
      $tr.append('<td><button data-id="' + sweater.id + '" class="btn btn-danger deleteBtn">Delete</button></td>');
      //add row to tbody on DOM
      $('#sweaterList').append($tr);
    }
}