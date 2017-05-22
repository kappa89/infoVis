var svg = d3.select("svg");
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
var numberOfFlowers = 30;
var flowerRadius = 30;
var globalCenter = [width/2.0,
                    height/2.0];

var nodes = d3.range(numberOfFlowers+1).map(function() { return {}; }),
    root = nodes[0];

root.radius = 50;
root.fixed = true;

var force = d3.layout.force()
    .gravity(0.0)
    .charge(function(d,i){return i ? -0.01 : -500;})
    .nodes(nodes)
    .size([width, height]);

force.start();

svg.selectAll("image")
    .data(nodes.slice(1)) //no root
    .enter().append("svg:image")
    .attr("xlink:href", "img/clover.svg")
    .attr("height", flowerRadius);

function setCenter(index)
{
    index = index + 1;
    nodes[index].x = globalCenter[0];
    nodes[index].y = globalCenter[1];
    nodes[index].px = globalCenter[0];
    nodes[index].py = globalCenter[1];
}

force.on("tick", function(e) {
 svg.selectAll("image")
      .attr("x", function(d, i) {
          if((d.x > (width - flowerRadius*1.5)) || d.x < 0)
          {
              return setCenter(i);
          }
          return d.x;
        })
      .attr("y", function(d, i) {
         if(d.y > (height-flowerRadius*1.5) || d.y < 0)
         {
              return setCenter(i);
          }
          return d.y;
    });
});

svg.on("mousemove", function() {
  var p1 = d3.mouse(this);
  root.px = p1[0];
  root.py = p1[1];
  force.resume();
});