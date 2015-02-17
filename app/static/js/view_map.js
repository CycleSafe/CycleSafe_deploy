require(["components/CSMap"], function(CSMap){

    var CSViewMap  = React.createClass({displayName: "CSViewMap",
        getInitialState: function(){
            return {coords:[]}
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
            /* What does this do ?
            setTimeout(function () {
                if(!coords){
                    window.console.log("No confirmation from user, using fallback");
                }else{
                    window.console.log("Location was set");
                }
            }, geoOptions.timeout + 1000); // Wait extra second */
        },
        render: function(){
            /*
                <CSMap coords={} zoom={}/> only if parent has coords and zoom. Otherwise, <CSMap /> will use its defaultProps
                Note: render() will be called everytime this.state is updated, so the else{} clause will be triggered when the user sets coords
            */
            var csMap;
            if(this.state.coords.length < 2){
                csMap = React.createElement(CSMap, null)
            }else{
                csMap = React.createElement(CSMap, {coords: this.state.coords, zoom: 12})
            }
            return (
                React.createElement("div", null, 
                    React.createElement(CSNavBar, null), 
                    React.createElement(CSSearchBox, null), 
                    React.createElement(CSTools, null), 
                    csMap
                )
            )
        }
    });

    var CSNavBar = React.createClass({displayName: "CSNavBar",
        render: function(){
            return (
                React.createElement("div", {className: "nav"}, React.createElement("span", {className: "title"}, "CycleSafe"), React.createElement("span", {className: "tagline"}, "We make roads safer for everyone"))
            )
        }
    });

    var CSSearchBox = React.createClass({displayName: "CSSearchBox",
        render: function(){
            return (
                React.createElement("input", {id: "pac-input", className: "map-search-box", type: "text", placeholder: "Search for a location here."})
            )
        }
    });

    var CSTools = React.createClass({displayName: "CSTools",
        render: function(){
            return (
                React.createElement("div", {className: "tools"}, 
                    React.createElement(CSReportButton, null)
                )
            )
        }
    });

    var CSReportButton = React.createClass({displayName: "CSReportButton",
        render: function(){
            return (
                React.createElement("div", {className: "btn-report"})
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
