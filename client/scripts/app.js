// YOUR CODE HERE:

// https://api.parse.com/1/classes/messages

// **App ID:** dSNCwIniCXIY3dJz4KTuz9ROSUREvvCknGB11ReX

// **REST API Key:** WsWpCFH7gaxcB2B0jVvyKPOcT5NVHriAulknx789

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

var prependMessages = function() {
  var results = $.get('https://api.parse.com/1/classes/messages', function() {
    window.results2 = JSON.parse(results.responseText).results;
    var accepted = _.reject(window.results2, function(obj) {
      return setContains(obj.objectId);
    });
    for (var i = 0; i < accepted.length; i++) {
      $('body').prepend(
        `<div>      
         <p>Username: ${shieldXSS(accepted[i].username)}</p>
         <p>Message: ${shieldXSS(accepted[i].text)}</p>
       </div>`);
    }
  });
};

setInterval(prependMessages, 500);

var shieldXSS = function(string = '') {
  var arrayed = string.split('');
  var set = new Set(['&', '<', '>', '!', '@', '$', '%', '(', ')', '=', '+', '{', '}', '[', ']']);
  var rejected = _.reject(arrayed, function(char) {
    return set.has(char);
  });
  return rejected.join('');
};
