var React = require('react/addons'),
    $ = require('jquery'),
    ReactGoogleMaps = require('react-google-maps'),
    GoogleMaps = ReactGoogleMaps.GoogleMaps,
    Marker = ReactGoogleMaps.Marker,
    InfoWindow = ReactGoogleMaps.InfoWindow;

var CSViewMap  = React.createClass({displayName: "CSViewMap",
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
            React.createElement("div", null, 
                React.createElement("div", {className: "nav"}, React.createElement("span", {className: "title"}, "CycleSafe")), 
                React.createElement(CSMap, {handleClick: this.handleMapClick, markerData: this.state.markerData, coords: this.state.coords, zoom: this.state.zoom}), 
                React.createElement(CSUtils, {selectedCoords: this.state.selectedCoords})
            )
        )
    }
});

var CSMap = React.createClass({displayName: "CSMap",
    render:function(){
        return (
            React.createElement(GoogleMaps, {
            containerProps: 
                {
                  className:"map-canvas"
                }, 
            
            onClick: this.handleClick, 
            googleMapsApi: google.maps, 
            zoom: this.props.zoom, 
            center: {lat: this.props.coords.lat, lng: this.props.coords.lng}}, 
            this.props.markerData.objects.map(function(marker, index){
                return (
                    React.createElement(Marker, {
                      position: new google.maps.LatLng(marker.lat,marker.lon), 
                      key: marker.date_time})
                )
            }, this)
            )
        )
    },
    handleClick: function(e){
        this.props.handleClick(e);
    }
});

var CSUtils = React.createClass({displayName: "CSUtils",
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
            case 1: tabContent = React.createElement(CSTripPlanner, null); break;
            default: tabContent = React.createElement(CSReportHazard, {selectedCoords: this.state.selectedCoords});
        }
        var tabs = this.state.tabs.map(function(tab, i){
            var tabClassName = "tab";
            if(this.state.activeTab == i){
                tabClassName+=" tab-selected";
            }
            return (
                React.createElement(CSTab, {className: tabClassName, tab: tab, iter: i, key: i, title: tab.title, handleChangeTab: this.handleChangeTab})
            )
        }.bind(this));
        var headerClass="header header-pulse";
        if(this.state.expanded){
            headerClass = "header";
        }
        return (
            React.createElement("div", {className: "menu-utils"}, 
                React.createElement("div", {onClick: this.handleHeaderClick, className: headerClass}, 
                    React.createElement("img", {src: "/static/img/ic_bike.svg"})
                ), 
                React.createElement("div", {className: "tab-container"}, 
                   tabs
                ), 
                React.createElement("div", {className: "tab-content"}, 
                    tabContent
                )
            )
        )
    }
});

var CSTab = React.createClass({displayName: "CSTab",
    render: function(){
        return ( 
            React.createElement("div", {className: this.props.className, onClick: this.handleClick}, 
                React.createElement("span", {className: "tab-title"}, this.props.title)
            )
        )
    },
    handleClick: function(){
        this.props.handleChangeTab(this.props.iter);
    }
});

var CSReportHazard = React.createClass({displayName: "CSReportHazard",
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
            React.createElement("div", {className: "report-hazard"}, 
                React.createElement("div", {className: "user-type"}, 
                    React.createElement("div", {className: class_bicycle_button, onClick: this.handleChangeInput.bind(this,'userType',null,0)}, 
                        React.createElement("img", {src: "/static/img/ic_bike.svg"})
                    ), 
                    React.createElement("div", {className: class_pedestrian_button, onClick: this.handleChangeInput.bind(this,'userType',null,1)}, 
                        React.createElement("img", {src: "/static/img/ic_pedestrian.svg"})
                    )
                ), 
                React.createElement("div", {className: "hazard-time"}, 
                    React.createElement("select", {ref: "subject", onChange: this.handleChangeInput.bind(this,'hazardType')}, 
                        React.createElement("option", {value: "0"}, "Choose a Hazard"), 
                        React.createElement("option", {value: "1"}, "Construction"), 
                        React.createElement("option", {value: "2"}, "Dangerous Crossing"), 
                        React.createElement("option", {value: "3"}, "Dangerous Road"), 
                        React.createElement("option", {value: "4"}, "Heavy Traffic"), 
                        React.createElement("option", {value: "5"}, "Low Visibility"), 
                        React.createElement("option", {value: "6"}, "Obstruction")
                    ), 
                    React.createElement("input", {type: "text", defaultValue: new Date(), onChange: this.handleChangeInput.bind(this,'dateTime')})
                ), 
                React.createElement("div", {className: "lat-long"}, 
                    React.createElement("input", {type: "text", ref: "inputLat", value: this.state.formFields.latLong[0], onChange: this.handleChangeInput.bind(this,'latLong')}), 
                    React.createElement("input", {type: "text", ref: "inputLong", value: this.state.formFields.latLong[1], onChange: this.handleChangeInput.bind(this,'latLong')})
                ), 
                React.createElement("div", {className: "description"}, 
                    React.createElement("textarea", {placeholder: "Description", onChange: this.handleChangeInput.bind(this,'description')})
                ), 
                React.createElement("div", {className: "submit"}, 
                    React.createElement("span", null, "Submit")
                )
            )
        )
    }
});

var CSTripPlanner = React.createClass({displayName: "CSTripPlanner",
    render: function(){
        return (  
            React.createElement("div", {className: "trip-planner"}
            )
        )
    }
});

$(document).ready(function(){
    React.render(
        React.createElement(CSViewMap, null),
        $('.wrap')[0]
    );
});
