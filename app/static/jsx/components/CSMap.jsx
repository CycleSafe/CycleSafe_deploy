define([], function(){
	var CSMap = React.createClass({

        getInitialState: function() {
            return {map:null, markerData:null}
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

            google.maps.event.addListener(this.state.map, 'click', function(e){
                this.handleClick(e);
            }.bind(this));
        },
        handleClick: function(e){
            this.props.handleMapClick(e);
        },
        shouldComponentUpdate: function(p,s){
            /*
                If the next props (p) are not the same as the default, then update the map
            */
            if(p.coords != this.props.coords){
                return true;
            }
            return false;
        },
        componentDidUpdate: function(nextProps){
            if(this.state.map){
                if(nextProps.markerData){
                    this.setState({markerData:nextProps.markerData});
                }
                this.state.map.panTo(this.centerMap());
                this.state.map.setZoom(this.props.zoom);
            }
        },
        centerMap: function(){
            return new google.maps.LatLng(this.props.coords[0], this.props.coords[1]);
        },
        drawMarkers: function(){
            var infoWindow = new google.maps.InfoWindow();
            for (var i = 0; i < this.state.markerData.objects.length; i++) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(this.state.markerData.objects[i].lat, this.state.markerData.objects[i].lon),
                    map: this.state.map,
                    animation: google.maps.Animation.DROP,
                    title: this.state.markerData.objects[i].description,
                });
                /* Unfortunately the Maps API requires an HTML string. Can't "Reactify". 
                */
                contentString = '<div class="infoindow">' +
                    '<h4><span class="blue">User: </span>' + this.state.markerData.objects[i].user_type + '</h4>' +
                    '<p> <span class="blue">Date and Time: </span>' + this.state.markerData.objects[i].date_time + '<br>' +
                    '<span class="blue">Hazard: </span>' + this.state.markerData.objects[i].hazard_type + '<br>' +
                    '<span class="blue">Description: </span>' + this.state.markerData.objects[i].description + '</p>' +
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
                <div id="map-canvas"></div>
            )
        }
    });

	return CSMap;
});