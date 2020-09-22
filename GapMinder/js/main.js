/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

const MARGIN = {LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100}
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

let year = 0

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// hard coded domain, need to change
const x = d3.scaleLog().base(10).range([0, WIDTH]).domain([142, 150000])
const y = d3.scaleLinear().range([HEIGHT, 0]).domain([0, 90])
const area = d3.scaleLinear().range([25 * Math.PI, 1500 * Math.PI]).domain([2000, 1400000000])
const continentColor = d3.scaleOrdinal(d3.schemePastel1)

// Labels
const xLabel = g.append("text")
  .attr("y", HEIGHT + 50)
  .attr("x", WIDTH / 2)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("GDP Per Capita ($)")
const yLabel = g.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -40)
  .attr("x", -170)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Life Expectancy (Years)")
const timeLabel = g.append("text")
  .attr("y", HEIGHT - 10)
  .attr("x", WIDTH - 40)
  .attr("font-size", "40px")
  .attr("opacity", "0.4")
  .attr("text-anchor", "middle")
  .text("1800")

// X Axis
const xAxisCall = d3.axisBottom(x)
  .tickValues([400, 4000, 40000])
  .tickFormat(d3.format("$"));
g.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT})`)
  .call(xAxisCall)

// Y Axis
const yAxisCall = d3.axisLeft(y)
g.append("g")
  .attr("class", "y axis")
  .call(yAxisCall)

d3.json("data/data.json").then(function (data) {
  const allData = data.map((y) => {
    return y.countries.filter((c) => (c.income !== null && c.life_exp !== null
      && c.population !== null
    ))
  })

  d3.interval(() => {
    // hard coded
    year = (year < 214) ? year + 1 : 0
    update(allData[year])
  }, 100)

  // first run of the visualization
  update(allData[0])
})

function update(data) {
  const t = d3.transition().duration(100)

  // JOIN new data with old elements.
  const circles = g.selectAll("circle")
    .data(data, d => d.country)

  // EXIT old elements not present in new data.
  circles.exit().remove()

  // ENTER new elements present in new data...

  circles.enter()
    .append("circle")
    .attr("fill", (d) => continentColor(d.continent))
    .merge(circles)
    .transition(t)
    .attr("cy", (d) => y(d.life_exp))
    .attr("r", d => Math.sqrt(area(d.population) / Math.PI))
    .attr("cx", (d) => x(d.income))

}