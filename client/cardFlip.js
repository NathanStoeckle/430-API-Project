"use strict";

//Allows us to keep track in case the user wishes to make more than one character
var totalCards = 0;
console.log("total cards start: " + totalCards);

//Used Started code, remains mostly the same
var handleResponse = function handleResponse(xhr, parseResponse) {

  //Gets the content field and status updates
  var content = document.querySelector("#content");
  var status = document.getElementById("status");

  //Checks to see if the status succeded, updated, created, or failed
  switch (xhr.status) {
    //Success
    case 200:
      if (parseResponse) {
        displayCards(content, xhr);
      }
      break;
      //Created Successfully
    case 201:
      if (parseResponse) {
        createCard(content, xhr);
      }
      status.innerText = "Card added";
      break;
      //Update
    case 204:
      //updated
      //update the cards by simulating a click for the search button
      $("#submitButton").trigger('click');
      status.innerText = "Card edited";
      break;
      //Bad Request
    case 400:
      status.innerText = "Status 400 - missing field(s) -";
      break;
      //Not Found - Also used for default
    case 404:
      break;
    default:
      break;
  }
};

//Send Post - Modified to suit the addCharacter function
var addCharacter = function addCharacter(e, addChara) {
  // Grab the forms action (/addCharacter)
  // and method (It should be POST)
  var action = addChara.getAttribute('action');
  var method = addChara.getAttribute('method');

  // Get the form's fields to detect user input (What did they put in the fields?)
  var name = addChara.querySelector('#nameField');
  var age = addChara.querySelector('#ageField');
  var species = addChara.querySelector('#speciesField');
  var classField = addChara.querySelector('#classField');
  var notes = addChara.querySelector('#notesField');

  var xhr = new XMLHttpRequest();

  xhr.open(method, action);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');

  //Checks if it's a get, post, or head request
  if (method == 'post') {
    //set onload to parse request and get json message
    xhr.onload = function () {
      return handleResponse(xhr, true);
    };
  } else {
    xhr.onload = function () {
      return handleResponse(xhr, false);
    };
  }

  // Build our x-www-form-urlencoded format
  var formData = "name=" + name.value + "&age=" + age.value + "&species=" + species.value + "&class=" + classField.value + "&notes=" + notes.value;

  //Send the form data
  xhr.send(formData);

  //cancel browser's default action
  e.preventDefault();

  // Return false to prevent/avoid a page redirection from forms
  return false;
};

//This function creates a card with data recieved from the forms
var createCard = function createCard(content, xhr) {

  // Checks to see if there is a form response and store the data
  var obj = JSON.parse(xhr.response);

  //Loops through the array for data and adds a new card...
  if (Object.keys(obj.cards)) {

    // Adds a new card, just one
    totalCards++;

    // This is the last card in object - last created
    var cardName = Object.keys(obj.cards)[Object.keys(obj.cards).length - 1];
    var card = obj.cards[cardName];
    console.log(obj.cards);

    //Should send the data recieved from the user in order to create a new card...
    createTemplate(totalCards, card.name, card.age, card.species, card.classField, card.notes);
  }
};

//Modified from starter code - requestUpdate, and a part of sendPost
var getCards = function getCards(e, addChara) {

  //grab the forms action (url to go to)
  //and method (HTTP method - POST in this case)
  var action = addChara.getAttribute('action');
  var method = addChara.getAttribute('method');

  var xhr = new XMLHttpRequest();

  xhr.open(method, action);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');

  //Checks if it's a get, post, or head request
  if (method == 'post') {
    //set onload to parse request and get json message
    xhr.onload = function () {
      return handleResponse(xhr, true);
    };
  } else {
    //set onload to check meta data and NOT message
    //There are no body responses in a head request
    xhr.onload = function () {
      return handleResponse(xhr, false);
    };
  }

  xhr.send();

  //cancel browser's default action
  e.preventDefault();

  //return false to prevent page redirection from a form
  return false;
};

// This should display all cards created...
var displayCards = function displayCards(content, xhr) {
  
  var obj = JSON.parse(xhr.response);

  if (Object.keys(obj.cards)) {
    
    //if card obj list is not empty
    // Fill the list with the new cards
    var cardLength = Object.keys(obj.cards).length;

    // Clears the content section
    content.innerHTML = "";

    for (var i = 0; i < cardLength; i++) {
      var cardName = Object.keys(obj.cards)[i];
      var card = obj.cards[cardName];
    }
  }
};

//Allows us to create the card for the OCs
var createTemplate = function createTemplate(num, name, age, species, classField, notes) {

  //Should be created in the empty section
  //  It's id name is "content"
  var html = "";

  // Format the card display
  //Create the card number, you never know how many OC's need to be created!
  html += "<div class='card' id='card-" + num + "'>";

  //Creates the card information for template
  html += "<div class='front'>";
  html += "<div class='cardContents'>";
  html += "<p><strong>Name: </strong>" + name + "</p>";
  html += "</div>";
  html += "</div>";

  html += "<div class='back'>";
  html += "<div class='cardContents'>";
  html += "<p><strong>Age: </strong>" + age + "</p>";
  html += "<p><strong>Species: </strong>" + species + "</p>";
  html += "<p><strong>Class: </strong>" + classField + "</p>";
  html += "<p><strong>Notes: </strong>" + notes + "</p>";
  html += "</div>";

  html += "</div>";

  content.innerHTML += html;

  $("div[id^=card-]").flip(); //apply flip animations

  // Reset the cards to display names
  $("div[id^=card-]").trigger("click");
  $("div[id^=card-]").trigger("click");
};

var init = function init() {
  //grab form
  var addChara = document.querySelector('#addChara');

  var name = addChara.querySelector('#nameField');
  var age = addChara.querySelector('#ageField');
  var species = addChara.querySelector('#speciesField');
  var classField = addChara.querySelector('#classField');
  var notes = addChara.querySelector('#notesField');


  $("#status").on('click', function (e) {
    $('#status').stop(true);
    $('#status').fadeIn(1000);
    $('#status').fadeOut(2000);
  });

  //This should add in a new card with character details
  addChara.addEventListener('submit', function (e) {
    addCharacter(e, addChara);
    name.value = ''; //empty out field
    species.value = ''; //empty out field
    classField.value = ''; //empty out field
    notes.value = 'Put in any special details about your original character here'; //Put in the original field

    document.getElementById("status").innerText = "";
    $("#status").trigger('click');
  });
};

window.onload = init;
