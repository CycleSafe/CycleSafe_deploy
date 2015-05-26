var React = require('react/addons'),
    $ = require('jquery'),
    ReactGoogleMaps = require('react-google-maps'),
    GoogleMaps = ReactGoogleMaps.GoogleMaps,
    Marker = ReactGoogleMaps.Marker,
    InfoWindow = ReactGoogleMaps.InfoWindow;

var CSViewMap  = React.createClass({
    getInitialState: function(){
        return {coords:{lat:37.6,lng:-95.665},zoom:5,selectedCoords:[],markerData:{meta:{},objects:[]}}
    },
    componentDidMount: function(){
        var geoOptions = {
            maximumAge: 30000,
            timeout:5000,
            enableHighAccuracy:true
        }
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position){
                var nextCoords = this.state.coords,
                    nextZoom = 15;
                nextCoords.lat = position.coords.latitude;
                nextCoords.lng = position.coords.longitude;
                this.setState({coords:nextCoords, zoom:nextZoom});
            }.bind(this));
        }
        $.get('/api/v1/hazard/?format=json', function(markerData){
            if(markerData) {
                this.setState({markerData:markerData});
            }
        }.bind(this));
    },
    handleMapClick: function(e){
        var nextSelectedCoords = this.state.selectedCoords;
        nextSelectedCoords[0] = e.latLng.lat();
        nextSelectedCoords[1] = e.latLng.lng();
        this.setState({selectedCoords:nextSelectedCoords});
    },
    render: function(){
        return (
            <div>
                <div className="nav"><span className="title">CycleSafe</span></div>
                <CSMap handleClick={this.handleMapClick} markerData={this.state.markerData} coords={this.state.coords} zoom={this.state.zoom} />
                <CSUtils selectedCoords={this.state.selectedCoords} />
            </div>
        )
    }
});

var CSMap = React.createClass({
    getInitialState: function(){
        /* infoCenter is set when an InfoWindow is open. This is so that when CSMap is re-rendered, it won't flash back to the old coordinates before panning */
        return {infoOpen: false, infoCenter:{}}
    },
    render:function(){
        var center={}
        this.state.infoOpen?center=this.state.infoCenter:center={lat: this.props.coords.lat, lng: this.props.coords.lng}
        console.log(center);
        return (
            <GoogleMaps 
                containerProps={
                    {
                      className:"map-canvas"
                    }
                }
                onClick={this.handleClick}
                googleMapsApi={google.maps}
                zoom={this.props.zoom}
                center={center}>
                {this.props.markerData.objects.map(toMarker,this)}
            </GoogleMaps>
        )

        function toMarker(marker,index){
            return (
                <Marker
                    ref={"marker-"+index}
                    position={new google.maps.LatLng(marker.lat,marker.lon)}
                    key={index}
                    onMouseover={this.handleMouseOver.bind(this,marker)}>
                    {renderInfoWindow.call(this,marker,index,this.ref)}
                </Marker>
            )
        }

        function renderInfoWindow(marker,index){
            var markerRef="marker-"+index;
            var contentString = '<div class="infoindow">' +
            '<h4><span class="blue">User: </span>' + marker.user_type + '</h4>' +
            '<p> <span class="blue">Date and Time: </span>' + marker.date_time + '<br>' +
            '<span class="blue">Hazard: </span>' + marker.hazard_type + '<br>' +
            '<span class="blue">Description: </span>' + marker.description + '</p>' +
            '</div>';
            return marker.showInfo ? <InfoWindow disableAutoPan={true} content={contentString} owner={markerRef} onCloseclick={this.handleCloseClick.bind(this, marker)}/> : null;
        }
    },
    handleMouseOver: function(marker,index,e){
        if(!marker.showInfo){
            marker.showInfo = true;
            /* parseFloat is changing the decimals by a small amount */
            this.setState({infoOpen:true,infoCenter:{lat:parseFloat(marker.lat),lng:parseFloat(marker.lon)}});
        }
    },
    handleCloseClick: function(marker){
        if(marker.showInfo){
            marker.showInfo = false;
            this.forceUpdate();
        }
    },
    handleClick: function(e){
        this.props.handleClick(e);
    }
});

var CSUtils = React.createClass({
    getInitialState: function(){
        return {expanded: false, activeTab: 0, selectedCoords: [], tabs:[{title:"Report Hazard"},{title:"Trip Planner"}]};
    },
    componentWillReceiveProps: function(p){
        if(p.selectedCoords.length==2){
            this.setState({expanded: true, activeTab: 0, selectedCoords: p.selectedCoords});
        }
    },
    handleHeaderClick: function(e){
        this.setState({expanded: !this.state.expanded});
    },
    handleChangeTab: function(tab){
        this.setState({activeTab: tab});
    },
    render: function(){
        if(this.state.expanded){
            $('.menu-utils').addClass('menu-utils-expand');
        }else{
            $('.menu-utils').removeClass('menu-utils-expand');                
        }
        var tabContent;
        switch(this.state.activeTab){
            case 1: tabContent = <CSTripPlanner />; break;
            default: tabContent = <CSReportHazard selectedCoords={this.state.selectedCoords}/>;
        }
        var tabs = this.state.tabs.map(function(tab, i){
            var tabClassName = "tab";
            if(this.state.activeTab == i){
                tabClassName+=" tab-selected";
            }
            return (
                <CSTab className={tabClassName} tab={tab} iter={i} key={i} title={tab.title} handleChangeTab={this.handleChangeTab}></CSTab>
            )
        }.bind(this));
        var headerClass="header header-pulse";
        if(this.state.expanded){
            headerClass = "header";
        }
        return (
            <div className="menu-utils">
                <div onClick={this.handleHeaderClick} className={headerClass}>
                    <img src="/static/img/ic_bike.svg"></img>
                </div>
                <div className="tab-container">
                   {tabs}
                </div>
                <div className="tab-content">
                    {tabContent}
                </div>
            </div>
        )
    }
});

var CSTab = React.createClass({
    render: function(){
        return ( 
            <div className={this.props.className} onClick={this.handleClick}>
                <span className="tab-title">{this.props.title}</span>
            </div>
        )
    },
    handleClick: function(){
        this.props.handleChangeTab(this.props.iter);
    }
});

var CSReportHazard = React.createClass({
    getInitialState: function(){
        return {selectedCoords:[],userType:"",time:{},hazardType:"",description:"",
                formFields: {userType:0,hazardType:0,dateTime:"",latLong:[],description:""}}
    },
    componentWillReceiveProps: function(p){
        // {BUG} Not called when tabs are switched
        if(p.selectedCoords.length==2){
            var nextFormFields = this.state.formFields;
            nextFormFields.latLong = p.selectedCoords;
            this.setState({formFields:nextFormFields});
        }
    },
    handleChangeInput: function(field,e,value) {
        // {REFACTOR} This is the wrong way to be doing forms in React.
        var fieldValue;
        switch(field){
            case 'latLong':
                fieldValue = [];
                fieldValue[0] = this.refs.inputLat.getDOMNode().value;
                fieldValue[1] = this.refs.inputLong.getDOMNode().value;
                break;
            case 'userType':
                fieldValue = value;
                break;
            default:
                fieldValue = e.target.value;
        }
        var nextFormFields = this.state.formFields;
        nextFormFields[field] = fieldValue;
        this.setState({formFields: nextFormFields});
    },
    render: function(){
        var class_bicycle_button = "user-button";
        var class_pedestrian_button = "user-button";
        if(this.state.formFields.userType==0){
            class_bicycle_button+=" user-button-selected";
        }else{
            class_pedestrian_button+= " user-button-selected";
        }
        return (  
            <div className="report-hazard">
                <div className="user-type">
                    <div className={class_bicycle_button} onClick={this.handleChangeInput.bind(this,'userType',null,0)}>
                        <img src="/static/img/ic_bike.svg"></img>
                    </div>
                    <div className={class_pedestrian_button} onClick={this.handleChangeInput.bind(this,'userType',null,1)}>
                        <img src="/static/img/ic_pedestrian.svg"></img>
                    </div>
                </div>
                <div className="hazard-time">
                    <select ref="subject" onChange={this.handleChangeInput.bind(this,'hazardType')}>
                        <option value="0">Choose a Hazard</option>
                        <option value="1">Construction</option>
                        <option value="2">Dangerous Crossing</option>
                        <option value="3">Dangerous Road</option>
                        <option value="4">Heavy Traffic</option>
                        <option value="5">Low Visibility</option>
                        <option value="6">Obstruction</option>
                    </select>
                    <input type="text" defaultValue={new Date()} onChange={this.handleChangeInput.bind(this,'dateTime')}></input>
                </div>
                <div className="lat-long">
                    <input type="text" ref="inputLat"  value={this.state.formFields.latLong[0]} onChange={this.handleChangeInput.bind(this,'latLong')}></input>
                    <input type="text" ref="inputLong" value={this.state.formFields.latLong[1]} onChange={this.handleChangeInput.bind(this,'latLong')}></input>
                </div>
                <div className="description">
                    <textarea placeholder="Description" onChange={this.handleChangeInput.bind(this,'description')}></textarea>
                </div>
                <div className="submit">
                    <span>Submit</span>
                </div>
            </div>
        )
    }
});

var CSTripPlanner = React.createClass({
    render: function(){
        return (  
            <div className="trip-planner">
            </div>
        )
    }
});

$(document).ready(function(){
    React.render(
        <CSViewMap />,
        $('.wrap')[0]
    );
});
