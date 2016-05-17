$(function() {
    // This will select everything with the class smoothScroll
    // This should prevent problems with carousel, scrollspy, etc...
    $('.smoothScroll').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 8000); // The number here represents the speed of the scroll in milliseconds
                return false;
            }
        }
    });
});



var sensor_names;
var select;
var current_sensor;


var map_data;
var geo_data;
var map;
var map_w = 600;
var map_h = 400;

function populate_select(names)
{
    console.log(names);
    current_sensor = names[0];
    select = d3.select("#sensor_opt");

    select.on("change", function(d)
              {
                  current_sensor = d3.select(this).property("value");

                  update_map(current_sensor);

                  console.log(current_sensor);
              });

     select.selectAll("option")
        .data(names)
        .enter()
        .append("option")
        .attr("value", function (d) { return d; })
        .text(function (d) { return d; });





}


function populate_map(map_data)
{
}


function draw_map(geojson)
{
    
    map = d3.select("#map").append("svg")
        .attr('width', map_w)
        .attr('height', map_h);

    var projection = d3.geo.albers()
        .scale(1)
        .translate([0,0]);

    var path = d3.geo.path()
        .projection(projection);
    
    var b = path.bounds(geojson),
        s = .95 / Math.max((b[1][0] - b[0][0]) / map_w, (b[1][1] - b[0][1]) / map_h),
        t = [(map_w- s * (b[1][0] + b[0][0])) / 2, (map_h- s * (b[1][1] + b[0][1])) / 2];

    
    // Update the projection to use computed scale & translate.
    projection
        .scale(s)
        .translate(t);


    map.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style('fill', 'steelblue');
}


d3.json("sensor_list.json", function(error, json)
        {
            if(error) return console.warn.error();

            sensor_names = json;

            populate_select(json);
        });



