const margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

const parseTime = d3.timeParse("%B %-d, %Y %H:%M:%S %p");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

d3.csv("data/sas_test_data.csv").then(function(data) {

  // format the data
  data.forEach(function (d) {
    d.date = parseTime(d.sas_tmstmp_of_crsh);
    d.number_of_fatalities = +d.number_of_fatalities
    console.log(d)
  });
})