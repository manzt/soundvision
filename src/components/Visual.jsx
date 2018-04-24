import React from 'react';
import { connect } from 'react-redux';
import { handleAlbumSelection } from '../actions/index';
import * as d3 from 'd3';
import { event as currentEvent } from 'd3-selection';

class Visual extends React.Component {
  constructor(props) {
    super(props);
    this.createVisual = this.createVisual.bind(this);
  }

  componentDidMount() {
    this.createVisual();
  }

  componentDidUpdate() {
    this.createVisual();
  }

  createVisual() {
    //For converting strings to Dates
    const releaseDateParse = d3.timeParse("%Y");
    const addedDateParse = d3.timeParse("%Y-%m-%d");
    //For converting Dates to strings
    const formatYear = d3.timeFormat("%Y");
    const formatScroller = d3.timeFormat("%b %d");

    //define size of top and bottom visual
    let svg = d3.select("svg"),
        margin = {top: 0, right: 35, bottom: 90, left: 30},
        margin2 = {top: 300, right: 35, bottom: 30, left: 30},
        w = +svg.attr("width") - margin.left - margin.right,
        h = +svg.attr("height") - margin.top - margin.bottom,
        h2 = +svg.attr("height") - margin2.top - margin2.bottom ;

    //set scales for x and y on top and bottom visual
    let xScale = d3.scaleTime().range([0, w]),
        xScale2 = d3.scaleTime().range([0, w]),
        yScale2 = d3.scaleLinear().range([h2, 0]);

    //define axis types
    let xAxis = d3.axisBottom(xScale).ticks(d3.timeMonth),
        xAxis2 = d3.axisBottom(xScale2).ticks(d3.timeYear)

    //include library state and albumSelect dispatch from props
    const { library, albumSelect } = this.props;

    //import data for visualization
    let data = library;

    //transform date strings into date objects
    data.forEach(d => {
      d.date_added = addedDateParse(d.date_added.slice(0,10));
      d.album.release_date = releaseDateParse(d.album.release_date.slice(0,4));
    })

    //sort by release_date so dots will be sorted within each histogram bin (colors grouped)
    let dataset = data.sort( (a,b) => {
      return a.album.release_date - b.album.release_date;
    });

    //find extent of library downloads
    let extent = d3.extent(dataset, d => d.date_added);

    //set x-axis domains
    xScale.domain(extent),
    xScale2.domain(xScale.domain());

    // Determine the first and last dates in the data set
    let dayBins = d3.timeDays(d3.timeDay.offset(extent[0], -1),
                              d3.timeDay.offset(extent[1], 1));

    // Use the histogram layout to create a function that will bin the data for
    // the top histogram
    let bins = d3.histogram()
                 .value(d => d.date_added)
                 .domain(xScale.domain())
                 .thresholds(dayBins)(dataset);

    // Use the histogram layout to create a function that will bin the data for
    // the bottom histogram with brush
    let bins2 = d3.histogram()
                  .value(d => d.date_added)
                  .domain(xScale2.domain())
                  .thresholds(dayBins)(dataset);

    //set y-scale domain for bottom histogram
    yScale2.domain([0, d3.max(bins2, d => d.length)]);

    //append svg group to svg for top visual
    const top = svg.append("g")
                   .attr("class", "top")
                   .attr("transform", `translate(${margin.left},${margin.top})`);

    //append svg group to svg for bottom visual
    const bottom = svg.append("g")
                      .attr("class", "bottom")
                      .attr("transform", `translate(${margin2.left},${margin2.top})`);

    //append svg group for scroll over focus element
    const focus = top.append("g")
                     .attr('class', 'focus')
                     .style('display', 'none');
    //set focus attributes, line & text
    focus.append('text').attr('y', h + 30).attr('dy', '.35em');
    focus.append('line').classed('y', true);
    d3.selectAll('.focus').style('opacity', 0.7);
    //style focus
    d3.selectAll('.focus line')
      .style('fill', 'none')
      .style('stroke', '#636363')
      .style('stroke-width', '1px');

    //create background rect to handle mouseover for focus
    top.append('rect')
       .attr('class', 'behind')
       .attr('width', w)
       .attr('height', h)
       .on('mouseover', () => focus.style('display', null))
       .on('mousemove', mousemove);
    //remove fill and enable all pointer-events
    d3.select('.behind')
      .style("fill",'none')
      .style("pointer-events", 'all');


    //create bottom histogram
    let bar = bottom.selectAll(".bar")
               .data(bins2)
               .enter()
               .append("g")
               .attr("class", "bar")
               .attr("date", d => d.date_added)
               .attr("transform", d => `translate(${xScale2(d.x0)},${yScale2(d.length)})`)
    //append each rect
    bar.append("rect")
       .attr("width", xScale2(bins2[0].x1) - xScale2(bins2[0].x0))
       .attr("height", d => h2 - yScale2(d.length));

    //Create X axis
    top.append("g")
       .attr("class", "axis axis--x1")
       .attr("transform", `translate(0,${h})`)
       .call(xAxis);

    //Create X-axis 2
    bottom.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", `translate(0,${h2})`)
          .call(xAxis2)
          .style("fill-opacity", "0.6")
          .style("stroke-opacity", "0.3")

    //create d3 brush to brush over bottom visual
    let brush = d3.brushX()
                  .extent([[0,0], [w, h2]])
                  .on("brush end", brushed);
    //append brush to bottom svg group
    bottom.append("g")
          .attr("class", "brush")
          .call(brush)
          .call(brush.move, [xScale2(extent[0]),
            xScale2(extent[0].setMonth(extent[0].getMonth() + 2.5))
          ]);

    //D3 brush options
    // removes handle to resize the brush:
    // d3.selectAll('.brush>.handle').remove();

    // removes crosshair cursor:
    d3.selectAll('.brush>.overlay').remove();

    //create circle to remove all .selected when clicked
    top.append("circle")
       .attr("cx", w)
       .attr("cy", 20)
       .attr("r", 10)
       .style("fill", "#b6a6cd")
       .style("fill-opacity", "0.7")
       .on("click", () => {
         d3.selectAll(".selected")
           .classed("selected", false)
           .style('fill-opacity', "0.5")
           .style('stroke-width', "0")
         //sends dispatch to update album selection to an empty array
         albumSelect(d3.selectAll(".selected").data());
       })
      //Timeline Scroller
      function mousemove() {
        const xcoord = d3.mouse(this)[0];
        const domainX = xScale.invert(xcoord);
        focus.attr('transform', `translate(${xScale(domainX)}, 0)`);
        focus.select('line.y')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', h + 20);

        focus.select('text')
        .style('fill', '#636363')
        .style('fill-opacity', "1")
        .style('font-family', "sans-serif")
        .style('font-size', "10px")
        .text(formatScroller(domainX))
      }
      function brushed() {
        focus.style("display", "none")
        let s = currentEvent.selection;
        xScale.domain(s.map(xScale2.invert, xScale2));
        top.select(".axis--x1").call(xAxis)
           .style("fill-opacity", "0.6")
           .style("stroke-opacity", "0.3")

        let binContainer = top.selectAll(".gBin").data(bins);
        let binContainerEnter = binContainer.enter()
          .append("g")
            .attr("class", "gBin")
            .attr("transform", d => `translate(${xScale(d.x0)},0)`)
            .on("mouseover", d => {
              focus.style('display', null);
              focus.attr('transform', `translate(${xScale(d.x0)}, 0)`);
              focus.select('line.y')
                   .attr('x1', 0)
                   .attr('x2', 0)
                   .attr('y1', 0)
                   .attr('y2', h + 20);

              focus.select('text')
                   .style('fill', '#636363')
                   .style('fill-opacity', "1")
                   .style('font-family', "sans-serif")
                   .style('font-size', "10px")
                   .text(formatScroller(d[0].date_added))
            });
        //pupulate bin container with data
        binContainerEnter.selectAll("circle")
          .data(d => d.map((p, i) => {
            //console.log(p, i)
            return {
                      idx: i,
                      radius: (xScale(d.x1) - xScale(d.x0)) /2,
                      date_added: p.date_added,
                      release_date: p.album.release_date,
                      images: p.album.images,
                      title: p.album.name,
                      artists: p.album.artists,
                      id: p.album.id,
                      tracks: p.album.tracks
                   }
          }))
          .enter()
          .append("circle")
            .attr("class", "dot")
            .attr("cx", 0) //g element already at correct x pos
            .attr("cy", d =>  - d.idx * 2 * d.radius - d.radius)
            .attr("r", d => d.radius)
            .style("fill", d => {
              let year = parseInt(formatYear(d.release_date))
              return getColor(year)
            })
            .on("mouseover", function(d) {
              let parentBin = d3.select(this).node().parentNode
              let re = /([0-9]+.[0-9])\w+/;
              let transform = d3.select(parentBin).attr('transform').match(re) || 0;
              let xpos = parseFloat(transform)

              d3.select("#tooltip")
                .style("margin-left", xpos - w/2 - 7 + "px")
                .style("top", 42 + margin.top + "px")
                .select("#title").text(d.title);

              d3.select("#year").text(` (${formatYear(d.release_date)})`)
              d3.select("#artist").text(`${d.artists[0].name}`)
              d3.select("#image").attr("src", d.images[2].url)
              d3.select("#tooltip").classed("hidden", false);

              d3.select(this)
                .style('fill-opacity', "1")
                .style('stroke-width', "1.2")
                .style('stroke-opacity', '0.7')
                .style('stroke', "#636363")
                .attr("r", d => d.radius * 1.3);
            })
           .on("mouseout", function() {
              d3.select("#tooltip").classed("hidden", true)
              if (!d3.select(this).classed('selected')) {
                d3.select(this)
                  .style('fill-opacity', "0.5")
                  .style('stroke-width', "0")
              }
              d3.select(this)
                .attr("r", d => d.radius)
           })
           .on("mousedown", function() {
             let dot = d3.select(this);
             dot.classed('selected', !dot.classed('selected'));
             console.log(d3.selectAll(".selected").data());
             albumSelect(d3.selectAll(".selected").data());
           })
        binContainerEnter.merge(binContainer)
            .attr("transform", d => `translate(${xScale(d.x0)}, ${h})`);
     }

    function getColor(year) {
      let colors = [
        "#b6a6cd",//<50s
        "#84acd5",//50s
        "#84cdeb",//60s
        "#82d0c5",//70s
        "#cadf82",//80s
        "#fce189",//90s
        "#fbca93",//00s
        "#f59194",//10s
        "#f1a2ca"//20s
      ]
      let tens = (year%100 - year%10) / 10;
      if(year < 2000) {
        if(year%100 < 50) return colors[0];
        return colors[tens - 4]
      }
      return colors[tens + 6]
    }
  }
  render() {
    return <div>
        <svg
          width="675"
          height="350" />
        <div id="tooltip" className="hidden">
    			<img id="image" src="" alt=""></img>
    			<p>
    				<strong>
    					<span id="title"></span>
    					<span id="year"></span>
    				</strong><br/>
    				<span id="artist"></span>
    			</p>
    		</div>
      </div>
  }
}

const mapStateToProps = ({ library }) => ({ library });
const mapDispatchToProps = dispatch => ({
  albumSelect: (albumSelection) => {
    dispatch(handleAlbumSelection(albumSelection));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Visual);
