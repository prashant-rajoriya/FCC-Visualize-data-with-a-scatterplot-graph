d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function(err, data) {
  if(err) throw err;

  let width = 900;
  let height = 500;
  let padding = 60;
  var timeParse = d3.timeParse("%M:%S");
  let legends = [
    {
      'text' : "Riders with doping allegations",
      'color' : 'blue'
    },
    {
      'text' : "No doping allegations",
      'color' : 'green'
    }
  ];
  
  data.map( d => {
    d['Time'] = timeParse(d.Time);
  });
  
  let svg = d3.select('svg')
              .attr('width', width+100)
              .attr('height', height + padding);

  let xScale = d3.scaleLinear()
                  .domain([d3.min(data, d => d['Year']-1), d3.max(data, d => d['Year'] +1)])
                  .range([0,width]);
  
  let yScale = d3.scaleTime()
                  .domain(d3.extent(data, d => d.Time))
                  .range([padding, height]);

  let xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format('d'));

  let timeFormat = d3.timeFormat("%M:%S");

  let yAxis = d3.axisLeft(yScale)
                .tickFormat(timeFormat);

  let toolTip = d3.select('.holder')
                  .append('div')
                  .classed('tooltip',true)
                  .attr('id', 'tooltip')
                  .style('opacity', 0);

  svg.append('g')
      .attr('transform', `translate(${padding},${height})`)
      .attr('id', 'x-axis')
      .call(xAxis);

  svg.append('g')
      .attr('transform', `translate(${padding},0)`)
      .attr('id', 'y-axis')
      .call(yAxis);

  svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height/2)
      .attr('dy', '.75em')
      .style('font-size', '1.3em')
      .style('text-anchor', 'middle')
      .text('Time in Minutes');

  svg.append('text')
      .attr('x', width/2)
      .attr('y', height + padding)
      .attr('dy', -15)
      .style('font-size','1.3em')
      .style('text-anchor', 'middle')
      .text('Years');
    
  svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .classed('dot', true)
      .attr('cx', d => xScale(d.Year))
      .attr('cy', d => yScale(d.Time))
      .attr('r', 8)
      .attr('fill', d => d.Doping? 'blue' : 'green')
      .attr('data-xvalue', d => d.Year)
      .attr('data-yvalue', d => d.Time.toISOString())
      .attr('transform', `translate(60,0)`)
      .style('stroke', 'black')
      .style('stroke-width', '1')
      .on('mousemove', d => {
        toolTip
          .transition()
          .duration(200)
          .style('opacity', 1);

        toolTip
          .style('left', d3.event.x - 4*padding + 10 + 'px')
          .style('top', d3.event.y - 3*padding -20 + 'px')
          .attr('data-year', d.Year)
          .html(`
            <p>Name : ${d.Name}</p>
            <p>Year : ${d.Year}</p>
            <p>Time : ${timeFormat(d.Time)}</p>
            <p>Nationality : ${d.Nationality}</p>
            <p>Doping : ${d.Doping? d.Doping:"No Charges on player"}</p>
            `)
      })
      .on('mouseout', d => {
        toolTip
          .transition()
          .duration(200)
          .style('opacity', 0);
      })
  
  var legend = svg.selectAll(".legend")
                  .data(legends)
                  .enter()
                  .append("g")
                  .attr("class", "legend")
                  .attr("id", "legend")
                  .attr("transform", function(d, i) {
                    return "translate(0," + (height/10 - i * 20) + ")";
                  });
  
    legend.append("rect")
      .attr("x", width + padding)  
      .attr("width", 18)
      .attr("height", 18)
      .style('stroke', 'black')
      .style('stroke-width', 1)
      .style("fill", d => d.color);
  
    legend.append("text")
      .attr("x", width+ padding -10)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(d => d.text);
  
}); 
