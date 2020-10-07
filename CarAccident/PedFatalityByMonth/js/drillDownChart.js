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

d3.csv("data/sas_test_data.csv", (dataForChart) => {
  dataForChart.forEach(d => {
    d.Frequency = parseInt(d.Frequency.replace(/,/g, ''))
  })
  let yearlyTotal = 0;
  let p = 0;
  let result = [];
  let months = [];
  let year = {}
  let month = {}

  while (p < dataForChart.length - 1) {
    month["number"] = dataForChart[p].Frequency
    month["month"] = dataForChart[p].sas_mnth_of_crsh
    months.push(month)
    yearlyTotal += dataForChart[p].Frequency
    if (dataForChart[p].sas_yr_of_crsh !== dataForChart[p + 1].sas_yr_of_crsh){
      year["year"] = dataForChart[p].sas_yr_of_crsh
      year["total"] = yearlyTotal
      year["months"] = months
      result.push(year)

      yearlyTotal = 0
      months = [];
      year = {}
    }
    p++
  }
  year["year"] = dataForChart[p].sas_yr_of_crsh
  year["total"] = yearlyTotal
  month["number"] = dataForChart[p].Frequency
  month["month"] = dataForChart[p].sas_mnth_of_crsh
  months.push(month)
  year["months"] = months
  result.push(year)
  console.log(result)

  y.domain(result.map(d => d.year))
  x.domain([0, d3.max(result, d => d.total)])

  const rects = g.selectAll("rect").data(result)

  rects.enter().append('rect')
    .attr('x', 0)
    .attr('y', (d) => y(d.year))
    .attr('height', y.bandwidth)
    .attr('width', d => x(d.total))
    .attr('fill', '#69b3a2')

})
