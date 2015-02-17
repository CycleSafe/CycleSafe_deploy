require(["components/CSMap"], function(CSMap){

    var CSViewMap  = React.createClass({
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
                csMap = <CSMap />
            }else{
                csMap = <CSMap coords={this.state.coords} zoom={12}/>
            }
            return (
                <div>
                    <CSSearchBox />
                    {csMap}
                </div>
            )
        }
    });

    var CSSearchBox = React.createClass({
        render: function(){
            return (
                <input id="pac-input" className="controls" type="text" placeholder="Search for a location here."></input>
            )
        }
    });

    $(document).ready(function(){
        React.render(
            <CSViewMap />,
            $('.content')[0]
        );
    });

});
