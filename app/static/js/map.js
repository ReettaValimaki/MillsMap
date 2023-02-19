
const createMap=()=>{
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
        "HOTOSM": hotLayer
    } //here more layers: https://www.tutorialspoint.com/leafletjs/leafletjs_getting_started.htm

    L.control.layers(baseMaps).addTo(map);
    osmLayer.addTo(map);



    // add a scale at at your map.
    var scale = L.control.scale().addTo(map);
    return map
}

const createLegend = (map) => {
    // Legend
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "legend");
      div.innerHTML += "<h4>Number of Mills</h4>";
      div.innerHTML += '<i style="background: #7cc247"></i><span>Less than 10</span><br>';
      div.innerHTML += '<i style="background: #f7eb65"></i><span>10 to 100</span><br>';
      div.innerHTML += '<i style="background: #ff7438"></i><span>More than 100</span><br>';
      div.innerHTML += '<i style="background: style="background-image: url(https://d30y9cdsu7xlg0.cloudfront.net/png/194515-200.png);background-repeat: no-repeat;"></i><span></span><br>';



      return div;
    };

    legend.addTo(map);
}

function drawMarkers(data) {
    var schoolIcon = L.icon({
        iconUrl: 'static/static_figures/school-solid.svg',
        iconSize:     [60, 50], // size of the icon
    });

    // Now the promise chain that uses the mills and machines
    customMarker = L.Marker.extend({
        options: {
            Id: 'Custom data!',
        }
    });
    var cross_data = crossfilter(data);
    var groupname = "marker-select";
    var facilities = cross_data.dimension(function(d) { return d.geo; });
    var facilitiesGroup = facilities.group().reduce(
        function(p, v) { // add
             p.coordinatesDescription_coodinates_coordinates = v.coordinatesDescription_coodinates_coordinates;
             p.Food_purchases_foodtype = v.Food_purchases_foodtype;
            // p.mill_type.push(v.mill_type);
            // p.image_fns.push(v.img_machines);
            // p.energy_source.push(v.energy_source);
	    // p.Location_addr_region.push(v.Location_addr_region);
	    // p.Location_addr_district.push(v.Location_addr_district);
            // p.operational_mill = v.operational_mill;
            // p.non_operational = v.non_operational;
            p.geo = v.geo;
             ++p.count;
             return p;
        },
         function(p, v) { // remove
             --p.count;
            // var index = p.image_fns.indexOf(v.img_machines);
            // if (index > -1) {
            //   p.image_fns.splice(index, 1);
            // }
            // var index = p.mill_type.indexOf(v.mill_type);
            // if (index > -1) {
            //   p.mill_type.splice(index, 1);
            // }
            // var index = p.mill_type.indexOf(v.energy_source);
            // if (index > -1) {
            //   p.energy_source.splice(index, 1);
            // }
	    // var index = p.Location_addr_region.indexOf(v.Location_addr_region);
	    // if (index > -1) {
		// p.Location_addr_region.splice(index, 1);
	    // }
	    // var index = p.Location_addr_district.indexOf(v.Location_addr_district);
	    // if (index > -1) {
		// p.Location_addr_district.splice(index, 1);
	    // }
             return p;
         },
         function() { // init
             return {count: 0};
         }
    );

    var mapChart = dc_leaflet.markerChart("#mapid",groupname);
    mapChart
        .dimension(facilities)
        .group(facilitiesGroup)
        .map(map)
        .cluster(true)
        .valueAccessor(function(kv) {
            return kv.value.count;
        })
        .locationAccessor(function(kv) {
            return kv.value.geo;
        })

         .popup(function(kv) {
             var tooltip = "<dt>Number of schools: " + kv.value.count + "</dt>" +
             "<dt>The school food type: " + kv.value.Food_purchases_foodtype  + "</dt>"

        //     "<dt>The mill is operational: " + kv.value.operational_mill  + "</dt>" +
        //     "<dt>Types of machines: " + kv.value.mill_type  + "</dt>" +
	    // "<dt>Energy sources of the machines: " + kv.value.energy_source  + "</dt>" +
	    // "<dt>Region: " + kv.value.Location_addr_region + "</dt>" +
        //     "<dt>District: " + kv.value.Location_addr_district + "</dt>" +
        //     "<dt>Mill id: " + kv.key + "</dt>";
        //     for(i in kv.value.image_fns){
        //         var fn = kv.value.image_fns[i],
        //         path = 'static/figures/' + fn
        //         tooltip = tooltip.concat("<img class='popupImage' src = '" + path + "'>")
        //     }
             return tooltip
         })
        .filterByArea(true)
      .marker(function(kv) {
            marker = new customMarker([
                kv.value.coordinatesDescription_coodinates_coordinates[1],
                kv.value.coordinatesDescription_coodinates_coordinates[0]],
                {
                    Id: (kv.key).toString(),
                    icon: schoolIcon,
                });
            // marker.on('click', function(e) {
            //     console.log(kv);
            //     var details_container = document.getElementById('details_container')
            //     details_container.innerHTML = '';
            //     document.getElementById('machine_details').innerHTML = kv.value.mill_type
            //     for(i in kv.value.image_fns){
            //         var fn = kv.value.image_fns[i]
            //             console.log(fn)
            //             var img = document.createElement("img");
            //             details_container.appendChild(img);
            //             img.src = "static/figures/" + fn;
            //         }
            //     })
            return marker;
    });

// //  The mill and machine numbers
// //  machines are just the length of the data
//     document.getElementById('machineNumber').innerHTML = data.length;
// //  mills are the unique ids in the data
//     totalMills(cross_data);
//     function unique_count_groupall(group) {
//       return {
//         value: function() {
//           return group.all().filter(kv => kv.key).length;
//         }
//       };
//     }
//     function totalMills(cross_data) {
//         // Select the Mills
//         var totalMillsND = dc.numberDisplay("#millNumber")
//         .formatNumber(d3.format("")); //change to ".2s" if want to have only the first two digits
//         // Count them
//         var dim = cross_data.dimension(dc.pluck("__id"));
//         var uniqueMills = unique_count_groupall(facilities.group());
//         totalMillsND.group(uniqueMills).valueAccessor(x => x);
//         totalMillsND.render();
//     };


// //  Graphs
//     var Packaging_flour_fortified = cross_data.dimension(function(d) { return d.Packaging_flour_fortified; });
//     var Packaging_flour_fortifiedGroup = Packaging_flour_fortified.group().reduceCount();
//     var fortifiedFlourPie = dc.pieChart("#fortifiedFlour",groupname)
//       .dimension(Packaging_flour_fortified)
//       .group(Packaging_flour_fortifiedGroup)
//       fortifiedFlourPie
//       .legend(dc.legend().highlightSelected(true))
//       .width(450)
//       .on('pretransition', function(chart) {
//         chart.selectAll('text.pie-slice').text(function(d) {
//             return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
//           })
//         })



//     var mill_type = cross_data.dimension(function(d) { return d.mill_type; });
//     var mill_typeGroup = mill_type.group().reduceCount();
//     var mill_typePie = dc.pieChart("#millTypes",groupname)
//       .dimension(mill_type)
//       .group(mill_typeGroup)
//       mill_typePie
//       .legend(dc.legend().highlightSelected(true))
//       .width(450)
//       .on('pretransition', function(chart) {
//        chart.selectAll('text.pie-slice').text(function(d) {
//           angle = (d.endAngle - d.startAngle) / (2*Math.PI) * 100;
//           let label = '';
//           if (angle > 6){
//               label = dc.utils.printSingleValue(angle) + '%'
//                  }
//              return label;
//         })
//       })

//     var operational_mill = cross_data.dimension(function(d) { return d.operational_mill; });
//     var operational_millGroup = operational_mill.group().reduceCount();
//     var operational_millPie = dc.pieChart("#functionalMills",groupname)
//       .dimension(operational_mill)
//       .group(operational_millGroup)
//       operational_millPie
//       .legend(dc.legend().highlightSelected(true))
//         .width(450)

//     var mill_owner = cross_data.dimension(function(d) { return d.interviewee_mill_owner; });
//     var mill_ownerGroup = mill_owner.group().reduceCount();
//     var mill_ownerPie = dc.pieChart("#millOwner",groupname)
//       .dimension(mill_owner)
//       .group(mill_ownerGroup)
//       mill_ownerPie
//       .legend(dc.legend().highlightSelected(true))
//       .width(450)

//     var fortified_standard = cross_data.dimension(function(d) { return d.Packaging_flour_fortified_standard; });
//     var fortified_standardGroup = fortified_standard.group().reduceCount();
//     var fortified_standardPie = dc.pieChart("#fortifiedStandard",groupname)
//       .dimension(fortified_standard)
//       .group(fortified_standardGroup)
//       fortified_standardPie
//       .legend(dc.legend().highlightSelected(true))
//       .width(450)

//     var commodity_milled = cross_data.dimension(function(d) { return d.commodity_milled;}, true);
//     var commodity_milledGroup = commodity_milled.group().reduceCount();
//     var commodity_milledChart = dc.barChart("#grainType",groupname)
//       commodity_milledChart
//         .x(d3.scaleBand())
//         .xUnits(dc.units.ordinal)
//         .brushOn(false)
// //        .yAxisLabel('Number of machines')
//         .dimension(commodity_milled)
//         .elasticY(true)
//         .width(450)
//         .yAxisPadding(100)
//         .group(commodity_milledGroup);

//     var energy_source = cross_data.dimension(function(d) { return d.energy_source; }, true);
//     var energy_sourceGroup = energy_source.group();
//     var energy_sourceChart = dc.barChart("#energySource",groupname)
//       energy_sourceChart
//           .x(d3.scaleBand())
//           .xUnits(dc.units.ordinal)
//           .brushOn(false)
// //          .yAxisLabel('Number of machines')
//           .dimension(energy_source)
//           .barPadding(0.1)
//           .outerPadding(0.05)
//           .elasticY(true)
//           .width(450)
//           .group(energy_sourceGroup);

//     var non_operational = cross_data.dimension(function(d){ return d.non_operational;}, true);
//     var non_operationalGroup = non_operational.group();
//     var non_operationalChart = dc.barChart("#nonOperational", groupname)
//     non_operationalChart
//         .dimension(non_operational)
//         .group(non_operationalGroup)
//         .x(d3.scaleBand())
//         .xUnits(dc.units.ordinal)
//         .brushOn(false)
// //        .yAxisLabel('Number of machines')
//         .barPadding(0.1)
//         .elasticY(true)
//         .outerPadding(0.05)
//         .width(250)

// //     Select menus
    const filters = {
    'school_details_Location_addr_region': ['selectRegion', 'Region'],
    'school_details_Location_addr_district': ['selectDistrict', 'District'],
    'Food_purchases_foodtype': ['selectFoodType', 'Food purchases type'],
    'school_details_school_type': ['selectSchoolType', 'School type'],
    'school_details_Status_school_ownership': ['selectSchoolOwnership', 'School ownership'],
    'school_details_Status_school_accommodation': ['selectSchoolAccommodation', 'School Accommodation'],
    'feeding_feeding_status': ['selectFeedingStatus', 'Feeding Status'],
    'Food_purchases-feeding_program_planning': ['selectFeedingPlanning', 'Feeding Program Planning'],
    }
    for (let key in filters){
        console.log('key is ', key);
        const id = '#' + filters[key][0]
        console.log(id)

        var region = cross_data.dimension(function(d) { return d[key]; });
        var selectRegion = new dc.SelectMenu(id, groupname);
        selectRegion
            .dimension(region)
            .group(region.group())
            .controlsUseVisibility(true);
        selectRegion.title(function (subs){
            return subs.key;
        })
    }

     dc.renderAll(groupname);

 //  Reset the filters
     d3.select('#resetFilters')
        .on('click', function() {
        console.log('reseted filters')
          dc.filterAll(groupname);
          dc.redrawAll(groupname);
     });

// //    Download
//     d3.select('#download')
//     .on('click', function() {
//         if(d3.select('#download-type input:checked').node().value==='table') {
//             var selectedData = non_operational2.top(Infinity);
//         }else{
//         var selectedData = data
//         }
//         var blob = new Blob([d3.csvFormat(selectedData)], {type: "text/csv;charset=utf-8"});
//         saveAs(blob, 'OMDTZ_mills.csv');
//     });
}