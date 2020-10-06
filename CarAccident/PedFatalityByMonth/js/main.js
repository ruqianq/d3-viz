const margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

const svg = d3.select("#chart-area").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

const g = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

// set the ranges
var x = d3.scaleBand().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

d3.csv("data/sas_test_data.csv").then(function(data) {



})