// Test if script is loaded
console.log('FPL Insights: Content script loaded');
document.body.style.border = '5px solid red'; // This will make the page border red if the script loads

// Hire me! smithjb84@gmail.com

var players = [];
var team = [];
var teams = [];

//Initiate Settings
function initiateSettings(){
	chrome.storage.sync.get('showPlayers', function(data) {
    if (data.showPlayers === "true"){
    	$("#showPlayers").click();
    	$(".settings-box").css("display", "none");
	}
	});
	chrome.storage.sync.get('showDifficulty', function(data) {
    if (data.showDifficulty === "true"){
    	clearDifficulty();
    	$("#showDifficulty").click();
    	$(".settings-box").css("display", "none");
	}
	});
}

// Get the required data for scatter
function getsdata(x_select, y_select, position) {
	var data = [],
		my_data = [],
		tags = [],
		my_tags = [],
		all_x = [],
		all_y = [],
		xmax,
		xmin,
		ymax,
		ymin,
		dividex = 1.0,
		dividey = 1.0,
		my_ids = [];

	for (item of team){
		my_ids.push(item.element)
	}

	if (x_select == "now_cost"){
		dividex = 10.0;
	}
	
	if (y_select == "now_cost"){
		dividey = 10.0;
	}

	for (item of players){
		if (item.element_type == position) {
			if (my_ids.includes(item["id"])){
				my_data.push([(item[x_select]/dividex).toFixed(1), (item[y_select]/dividey).toFixed(1)]);
				my_tags.push(item["web_name"]);
				all_x.push((item[x_select]/dividex).toFixed(1));
				all_y.push((item[y_select]/dividey).toFixed(1));
            }
            else{
				data.push([(item[x_select]/dividex).toFixed(1), (item[y_select]/dividey).toFixed(1)]);
				tags.push(item["web_name"]);
				all_x.push((item[x_select]/dividex).toFixed(1));
				all_y.push((item[y_select]/dividey).toFixed(1));
			}
		}
	}

	xmax = Math.max(...all_x);
	xmin = Math.min(...all_x);
	ymax = Math.max(...all_y);
	ymin = Math.min(...all_y);

	return [data, tags, xmax, xmin, ymax, ymin, my_data, my_tags];

	
}

// Get the required data for bar
function getbdata(featureb, positionb) {
	var datab = [],
	dividex = 1.0,
	dividey = 1.0;

	if (featureb == "now_cost"){
		dividex = 10.0;
	}

	if (featureb == "now_cost"){
		divide = 10.0;
	}

	for (item of players) {
        if (item.element_type == positionb) {
            datab.push([(item[featureb] / dividex).toFixed(1), item["web_name"]]);
        }
    }

	var databsorted = datab.sort(function (a, b) {
		return b[0] - a[0];
	});

	var databedited = databsorted.slice(0, 10);
	var editednames = [];
	var editedfeatures = [];

	for (item of databedited){
		editednames.push(item[1]);
		editedfeatures.push(item[0]);
	}

	var packaged = [];
	packaged.push(editednames);
	packaged.push(editedfeatures);
	return packaged;

}

// On select change for scatter
$('body').on( "change", ".select-adjust", function() {
	var xaxis = $( "#xaxis" ).val();
	var yaxis = $( "#yaxis" ).val();
	var position = parseInt($( "#position" ).val());

	var sdata = getsdata(xaxis, yaxis, position);
	$( "#chart1" ).empty();
	scatter(sdata);
});

// On select change for bar
$('body').on( "change", ".bar-adjust", function() {
	var featureb = $( "#feature" ).val();
	var positionb = parseInt($( "#positionb" ).val());

	var bdata = getbdata(featureb, positionb);
	$( "#chart2" ).empty();
	bar(bdata);
});

// Hide and Show fpl insights section
$('body').on( "click", ".toggle", function() {
	$(".outer").slideToggle();
	$('.outer').slick('setPosition');
	chrome.runtime.sendMessage({action: "viewInsights"});
});

// show settings
$('body').on( "click", ".settings-container", function() {
	$(".settings-box").css("display", "block");
});

//hide settings
$('body').on( "mouseleave", ".settings-box", function() {
	$(".settings-box").css("display", "none");
});

// Clicking Show Player Settings
$('body').on( "click", "#showPlayers", function() {
	if($(this).is(':checked')){
		chrome.storage.sync.set({ "showPlayers": "true" });
		showPlayers();
    }
    else{
		chrome.storage.sync.set({ "showPlayers": "false" });
		showShirts();
	}
});

// Clicking Show Difficulty Settings
$('body').on( "click", "#showDifficulty", function() {
	if($(this).is(':checked')){
		chrome.storage.sync.set({ "showDifficulty": "true" });
		showDifficulty();
    }
    else{
		chrome.storage.sync.set({ "showDifficulty": "false" });
		clearDifficulty();
	}
});

// Set up fpl insights
function setup() {
    console.log('FPL Insights: Setup function called');
    var checkExist = setInterval(function () {
        console.log('FPL Insights: Checking for main content container');
        // Look for the main content area with multiple possible selectors
        let container = $('.ism, .Layout__MainContent-sc-1e0jf8e-1, .Layout__MainContent-sc-1e0jf8e-2, .Layout__MainContent-sc-1e0jf8e-3, main, .Layout__Content-sc-1e0jf8e-0');
        if (container.length) {
            console.log('FPL Insights: Found container:', container.attr('class'));
            clearInterval(checkExist);
            initialsetup();
        }
    }, 100);
}

// Set up fpl insights section on tab click
$(document).on("click", "a:contains('Transfers')", function() {
    console.log('FPL Insights: Transfers tab clicked');
    var checkExists = setInterval(function() {
        console.log('FPL Insights: Checking for main content container after tab click');
        let container = $('.ism, .Layout__MainContent-sc-1e0jf8e-1, .Layout__MainContent-sc-1e0jf8e-2, .Layout__MainContent-sc-1e0jf8e-3, main, .Layout__Content-sc-1e0jf8e-0');
        if (container.length) {
            console.log('FPL Insights: Found container after tab click:', container.attr('class'));
            clearInterval(checkExists);
            initialsetup();
        }
    }, 100);
});

//Player Pics
function showPlayers() {
    var playerPics = setInterval(function () {
        if ($('.Pitch__PitchContainer-sc-1e0jf8e-0').length) {
            clearInterval(playerPics);
            $('.PitchElement__ElementImage-sc-1e0jf8e-0').each(function (index) {
                var name = $(this).closest('.PitchElement__ElementContainer-sc-1e0jf8e-1').find('.PitchElementData__ElementName-sc-1u4y6pr-0').text();
                var shirt_team = $(this).attr("alt");

                var result_team = teams.find(obj => {
                    return obj.name === shirt_team
                });

                var team_id = result_team.id;

                var result = players.find(obj => {
                    return (obj.web_name === name && obj.team === team_id)
                });

                var code = result.photo.slice(0, -4);
                var personpic = "//platform-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p" + code + ".png";
                $(this).prev().attr("srcset", personpic);
                $(this).attr("width", "56");
            });
        }
    }, 10);
}

//Show Shirts
function showShirts() {
    var shirtPics = setInterval(function () {
        if ($('.Pitch__PitchContainer-sc-1e0jf8e-0').length) {
            $('.PitchElement__ElementImage-sc-1e0jf8e-0').each(function (index) {
                var name = $(this).closest('.PitchElement__ElementContainer-sc-1e0jf8e-1').find('.PitchElementData__ElementName-sc-1u4y6pr-0').text();
                var shirt_team = $(this).attr("alt");
                var result_team = teams.find(obj => {
                    return obj.name === shirt_team
                });
                var code = result_team.code;
                if (index <= 1) {
                    var shirtpic = "/dist/img/shirts/shirt_"+code+"_1-66.png";
                } else {
                    var shirtpic = "/dist/img/shirts/shirt_"+code+"-66.png";
                }
                $(this).prev().attr("srcset", shirtpic);
                $(this).attr("width", "56");
            });
            clearInterval(shirtPics);
        }
    }, 10);
}

// Scatter Graph
function scatter(sdata){
	
	var xlabel = $("#xaxis option:selected").html();
	var ylabel = $("#yaxis option:selected").html();
	
	var options = {
            chart: {
                height: 500,
                type: 'scatter',
                zoom: {
                    enabled: true,
                    type: 'xy',
                }
            },
            colors: ['#fa2730', '#2e93fa'],
            series: [{
                name: "In Team",
                data: sdata[6],
            },
				{
                name: "Not in Team",
                data: sdata[0],
            }
			],
			tooltip: {
				 y: {
					 show: true,
				  title: {
					  formatter: (value, opts) => {
					  	if(opts.seriesIndex == 0){
					  		return sdata[7][opts.dataPointIndex]
						}
						else{
					  		return sdata[1][opts.dataPointIndex]
						}

					  }
				  }
				},
				x: {
					 show: false,
				}
			},
            xaxis: {
				max: sdata[2],
				min: sdata[3],
				type: 'numeric',
				title: {
				text: xlabel,
				style: {
                fontSize: '16px',
				
				}
				}
            },
            yaxis: {
				max: sdata[4],
				min: sdata[5],
				type: 'numeric',
				title: {
				text: ylabel,
				style: {
                fontSize: '16px',
				
				}
				}
                
            },
			
        };

        var chart = new ApexCharts(
            document.querySelector("#chart1"),
            options
        );
        
        chart.render();
}

// Bar Graph
function bar(bdata){
	var options = {
            chart: {
                height: 500,
                type: 'bar',
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: false
            },
            series: [{
            	name: $("#feature option:selected").html(),
                data: bdata[1]
            }],
            xaxis: {
                categories: bdata[0]
            }
        }

       var chart = new ApexCharts(
            document.querySelector("#chart2"),
            options
        );

        chart.render();


}

//Load Difficulty
function showDifficulty() {
    var showDiff = setInterval(function () {
        if ($('.Pitch__PitchContainer-sc-1e0jf8e-0').length) {
            clearDifficulty();
            clearInterval(showDiff);
            $('.PitchElement__ElementImage-sc-1e0jf8e-0').each(function (index) {
                var name = $(this).closest('.PitchElement__ElementContainer-sc-1e0jf8e-1').find('.PitchElementData__ElementName-sc-1u4y6pr-0').text();
                var shirt_team = $(this).attr("alt");
                var result_team = teams.find(obj => {
                    return obj.name === shirt_team
                });

                var team_id = result_team.id;

                var result = players.find(obj => {
                    return (obj.web_name === name && obj.team === team_id)
                });

                var player_id = result.id.toString();
                var area = $(this).closest('.PitchElement__ElementContainer-sc-1e0jf8e-1').next();
                $(this).closest('.PitchElement__ElementContainer-sc-1e0jf8e-1').parent().parent().parent().css("margin-bottom", "-22px");
                $.get("/api/element-summary/"+player_id+"/", area, function(data, status){
                    var i;
                    area.remove(".gameD");
                    for (i = 0; i < 5; i++) {
                        var diff = data.fixtures[i].difficulty;
                        area.append("<div class='gameD difficulty"+diff+"'>"+diff+"</div>");
                    }
                });
            });
        }
    }, 10);
}

// Clear Difficulty
function clearDifficulty(){
	$('.gameD').remove();
}

//Initialise variables
console.log('FPL Insights: Starting initialization');
$.get("/api/bootstrap-static/", function(data, status){
    console.log('FPL Insights: Bootstrap data loaded');
    players = data.elements;
    teams = data.teams;
    $.get("/api/me/", function(data, status) {
        console.log('FPL Insights: User data loaded');
        var id = data["player"]["entry"].toString();
        $.get("/api/my-team/"+id+"/", function(data, status) {
            console.log('FPL Insights: Team data loaded');
            team = data.picks;
            if (window.location.href === "https://fantasy.premierleague.com/transfers"){
                console.log('FPL Insights: On transfers page, calling setup');
                setup();
            }
        }).fail(function(error) {
            console.error('FPL Insights: Failed to load team data:', error);
        });
    }).fail(function(error) {
        console.error('FPL Insights: Failed to load user data:', error);
    });
}).fail(function(error) {
    console.error('FPL Insights: Failed to load bootstrap data:', error);
});

// show players when trying to switch
$('body').on( "click", ".clRECT:contains('Restore Player'), .clRECT:contains('Add Player')", function() {
	if($('#showPlayers').is(':checked')){
		showPlayers();
    }
    if($('#showDifficulty').is(':checked')){
		clearDifficulty();
		showDifficulty();
    }
});

function initialsetup() {
    console.log('FPL Insights: Initial setup started');
    // Check if we're on a valid FPL page
    if (!window.location.href.includes('fantasy.premierleague.com')) {
        console.log('FPL Insights: Not on FPL website');
        return;
    }

    // Wait for jQuery to be available
    if (typeof $ === 'undefined') {
        console.log('FPL Insights: jQuery not loaded, retrying in 1s');
        setTimeout(initialsetup, 1000);
        return;
    }

    // Wait for the page to be fully loaded
    if (document.readyState !== 'complete') {
        console.log('FPL Insights: Page not fully loaded, retrying in 1s');
        setTimeout(initialsetup, 1000);
        return;
    }

    console.log('FPL Insights: Loading charts.html');
    $.get(chrome.runtime.getURL('/charts.html'), function(data) {
        console.log('FPL Insights: Charts.html loaded');
        // Remove existing graph area if it exists
        $("#graph-area").remove();
        
        // Find the gameweek heading element
        let gameweekHeading = $('.TabHeading__TabHeadingOuter-sc-1wos76v-0');
        if (gameweekHeading.length === 0) {
            console.log('FPL Insights: Could not find gameweek heading');
            return;
        }
        console.log('FPL Insights: Found gameweek heading');

        // Create the graph area
        let graphArea = $($.parseHTML(data));
        
        // Style the graph title
        graphArea.find('#graph-title').css({
            'background-color': '#37003c',
            'padding': '10px 20px',
            'margin': '0',
            'border-radius': '6px 6px 0 0',
            'position': 'relative',
            'display': 'flex',
            'align-items': 'center'
        });

        // Create a left section for title and toggle
        let leftSection = $('<div class="left-section" style="display: flex; align-items: center; gap: 8px;"></div>');
        graphArea.find('.bar-title').appendTo(leftSection);
        graphArea.find('.toggle').appendTo(leftSection);
        leftSection.prependTo(graphArea.find('#graph-title'));

        // Create a right section for controls
        let rightSection = $('<div class="right-section" style="display: flex; align-items: center; margin-left: auto; gap: 20px;"></div>');
        graphArea.find('#prev').appendTo(rightSection);
        graphArea.find('#next').appendTo(rightSection);
        graphArea.find('.donate').appendTo(rightSection);
        rightSection.appendTo(graphArea.find('#graph-title'));
        
        // Style the title text
        graphArea.find('.bar-title').css({
            'color': 'white',
            'margin': '0',
            'font-size': '16px',
            'font-weight': 'bold'
        });

        // Style the toggle button
        graphArea.find('.toggle').css({
            'margin': '0',
            'padding': '0',
            'display': 'flex',
            'align-items': 'center'
        });

        // Style the navigation arrows
        graphArea.find('#prev, #next').css({
            'margin': '0',
            'padding': '0 5px',
            'display': 'flex',
            'align-items': 'center'
        });

        // Style the donate button
        graphArea.find('.donate').css({
            'margin': '0',
            'padding': '0',
            'display': 'flex',
            'align-items': 'center'
        });

        // Remove the settings container
        graphArea.find('.settings-container').remove();
        
        // Make sure the outer div is visible but collapsed
        graphArea.find('.outer').css({
            'display': 'none',
            'width': '100%',
            'position': 'relative',
            'margin': '0'
        });
        
        // Style the inner divs
        graphArea.find('.inner').css({
            'width': '100%',
            'padding': '10px',
            'background': 'transparent',
            'margin': '0'
        });
        
        // Make sure charts are visible but smaller
        graphArea.find('.chart').css({
            'width': '100%',
            'height': '400px',
            'margin-top': '10px'
        });
        
        // Style the select elements
        graphArea.find('.select-adjust, .bar-adjust').css({
            'width': '100%',
            'padding': '6px',
            'margin-bottom': '8px',
            'border': '1px solid #ddd',
            'border-radius': '4px',
            'font-size': '14px'
        });
        
        // Insert the graph area before the gameweek heading
        gameweekHeading.before(graphArea);
        console.log('FPL Insights: Charts appended before gameweek heading');
        
        try {
            initiateSettings();
            var featureb = $("#feature").val();
            var positionb = parseInt($("#positionb").val());

            var sdata = getsdata("now_cost", "total_points", 1);
            var bdata = getbdata(featureb, positionb);

            scatter(sdata);
            bar(bdata);
            
            // Initialize slick slider
            $('.outer').slick({
                prevArrow: '#prev',
                nextArrow: '#next',
                autoplay: false,
                arrows: true,
                draggable: true,
                dots: true,
                infinite: true,
                speed: 300,
                slidesToShow: 1,
                adaptiveHeight: true
            });

            $('#next').click(function(){
                $(".outer").slick('slickNext');
            });
            $('#prev').click(function(){
                $(".outer").slick('slickPrev');
            });
            console.log('FPL Insights: Setup completed successfully');
        } catch (error) {
            console.error('FPL Insights: Error during setup:', error);
        }
    }).fail(function(error) {
        console.error('FPL Insights: Failed to load charts.html:', error);
    });
}