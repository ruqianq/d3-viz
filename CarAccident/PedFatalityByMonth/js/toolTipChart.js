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

// Tooltip
const tool_tip = d3.tip()
  .attr("class", "d3-tip")
  .html("<div id='tipDiv'></div>");

svg.call(tool_tip);

d3.csv("data/sas_test_data.csv", function (data) {
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

  g.call(d3.axisBottom(x))
  g.call(d3.axisLeft(y)).selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  rects.enter().append('rect')
    .attr('x', 0)
    .attr('y', (d) => y(d.year))
    .attr('height', y.bandwidth)
    .attr('width', d => x(d.number))
    .attr('fill', '#69b3a2')
    .on('mouseover', function (d) {
      tool_tip.show();
      var tipSVG = d3.select("#tipDiv")
        .append("svg")
        .attr("width", 220)
        .attr("height", 80);
      let currentYear = d.year
      const xTip = d3.scaleBand()
        .domain(data.map(d => d.sas_mnth_of_crsh)).
        range([0, 130]);
      const yTip = d3.scaleLinear()
        .domain([d3.min(data, d => d.Frequency), d3.max(data, d => d.Frequency)])
        .range([50, 0])

      tipSVG.append("path")
        .datum(data.filter(function (d) {
          return d.sas_yr_of_crsh === currentYear
        }))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function (d) {
            return xTip(d.sas_mnth_of_crsh)
          })
          .y(function (d) {
            return yTip(d.Frequency)
          })
        )
      tipSVG.append("g").attr("transform", "translate(0," + 50 + ")")
        .call(d3.axisBottom(xTip)).selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-90)")
        .style("text-anchor", "end");
      tipSVG.append("g")
        .call(d3.axisLeft(y));
    })
    .on('mouseout', tool_tip.hide);
})