/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

let year = 0

const svg = d3.select("#chart-area").append("svg")
	.attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
	.attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
	.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// hard coded domain, need to change
const x = d3.scaleLog().base(10).range([0, WIDTH]).domain([142, 150000])
const y = d3.scaleLinear().range([HEIGHT, 0]).domain([0, 90])

d3.json("data/data.json").then(function(data){
	const allData = data.map((y) => {
		return y.countries.filter((c) => (c.income !== null && c.life_exp !== null
			&& c.population !== null
		))
	})

	d3.interval(() => {
		year += 1
	}, 1000)
	update(allData[0])
})

function update(data) {
	const t = d3.transition().duration(750)

	const circles = g.selectAll("circle")
		.data(data, d => d.country)

	circles.enter()
		.append("circle")
		.attr("fill", "red")
		.attr("cy", (d) => y(d.life_exp))
		.attr("r", 5)
		.attr("cx", (d) => x(d.income))
}