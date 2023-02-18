
toggleNavbar()
const map = createMap()

// Launch fetch of mills and machines
// Note that this happens concurrently, but we'll only use the
// machines after the mills download is complete
var subs
mills_promise = $.get('/read_submissions')

mills_promise.then(function(data) {
    data = JSON.parse(data)
    var element = document.getElementById("spin");
    element.classList.toggle("hide");
    drawMarkers(data);
});
createLegend(map);

