const margin = {top: 30, right: 120, bottom: 0, left: 120},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

const x = d3.scaleLinear()
  .range([0, width]);

const barHeight = 20;

const color = d3.scaleOrdinal()
  .range(["steelblue", "#ccc"]);

const duration = 750,
  delay = 25;

const xAxis = d3.axisTop(x);

const svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("rect")
  .attr("class", "background")
  .attr("width", width)
  .attr("height", height)
  .on("click", up);

svg.append("g")
  .attr("class", "x axis");

svg.append("g")
  .attr("class", "y axis")
  .append("line")
  .attr("y1", "100%");


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

  function down(d, i) {
    if (!d.children || this.__transition__) return;
    var end = duration + d.children.length * delay;

    // Mark any currently-displayed bars as exiting.
    var exit = svg.selectAll(".enter")
      .attr("class", "exit");

    // Entering nodes immediately obscure the clicked-on bar, so hide it.
    exit.selectAll("rect").filter(function(p) { return p === d; })
      .style("fill-opacity", 1e-6);

    // Enter the new bars for the clicked-on data.
    // Per above, entering bars are immediately visible.
    var enter = bar(d)
      .attr("transform", stack(i))
      .style("opacity", 1);

    // Have the text fade-in, even though the bars are visible.
    // Color the bars as parents; they will fade to children if appropriate.
    enter.select("text").style("fill-opacity", 1e-6);
    enter.select("rect").style("fill", color(true));

    // Update the x-scale domain.
    x.domain([0, d3.max(d.children, function(d) { return d.value; })]).nice();

    // Update the x-axis.
    svg.selectAll(".x.axis").transition()
      .duration(duration)
      .call(xAxis);

    // Transition entering bars to their new position.
    var enterTransition = enter.transition()
      .duration(duration)
      .delay(function(d, i) { return i * delay; })
      .attr("transform", function(d, i) { return "translate(0," + barHeight * i * 1.2 + ")"; });

    // Transition entering text.
    enterTransition.select("text")
      .style("fill-opacity", 1);

    // Transition entering rects to the new x-scale.
    enterTransition.select("rect")
      .attr("width", function(d) { return x(d.value); })
      .style("fill", function(d) { return color(!!d.children); });

    // Transition exiting bars to fade out.
    var exitTransition = exit.transition()
      .duration(duration)
      .style("opacity", 1e-6)
      .remove();

    // Transition exiting bars to the new x-scale.
    exitTransition.selectAll("rect")
      .attr("width", function(d) { return x(d.value); });

    // Rebind the current node to the background.
    svg.select(".background")
      .datum(d)
      .transition()
      .duration(end);

    d.index = i;
  }

})
