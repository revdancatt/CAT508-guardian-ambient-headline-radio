control = {

  alreadyHave: {},
  alreadyHaveList: [],
  radioQueue: [],
  broadcasting: false,
  pageSize: 10,
  windowResize: null,
  
  init: function() {

    //  Set the tiles across size, directly because I'm a hack
    aesthetic.tilesAcross = 20;

    $(document).bind('touchstart', function(e) {e.preventDefault();});
    $(window).resize(function() {
      control.windowResize = setTimeout( function() { aesthetic.renderTiles(); }, 500);
    });

    control.getLatestHeadline();
    setInterval(function() {control.getLatestHeadline();}, 60000);

  },

  getLatestHeadline: function() {

    utils.log('checking for latest');

    //  Go and get the latest headline...
    $.getJSON("http://content.guardianapis.com/search?page-size=" + control.pageSize + "&format=json&show-fields=trailText%2Cheadline%2Cthumbnail&callback=?",
      //  TODO: add error checking to this response
      function(json) {

        control.pageSize = 1;

        //  check to see if it's in any way valid
        if ('response' in json && 'results' in json.response && json.response.results.length > 0) {

          utils.log('have valid response');

          //  make sure we don't already have it, and it has a tumbnail
          var thisStory = null;
          for (var i in json.response.results) {
            thisStory = json.response.results[i];
            if (!(thisStory.apiUrl in control.alreadyHave) && 'fields' in thisStory && 'thumbnail' in thisStory.fields) {
              
              utils.log('dont already have story');

              //  make the object that contains everything we need to broadcast it
              var newStory = {
                'headline': thisStory.fields.headline,
                'trailText': thisStory.fields.trailText,
                'sectionName': thisStory.sectionName,
                'apiUrl': thisStory.apiUrl,
                'webUrl': thisStory.webUrl,
                'thumbnail': thisStory.fields.thumbnail.replace('http://static.guim.co.uk/sys-images/', ''),
                'imageLoaded': false,
                'broadcast': false
              };

              //  mark that we now have it and push it onto the radio queue
              control.alreadyHave[thisStory.apiUrl] = true;
              control.alreadyHaveList.push(thisStory.apiUrl);
              control.radioQueue.push(newStory);
              break;
            }
          }
        }

        control.checkBroadcast();

      }
    );

  },

  checkBroadcast: function() {

    utils.log('checking broadcast');

    //  see if we are already broadcasting, if so exit here
    if (control.broadcasting) return;

    //  see if there's anything to broadcast
    if (control.radioQueue.length === 0) return;

    //  otherwise mark that we are broadcasting now, even though we actually have a few things to do before then
    control.broadcasting = true;

    //  first we have to load the image
    aesthetic.loadimage();

  },

  finishBroadcast: function() {

    utils.log('finishBroadcast');
    //  remove the element from the radioQueue
    control.radioQueue.reverse().pop();
    control.radioQueue.reverse();
    control.broadcasting = false;

  }

};

utils = {
    
  log: function(msg) {

    try {
      console.log(msg);
    } catch(er) {
      //  Ignore
    }
  }

}