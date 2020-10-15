/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 3 - CoinStats
*/
		
const MARGIN = { LEFT: 20, RIGHT: 100, TOP: 50, BOTTOM: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

let formattedData

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// time parser for x-scale
const parseTime = d3.timeParse("%d/%m/%Y")
// for tooltip
const bisectDate = d3.bisector(d => d.date).left

// Tooltip
// const tip = d3.tip()
// 	.attr('class', 'd3-tip')
// 	.html(d => {
// 	})
// g.call(tip)

// scales
const x = d3.scaleTime().range([0, WIDTH])
const y = d3.scaleLinear().range([HEIGHT, 0])

// axis generators
const xAxisCall = d3.axisBottom()
const yAxisCall = d3.axisLeft()
	.ticks(6)
	.tickFormat(d => `${parseInt(d / 1000)}k`)

// axis groups
const xAxis = g.append("g")
	.attr("class", "x axis")
	.attr("transform", `translate(0, ${HEIGHT})`)
const yAxis = g.append("g")
	.attr("class", "y axis")

xAxis.call(xAxisCall.scale(x))
yAxis.call(yAxisCall.scale(y))
    
// y-axis label
yAxis.append("text")
	.attr("class", "axis-title")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end")
	.attr("fill", "#5D6971")

let value = "price_usd"

// line path generator
const line = d3.line()
	.x(d => x(d.date))
	.y(d => y(d[value]))

d3.json("data/coins.json").then(data => {

	formattedData = data
	let bitcoin = data["bitcoin"]

	bitcoin.forEach(d => {
		d.date = parseTime(d.date)
		d.price_usd = Number(d.price_usd)
		d.market_cap = Number(d.market_cap)
		d["24h_vol"] = Number(d["24h_vol"])
	})

	// set scale domains
	x.domain(d3.extent(bitcoin, d => d.date))
	y.domain([
		d3.min(bitcoin, d => d[value]) / 1.005,
		d3.max(bitcoin, d => d[value]) * 1.005
	])

	// add line to chart
	g.append("path")
		.attr("class", "line")
		.attr("fill", "none")
		.attr("stroke", "grey")
		.attr("stroke-width", "3px")
		.attr("d", line(bitcoin))

	/******************************** Tooltip Code ********************************/

	const focus = g.append("g")
		.attr("class", "focus")
		.style("display", "none")

	focus.append("line")
		.attr("class", "x-hover-line hover-line")
		.attr("y1", 0)
		.attr("y2", HEIGHT)

	focus.append("line")
		.attr("class", "y-hover-line hover-line")
		.attr("x1", 0)
		.attr("x2", WIDTH)

	focus.append("circle")
		.attr("r", 7.5)

	focus.append("text")
		.attr("x", 15)
		.attr("dy", ".31em")

	g.append("rect")
		.attr("class", "overlay")
		.attr("width", WIDTH)
		.attr("height", HEIGHT)
		.on("mouseover", () => focus.style("display", null))
		.on("mouseout", () => focus.style("display", "none"))
		.on("mousemove", mousemove)

	function mousemove() {
		const x0 = x.invert(d3.mouse(this)[0])
		const i = bisectDate(data, x0, 1)
		const d0 = data[i - 1]
		const d1 = data[i]
		const d = x0 - d0.date > d1.date - x0 ? d1 : d0
		focus.attr("transform", `translate(${x(d.date)}, ${y(d[value])})`)
		focus.select("text").text(d.value)
		focus.select(".x-hover-line").attr("y2", HEIGHT - y(d[value]))
		focus.select(".y-hover-line").attr("x2", -x(d.date))
	}
	
	/******************************** Tooltip Code ********************************/
})

$('#coin-select')
	.on("change", () => {
		update(formattedData)
	})

$('#var-select')
	.on("change", () => {
		update(formattedData)
	})

function update(data) {

	const type = $('#coin-select').val()
	const value = $('#var-select').val()

	const filterData = data[type].map(d => {
		return d[value]
	})
	console.log(filterData)
}
