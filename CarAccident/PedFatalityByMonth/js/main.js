const margin = {top: 10, right: 10, bottom: 130, left: 100},
      width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

const svg = d3.select('#chart-area').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)

const g = svg.append('g')
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleBand().range([height, 0])
  .paddingInner(0.3)
  .paddingOuter(0.2);

d3.csv("data/sas_test_data.csv").then(function(data) {
  data.forEach(d => {
    d.Frequency = parseInt(d.Frequency.replace(/,/g, ''))
  })
  const sumOf2015 = data.filter(d => d.sas_yr_of_crsh === "2015").reduce((a, b) => {
    a += b.Frequency
    return a
  }, 0)

  const sumOf2016 = data.filter(d => d.sas_yr_of_crsh === "2016").reduce((a, b) => {
    a += b.Frequency
    return a
  }, 0)

  const sum = [
    {
      "year": "2015",
      "number": sumOf2015
    },
    {
      "year": "2016",
      "number": sumOf2016
    }
  ];

  y.domain(sum.map(d => d.year))
  x.domain([0, d3.max(sum, d => d.number)])

  const rects = g.selectAll("rect").data(sum)

  rects.enter().append('rect')
    .attr('x', 0)
    .attr('y', (d) => y(d.year))
    .attr('height', y.bandwidth)
    .attr('width', d => x(d.number))
    .attr('fill', 'red')
})