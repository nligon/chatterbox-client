// YOUR CODE HERE:

// https://api.parse.com/1/classes/messages

// **App ID:** dSNCwIniCXIY3dJz4KTuz9ROSUREvvCknGB11ReX

// **REST API Key:** WsWpCFH7gaxcB2B0jVvyKPOcT5NVHriAulknx789

// $.get('https://api.parse.com/1/classes/messages', )

var app = {};
var results = $.get('https://api.parse.com/1/classes/messages', function() {

  window.results2 = JSON.parse(results.responseText).results;
  for (var i = 0; i < results2.length; i++) {
    $('body').append(
      `<div>
         <p>Username: ${shieldXSS(results2[i].username)}</p>
         <p>Message: ${shieldXSS(results2[i].text)}</p>
       </div>`);
  }
});

// results2 = JSON.parse(results.responseText)

// setTimeout(function(){window.}, 1000);

// arrayify string
var shieldXSS = function(string = '') {
  var arrayed = string.split('');
  var set = new Set(['&', '<', '>', '!', '@', '$', '%', '(', ')', '=', '+', '{', '}', '[', ']']);
  var rejected = _.reject(arrayed, function(char) {
    return set.has(char);
  });
  return rejected.join('');
};

// _.reject array, "Is this character a bad character"

// stringify the array
