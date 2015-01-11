
//for(var i=0;i<stylesheet.layers.length;i++){console.log(i+': '+stylesheet.layers[i]['id'])}

  var current={'history':[], 'quickPick': false, 'stashedStyle':{}, capitalization:[['none','Default'], ['uppercase','UPPERCASE'],['lowercase','lowercase']]};
  var recordChange;
  var fb = new Firebase("https://explorer.firebaseio.com");

  //anonymouse login
  fb.authAnonymously(function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
    }
  });
function $(x) {
  return d3.selectAll(x);
}


  function closeDropdown() {
    $('.direct-select').classed({'visible':false});
    $('.dropdown').classed({'expand':false});
  };

  function formatText(input){return input.charAt(0).toUpperCase()+ input.slice(1).replace(/_/g, ' ')};

d3.selectAll('ul')
  .on('mousewheel',function(e){
    if($('input:hover').length==0 && $('.inputarea:hover').length==0){
    map.zoomTo(map.getZoom()+event.wheelDeltaY*0.01,{offset:differential, animate:false }
    )};
});

//Load layer scheme
mapboxgl.util.getJSON('layers.json', function (err, layers) {
  if (err) throw err;
  window.layerRef= layers;
  window.fonts=[];
  for (var family in layers.Fonts) {
    fonts = fonts.concat(layers.Fonts[family]);
  }
});



//Load styles
mapboxgl.util.getJSON('style2.json', function (err, style) {
  if (err) throw err;

  window.stylesheet=style;
  fb.set(stylesheet);
  style.layers.forEach(function(layer) {layer.interactive = true});



  //Draw map
  mapboxgl.accessToken = 'pk.eyJ1IjoicGV0ZXJxbGl1IiwiYSI6ImpvZmV0UEEifQ._D4bRmVcGfJvo1wjuOpA1g';
  window.map = new mapboxgl.Map({
    container: 'map', // container id
    style: style, //stylesheet location
    zoom: 2, // starting zoom,
    hash: true,
    maxZoom:20
  });



  //Direct select
  map
    .on('click', function(e) {
      var center = map.project(map.getCenter());
      window.differential=[e.point.x-center.x, e.point.y-center.y];

      if(!event.shiftKey){
        toggleBubble(e);
        //toggle bubble visibility, whenever map is clicked
        $('.direct-select')
          .style('-webkit-transform', 'translateX('+e.point.x+'px) translateY('+e.point.y+'px)')
          .classed("visible", !d3.select('.direct-select').classed("visible"));
        $('.editing').classed({'editing':false})
      }
    })
    .on('zoom', function() {
      $('.slider .zoomneedle').style('left', (map.getZoom()*5-2.5)+'%');
    });


  });




//Get features at the mouse position, and then either 1) surfaces edit UI (if quickpick active, or only one feature present) or 2) serves up the list of features

function toggleBubble(e) {
  $('.inputarea input').remove();
  $('.inputarea .slider').remove();

  map.featuresAt(e.point, {"radius":10}, function(err, output) {
        if (err) throw err;
        var latlon=map.unproject(e.point);
        $('.expand').classed({'expand':false});

        //take only the id, filter out the border layers and repeats
        output = output
          .map(function(n){return n['_bucket']})
          .filter(function(n) {return n.indexOf('_case') == -1})
          .filter(function(n) {return n.indexOf('_stroke') == -1})
          .reverse();

        var features = [];
        if (output.length<10){
          features.push('land')
        };

        //remove repeats
        for (var i=0; i<output.length; i++){
          if (features.indexOf(output[i])== -1) {features.push(output[i])}
          if (map.getZoom()<15){}
        };
        $('.direct-select li').remove();

        //if only one feature at location, go right to edit view
        if (current.quickPick || features.length==1){showEditView(features[features.length-1],null, latlon)}

        else (
          d3.select('.direct-select')
            .select('ul')
            .selectAll('li')
            .data(features.reverse())
            .enter()
            .insert('li')
            .attr('class', 'keyline-bottom col12 clearfix')
            .text(function(d,i){return formatText(features[i])})
            .on('click', function(d,i) {deactivateLayer(features[i]);showEditView(d,i, latlon)})
            .on('mouseover', function(d,i){
              activateLayer(features[i]);
            })
            .on('mouseout', function(d,i) {
              deactivateLayer(features[i]);
            })
        );

        //track select bubble to the map
        map.on('move', function(){
          var pos=map.project(latlon);
          $('.visible.direct-select')
            .style('-webkit-transform', 'translateX('+pos.x+'px) translateY('+pos.y+'px)');

          var center = map.project(map.getCenter());
          window.differential=[pos.x-center.x, pos.y-center.y];
        });
      });
}

function activateLayer(layer){
  var mapStyle = map.style.layermap[layer].paint;

  switch(layerRef.Layers[layer]['Category']) {
    case "Background":
      current.existingFill = mapStyle['background-color'];
      current.existingOpacity = mapStyle['background-opacity'];

      mapStyle['background-opacity'] = 0.7;
      mapStyle['background-image'] = 'select';
      break;

    case "Water":
    case "Terrain":
    case "Buildings":
      current.existingFill = mapStyle['fill-color'];
      current.existingOpacity = mapStyle['fill-opacity'];

      mapStyle['fill-opacity'] = 0.7;
      mapStyle['fill-image'] = 'select';
      break;

    case "Lines":
    case "Roads":
      current.existingOpacity = mapStyle['line-opacity'];
      current.existingLine = mapStyle['line-color'];

      mapStyle['line-opacity'] = 1;
      mapStyle['line-color'] = "#f18e6b";
      break;

    case "Labels":
      current.existingText = mapStyle['text-color'];
      mapStyle['text-color'] = "red";
      break;

    default:
      alert('activatelayer exception!');
  };


  map.style.cascade({transition:!1});
};

function deactivateLayer(layer){
  //replace with original style that we stashed
  var mapStyle = map.style.layermap[layer].paint;

  switch(layerRef.Layers[layer]['Category']) {
    case "Background":
      mapStyle['background-opacity'] = current.existingOpacity;
      //mapStyle['background-color'] = current.existingFill;
      delete(mapStyle['background-image']);
      break;

    case "Water":
    case "Terrain":
    case "Buildings":
      mapStyle['fill-opacity'] = current.existingOpacity;
      delete(mapStyle['fill-image']);
      break;

    case "Lines":
    case "Roads":
      mapStyle['line-opacity'] = current.existingOpacity;
      mapStyle['line-color'] = current.existingLine;
      break;

    case "Labels":
      mapStyle['text-color'] = current.existingText;
      break;

    default:
      alert('activatelayer exception!');
  };

  map.style.cascade({transition:!1});
};

function showEditView(d, i, latlon) {
  if ($('.visible').length>=1){
    //when <li> is clicked, center map on the bubble, and flip the bubble
    //$('.direct-select li').trigger('mouseout');
    $('.dropdown').classed({'expand':true});
    map.panTo(latlon,{duration:600});

    //Set title
    $('.edit-view h2').text(formatText(d));

    var selectedGroup= layerRef['Layers'][d];
    var selectedCat=selectedGroup.Category;
    var MappingScheme= layerRef['Categories'][selectedGroup['Category']]['MappingScheme'];

    //Show proper edit UI based on category of the clicked layer
    $('#'+selectedCat).classed({'editing':true});


    //define layer of each inputarea
    d3.selectAll('.editing .inputarea')
      .attr('layer', function(d, i){return selectedGroup.LayerMapping[MappingScheme[i]]});

    //Populate fields with prop values as they currently stand
    getValues('.editing .inputarea');
  }
}

// Master value editor: updates and applies new style on every keystroke, and converts prop modes accordingly

function setValue(layer, type, prop, value, convert, instant){
  clearTimeout(recordChange);
  var layerindex = stylesheet.layers.map(function(e) { return e.id; }).indexOf(layer);
  var path = stylesheet['layers'][layerindex][type][prop];
  var mapObject = map.style.layermap[layer][type][prop];

  function set(value){console.log(value);
    stylesheet['layers'][layerindex][type][prop] = value;
    map.style.layermap[layer][type][prop] = value
  };

  switch (convert){

          case 'global':
            if(typeof path === 'object') {set(value)};
            //console.log('we just changed a value to global. the new value is: '+JSON.stringify(path));
            break;

          case 'anchor':

            if(typeof path === 'object') {
              var index = path['stops'].map(function(e){return e[0]}).indexOf(value[0]);

              //if currently trans, splice in a new array entry
              if (index == -1) {
                var futurePosition = path['stops'].filter(function(n){return n[0]<value[0]}).length;
                var newAnchor = value;
                path['stops'].splice(futurePosition, 0, newAnchor);
                //console.log('we just added a new anchor. the new value is: '+JSON.stringify(path));
              }
            }
            //if it's currently global, set up new array
            else {
                var newArray= {"stops": value};
                set(newArray);
            }
            break;

          case 'delete':

            //if there's an existing array of length > 1, just pluck out this anchor point
            console.log('this array is currently '+JSON.stringify(path['stops'])+'. The value passed in was '+value);
            if (typeof path === 'object' && path['stops'].length > 1) {
              var index = path['stops'].map(function(e){return e[0]}).indexOf(parseFloat(value[0]));
              mapObject['stops'].splice(index, 1);

              //console.log('we just removed an anchor. the new value is: '+JSON.stringify(path));
            }

            // the array has only one object, convert to global with the last anchor's value
            else
              if (path['stops'].length == 1) {
                set(value[1]);
                getValues();
                //console.log('we just removed the last anchor, converting it to a global value of: '+JSON.stringify(path))
              };
            console.log('after removal, the stops are '+JSON.stringify(path))
            break;

          //moving an anchor to a new zoom level
          case 'move':
            if(value[0] != value[1]){
              var index = path['stops'].map(function(e){return e[0]}).indexOf(value[0]);
              var stopvalue = mapObject.stops[index][1];
              //console.log('the stop we are changing has a value of '+stopvalue);

              //remove old array
              mapObject.stops.splice(index, 1);
              //console.log('after removal, the array looks like: '+JSON.stringify(path.stops));

              //splice in new array
              var futurePosition = path['stops'].filter(function(n){return n[0]<value[1]}).length;
              mapObject.stops.splice(futurePosition, 0, [value[1], stopvalue]);
              //console.log('with the new object inserted, the array looks like: '+JSON.stringify(mapObject.stops))
            }
            break;

          case 'history':
            console.log('sdfsdf');
            set(value);
            break;
          case null:

            //Edit existing anchor
            if(typeof path === 'object') {
                var index = path.stops.map(function(e){return e[0]}).indexOf(value[0]);
                path.stops[index][1] = Math.round(value[1]*100)/100;
                console.log('we just changed an anchor value. Overall, the new value is: '+JSON.stringify(path));
            }
            else {
              set(value);
            //console.log('we just changed a global value. the new value is: '+JSON.stringify(path));

            };
            break;
        }

  recordChange=setTimeout(function(){
    //record history only if we're not traversing the history with undo/redo
    if(convert !='history'){
      current.history.push([layer, type, prop, path, value]); //old value is path, new value is value

      d3.select('.history')
      .selectAll('.step')
      .data(current.history)
      .enter()
      .insert('div','div')
      .attr('class','step pad1')
      .text('Undo '+prop+' ('+formatText(layer)+')')
      .on('click',function(d){
        //alert(d);
        setValue(d[0], d[1], d[2], d[3], 'history', instant)
      });
    }
    fb.set(stylesheet);
  },500);

    //Apply paint changes
    map.style.cascade(instant);

    //Apply (any) layout changes
    if (type=='layout'){map.setStyle(stylesheet)}
};








function getValues(selector) {
    $(selector).each(function(){
        var inputarea = d3.select(this);
        var layer = inputarea.attr('layer');
        var type = inputarea.attr('type');
        var prop = inputarea.attr('prop');
        var value = map.style.layermap[layer][type][prop];
    console.log(value);

        //remove elements from previous inputs
        inputarea.selectAll('.slider, .input, .colorsample, .colordrawer, select').remove();

        //set title
        d3.selectAll('h2')
            .on('mousewheel',function(e){
                event.preventDefault();
              if($('input:hover').length==0 && $('.inputarea:hover').length==0){
                map.zoomTo(map.getZoom()+event.wheelDeltaY*0.01,{offset:differential, animate:false }
              )};
            });

        //if it's a global value, append an input field and populate it with the value
        if (typeof value === 'string' || typeof value === 'number'|| typeof value === 'null') {


          if (inputarea.classed('font')) {
              inputarea
                .selectAll('select')
                .data([1])
                .enter()
                .append('select')
                .on('change', function(){
                  var newFont = d3.select(this).property('value');
                  setValue(layer, type, prop, newFont, null);
                })
                .selectAll('option')
                .data(fonts)
                .enter()
                .append('option')
                .attr('value',function(d,i){return fonts[i]})
                .attr('selected', function(d,i){
                  if (fonts[i]==value){return true}})
                .text(function(d,i){return fonts[i]});
          }

          else if (inputarea.classed('capping')) {
              inputarea
                .selectAll('select')
                .data([1])
                .enter()
                .append('select')
                .on('change', function(){
                  var newFont = d3.select(this).property('value');
                  setValue(layer, type, prop, newFont, null);
                })
                .selectAll('option')
                .data(current.capitalization)
                .enter()
                .append('option')
                .attr('value',function(d,i){return current.capitalization[i][0]})
                .attr('selected', function(d,i){
                  if (fonts[i]==value){return true}})
                .text(function(d,i){return current.capitalization[i][1]});
          }
            else {
              inputarea
                .on('mousewheel',function(e){
                    event.preventDefault();
                    var curElem=d3.select(this);
                    var layer = curElem.attr('layer');
                    var type = curElem.attr('type');
                    var prop = curElem.attr('prop');
                    var input = curElem.select('.input')[0][0];
                    var zoom = parseInt(curElem.attr('zoom'));
                    var curVal = parseFloat(map.style.layermap[layer][type][prop]);
                    var wheelDelta = event.wheelDeltaY;
                    var min=0;
                    var max=99;
                    var increment;
                    var delta;
                    if(curElem.attr('prop').indexOf('opacity')==-1)
                      {increment= 0.02}
                    else {increment= 0.02; max=1};

                    delta=wheelDelta*increment*0.01;

                    var newVal=(curVal-delta).toFixed(4);

                    if (newVal<=max && newVal>=min) {
                      setValue(layer, type, prop, newVal, null, {transition:!1});
                      input.innerHTML = parseFloat(newVal).toFixed(2);
                    }
                })
                .selectAll('.input')
                .data([1])
                .enter()
                .append('div')
                .attr('class', 'text-right input')
                .attr('contenteditable','true')
                .text(function(){if (!isNaN(value)){return parseFloat(value).toFixed(2)} else {return value}})
                .on('keyup', function(){
                  var newVal = d3.select(this)[0][0].innerHTML;
                  setValue(layer, type, prop, newVal, null);
                });

              // mode switcher to transitional
              inputarea
                .select('.mode')
                .classed('global', false)
                .classed('anchor', true)
                .on('click', function() {
                  setValue(layer, type, prop, [ [Math.round(map.getZoom()), map.style.layermap[layer][type][prop]] ], 'anchor', null);
                  getValues('.editing .inputarea');
                });

              //specific to the color UI: nonwheelable, and append the color picker (inspired by http://codepen.io/Zaku/details/fyLKw)
              if(inputarea.classed('color')) {

              //add color circle
              inputarea
                .insert('div','.input')
                .attr('class','colorsample tooltip fr')
                .attr('style', 'background-color:'+value)
                .attr('onclick','d3.select(this).classed("open", !d3.select(this).classed("open"))');

              inputarea.select('.input')
                .on('keyup', function(){
                  var newVal= d3.select(this)[0][0].innerHTML;
                  inputarea.select('.colorsample')[0][0].style.background=newVal;
                  setValue(layer, type, prop, newVal, null);
                  value=newVal;
                });

              //add colorpicker
              inputarea
                .append('div')
                .attr('class','colordrawer')
                .append('div')
                .attr('class', 'downarrow');
              inputarea
                .select('.colordrawer')
                .append('div')
                .attr('class', 'rainbow');
              inputarea
                .select('.colordrawer')
                .append('div')
                .attr('class','lightness')
                .text(" ←  Lightness  →");
              inputarea
                .select('.colordrawer')
                .append('div')
                .attr('class','alpha');

              inputarea
                .select('.colordrawer')
                .append('div')
                .attr('class','colorbox')
                .attr("style", "background-color: " + value)
                .on('mousemove', function(e) {
                  var maxX, maxY, x, y;
                  maxX = 280;
                  maxY = 210;
                  x = event.offsetX;
                  y = event.offsetY;
                  h = ~~(x / maxX * 360);
                  l = ~~( y / maxY * 10000) / 100;
                  draw();
                  $('.downarrow')
                    .style('-webkit-transform','translateX('+x+'px)');
                })
                .on("mousewheel", function(e) {
                    event.preventDefault();
                    var delta;
                    if (event.wheelDelta) {
                      delta = event.wheelDelta / 120;
                    }

                    if (event.details) {
                      delta = -event.details;
                    }

                    s = Math.max(0, Math.min(100, s + delta * 5));
                    draw();
                })
                .on('click', function(){
                  inputarea
                    .select('.colorsample')
                    .classed('open', false);
                  value=map.style.layermap[layer][type][prop];
                })
                .on('mouseleave', function(){
                    colorbox.attr("style", "background-color: " + value);
                    inputarea.select('.colorsample').attr("style", "background-color: " + value);
                    inputarea.select('.input')
                      .text(value);
                    setValue(layer, type, prop, value, null, {transition:!1});
                });


                var draw, h, l, s, colorbox;

                h = ~~(Math.random() * 360);
                s = 50;
                l = 50;
                colorbox = inputarea.select('.colorbox');

                draw = function() {
                  var hsl, rgb;
                  hsl = new d3.hsl(h, s / 100.0, l / 100.0);
                  rgb = new d3.rgb(hsl);

                  colorbox.attr("style", "background-color: " + hsl.toString());
                  $('.colorcircle').style('background-color',hsl.toString());
                  inputarea.select('.colorsample').attr("style", "background-color: " + hsl.toString());
                  inputarea.select('.input')
                    .text(hsl.toString());
                  setValue(layer, type, prop, hsl.toString(), null, {transition:!1});
                };
            }
              else {inputarea.classed('wheelable', true)}
            }
        }

        //if it's a ranged thing, we gotta build a fucking slider
        if (typeof value === 'object') {


          var slider =  inputarea.classed('wheelable',false)
                        .append('div')
                        .attr('class', 'slider');
          inputarea
            .select('.mode')
            .classed('global', true)
            .classed('anchor', false)
            .on('click', function(){
              setValue(layer, type, prop, 1, 'global', null);
              getValues('.editing .inputarea');
              //d3.select(this).trigger('mouseout').trigger('mouseover');
            });

          //set up the basic slider and needle
          slider
            .append('div')
            .attr('class','zoomneedle')
            .attr('style', 'left:'+(map.getZoom()*5-2.5)+'%')
            ;

          var gridlines=[1,1,1,1,1,2,1,1,1,1,2,1,1,1,1,2,1,1,1,1,1];

          //make the hover area, svg, and path
            slider
            .append('div')
            .attr('class','slidersegment')
            .on('mousewheel',function(e){
              event.preventDefault();
              map.zoomTo(map.getZoom()+event.wheelDeltaY*0.01,{offset:differential, animate:false });
            })
            .on('click', function() {
              var roundedzoom = Math.round(20*event.offsetX/210);
              setValue(layer, type, prop, [roundedzoom, 1], 'anchor', null);
              updateSliderStop(slider, value.stops, layer, type, prop);
            })
            .append('svg')
            .selectAll('line')
            .data(gridlines)
            .enter()
            .append('line')
            .attr('class',function(d,i){
              if(i%5==0){return 'fifth'}
            })
            .attr('x1', function(d,i){return 10*i+5})
            .attr('x2', function(d,i){return 10*i+5})
            .attr('y1',0)
            .attr('y2',50);

            slider.select('svg')
            .append('path');


          //add stops for the first time
          updateSliderStop(slider, value.stops, layer, type, prop);



        }
    })
  
};

function updateSliderStop(slider, data, layer, type, prop){
    var stops=slider
      .selectAll('.stop')
      .data(data, function(d) {return d});

    //moving ramp stops

    var stopsWithBubbles= 
    stops
      .enter()
      .append('div')
      .attr('class', 'stop wheelable')
      .attr('layer', layer)
      .attr('type', type)
      .attr('prop', prop)
      .attr('zoom',function(d){return d[0]})
      .attr('style',function(d,i) {return 'left:'+d[0]*10+'px'})
      .on('mousedown', function(d){
        d3.event.preventDefault(); // disable text dragging
        var startx=d3.event.clientX;
        var startoffset=d[0]*10; 
        var currentstop=d3.select(this);

        var w = d3.select(window)
            .on("mousemove", mousemove)
            .on("mouseup", mouseup);

        function mousemove() {
          var currentx = startoffset+d3.event.clientX-startx;
          if (currentx >= 0 && currentx <= 200 && data.map(function(e){return e[0]}).indexOf(Math.round(currentx/10))==-1)
          {
          
            updateSliderStop(slider, data, layer, type, prop);
            currentstop
              .attr('style', function() {return 'left:' + currentx +'px'})
              .attr('zoom', Math.round(currentx*0.1));
          }
        }

        function mouseup() {
          w.on("mousemove", null).on("mouseup", null);

          var rounded = Math.round((startoffset+d3.event.clientX-startx)/10)*10;
          console.log(data.map(function(e){return e[0]}).indexOf(Math.round(rounded/10)));

          if (rounded >= 0 && rounded <= 200 && data.map(function(e){return e[0]}).indexOf(Math.round(rounded/10))==-1) {

            setValue(layer, type, prop, [Math.round(startoffset*0.1), Math.round(rounded*0.1)], 'move', null);
            updateSliderStop(slider, data, layer, type, prop);
          };
        }
      })
      .on('mousewheel',function(d){
          event.preventDefault();
          var curElem=d3.select(this);
          var layer = curElem.attr('layer');
          var type = curElem.attr('type');
          var prop = curElem.attr('prop');
          var input = curElem.select('.input')[0][0];
          var zoom = d[0];
          var curVal = parseFloat(d[1]);
          var wheelDelta = event.wheelDeltaY;
          var min=0;
          var max=99;
          var increment;
          var delta;
          if(curElem.attr('prop').indexOf('opacity')==-1)
            {increment= 0.02}
          else {increment= 0.02; max=1};

          delta=wheelDelta*increment*0.01;

          var newVal=(curVal-delta).toFixed(4);

          if (newVal<=max && newVal>=min) {
            setValue(layer, type, prop, [zoom, newVal], null, {transition:!1});
            input.innerHTML = parseFloat(newVal).toFixed(2);
            updateSliderStop(slider, data, layer, type, prop)
          }
      })




      //draw stop bubble
        .append('div')
        .attr('class','stopbubble');


        stopsWithBubbles
          .append('span')
          .on('click', function(d){
          console.log(d);
          var zoom = d[0];

          setValue(layer, type, prop, [zoom, 1], 'delete', null);
          updateSliderStop(slider, data, layer, type, prop)
        })
        .text('✕ ');

        stopsWithBubbles
        .append('div')
        .attr('class','input')
        .attr('contenteditable','true')
        .text(function(d,i){return d[1]});


  //draw each stop's dot
  stops.selectAll('.dot')
    .data([1])
    .enter()
    .insert('span', '.stopbubble')
    .attr('class','dot')
    .text('⋅');



  stops.exit().remove();


//draw the curve

  var w=210;
  var h=48;

  var input = data;
  var ymax = d3.max(input.map(function(n){return n[1]}));

  var output=input.map(function(n){return {"x":n[0], "y":n[1]}});

  if (output[0]['x']!=0){output.unshift({'x':0, 'y': output[0]['y']})};
  if (output.slice(-1)[0]!=20){output.push({'x': 20, 'y': output.slice(-1)[0]['y']})};
  var scalex = d3.scale
    .linear()
    .domain([0, 20])
    .range([0, w]);

            var scaley =
              d3.scale
              .linear()
              .domain([0, ymax])
              .range([0.5, 0.4*h*0.5]);

            var area = d3.svg.area()
                .x(function(d) { return scalex(d.x) })
                .y0(function(d) { return -scaley(d.y)+0.5*h })
                .y1(function(d) { return scaley(d.y)+0.5*h })
                .interpolate("basis");

            slider.select('.slidersegment').select('path')
            .attr('d',area(output));

}


for (var object in stylesheet.layers) {
  for (var property in stylesheet.layers[object]['paint']) {
    if (stylesheet.layers[object]['paint'][property]==1) {
      console.log(stylesheet.layers[object]['id']+"'s "+property)
    }
  }
}


