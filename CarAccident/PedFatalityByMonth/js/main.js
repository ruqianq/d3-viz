const margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

const svg = d3.select("#chart-area").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

const g = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

const parseTime = d3.timeParse("%B %-d, %Y %H:%M:%S %p");

// set the ranges
var x = d3.scaleBand().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

d3.csv("data/sas_test_data.csv").then(function(data) {

  // format the data
  data.forEach(function (d) {
    d.sas_tmstmp_of_crsh = parseTime(d.sas_tmstmp_of_crsh);
    d.month = d.sas_tmstmp_of_crsh.getMonth()
    d.year = d.sas_tmstmp_of_crsh.getFullYear()
    d.number_of_fatalities = +d.number_of_fatalities
  });
  let result = []

  let p = 0;
  let acc = 0
  while (p < data.length - 1) {
    acc += data[p].number_of_fatalities

    if (data[p].month !== data[p+1].month){
      let fatalByMonth = {}
      fatalByMonth["sum"] = acc
      fatalByMonth["month"] = data[p].month
      fatalByMonth["year"] = data[p].year
      result.push(fatalByMonth)
      acc = 0
    }
    p++
  }

  // const rects = g.selectAll("rect")
  //   .data(data, d => d.number_of_fatalities)

})