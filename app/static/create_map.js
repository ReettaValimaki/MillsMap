<script type="text/javascript">

$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('hide');
        $('#mapbar').toggleClass('col-8');
        $('#left-arrow').toggleClass('hide');
        $('#right-arrow').toggleClass('hide');
    });

});

$(document).ready(function () {
    $('#sidebarOpen').on('click', function () {
        $('#sidebar').toggleClass('hide');
        $('#mapbar').toggleClass('col-8');
        $('#left-arrow').toggleClass('hide');
        $('#right-arrow').toggleClass('hide');
    });

});

var form = document.getElementById('filterForm')

  // center of the map
var center = [-6.23, 34.9];
// Create the map
var map = new L.map('mapid', {
    fullscreenControl: true
    }).setView(center, 6);
// Set up the OSM layer
L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(map);
// L.tileLayer.bing(bing_key).addTo(map)
//var bing = new L.BingLayer(bing_key);


var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors' +
        '</a> ',
    tileSize: 256,
});
var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});
var googleTer = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});
var hotLayer = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 20,
})
var mqi = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{LOD}/{X}/{Y}.png", {
    subdomains: ['otile1','otile2','otile3','otile4']
});
var baseMaps = {
    "OpenStreetMap": osmLayer,
    "Google Satellite": googleSat,
    "Google Terrain": googleTer,
    "HOTOSM": hotLayer
} //here more layers: https://www.tutorialspoint.com/leafletjs/leafletjs_getting_started.htm

L.control.layers(baseMaps).addTo(map);
osmLayer.addTo(map);

// add a scale at at your map.
var scale = L.control.scale().addTo(map);

var markers = new L.MarkerClusterGroup();

//var markers = L.featureGroup();
markers.addTo(map);

/*
promise = $.get('/mill_points')
promise.then(function(submissions_filtered) {
    var element = document.getElementById("spin");
    element.classList.toggle("hide");

    var submissions_filtered_json = JSON.parse(submissions_filtered)

    for (submission_index in submissions_filtered_json){
        var submission = submissions_filtered_json[submission_index]
        try {
            var coordinates = submission['coordinates']
        }
        catch(err) {
            console.log("No GPS coordinates found for the submission", submission)
        }
        color = 'blue'

        var lng = coordinates[1]
        var lat = coordinates[0]
        var marker = L.circleMarker([lng, lat],{stroke: false, fillOpacity: 0.8});
        marker.setStyle({fillColor: color});
        markers.addLayer(marker);

        var toolTip = 
            "<dt>Number of milling machines:" + submission['number_milling_machines'] + "</dt>" 
        toolTip += "<hr>"
        counter = 0
        for (machine_index in submission['machines']){
            counter += 1
            toolTip += "<dt> Machine: " + counter + "</dt>";
            toolTip += "<div> ID: " + submission['machines'][machine_index]['__id'] + "</div>";
            toolTip += "<div> Type of mill: ";
            toolTip += submission['machines'][machine_index]['mill_type'] + "</div>";
            toolTip += "<div> Operational: ";
            toolTip += submission['machines'][machine_index]['operational_mill'] + "</div>";
            toolTip += "<div> Energy source: ";
            toolTip += submission['machines'][machine_index]['energy_source'] + "</div>";

            //console.log(submission['machines'][machine_index]['energy_source'])
            //console.log(submission['machines'][machine_index])
        }
        marker.bindTooltip(toolTip);

    }
    
    map.isFullscreen() // Is the map fullscreen?
    map.toggleFullscreen() // Either go fullscreen, or cancel the existing fullscreen.
    L.Control.Fullscreen
    map.fitBounds(markers.getBounds())
});
*/
 
// // `fullscreenchange` Event that's fired when entering or exiting fullscreen.
// map.on('fullscreenchange', function () {
//     if (map.isFullscreen()) {
//         console.log('entered fullscreen');
//     } else {
//         console.log('exited fullscreen');
//     }
// });
 

/**
*
* @param{HTMLTableElement} table to sort
* @param{number} index of the column to sort
* @param{boolean} determines if the sorting will be ascending order
* 
**/
function sortTableByColumn(table, column, asc = true){
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll('tr'));

    //sort each row
    const sortedRows = rows.sort((a,b) => {
        const aColText = a.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();
        const bColText = b.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();
        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    });

    // Remove all existing TRs from the table
    while (tBody.firstChild){
        tBody.removeChild(tBody.firstChild);
    }

    // Add the newly sorted rows
    tBody.append(...sortedRows);

    // Remember how the column is currently sorted
    table.querySelectorAll('th').forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-asc", asc)
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-desc", !asc)
}

document.querySelectorAll(".table-sortable th").forEach(headerCell => {
    headerCell.addEventListener("click", () =>{
        const tableElement = headerCell.parentElement.parentElement.parentElement;
        const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
        const currentIsAscending = headerCell.classList.contains('th-sort-asc');

        sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
   });
});
//sortTableByColumn(document.querySelector('table'),1)
</script>
