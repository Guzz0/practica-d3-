// CHART START

// definir medidas
const width = 800
const height = 500
const margin = {
    top: 10,
    bottom: 40,
    left: 40, 
    right: 10
}



const svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height)
const elementGroup = svg.append("g").attr("id", "elementGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)
const axisGroup = svg.append("g").attr("id","axisGroup")
const xAxisGroup = axisGroup.append("g").attr('transform', `translate(${margin.left},${height-margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr('transform', `translate(${margin.left},${margin.top})`)

//escala

const x = d3.scaleLinear().range([0,width - margin.left - margin.right])
const y = d3.scaleBand().range([height - margin.top -margin.bottom,0]).padding(0.1)
//eje

const xAxis =d3.axisBottom().scale(x)
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
       
    data = d3.nest()
            .key(d => d.winner)
            .rollup(d => d.length)
            .entries(data)
 
    data1 = data
    datafiltered = data1.filter(function(d){ return d.key != "" })

n_of_cups = datafiltered.map((d) => d['value'])
countries = datafiltered.map((d) => d['key'])
})

//datos para slider con años de cada copa
d3.csv("data.csv").then(data => {
       
data2 = d3.values(data).map(d => d.year = +d.year)

years = data2.filter(Boolean);

//aplicar eje
})
maxi = d3.max(n_of_cups)

xAxisGroup.call(xAxis)
yAxisGroup.call(yAxis)


x.domain([0, maxi])
y.domain(countries)


elementGroup.selectAll("rect").data(datafiltered)
.join("rect")
      .attr("x", d => x(d.key))
      .attr("y", d => y(d.value))
      .attr("height", y.bandwidth)
      .attr("width",d => height - margin.bottom - margin.top - x(d.value))

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