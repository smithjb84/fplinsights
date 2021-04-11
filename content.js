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
function initialsetup() {

	$.get(chrome.extension.getURL('/charts.html'), function(data) {
		$( "#graph-area" ).remove();
		$($.parseHTML(data)).appendTo('.eSoeNt');
		initiateSettings();
		var featureb = $( "#feature" ).val();
		var positionb = parseInt($( "#positionb" ).val());

		var sdata = getsdata("now_cost", "total_points", 1);
		var bdata = getbdata(featureb, positionb);

		scatter(sdata);
		bar(bdata);
		$(".outer").css('display', 'none');
		$('.outer').slick({
			prevArrow: '#prev',
   			nextArrow: '#next',
		 	autoplay: false,
		 	arrows: false,
			draggable: false,
		  });

		$('#next').click(function(){
			$(".outer").slick('slickNext');
		});
		$('#prev').click(function(){
			$(".outer").slick('slickPrev');
		});
	});
}

//Initialise variables
$.get("/api/bootstrap-static/", function(data, status){
		players = data.elements;
		teams = data.teams;
		$.get("/api/me/", function(data, status) {
			var id = data["player"]["entry"].toString();
			$.get("/api/my-team/"+id+"/", function(data, status) {
				team = data.picks;
				if (window.location.href === "https://fantasy.premierleague.com/transfers"){
					setup();
				}
            });
			});
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

// Set up fpl insights section on page load
function setup() {
    var checkExist = setInterval(function () {
        if ($('.eSoeNt').length) {
        	clearInterval(checkExist);
			initialsetup();
        }
    }, 10);
}

// Set up fpl insights section on tab click
$( "ul" ).on( "mouseup", "a:contains('Transfers')", function() {
	var checkExists = setInterval(function() {
	   if ($('.eSoeNt').length) {
	   		clearInterval(checkExists);
		   initialsetup();
	   }
	}, 10);
});

//Player Pics
function showPlayers() {
    var playerPics = setInterval(function () {
        if ($('.bcESdd').length) {
        	clearInterval(playerPics);
            $('.hoGPkp').each(function (index) {
                var name = $(this).parent().parent().find('.PitchElementData__ElementName-sc-1u4y6pr-0').text();
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
        if ($('.bcESdd').length) {
            $('.hoGPkp').each(function (index) {
                var name = $(this).parent().parent().find('.PitchElementData__ElementName-sc-1u4y6pr-0').text();
                var shirt_team = $(this).attr("alt");
                var result_team = teams.find(obj => {
                    return obj.name === shirt_team
                });
                var code = result_team.code;
                if (index <=1){
                	var shirtpic = "/dist/img/shirts/shirt_"+code+"_1-66.png";
					console.log(shirtpic);
				}
				else{
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
function showDifficulty(){
	var showDiff = setInterval(function () {
        if ($('.bcESdd').length) {
        	clearDifficulty();
        	clearInterval(showDiff);
            $('.hoGPkp').each(function (index) {
            	var name = $(this).parent().parent().find('.PitchElementData__ElementName-sc-1u4y6pr-0').text();
            	var shirt_team = $(this).attr("alt");
                var result_team = teams.find(obj => {
                    return obj.name === shirt_team
                });

                var team_id = result_team.id;

                var result = players.find(obj => {
                    return (obj.web_name === name && obj.team === team_id)
                });

                var player_id = result.id.toString();
                var area = $(this).parent().next();
				$(this).parent().parent().parent().parent().parent().css("margin-bottom", "-22px");
                $.get("/api/element-summary/"+player_id+"/", area, function(data, status){
					var i;
					area.remove( ".gameD" );
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