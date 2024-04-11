// define url as a constant variable
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

d3.json(url).then(data => {
    console.log(data);
}).catch(function(error) {
    console.log("Error fetching data:", error);
});

// Initialize init() function
function init(){

    let dropdownMenu = d3.select("#selDataset");
    d3.json(url).then(data => {
        data.names.forEach(id => {
            dropdownMenu.append("option").text(id).property("value", id);
        });
        let default_sample = data.names[0];
        barChart(default_sample);
        bubbleChart(default_sample);
        metaData(default_sample);
    });
};

// create bar chart
function barChart(sample){
    d3.json(url).then(data => {
        let samples = data.samples;
        let resultArray = samples.filter(result => result.id == sample);
        let result = resultArray[0];
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;
        // create console log
        console.log(otu_ids, otu_labels, sample_values);
        // create bar chart ticks
        let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        let barData = [{
          y: yticks,
          x: xticks,
          text: labels,
          type: "bar",
          orientation: "h",
        }];
        let barLayout = {
          title: "Top 10 Sampled Bacteria",
          margin: { t: 30, l: 150 }
        };
        Plotly.newPlot("bar", barData, barLayout);
    }); 
    }

// create bubble chart
function bubbleChart(sample){
    d3.json(url).then(data => {
        let filtered_data = data.samples.filter(item => item.id == sample);
        let choosen_sample = filtered_data[0];
        let trace_bubble = {
            x: choosen_sample.otu_ids,
            y: choosen_sample.sample_values,
            text: choosen_sample.otu_labels,
            mode: "markers",
            marker: {
                size: choosen_sample.sample_values
            }
        };
        let layout = {
            title: "Bacteria per sample",
            xaxis: {title: "OTU ID"},
            hovermode: "closest"
        };
        Plotly.newPlot("bubble", [trace_bubble], layout);
    });
};

// display sample metadata
function metaData(sample){
    d3.json(url).then(data => {
        let filtered_data = data.metadata.filter(item => item.id == sample);
        let choosen_sample = filtered_data[0];
        d3.select("#sample-metadata").html("");
        Object.keys(choosen_sample).map(key => {
            d3.select("#sample-metadata").append("h6").text(`${key}: ${choosen_sample[key]}`);
        });
    });
};

// display chosen key values
function optionChanged(choosen_sample){
    barChart(choosen_sample);
    bubbleChart(choosen_sample);
    metaData(choosen_sample);
};

init();