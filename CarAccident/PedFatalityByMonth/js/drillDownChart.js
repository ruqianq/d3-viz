const margin = {top: 30, right: 120, bottom: 0, left: 120},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

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

const duration = 750,
  delay = 25;

d3.csv("data/sas_test_data.csv", (dataForChart) => {
  dataForChart.forEach(d => {
    d.Frequency = parseInt(d.Frequency.replace(/,/g, ''))
  })

  let allYears = {}
  let currentYear = dataForChart[0].sas_yr_of_crsh
  let years = []

  let children = [];
  for (let i of dataForChart) {
    let child = {}
    if (i.sas_yr_of_crsh !== currentYear) {
      let year = {}
      year["name"] = currentYear
      year["children"] = children
      years.push(year)
      currentYear = i.sas_yr_of_crsh
      children = []
    }
    child["name"] = i.sas_mnth_of_crsh
    child["value"] = i.Frequency
    children.push(child)

    if (dataForChart.indexOf(i) === dataForChart.length - 1) {
      let year = {}
      year["name"] = currentYear
      year["children"] = children
      years.push(year)
    }
  }
  allYears["name"] = "allYears"
  allYears["children"] = years

  const root = d3.hierarchy(allYears)
    .sum(function(d) { return d.value; });
  x.domain([0, root.value]).nice();
  down(root, 0);

  y.domain(result.map(d => d.year))

  const rects = g.selectAll("rect").data(result)

  rects.enter().append('rect')
    .attr('x', 0)
    .attr('y', (d) => y(d.year))
    .attr('height', y.bandwidth)
    .attr('width', d => x(d.total))
    .attr('fill', '#69b3a2')

})
