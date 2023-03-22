// Instructions: Use D3 library to read in samples.json from URL provided

// Variable for JSON URL provided
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Retrive JSON data and log it
d3.json(url).then(function(data) {
    console.log(data);
  });

// Initialize the dashboard at start up 
function init() {

    // Create drop down menu
    let dropdownMenu = d3.select("#selDataset");

    // Get sample names to use in drop down menu and set as variable
    d3.json(url).then((data) => {
        
        let dataNames = data.names;
        dataNames.forEach((id) => {
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // Get first sample from list and log it
        let testSubject = dataNames[0];

        console.log(testSubject);

        // Build out information for dashboard
        demographicInfo(testSubject);
        barChart(testSubject);
        bubbleChart(testSubject);
        gaugeChart(testSubject);
    });
};

// Function to build Demographic data
function demographicInfo(sample) {

    // Retrive JSON data
    d3.json(url).then((data) => {

        // Set variables for Demographic data and log 
        let metadata = data.metadata;
        let resultID = metadata.filter(result => result.id == sample);
        console.log(resultID)

        let firstID = resultID[0];

        // Clear out info
        d3.select("#sample-metadata").html("");

        // Add each key/value pair to the chart and log as they are being appended
        Object.entries(firstID).forEach(([key,resultID]) => {
            console.log(key,resultID);
            d3.select("#sample-metadata").append("h5").text(`${key}: ${resultID}`);
        });
    });

};

// Function to build bar chart
function barChart(sample) {

    // Retrive JSON data
    d3.json(url).then((data) => {

        // Set variables for bar chart and log
        let dataSamples = data.samples;
        let resultID = dataSamples.filter(result => result.id == sample);
        let firstID = resultID[0];
        let otu_ids = firstID.otu_ids;
        let otu_labels = firstID.otu_labels;
        let sample_values = firstID.sample_values;

        console.log(otu_ids,otu_labels,sample_values);

        // Set up variables to graph (show in descending order)
        let y_axis = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let x_axis = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Create trace for bar chart 
        let colors = ['#5e4fa2', '#3288bd', '#66c2a5','#abdda4', '#e6f598', '#fee08b', '#fdae61', '#f46d43', '#d53e4f', '#9e0142',] 
        let traceBar = {
            type: "bar",
            orientation: "h",
            x: x_axis,
            y: y_axis,
            text: labels,
            mode: "markers",
            marker: {
                color: colors
            }            
        };

        // Create layout for bar chart
        let layout = {
            title: {
                text: "<b>Top OTUs (up to 10) Found in Test Subject</b>",
                font: {color: "black", size: 14}
            },
            width: 600,
            height: 475
        };

        // Plot the data into bar chart
        Plotly.newPlot("bar", [traceBar], layout)
    });
};

// Function to build the gauge chart
function gaugeChart(sample) {

    // Retrive JSON data
    d3.json(url).then((data) => {

        // Set variables for gauge chart and log
        let metadata = data.metadata;
        let resultID = metadata.filter(result => result.id == sample);
        console.log(resultID)

        let firstID = resultID[0];

        // Add each key/value pair to the chart and log as they are being appended 
        let frequency = Object.values(firstID)[6];
        
        // Create trace for gauge chart 
        let traceGauge = {
            value: frequency,
            domain: {x: [0,1], y: [0,1]},
            title: {
                text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
                font: {color: "black", size: 16}
            },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [0,10], tickmode: "linear", tick0: 2, dtick: 2},
                bar: {color: "black"},
                steps: [
                    {range: [0, 1], color: '#5e4fa2'},
                    {range: [1, 2], color: '#3288bd'},
                    {range: [2, 3], color: '#66c2a5'},
                    {range: [3, 4], color: '#abdda4'},
                    {range: [4, 5], color: '#e6f598'},
                    {range: [5, 6], color: '#fee08b'},
                    {range: [6, 7], color: '#fdae61'},
                    {range: [7, 8], color: '#f46d43'},
                    {range: [8, 9], color: '#d53e4f'},
                    {range: [9, 10], color: '#9e0142'},
                ]
            } 
        };

        // Create layout for gauge chart
        let layout = {
            width: 500, 
            height: 475
        };

        // Plot the data into gauge chart
        Plotly.newPlot("gauge", [traceGauge], layout)
    });
};


// Function to build bubble chart
function bubbleChart(sample) {

    // Retrive JSON data
    d3.json(url).then((data) => {
        
        // Set variables for bubble chart and log
        let dataSamples = data.samples;
        let resultID = dataSamples.filter(result => result.id == sample);
        let firstID = resultID[0];

        let otu_ids = firstID.otu_ids;
        let otu_labels = firstID.otu_labels;
        let sample_values = firstID.sample_values;

        console.log(otu_ids,otu_labels,sample_values);
        
        // Create trace for bubble chart
        let traceBubble = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Spectral-10"
            }
        };

        // Create layout for bubble chart
        let layout = {
            title: {
                text: "<b>OTU Data for Subject</b>",
                font: {color: "black", size: 16}
            },
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Values"},
            width: 1200, 
            height: 500
        };

        // Plot the data into bubble chart
        Plotly.newPlot("bubble", [traceBubble], layout)
    });
};

// Function to update dashboard with each new selection, log, and call all functions
function optionChanged(newID) { 
    console.log(newID); 
    demographicInfo(newID);
    barChart(newID);
    bubbleChart(newID);
    gaugeChart(newID);
};

init();