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
    var html, md;
    if (path.indexOf('.html') > -1) {html = true;}
    if (path.indexOf('.md') > -1) {md = true;}
    
    if (html) {
      d3.html(path, function (data) {
        app.sectionHTMLFragments[index] = data;
        app.sectionsLoaded++;
        if (app.sectionsLoaded >= app.sectionPaths.length) {
          app.write(app.sectionHTMLFragments);
        }
      });
    } else if (md) {
      d3.text(path, function (data) {
        var node = document.createElement('template');
        node.innerHTML = marked(data);
        var fragment = node.content;
        app.sectionHTMLFragments[index] = fragment;
        app.sectionsLoaded++;
        if (app.sectionsLoaded >= app.sectionPaths.length) {
          app.write(app.sectionHTMLFragments);
        }
      });
    }
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
