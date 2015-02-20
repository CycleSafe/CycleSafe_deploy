require(["components/CSMap"], function(CSMap){

    var CSViewMap  = React.createClass({
        getInitialState: function(){
            return {coords:[], selectedCoords:[]}
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
                csMap = <CSMap handleMapClick={this.handleMapClick}/>
            }
            else{
                csMap = <CSMap coords={this.state.coords} zoom={12} handleMapClick={this.handleMapClick}/>
            }
            return (
                <div>
                    <div className="nav"><span className="title">CycleSafe</span><span className="tagline">We make roads safer for everyone</span></div>
                    <input id="pac-input" className="map-search-box" type="text" placeholder="Search for a location here."></input>
                    {csMap}
                    <CSUtils selectedCoords={this.state.selectedCoords} />
                </div>
            )
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
                return (
                    <CSTab tab={tab} iter={i} key={i} title={tab.title} handleChangeTab={this.handleChangeTab}></CSTab>
                )
            }.bind(this));
            return (
                <div className="menu-utils">
                    <div onClick={this.handleHeaderClick} className="header"></div>
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
                <div className="tab" onClick={this.handleClick}>
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
            return {selectedCoords:[],userType:"",time:{},hazardType:"",description:""}
        },
        componentWillReceiveProps: function(p){
            if(p.selectedCoords.length==2){
                this.setState({selectedCoords:p.selectedCoords});
            }
        },
        render: function(){
            return (  
                <div className="report-hazard">
                    <span>{this.props.selectedCoords}</span>
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

});
