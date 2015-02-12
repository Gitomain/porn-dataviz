  function wordCloud(chart_svg) {

        var fill = d3.scale.category20();
        var width = document.getElementById("containerSouth").getElementsByClassName("right")[0].offsetWidth;
        var height = 400;

      //Construct the word cloud's SVG element
        var svg = d3.select(chart_svg).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + height / 2 + "," + height / 2 + ")");


         function draw(words) {

               var cloud = svg.selectAll("g text")
                .data(words, function(d) { return d.text; })

               //Entering words
                cloud.enter()
                    .append("text")
                    .style("font-family", "Impact")
                    .style("fill", function(d, i) { return fill(i); })
                    .attr("text-anchor", "middle")
                    .attr('font-size', 1)
                    .text(function(d) { return d.text; });

                //Entering and existing words
                cloud.transition()
                        .duration(600)
                        .style("font-size", function(d) { return d.size + "px"; })
                        .attr("transform", function(d) {
                            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                        })
                        .style("fill-opacity", 1);

                //Exiting words
                cloud.exit()
                    .transition()
                        .duration(200)
                        .style('fill-opacity', 1e-6)
                        .attr('font-size', 1)
                        .remove();

           }

        //Use the module pattern to encapsulate the visualisation code. We'll
        // expose only the parts that need to be public.
        return {
            //Recompute the word cloud for a new set of words. This method will
            // asycnhronously call draw when the layout has been computed.
            //The outside world will need to call this function, so make it part
            // of the wordCloud return value.
            update: function(data) {
                d3.layout.cloud().size([width - 100, height - 100])
                        .words(data.map(function (d) {
                            return {text: censorship(d.tag), size: d.size / 2};
                        }))
                        .padding(5)
                        .rotate(function () {
                            return ~~(Math.random() * 2) * 90;
                        })
                        .font("Impact")
                        .fontSize(function (d) {
                            return d.size / 2;
                        })
                        .on("end", draw)
                        .start();
            }
        }
}