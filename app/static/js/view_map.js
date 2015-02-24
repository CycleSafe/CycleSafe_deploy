require(["components/CSMap"], function(CSMap){

    var CSViewMap  = React.createClass({displayName: "CSViewMap",
        getInitialState: function(){
            return {coords:[], selectedCoords:[],markerData: []}
        },
        componentDidMount: function(){
            var geoOptions = { maximumAge: 30000,
                timeout:5000,
                enableHighAccuracy:true
            }
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(geopos){
                    this.setState({coords:[geopos.coords.latitude,geopos.coords.longitude]});
                }.bind(this), null, geoOptions);
            } else {
                console.warn('Geolocation isnt available for this user.');
            }
            $.get('/api/v1/hazard/?format=json', function(markerData){
                if(markerData) {
                    this.setState({markerData:markerData});
                }
            }.bind(this));
        },
        handleMapClick: function(e){
            var nextSelectedCoords = this.state.selectedCoords;
            nextSelectedCoords[0] = e.latLng.D;
            nextSelectedCoords[1] = e.latLng.k;
            this.setState({selectedCoords:nextSelectedCoords});
        },
        render: function(){
            /*
                <CSMap coords={} zoom={}/> only if parent has coords and zoom. Otherwise, <CSMap /> will use its defaultProps
                Note: render() will be called everytime this.state is updated, so the else{} clause will be triggered when the user sets coords
            */
            var csMap;
            if(this.state.coords.length < 2){
                csMap = React.createElement(CSMap, {handleMapClick: this.handleMapClick, markerData: this.markerData})
            }
            else{
                csMap = React.createElement(CSMap, {coords: this.state.coords, zoom: 12, handleMapClick: this.handleMapClick, markerData: this.markerData})
            }
            return (
                React.createElement("div", null, 
                    React.createElement("div", {className: "nav"}, React.createElement("span", {className: "title"}, "CycleSafe"), React.createElement("span", {className: "tagline"}, "We make roads safer for everyone")), 
                    React.createElement("input", {id: "pac-input", className: "map-search-box", type: "text", placeholder: "Search for a location here."}), 
                    csMap, 
                    React.createElement(CSUtils, {selectedCoords: this.state.selectedCoords})
                )
            )
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
                return (
                    React.createElement(CSTab, {tab: tab, iter: i, key: i, title: tab.title, handleChangeTab: this.handleChangeTab})
                )
            }.bind(this));
            return (
                React.createElement("div", {className: "menu-utils"}, 
                    React.createElement("div", {onClick: this.handleHeaderClick, className: "header"}), 
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
                React.createElement("div", {className: "tab", onClick: this.handleClick}, 
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
            return {selectedCoords:[],userType:"",time:{},hazardType:"",description:""}
        },
        componentWillReceiveProps: function(p){
            if(p.selectedCoords.length==2){
                this.setState({selectedCoords:p.selectedCoords});
            }
        },
        render: function(){
            return (  
                React.createElement("div", {className: "report-hazard"}, 
                    React.createElement("span", null, this.props.selectedCoords)
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

});
