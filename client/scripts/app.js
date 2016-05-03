// YOUR CODE HERE:

// https://api.parse.com/1/classes/messages

// **App ID:** dSNCwIniCXIY3dJz4KTuz9ROSUREvvCknGB11ReX

// **REST API Key:** WsWpCFH7gaxcB2B0jVvyKPOcT5NVHriAulknx789

var username = window.prompt('SAY YOUR NAME') || 'anon';

var app = {};
app.init = function() {};
app.send = function() {};

var IDs = new Set();
var setContains = function(ID) {
  if (IDs.has(ID)) {
    return true;
  } else {
    IDs.add(ID);
    return false;
  }
};

// var sendMsg = function() {
//   var message = document.getElementById('userInput').value;
//   newMsg(message);
// };

//roomname array = roomnames (get from noRepeats and filter using shieldXSS), either on every refresh of messages or when someone opens that menu
//make a new room dropdodwn list every refresh
//have the array of rooms populate into the drop down
// have the dropdown links reference a function that clears the chats and re-appends only those that contain the selected roomname
//


var contentUpdate = function() {
  $.get('https://api.parse.com/1/classes/messages', function(resultsObj) {
    var dataArray = JSON.parse(resultsObj.responseText).results;
  });
};

var updater = function() {
  console.log(resultsObj);
  var dataArray = JSON.parse(resultsObj.responseText).results;
  var noRepeats = _.reject(window.results2, function(obj) {
    return setContains(obj.objectId);
  });
  msgUpdate(noRepeats);
};

var msgUpdate = function(noRepeats) {
  for (var i = 0; i < noRepeats.length; i++) {
    $('#chats').prepend(
      `<div>      
         <p>Username: ${shieldXSS(noRepeats[i].username)}</p>
         <p>Message: ${shieldXSS(noRepeats[i].text)}</p>
         <p>Roomname: ${shieldXSS(noRepeats[i].text)}</p>
       </div>`);
  }
};

setInterval(contentUpdate, 500);

var shieldXSS = function(string = '') {
  var arrayed = string.split('');
  var set = new Set(['&', '<', '>', '!', '@', '$', '%', '(', ')', '=', '+', '{', '}', '[', ']']);
  var rejected = _.reject(arrayed, function(char) {
    return set.has(char);
  });
  return rejected.join('');
};

var sendMsg = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify({
      username: username,
      text: document.getElementById('userInput').value,
      roomname: "CatParty2016"
    }),
    contentType: 'application/json',
    success: function(data) {
      console.log('chatterbox: Message sent');
    },
    error: function(data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};
