aesthetic = {
  
  imageData: null,

  loadimage: function() {

    //  get the story we are about to broadcase
    var story = control.radioQueue[0];

    //  get the image URL
    var thumb = story.thumbnail;

    //  remove an old image
    $('img#holder').remove();
    $('#hiddenStuff').append($('<img>').attr('id', 'holder'));
    $('img#holder').load(function() {aesthetic.copyToCanvas();});

    //  Go and get the latest headline...
    $.getJSON("http://gu-tools-v3.appspot.com/img_to_json?img=" + thumb + "&callback=?",
      //  TODO: add error checking to this response
      function(json) {
        $('img#holder').attr('src', json.data);
      }
    );

  },

  copyToCanvas: function() {

    utils.log('image loaded');
    var c=$('#sourceCanvas')[0];
    var ctx=c.getContext("2d");
    ctx.drawImage($("img#holder")[0],0,0);

    //  Now convert to the larger canvas

    //  To do this we are dividing the source image into a grid of 7x7 squares, we'll then average the
    //  top, bottom, left & right quarters and work out which quarter is closest to its adjacent ones
    //  then we'll take the average between those two quarters and fill in the diagonal half with them
    //  and same for the other half, and this render the image in triangles
    var imageData = ctx.getImageData(0, 0, 140, 84);
    aesthetic.imageData = imageData;
   
    aesthetic.renderTiles();

  },

  renderTiles: function() {

    var imageData = aesthetic.imageData;

      //  resize the canvas
      $('#targetCanvas').remove();
      $('#targetHolder').append($('<canvas>').attr({'id': 'targetCanvas'}));
      $('#targetCanvas').attr({'width': $(window).innerWidth(), 'height': $(window).innerHeight()});
      $('#targetCanvas').css({'width': $(window).innerWidth() + 'px', 'height': $(window).innerHeight() + 'px'});
      
      var ct=$('#targetCanvas')[0];
      var ctxt=ct.getContext("2d");

      //  work out the new tile dimensions
      var tileSize = {
        'width': $('#targetCanvas').width()/ 20,
        'height': $('#targetCanvas').height()/ 12
      };

    for (var y = 0; y < 84; y += 7) {
      for (var x = 0; x < 140; x += 7 ) {
        var top = {'r': 0, 'g': 0, 'b': 0};
        var left = {'r': 0, 'g': 0, 'b': 0};
        var right = {'r': 0, 'g': 0, 'b': 0};
        var bottom = {'r': 0, 'g': 0, 'b': 0};

        //  Do the top first
        top.r+=imageData.data[(((x+1)+((y+0)*140))*4)+0]; top.g+=imageData.data[(((x+1)+((y+0)*140))*4)+1]; top.b+=imageData.data[(((x+1)+((y+0)*140))*4)+2];
        top.r+=imageData.data[(((x+2)+((y+0)*140))*4)+0]; top.g+=imageData.data[(((x+2)+((y+0)*140))*4)+1]; top.b+=imageData.data[(((x+2)+((y+0)*140))*4)+2];
        top.r+=imageData.data[(((x+3)+((y+0)*140))*4)+0]; top.g+=imageData.data[(((x+3)+((y+0)*140))*4)+1]; top.b+=imageData.data[(((x+3)+((y+0)*140))*4)+2];
        top.r+=imageData.data[(((x+4)+((y+0)*140))*4)+0]; top.g+=imageData.data[(((x+4)+((y+0)*140))*4)+1]; top.b+=imageData.data[(((x+4)+((y+0)*140))*4)+2];
        top.r+=imageData.data[(((x+5)+((y+0)*140))*4)+0]; top.g+=imageData.data[(((x+5)+((y+0)*140))*4)+1]; top.b+=imageData.data[(((x+5)+((y+0)*140))*4)+2];
        top.r+=imageData.data[(((x+2)+((y+1)*140))*4)+0]; top.g+=imageData.data[(((x+2)+((y+1)*140))*4)+1]; top.b+=imageData.data[(((x+2)+((y+1)*140))*4)+2];
        top.r+=imageData.data[(((x+3)+((y+1)*140))*4)+0]; top.g+=imageData.data[(((x+3)+((y+1)*140))*4)+1]; top.b+=imageData.data[(((x+3)+((y+1)*140))*4)+2];
        top.r+=imageData.data[(((x+4)+((y+1)*140))*4)+0]; top.g+=imageData.data[(((x+4)+((y+1)*140))*4)+1]; top.b+=imageData.data[(((x+4)+((y+1)*140))*4)+2];
        top.r+=imageData.data[(((x+3)+((y+2)*140))*4)+0]; top.g+=imageData.data[(((x+3)+((y+2)*140))*4)+1]; top.b+=imageData.data[(((x+3)+((y+2)*140))*4)+2];
        top.r = parseInt(top.r/9, 10); top.g = parseInt(top.g/9, 10); top.b = parseInt(top.b/9, 10);

        //  Do the bottom next
        bottom.r+=imageData.data[(((x+1)+((y+6)*140))*4)+0]; bottom.g+=imageData.data[(((x+1)+((y+6)*140))*4)+1]; bottom.b+=imageData.data[(((x+1)+((y+6)*140))*4)+2];
        bottom.r+=imageData.data[(((x+2)+((y+6)*140))*4)+0]; bottom.g+=imageData.data[(((x+2)+((y+6)*140))*4)+1]; bottom.b+=imageData.data[(((x+2)+((y+6)*140))*4)+2];
        bottom.r+=imageData.data[(((x+3)+((y+6)*140))*4)+0]; bottom.g+=imageData.data[(((x+3)+((y+6)*140))*4)+1]; bottom.b+=imageData.data[(((x+3)+((y+6)*140))*4)+2];
        bottom.r+=imageData.data[(((x+4)+((y+6)*140))*4)+0]; bottom.g+=imageData.data[(((x+4)+((y+6)*140))*4)+1]; bottom.b+=imageData.data[(((x+4)+((y+6)*140))*4)+2];
        bottom.r+=imageData.data[(((x+5)+((y+6)*140))*4)+0]; bottom.g+=imageData.data[(((x+5)+((y+6)*140))*4)+1]; bottom.b+=imageData.data[(((x+5)+((y+6)*140))*4)+2];
        bottom.r+=imageData.data[(((x+2)+((y+5)*140))*4)+0]; bottom.g+=imageData.data[(((x+2)+((y+5)*140))*4)+1]; bottom.b+=imageData.data[(((x+2)+((y+5)*140))*4)+2];
        bottom.r+=imageData.data[(((x+3)+((y+5)*140))*4)+0]; bottom.g+=imageData.data[(((x+3)+((y+5)*140))*4)+1]; bottom.b+=imageData.data[(((x+3)+((y+5)*140))*4)+2];
        bottom.r+=imageData.data[(((x+4)+((y+5)*140))*4)+0]; bottom.g+=imageData.data[(((x+4)+((y+5)*140))*4)+1]; bottom.b+=imageData.data[(((x+4)+((y+5)*140))*4)+2];
        bottom.r+=imageData.data[(((x+3)+((y+4)*140))*4)+0]; bottom.g+=imageData.data[(((x+3)+((y+4)*140))*4)+1]; bottom.b+=imageData.data[(((x+3)+((y+4)*140))*4)+2];
        bottom.r = parseInt(bottom.r/9, 10); bottom.g = parseInt(bottom.g/9, 10); bottom.b = parseInt(bottom.b/9, 10);

        //  Do the left
        left.r+=imageData.data[(((x+0)+((y+1)*140))*4)+0]; left.g+=imageData.data[(((x+0)+((y+1)*140))*4)+1]; left.b+=imageData.data[(((x+0)+((y+1)*140))*4)+2];
        left.r+=imageData.data[(((x+0)+((y+2)*140))*4)+0]; left.g+=imageData.data[(((x+0)+((y+2)*140))*4)+1]; left.b+=imageData.data[(((x+0)+((y+2)*140))*4)+2];
        left.r+=imageData.data[(((x+0)+((y+3)*140))*4)+0]; left.g+=imageData.data[(((x+0)+((y+3)*140))*4)+1]; left.b+=imageData.data[(((x+0)+((y+3)*140))*4)+2];
        left.r+=imageData.data[(((x+0)+((y+4)*140))*4)+0]; left.g+=imageData.data[(((x+0)+((y+4)*140))*4)+1]; left.b+=imageData.data[(((x+0)+((y+4)*140))*4)+2];
        left.r+=imageData.data[(((x+0)+((y+5)*140))*4)+0]; left.g+=imageData.data[(((x+0)+((y+5)*140))*4)+1]; left.b+=imageData.data[(((x+0)+((y+5)*140))*4)+2];
        left.r+=imageData.data[(((x+1)+((y+2)*140))*4)+0]; left.g+=imageData.data[(((x+1)+((y+2)*140))*4)+1]; left.b+=imageData.data[(((x+1)+((y+2)*140))*4)+2];
        left.r+=imageData.data[(((x+1)+((y+3)*140))*4)+0]; left.g+=imageData.data[(((x+1)+((y+3)*140))*4)+1]; left.b+=imageData.data[(((x+1)+((y+2)*140))*4)+2];
        left.r+=imageData.data[(((x+1)+((y+4)*140))*4)+0]; left.g+=imageData.data[(((x+1)+((y+4)*140))*4)+1]; left.b+=imageData.data[(((x+1)+((y+2)*140))*4)+2];
        left.r+=imageData.data[(((x+2)+((y+3)*140))*4)+0]; left.g+=imageData.data[(((x+2)+((y+3)*140))*4)+1]; left.b+=imageData.data[(((x+2)+((y+3)*140))*4)+2];
        left.r = parseInt(left.r/9, 10); left.g = parseInt(left.g/9, 10); left.b = parseInt(left.b/9, 10);

        //  Finally the right
        right.r+=imageData.data[(((x+6)+((y+1)*140))*4)+0]; right.g+=imageData.data[(((x+6)+((y+1)*140))*4)+1]; right.b+=imageData.data[(((x+6)+((y+1)*140))*4)+2];
        right.r+=imageData.data[(((x+6)+((y+2)*140))*4)+0]; right.g+=imageData.data[(((x+6)+((y+2)*140))*4)+1]; right.b+=imageData.data[(((x+6)+((y+2)*140))*4)+2];
        right.r+=imageData.data[(((x+6)+((y+3)*140))*4)+0]; right.g+=imageData.data[(((x+6)+((y+3)*140))*4)+1]; right.b+=imageData.data[(((x+6)+((y+3)*140))*4)+2];
        right.r+=imageData.data[(((x+6)+((y+4)*140))*4)+0]; right.g+=imageData.data[(((x+6)+((y+4)*140))*4)+1]; right.b+=imageData.data[(((x+6)+((y+4)*140))*4)+2];
        right.r+=imageData.data[(((x+6)+((y+5)*140))*4)+0]; right.g+=imageData.data[(((x+6)+((y+5)*140))*4)+1]; right.b+=imageData.data[(((x+6)+((y+5)*140))*4)+2];
        right.r+=imageData.data[(((x+5)+((y+2)*140))*4)+0]; right.g+=imageData.data[(((x+5)+((y+2)*140))*4)+1]; right.b+=imageData.data[(((x+5)+((y+2)*140))*4)+2];
        right.r+=imageData.data[(((x+5)+((y+3)*140))*4)+0]; right.g+=imageData.data[(((x+5)+((y+3)*140))*4)+1]; right.b+=imageData.data[(((x+5)+((y+2)*140))*4)+2];
        right.r+=imageData.data[(((x+5)+((y+4)*140))*4)+0]; right.g+=imageData.data[(((x+5)+((y+4)*140))*4)+1]; right.b+=imageData.data[(((x+5)+((y+2)*140))*4)+2];
        right.r+=imageData.data[(((x+4)+((y+3)*140))*4)+0]; right.g+=imageData.data[(((x+4)+((y+3)*140))*4)+1]; right.b+=imageData.data[(((x+4)+((y+3)*140))*4)+2];
        right.r = parseInt(right.r/9, 10); right.g = parseInt(right.g/9, 10); right.b = parseInt(right.b/9, 10);

        //  ok, now that we have the average values for the top, left, right and bottom. I want to know which pair have the greatest
        //  similarity
        var topleft = (Math.abs(top.r-left.r) + Math.abs(top.g-left.g) + Math.abs(top.b-left.b))/3;
        var topright = (Math.abs(top.r-right.r) + Math.abs(top.g-right.g) + Math.abs(top.b-right.b))/3;
        var bottomleft = (Math.abs(bottom.r-left.r) + Math.abs(bottom.g-left.g) + Math.abs(bottom.b-left.b))/3;
        var bottomright = (Math.abs(bottom.r-right.r) + Math.abs(bottom.g-right.g) + Math.abs(bottom.b-right.b))/3;



        //  if the top left is the lowest value, the we'll merge the top & left quarters together
        //  and the bottom & right together and then draw the tqo halfs of the tile
        if ((topleft < topright && topleft < bottomleft && topleft < bottomright) || (bottomright < topleft && bottomright < topright && bottomright < bottomleft)) {
          var tl = { 'r': parseInt((top.r + left.r)/2, 10), 'g': parseInt((top.g + left.g)/2, 10), 'b': parseInt((top.b + left.b)/2, 10) };
          var br = { 'r': parseInt((bottom.r + right.r)/2, 10), 'g': parseInt((bottom.g + right.g)/2, 10), 'b': parseInt((bottom.b + right.b)/2, 10) };
          
          //  first one diagonal
          ctxt.fillStyle="rgb(" + tl.r + "," + tl.g + "," + tl.b + ")";
          ctxt.beginPath();
          ctxt.moveTo((x/7)*tileSize.width, (y/7)*tileSize.height);
          ctxt.lineTo(((x/7)+1)*tileSize.width+1, (y/7)*tileSize.height);
          ctxt.lineTo((x/7)*tileSize.width, ((y/7)+1)*tileSize.height+1);
          ctxt.lineTo((x/7)*tileSize.width, (y/7)*tileSize.height);
          ctxt.closePath();
          ctxt.fill();

          //  now the next
          ctxt.fillStyle="rgb(" + br.r + "," + br.g + "," + br.b + ")";
          ctxt.beginPath();
          ctxt.moveTo(((x/7)+1)*tileSize.width, (y/7)*tileSize.height);
          ctxt.lineTo(((x/7)+1)*tileSize.width+1, (y/7)*tileSize.height);
          ctxt.lineTo(((x/7)+1)*tileSize.width+1, ((y/7)+1)*tileSize.height+1);
          ctxt.lineTo((x/7)*tileSize.width, ((y/7)+1)*tileSize.height+1);
          ctxt.lineTo((x/7)*tileSize.width, ((y/7)+1)*tileSize.height);
          ctxt.lineTo(((x/7)+1)*tileSize.width, (y/7)*tileSize.height);
          ctxt.closePath();
          ctxt.fill();

        } else {
          var tr = { 'r': parseInt((top.r + right.r)/2, 10), 'g': parseInt((top.g + right.g)/2, 10), 'b': parseInt((top.b + right.b)/2, 10) };
          var bl = { 'r': parseInt((bottom.r + left.r)/2, 10), 'g': parseInt((bottom.g + left.g)/2, 10), 'b': parseInt((bottom.b + left.b)/2, 10) };

          ctxt.fillStyle="rgb(" + tr.r + "," + tr.g + "," + tr.b + ")";
          ctxt.beginPath();
          ctxt.moveTo((x/7)*tileSize.width, (y/7)*tileSize.height);
          ctxt.lineTo(((x/7)+1)*tileSize.width+1, (y/7)*tileSize.height);
          ctxt.lineTo(((x/7)+1)*tileSize.width+1, ((y/7)+1)*tileSize.height+1);
          ctxt.lineTo((x/7)*tileSize.width, (y/7)*tileSize.height);
          ctxt.closePath();
          ctxt.fill();

          //  now the next
          ctxt.fillStyle="rgb(" + bl.r + "," + bl.g + "," + bl.b + ")";
          ctxt.beginPath();
          ctxt.moveTo((x/7)*tileSize.width, (y/7)*tileSize.height);
          ctxt.moveTo((x/7)*tileSize.width+1, (y/7)*tileSize.height);
          ctxt.lineTo(((x/7)+1)*tileSize.width+1, ((y/7)+1)*tileSize.height);
          ctxt.lineTo(((x/7)+1)*tileSize.width+1, ((y/7)+1)*tileSize.height+1);
          ctxt.lineTo((x/7)*tileSize.width, ((y/7)+1)*tileSize.height+1);
          ctxt.lineTo((x/7)*tileSize.width, (y/7)*tileSize.height);
          ctxt.closePath();
          ctxt.fill();

        }        
      }
    }

    control.finishBroadcast();

  },

  cheat: function() {

    //  get the image URL
    var thumb = 'Guardian/Pix/pictures/2012/3/14/1331747333169/A-disabled-woman-in-a-whe-003.jpg';

    //  remove an old image
    $('img#holder').remove();
    $('body').append($('<img>').attr('id', 'holder'));
    $('img#holder').load(function() {aesthetic.copyToCanvas();});

    //  Go and get the latest headline...
    $.getJSON("http://gu-tools-v3.appspot.com/img_to_json?img=" + thumb + "&callback=?",
      //  TODO: add error checking to this response
      function(json) {
        $('img#holder').attr('src', json.data);
      }
    );

  }

};