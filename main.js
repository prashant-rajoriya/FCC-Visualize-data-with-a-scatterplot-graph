d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function(err, data) {
  if(err) throw err;

  let width = 900;
  let height = 500;
  let padding = 60;
  data.map( d => {
    d.Place = +d.Place;
    let temp = d['Time'].split(':');
    d['Time'] = new Date(Date.UTC(1970, 0, 1, 0, temp[0], temp[1]));
  });
  
  let svg = d3.select('svg')
              .attr('width', width+100)
              .attr('height', height + 60);

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
  
}); 
