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

    //  Stop the user from moving the page around on iDevices
    $(document).bind('touchstart', function(e) {e.preventDefault();});
    
    //  Whenever the use resized the window we need to redraw the canvas because we
    //  can't just simply set it at 100% and be done with it. *But* don't do it
    //  each time we resize only when the user has probably stopped
    $(window).resize(function() {
      control.windowResize = setTimeout( function() { aesthetic.renderTiles(); }, 500);
    });

    //  Go get the lates headline from the Guardian
    control.getLatestHeadline();

    //  and do it once a minute from now on
    setInterval(function() {control.getLatestHeadline();}, 60000);

  },

  getLatestHeadline: function() {


    //  Go and get the latest headline...
    //  The first time we do this we're going to grab 10 or so pages because we don't
    //  know if the very latest story will have a thumbnail and we definitly want one
    //  to start with.
    //  After that we'll just get the latest and ignore it if there's no thumbnail
    $.getJSON("http://content.guardianapis.com/search?page-size=" + control.pageSize + "&format=json&show-fields=trailText%2Cheadline%2Cthumbnail&callback=?",

      //  TODO: add error checking to this response
      function(json) {

        //  Set the page size down to 1 for all future fetches (because I'm a hack)
        control.pageSize = 1;

        //  check to see if it's in any way valid
        if ('response' in json && 'results' in json.response && json.response.results.length > 0) {


          //  Loop thru the results (probably just the one) looking for a story we can use
          var thisStory = null;
          for (var i in json.response.results) {

            thisStory = json.response.results[i];

            //  make sure we don't already have it, and it has a tumbnail
            if (!(thisStory.apiUrl in control.alreadyHave) && 'fields' in thisStory && 'thumbnail' in thisStory.fields) {
              
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
              
              //  drop out here, we have what we want
              break;
            }
          }
        }

        //  check the boradcast queue to see if there's anything we need to do
        //  i.e. yes there's something we need to do as we probably just pushed
        //  something onto the queue
        control.checkBroadcast();

      }
    );

  },

  //  And now we're going to look at the broadcast queue to see if there's any stories in there
  //  that we may need to process. We do this because it may take a while to get through the
  //  text-to-speach for a long headline and trail text and we don't want to start the next
  //  story before finishing the current one. We don't want to crash the pips.
  checkBroadcast: function() {

    //  see if we are already "broadcasting", if so exit here
    if (control.broadcasting) return;

    //  see if there's anything to broadcast
    if (control.radioQueue.length === 0) return;

    //  We got here, that means there's something to do. Mark us as broadcasting, we we don't do
    //  anything else until we've finished. Note, once we've finished we don't need to check the
    //  queue again, as the getLatestHeadline will run once a minute anyway and always check the
    //  broadcast queue at the end.
    control.broadcasting = true;

    //  QUICK HACK: set the headline and link,
    //  I'll move this out to someplace else when we're actually doing the headline display
    //  properly
    var hl = $('<a>').attr('href', control.radioQueue[0].webUrl).html(control.radioQueue[0].headline);
    $('#headline').empty().append(hl);
    

    //  first we have to load the image
    aesthetic.loadimage();

    //  Then we have to lower the music volume
    //  NOTE: We need music playing to do this, duh!!

    //  TODO: Once the music has had a chance to lower the volumn we queue up the
    //  text-to-speech part
    speak(control.radioQueue[0].headline, {amplitude: 100, pitch: 50, speed: 145, wordgap: 3});

    //  TODO: although we do this somewhere else, once the text-to-speach has finished
    //  then we raise the music back up, and say that we've finished broadcasting so
    //  we're clear for the next broadcast.
    //  ALTHOUGH: we'll actually turn off the broadcasting in whichever function is raising
    //  the music volume
    control.finishBroadcast();


  },

  finishBroadcast: function() {

    //  remove the element from the radioQueue is a really messy way
    //  put I like stringing reverse and pops together ;)
    control.radioQueue.reverse().pop();
    control.radioQueue.reverse();

    //  Ok, we're not broadcasting any more, the queue is clear for the next one.
    control.broadcasting = false;

  }

};


//  This is where all my utils live when I remember to put them here, because I often leave
//  them in the wrong object thingy
utils = {
    
  //  because I often leave console.logs in code and not notice because I have the console open
  //  this means that at least the logging will work on IE, AHAHAHAHAAHAHAHAHAHAHAHAHAHAHAH
  log: function(msg) {

    try {
      console.log(msg);
    } catch(er) {
      //  Ignore
    }
  }

}