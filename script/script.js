var svg = d3.select("svg");

//funzione per restituire valori dell'SVG adattato alla pagina
function getRealSVGDimensions(){
	var winH = window.innerHeight;
	var winW = window.innerWidth;
	var svgPercH = svg.attr("height").slice(0, -1);
	var svgPercW = svg.attr("width").slice(0, -1);

	return {"H":(winH*(svgPercH/100.0)), "W": (winW*(svgPercW/100.0))};
}

var svgDimensions = getRealSVGDimensions();

var width = svgDimensions.W,
    height = svgDimensions.H;

var numberOfFlowers = 30; //numero di quadrifogli
var flowerDimension = 30; //dimensione quadrifoglio
var globalCenter = [width/2.0, //centro in cui riposiziono i quadrifogli
                    height/2.0];
var fixScale = 1.5;

var nodes = d3.range(numberOfFlowers+1).map(function() { return {}; }),
    root = nodes[0]; //mouse

root.radius = 100;
root.fixed = true;

var force = d3.layout.force() //tuning della forza
    .gravity(0.0)
    .charge(function(d,i){return i ? -10 : -500;})
    .nodes(nodes)
    .size([width, height]);

force.start(); //use the force luke!

svg.selectAll("image")
    .data(nodes.slice(1)) //no root
    .enter().append("svg:image")
    .attr("xlink:href", "img/clover.svg")
    .attr("height", flowerDimension);

//funzione per traslare i quadrifogli al centro
function setCenter(index) 
{
    index++;
    
    nodes[index].x = globalCenter[0];
    nodes[index].px = globalCenter[0];
    
    nodes[index].y = globalCenter[1];
    nodes[index].py = globalCenter[1];
    
}

//funzione per delimitare i quadrifogli dentro l'area
force.on("tick", function(e) {
 svg.selectAll("image")
      .attr("x", function(d, i) {
          if((d.x > (width - flowerDimension*fixScale)) || d.x < 0)
          {
              d.opacity = 0;
              return setCenter(i);
          }
          return d.x;
        })
      .attr("y", function(d, i) {
         if(d.y > (height-flowerDimension*fixScale) || d.y < 0)
         {
              return setCenter(i);
          }
          return d.y;
    });
});

//funzione posizione del mouse
svg.on("mousemove", function() {
  var p1 = d3.mouse(this);
  root.px = p1[0];
  root.py = p1[1];
  force.resume();
});