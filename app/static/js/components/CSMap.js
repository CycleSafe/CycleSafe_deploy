define([], function(){
	var CSMap = React.createClass({displayName: "CSMap",

        getInitialState: function() {
            return {map:null, mapData:null}
        },
        getDefaultProps: function(){
            /* Coords of the United States. Default if this component is rendered without props 
               They will be overriden with whatever the user's coordinates are 
            */
            return {coords:[37.6,-95.665],zoom:5}
        },
        componentDidMount: function(){
            var mapOptions = {
                center: this.centerMap(),
                zoom: this.props.zoom,
                mapTypeId: google.maps.MapTypeId.ROAD
            };
            var map = new google.maps.Map(this.getDOMNode(),mapOptions);
            this.setState({map:map});
            if(this.state.map){
                $.get('/api/v1/hazard/?format=json', function(mapData){
                    if(mapData) {
                        this.setState({mapData:mapData});
                        this.drawMarkers();
                    }
                }.bind(this));
            }
            /*
                Another example of a component that could have been easily "Reactified" but can't because Google...
            */
            var input = document.getElementById('pac-input');
            this.state.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
            var searchBox = new google.maps.places.SearchBox(input);
            // Listen for the event fired when the user selects an item from the
            // pick list. Retrieve the matching places for that item.
            google.maps.event.addListener(searchBox, 'places_changed', function () { 
                var places = searchBox.getPlaces();
                if (places.length == 0) {
                    return;
                }
                this.drawPlaces(places);
            }.bind(this));
        },
        componentDidUpdate: function(){
            if(this.state.map){
                this.state.map.panTo(this.centerMap());
                this.state.map.setZoom(this.props.zoom);
            }
        },
        centerMap: function(){
            return new google.maps.LatLng(this.props.coords[0], this.props.coords[1]);
        },
        drawMarkers: function(){
            var infoWindow = new google.maps.InfoWindow();
            for (var i = 0; i < this.state.mapData.objects.length; i++) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(this.state.mapData.objects[i].lat, this.state.mapData.objects[i].lon),
                    map: this.state.map,
                    animation: google.maps.Animation.DROP,
                    title: this.state.mapData.objects[i].description,
                });
                /* Unfortunately the Maps API requires an HTML string. Can't "Reactify". 
                   This would have been the perfect example of a reusable web component.
                */
                contentString = '<div class="infoindow">' +
                    '<h4><span class="blue">User: </span>' + this.state.mapData.objects[i].user_type + '</h4>' +
                    '<p> <span class="blue">Date and Time: </span>' + this.state.mapData.objects[i].date_time + '<br>' +
                    '<span class="blue">Hazard: </span>' + this.state.mapData.objects[i].hazard_type + '<br>' +
                    '<span class="blue">Description: </span>' + this.state.mapData.objects[i].description + '</p>' +
                    '</div>';
                google.maps.event.addListener(marker, 'mouseover', (function (marker, contentString) {
                    return function () {
                        infoWindow.setContent(contentString);
                        infoWindow.open(this.state.map, marker);
                    }.bind(this);
                }.bind(this))(marker, contentString));
            }
        },
        drawPlaces: function(places){
            /* What does this do ? */
            /*for (var i = 0, marker; marker = markers[i]; i++) {
                    marker.setMap(null);
            }

            // For each place, get the icon, place name, and location.
            markers = [];*/
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0, place; place = places[i]; i++) {
                var image = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                var marker = new google.maps.Marker({
                    map: this.state.map,
                    icon: image,
                    title: place.name,
                    position: place.geometry.location,
                });

                //Center the map on the new marker's location.
                this.state.map.panTo(place.geometry.location);
                /* What does this do ? */
                //Add marker to map.
                //markers.push(marker);
                return true;

            }
        },
        render: function(){
            return (
                React.createElement("div", {id: "map-canvas"})
            )
        }
    });

	return CSMap;
});