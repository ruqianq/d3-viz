const margin = {top: 10, right: 10, bottom: 130, left: 100},
  width = 600 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

const svg = d3.select('#chart-area').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)

const g = svg.append('g')
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

// set the ranges
const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleBand().range([height, 0])
  .paddingInner(0.3)
  .paddingOuter(0.2);


