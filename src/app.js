(function(d3){

  var app = {};

  app.sectionPaths;
  app.sectionHTMLFragments = [];
  app.sectionsLoaded = 0;

  app.getSections = function () {
    var sectionPaths = './src/sections.txt';
    d3.text(sectionPaths, function (data) {
      app.sectionPaths = data.split('\n').filter(function(n) {return !!n;});
      for (var i = 0; i < app.sectionPaths.length; i++) {
        app.loadHTMLFragment('sections/' + app.sectionPaths[i], i);
      }
    });
  };

  app.init = function () {
    app.getSections();
  };

  app.loadHTMLFragment = function (path, index) {
    var html, md;
    if (path.indexOf('.html') > -1) {html = true;}
    if (path.indexOf('.md') > -1) {md = true;}

    if (html) {
      d3.html(path, function (data) {
        app.sectionHTMLFragments[index] = data;
        app.sectionsLoaded++;
        if (app.sectionsLoaded >= app.sectionPaths.length) {
          app.render(app.sectionHTMLFragments);
        }
      });
    } else if (md) {
      d3.text(path, function (data) {
        app.sectionHTMLFragments[index] = markdownToFragment(data);
        app.sectionsLoaded++;
        if (app.sectionsLoaded >= app.sectionPaths.length) {
          app.render(app.sectionHTMLFragments);
        }
      });
    }
  };

  app.activateMap = function () {
    var height = window.innerHeight / 3;
    var width = 860;

    var projection = d3.geo.equirectangular();
    projection.center([38, -5]);
    projection.scale(200);

    var svg = d3.select(".antebellum-map").append("svg")
      .attr("width", width)
      .attr("height", height);
    var path = d3.geo.path()
      .projection(projection);
    var g = svg.append("g");

    d3.json("./lib/world-110m2.json", function(error, topology) {
      g.selectAll("path")
      .data(topojson.object(topology, topology.objects.countries)
        .geometries)
      .enter()
      .append("path")
      .attr("d", path)
    }); 

    var zoom = d3.behavior.zoom()
      .on("zoom", function() {
        g.attr("transform", "translate("+ d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");
        g.selectAll("circle")
        .attr("d", path.projection(projection));
      g.selectAll("path")  
        .attr("d", path.projection(projection)); 
      });

    svg.call(zoom);
  };

  app.render = function (HTMLFragments) {
    var body = d3.select('body');
    body.append('div').classed('container', true);
    var container = d3.select('.container');
    container.append('img')
      .attr('width', 70)
      .attr('height', 65)
      .style('margin-bottom', -55)
      .attr('src', './images/hellfire-bw.png');

    for (var i = 0; i < HTMLFragments.length; i++) {
      container
        .node()
        .appendChild(HTMLFragments[i]);
    }

    app.afterRender();
  };

  app.beforeRender = function () {
    return true;
  };

  app.afterRender = function () {
    app.activateMap();
  };

  function markdownToFragment (markdownString) {
    var node = document.createElement('template');
    node.innerHTML = '<div class="card">' + marked(markdownString) + '</div>';
    return node.content;
  };

  window.app = app;

})(d3)
