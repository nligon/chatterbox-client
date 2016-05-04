// YOUR CODE HERE:

// https://api.parse.com/1/classes/messages

// **App ID:** dSNCwIniCXIY3dJz4KTuz9ROSUREvvCknGB11ReX

// **REST API Key:** WsWpCFH7gaxcB2B0jVvyKPOcT5NVHriAulknx789

var username = window.prompt('SAY YOUR NAME') || 'anon';

var app = {};
app.init = function() {};
app.send = function() {};
var IDs = new Set();
var latestRooms;
var currentRoom = 'testingSpam';

jQuery(document).ready(function() {
  $('select').change(function() {
    // alert($(this).val());
    chooseRoom($(this).val());
  });
});

//roomname array = roomnames (get from newMessages and filter using shieldXSS), either on every refresh of messages or when someone opens that menu
//make a new room dropdodwn list every refresh
//have the array of rooms populate into the drop down
// have the dropdown links reference a function that clears the chats and re-appends only those that contain the selected roomname


// appends final set of rooms to dropdown
var roomLister = function(roomSet) {
  $('#select').empty();
  for (var item of roomSet) {
    $('#select').prepend(
      `<option value='${shieldXSS(item)}'>${shieldXSS(item)}</option>`);
  }
};

var chooseRoom = function(roomName) {
  currentRoom = roomName;
  $('#chats').empty();
  IDs = new Set();
  updatePage(roomName);
  return roomName;
};

var updatePage = function(roomName) {
  // console.log('updating!');
  var resultsObj = $.get('https://api.parse.com/1/classes/messages', function() {
    var dataArray = JSON.parse(resultsObj.responseText).results;
    updater(dataArray, roomName);
  });

  var updater = function(dataArray, roomName) {
    // console.log(dataArray);
    var allNewMessages = _.reject(dataArray, function(obj) {
      return setContains(IDs, obj.objectId);
    });
    var filteredMessages = _.filter(allNewMessages, function(item) {
      return item.roomname === roomName;
    });
    roomSetProducer(dataArray);
    msgPlacer(filteredMessages);
  };

  // Makes Set of roomnames from the parsed data array of message objects.
  var roomSetProducer = function(dataArray) {
    var roomResults = new Set();
    for (var i = 0; i < dataArray.length; i++) {
      roomResults.add(dataArray[i].roomname);
    }
    latestRooms = roomResults;
    return roomResults;
  };

  var msgPlacer = function(newMessages, roomName) {
    for (var i = 0; i < newMessages.length; i++) {
      $('#chats').prepend(
        `<div>      
         <p>Username: ${shieldXSS(newMessages[i].username)}</p>
         <p>Message: ${shieldXSS(newMessages[i].text)}</p>
         <p>Roomname: ${shieldXSS(newMessages[i].roomname)}</p>
       </div>`);
    }
  };
};


var sendMsg = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify({
      username: username,
      text: document.getElementById('userInput').value,
      roomname: currentRoom
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


var setContains = function(set, element) {
  if (set.has(element)) {
    return true;
  } else {
    set.add(element);
    return false;
  }
};

var shieldXSS = function(string = '') {
  var arrayed = string.split('');
  var set = new Set(['&', '<', '>', '!', '@', '$', '%', '(', ')', '=', '+', '{', '}', '[', ']']);
  var rejected = _.reject(arrayed, function(char) {
    return set.has(char);
  });
  return rejected.join('');
};

setInterval(function() { updatePage(currentRoom); }, 500);
