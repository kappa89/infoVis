var width = 960,
    height = 500;

var flowerRadius = 30;
var globalCenter = [width/2.0,
                    height/2.0];

var nodes = d3.range(30).map(function() { return {radius : "a"}; }),
    root = nodes[0];

root.radius = 50;
root.fixed = true;

var force = d3.layout.force()
    .gravity(0.0)
    .charge(function(d,i){return i ? 0 : -500;})
    .nodes(nodes)
    .size([width, height]);

force.start();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
    
    svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("stroke", "black")
    .style("fill", "none")
    .style("stroke-width", 3);


svg.selectAll("image")
    .data(nodes.slice(1)) //no root
    .enter().append("svg:image")
    .attr("xlink:href", "img/clover.svg")
    .attr("height", "10%");

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
          if((d.x > (width - flowerRadius)) || d.x < flowerRadius)
          {
              return setCenter(i);
          }
          return d.x;
        })
      .attr("y", function(d, i) {
         if(d.y > height-flowerRadius || d.y < flowerRadius)
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