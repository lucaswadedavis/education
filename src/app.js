(function(d3){
  
  var app = {};
  
  app.sectionPaths;
  app.sectionHTMLFragments = [];
  app.sectionsLoaded = 0;

  app.getSections = function () {
    var sectionPaths = './src/sections.json';
    d3.json(sectionPaths, function (data) {
      app.sectionPaths = data.paths;
      for (var i = 0; i < app.sectionPaths.length; i++) {
        app.loadHTMLFragment(app.sectionPaths[i], i);
      }
    });
  };

  app.init = function () {
    app.getSections();
  };

  app.loadHTMLFragment = function (path, index) {
    d3.html(path, function (data) {
      app.sectionHTMLFragments[index] = data;
      app.sectionsLoaded++;
      if (app.sectionsLoaded >= app.sectionPaths.length) {
        app.write(app.sectionHTMLFragments);
      }
    });
  };

  app.write = function (HTMLFragments) {
    for (var i = 0; i < HTMLFragments.length; i++) {
      d3.select("body")
        .node()
        .appendChild(HTMLFragments[i]);
    }
  };
  
  window.app = app;

})(d3)
