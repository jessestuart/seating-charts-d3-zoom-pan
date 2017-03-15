const seatingChartRoot =  document.getElementById('wrapper');
const svgRoot = d3.select(seatingChartRoot);
const seatingChartUrl = "https://crossorigin.me/https://tt-prod-images.s3.amazonaws.com/dev/1484682402885_%5B2.0%5D_Astor+Place+Theatre.svg?context=document";

d3.xml(seatingChartUrl).mimeType("image/svg+xml").get((error, xml) => {
  if (error) {
    throw error;
  }
  // Initialize click handlers for buttons.
  d3.selectAll('button').on('click', onZoomButtonClicked);
  // Extract the SVG document fragment.
  const svgDocument = xml.documentElement;
  // Arbitrarily chosen width/height.
  const width  = 1000;
  const height = 1000;

  // Define zoom behavior:
  // - Limit zoom "scale" to between 50% scale and 300% scale.
  const zoom = d3.zoom()
                 .scaleExtent([0.5, 3])
                 .on("zoom", zoomed);

  // Instantiate the "outer" SVG element.
  const outerSvg = svgRoot
    .append('svg')
    .attr('width', 1000)
    .attr('height', 1000);

  // Instantiate a group element in which to contain the seating chart SVG.
  const g = outerSvg
    .append('g')
    .style('border', '1px solid');

  // Append the svg document to the new group element, and obtain a
  // d3 selection reference to it.
  g.node().appendChild(svgDocument);
  const svg = g
    .select('svg')
    .call(zoom)
    .on("wheel.zoom", null);

  // Instantiate the "rect" -- this will handle touch/click events
  // when panning.
  // NB: This *has* to be declared within the inner SVG, or it won't
  //     properly handle touch events.
  const rect = svg
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'overlay');

  function zoomed() {
    g.attr('transform', d3.event.transform);
  }

  function onZoomButtonClicked() {
    let zoomDirection;
    try {
      zoomDirection = parseInt(this.getAttribute('data-zoom'))
    } catch (e) {
      console.error(e);
      return;
    }

    if (zoomDirection !== 0) {
      transition(1 + (0.5 * zoomDirection));
    } else {
      svg.transition()
         .delay(100)
         .duration(600)
         .call(zoom.scaleTo, 1);
    }
  }

  function transition(zoomLevel) {
    svg.transition()
       .delay(100)
       .duration(600)
       .call(zoom.scaleBy, zoomLevel);
  }
});
