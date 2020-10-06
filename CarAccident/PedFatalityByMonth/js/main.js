const margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

const svg = d3.select('#chart-area').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)

const g = svg.append('g')
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleBand().range([height, 0]).paddingInner(0.3)
  .paddingOuter(0.2);

d3.csv("data/sas_test_data.csv").then(function(data) {
  data.forEach(d => {
    d.Frequency = parseInt(d.Frequency.replace(/,/g, ''))
  })
  let result = []
  let yearSum = 0;
  let p = 0;
  while (p < data.length - 1) {
    if (data[p].sas_yr_of_crsh !== data[p+1].sas_yr_of_crsh) {

    }
    yearSum += data[p].Frequency
  }


  y.domain(data.map(d => d.sas_yr_of_crsh))
  x.domain([0, d3.max(data, d => d.Frequency)])

  const rects = g.selectAll("rect").data(data)

  rects.enter().append('rect')
    .attr('x', (d) => x(d.Frequency))
    .attr('y', (d) => y(d.sas_yr_of_crsh))
    .attr('width', y.bandwidth)
    .attr('height', (d) => width - x(d.Frequency))
    .attr('fill', 'red')
})