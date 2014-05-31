<!DOCTYPE html>
<html lang="en">

	<head>
	    <meta charset="utf-8">
	    <title>Crime Map - Karachi</title>
	    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	    <meta name="description" content="">
	    <meta name="author" content="">

	    <link href="css/crime.css" rel="stylesheet">
	    <link href="css/bootstrap.css" rel="stylesheet">
	    <link href="css/bootstrap-responsive.css" rel="stylesheet">

	    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
	    <!--[if lt IE 9]>
	      <script src="assets/js/html5shiv.js"></script>
	    <![endif]-->
	</head>

<body data-spy="scroll" data-target=".bs-docs-sidebar">

	<!-- Alert/Notification -->
	<div class="alert fade in crime-alert">
		<button type="button" class="close" data-dismiss="alert">×</button>
		<strong>Help fight crime!</strong> If you have been witness or victim to a crime in Karachi, please report below
	</div>

    <!-- Navbar
    ================================================== -->
    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="brand" href="./index.html">Crime Map - Karachi</a>
          <div class="nav-collapse collapse">
            <ul class="nav">
              <li class="">
                <a href="./index.html">Dashboard</a>
              </li>
              <li class="active">
                <a href="./crime-reporting.html">Crime Reporting</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
	<!-- Subhead
	================================================== -->
	<header class="" id="overview">
		<div class="container"></div>
	</header>


	<div class='container'>

		<div class='row-fluid'>


			<!-- Region Left -->
			<div class='span3'>

				<div id='crime-request'>

					<form class="form-signin" method='GET' action=''>

						<fieldset class='crime-request-fieldset'>

							<legend class='crime-request-legend'>
								<button class='btn btn-success btn-crime-request report' id="reportCrime">Report a Crime</button>
							</legend>
                            <div id="reportMessage" style="display: none">Where did the crime happen? Click a location on the map to locate. If you need to interact with the map to find the exact location, <a href="#" id="cancelReport">Cancel</a>.</div>

							<div id='crime-request-region' style="display: none">

								<!-- Crime Type -->
								<div class="input-append">

									<input class="input-small" id="crime-type-value" type="text" placeholder="Crime Type">

									<div class="btn-group">
										<button class="btn dropdown-toggle" data-toggle="dropdown">
											Crime Type
											<span class="caret"></span>
										</button>
										<ul class="dropdown-menu" id=''>
											<li><a class='crime-type' href="#" data-value='Mugging'>Mugging</a></li>
											<li><a class='crime-type' href="#" data-value='Car/Vehicle Snatched'>Car/Vehicle Snatched</a></li>
											<li><a class='crime-type' href="#" data-value='Other'>Other</a></li>
										</ul>


									</div>
								</div>

								<!-- When -->
								<div class="input-append input-prepend">

									<input class="input-small" id="prependedInput" type="text" placeholder="Time of crime">

									<div class="btn-group">

										<button class="btn dropdown-toggle" data-toggle="dropdown">
											Date
											<span class="caret"></span>
										</button>
										<ul class="dropdown-menu">
											<li><a href="#">1</a></li>
											<li><a href="#">2</a></li>
										</ul>

										<button class="btn dropdown-toggle" data-toggle="dropdown">
											Time
											<span class="caret"></span>
										</button>
										<ul class="dropdown-menu">
											<li><a href="#">1</a></li>
											<li><a href="#">2</a></li>
										</ul>

									</div>
								</div>

								<!-- Full Name -->
								<div class="input-prepend">
									<span class="add-on">My Name is</span>
									<input class="input-medium" id="full-name" type="text" placeholder="Full Name">
								</div>

								<!-- Witness/Victim -->
								<div class="input-append">

									<input class="input-small" id="witness-type-value" type="hidden" placeholder="">
									<span class="add-on">I'm the person who is</span>

									<div class="btn-group">
										<button class="btn dropdown-toggle" data-toggle="dropdown">
											Witness
											<span class="caret"></span>
										</button>
										<ul class="dropdown-menu">
											<li><a href="#" class='witness-type' data-value='Victim'>Victim</a></li>
											<li><a href="#" class='witness-type' data-value='Witness'>Witness</a></li>
										</ul>
									</div>

								</div>

								<!-- Phone/Email -->
								<div class="input-prepend">
									<span class="add-on">My Contact</span>
									<input class="input-medium" id="contact" type="text" placeholder="Phone/Email">
								</div>

								<!-- Location -->
								<div class="input-append" style="display: none">
									<span class="add-on">Crime Location</span>
										<button id='report-a-crime' class="btn btn-info dropdown-toggle" data-toggle="dropdown">
											Report Crime
										</button>
								</div>

								<!-- -->
						        <button id="reportOkay" class="btn btn-large btn-danger">Report It!</button>

						 	</div>

						</fieldset>
					</form>

				</div>

				<div id='crime-detail' style="display: none">

					<fieldset class='crime-detail-fieldset'>

						<legend class='crime-detail-legend'>Crime Detail</legend>

						<div id='crime-detail-region'>

							<table class="table table-condensed">
								<tbody>
									<tr>
										<td>Location</td>
										<td>#total_crimes#</td>
									</tr>
									<tr>
										<td>Crimes</td>
										<td>#total_crimes#</td>
									</tr>
									<tr>
										<td>Time Range</td>
										<td>#time_of_crime#</td>
									</tr>
									<tr>
										<td>Crime Type</td>
										<td>#crime_type#</td>
									</tr>
								</tbody>
							</table>

	            		</div>

					<fieldset>

				</div>

			</div>

			<!-- Region Right -->
			<div class='span9'>

				<div class="hero-unit">
					<h3></h3>
					<div id="map-canvas" style="width: 100%"></div>
				</div>

			</div>

		</div>

	</div>




    <!-- Footer
    ================================================== -->
    <footer class="footer">
      <div class="container">
      </div>
    </footer>


    <!-- Placed at the end of the document so the pages load faster -->
    <script src="js/jquery.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/functions.js"></script>
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCtRuGX3NGV0sbcaW1mJQSNkX9YD1h4Bs4&sensor=true"></script>
    <script src="js/maps.js"></script>
    <script src="js/assets/bootstrap-alert.js"></script>
<!--
	<script src="js/assets/bootstrap-affix.js"></script>
    <script src="js/assets/bootstrap-alert.js"></script>
    <script src="js/assets/bootstrap-button.js"></script>
    <script src="js/assets/bootstrap-carousel.js"></script>
    <script src="js/assets/bootstrap-collapse.js"></script>
    <script src="js/assets/bootstrap-dropdown.js"></script>
    <script src="js/assets/bootstrap-modal.js"></script>
    <script src="js/assets/bootstrap-popover.js"></script>
    <script src="js/assets/bootstrap-scrollspy.js"></script>
    <script src="js/assets/bootstrap-tab.js"></script>
    <script src="js/assets/bootstrap-tooltip.js"></script>
    <script src="js/assets/bootstrap-transition.js"></script>
    <script src="js/assets/bootstrap-typeahead.js"></script>
-->
  </body>
</html>