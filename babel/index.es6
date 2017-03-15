const seatingChartRoot =  document.getElementById('wrapper');
const svgRoot = d3.select(seatingChartRoot);
const seatingChartUrl = "https://crossorigin.me/https://tt-prod-images.s3.amazonaws.com/dev/1484682402885_%5B2.0%5D_Astor+Place+Theatre.svg?context=document";

d3.xml(seatingChartUrl).mimeType("image/svg+xml").get((error, xml) => {
  if (error) {
    throw error;
  }
	// Initialize click handlers for buttons.
  // d3.selectAll("button[data-zoom]").on("click", clicked);
  d3.selectAll('button[data-zoom]').on('click', onZoomButtonClicked);
	// Extract the SVG document fragment.
  const svgDocument = xml.documentElement;
	// Arbitrarily chosen width/height.
  const svgWidth = 1000;
  const svgHeight = 1000;
	  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const width  = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

	// Define zoom behavior:
	// - Limit zoom "scale" to between 50% scale and 400% scale.
  const zoom = d3.zoom()
	               .scaleExtent([0.5, 4])
                 .on("zoom", zoomed);

	// Instantiate the "outer" SVG element.
  const outerSvg = svgRoot
		.append('svg')
  	.attr('width', width)
		.attr('height', height);

	// Instantiate the "rect" -- this will handle touch/click events
	// when panning.
  const rect = outerSvg
		.append('rect')
    .attr('width', width)
    .attr('height', height)
		.attr('class', 'overlay')
    .call(zoom);

	// Instantiate a group element in which to contain the seating chart SVG.
	const g = outerSvg
		.append('g')
    .style('border', '1px solid');

	// Append the svg document to the new group element, and obtain a
	// d3 selection reference to it.
	g.node().appendChild(svgDocument);
  const svg = g.select('svg').call(zoom);

  function zoomed() {
    g.attr('transform', d3.event.transform);
  }

  function onZoomButtonClicked() {
		const zoomDirection = this.getAttribute('data-zoom');
		transition(1 + (0.25 * zoomDirection));
	  // if (this.id === 'zoom_init') {
	  //   svg.transition()
	  //       .delay(100)
	  //       .duration(700)
	  //       .call(zoom.scaleTo, 1); // return to initial state
	  // }
  }

	function transition(zoomLevel) {
	  svg.transition()
	     .delay(50)
	     .duration(700)
	     .call(zoom.scaleBy, zoomLevel);
	}
});
