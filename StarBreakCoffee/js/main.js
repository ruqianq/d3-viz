/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

d3.csv("data/revenues.csv").then(data => {
  data.forEach(d => {
    d.revenue = +d.revenue;
    d.profit = +d.profit
  })

  const revenueBars = svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.revenue)])
    .range([HEIGHT, 0])

  const x = d3.scaleBand()
    .domain(data.map(d => d.month))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2)


  revenueBars
    .attr("y", d => y(d.revenue))
    .attr("x", d => x(d.month))
    .attr("width", x.bandwidth)
    .attr("height", d => HEIGHT - y(d.revenue))
    .attr("fill", "grey")

})

// Or you could do this within the csv
//
// d3.csv("data/revenues.csv", (data) => {
//   data.forEach(d => {
//     d.revenue = +d.revenue;
//     d.profit = +d.profit
//   })
// })