// CHART START

// definir medidas
const width = 800
const height = 500
const margin = {
    top: 30,
    bottom: 40,
    left: 100, 
    right: 10
}
const plotHeight = height - margin.top - margin.bottom
const plotWidth = width - margin.left - margin.right




const svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height)
const elementGroup = svg.append("g").attr("id", "elementGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)
const axisGroup = svg.append("g").attr("id","axisGroup")
const xAxisGroup = axisGroup.append("g").attr("id", "xAxisGroup").attr('transform', `translate(${margin.left},${height-margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr("id", "yAxisGroup").attr('transform', `translate(${margin.left},${margin.top})`)

//escala

let x = d3.scaleLinear().range([0,width - margin.left - margin.right])
let y = d3.scaleBand().range([height - margin.top -margin.bottom,0]).padding(0.1)
//eje

const xAxis =d3.axisBottom().scale(x).ticks(5)
const yAxis = d3.axisLeft().scale(y)

//manipulacion de datos
let data1
let data2
let countries = []
let n_of_cups = []
let yearformat = d3.timeParse("%Y")
let years
let datafiltered

//datos para grafica con paises y numero de copas.
d3.csv("data.csv").then(data => {
    data2 = d3.values(data).map(d => d.year = +d.year)
       
    data = d3.nest()
            .key(d => d.winner)
            .rollup(d => d.length)
            .entries(data)
 data1= data
datafiltered = data1.filter(function(d){ return d.key != "" })

n_of_cups = datafiltered.map((d) => d['value'])
countries = datafiltered.map((d) => d['key'])


//datos para slider con años de cada copa

       

years = data2.filter(Boolean);

//aplicar eje

maxi = d3.max(n_of_cups)
x.domain([0, maxi]).call(xAxis)
y.domain(countries).call(yAxis)
xAxisGroup.call(xAxis)
yAxisGroup.call(yAxis)

function color(datafiltered) {
    if (d => d.value === maxi) {
      return "max"
      } else if (d=> d.value < maxi) {
        return "#min";
      }}

// aplicar grafica
elementGroup.selectAll('.bar').data(data)
.call(bars)

function bars (group) {
    group.enter().append("rect")
      .attr('id', d => d.key)
      .attr('class', 'bar')
      .attr("x", 0)
      .attr("y", d => y(d.key))
      .attr("height", y.bandwidth)
      .attr("width",d => x(d.value))
      .attr("fill", (d) => {
              if (d = d.value == 5) {
                  return "#eb4703"
              }

              return "#69b3a2"
          })
      
     
}
    
  
//titulos
svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", (margin.top / 3) * 2)
  .attr("text-anchor", "middle")
  .text("Copas Mundiales")
  .style("font-size", "18px")
  .style("font-weight", "bold")
  svg
  .append("text")
  .attr("x", margin.left -50 )
  .attr("y", (margin.bottom / 3) * 2)
  .attr("text-anchor", "middle")
  .text('Paises')
  .style("font-size", "18px")
  .style("font-weight", "bold")

svg.append("text")
.attr("class","xAxis_label") 
.attr("text-anchor", "end") 
.attr("x", width/2) 
.attr("y", height - 5)
.text("Copas")
.style("font-size", "18px")
.style("font-weight", "bold")
  
})
// CHART END

// slider:
function slider() {    
    var sliderTime = d3
        .sliderBottom()
        .min(d3.min(years))  // rango años
        .max(d3.max(years))
        .step(4)  // cada cuánto aumenta el slider
        .width(580)  // ancho de nuestro slider
        .ticks(years.length)  
        .default(years[years.length -1])  // punto inicio de la marca
        d3.select('#slider-button').on('click', function() { slider.slide_to(++pos); });
            // conectar con la gráfica aquí
            d3.select('#slider').call(slider)
        ;

        var gTime = d3
        .select('div#slider-time')  // div donde lo insertamos
        .append('svg')
        .attr('width', width * 0.8)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)');

        gTime.call(sliderTime);

        d3.select('p#value-time').text(sliderTime.value());
}