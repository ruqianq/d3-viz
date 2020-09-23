/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

const MARGIN = {LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100}
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

let flag = true

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// X label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Month")

// Y label
const yLabel = g.append("text")
  .attr("class", "y axis-label")
  .attr("x", -(HEIGHT / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")

const x = d3.scaleBand()
  .range([0, WIDTH])
  .paddingInner(0.3)
  .paddingOuter(0.2)

const y = d3.scaleLinear()
  .range([HEIGHT, 0])

// X Axis
const xAxisCall = d3.axisBottom(x)

g.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT})`)
  .call(xAxisCall)

// Y Axis
const yAxisCall = d3.axisLeft(y)
g.append("g")
  .attr("class", "y axis")
  .call(yAxisCall)

d3.csv("data/vehicle_accidents.csv").then(data => {
  data.forEach(d => d.Frequency = Number(d.Frequency))

  let allModels = [...new Set(data.map(d => d.vehicle_make_name))]

  d3.select("#selectButton")
    .selectAll('myOption')
    .data(allModels)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; })

  let testData = data.filter((d) => {
    return d.vehicle_make_name === "Acura" && d.sas_yr_of_crsh === "2015"
  })

  d3.interval(() => {
    flag = !flag
    const newData = flag ? testData : data.filter((d) => {
      return d.vehicle_make_name === "Acura" && d.sas_yr_of_crsh === "2016"
    })
    update(newData)
  }, 1000)

  update(testData)
})

function update(data) {
  const t = d3.transition().duration(750)
  x.domain(data.map(d => d.sas_mnth_of_crsh))
  y.domain([0, d3.max(data, d => d.Frequency)])

  const rects = g.selectAll("rect")
    .data(data, d => d.sas_mnth_of_crsh)

  rects.exit().remove()

  rects.enter().append("rect")
    .attr("fill", "grey")
    .attr("x", (d) => x(d.sas_mnth_of_crsh))
    .attr("width", x.bandwidth)
    // AND UPDATE old elements present in new data.
    .merge(rects)
    .transition(t)
    .attr("y", d => y(d.Frequency))
    .attr("height", d => HEIGHT - y(d.Frequency))

}
