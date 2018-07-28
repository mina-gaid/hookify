const base = window.location.href.indexOf("0.0.0.0") > -1 ? "http://0.0.0.0:33507/" : "https://hookify.herokuapp.com/";

function moreLike(artistName){
	$("#resultsArea").html("");
    $.ajax({
        type: "POST",
        url: base + "recommendations?artist=" + artistName.replace(/\s+/g, " ").trim(),
        success: function(data) {
            show_recommendations(data)
        },
        dataType: 'json'
    });
}

function findRecommendations(e) {
	e.preventDefault();
    $('.error').hide();
    $('#errorMsg').html("");
    $('#findRecommendations').attr("disabled", "disabled");
    query = $('#query').val();
    if (!(query.replace(/\s/g, "").length > 0)) {
        $('.error').show();
        $('#errorMsg').html("Search query can't be empty!");
        $('#findRecommendations').removeAttr("disabled");
        return false;
    }
    $.ajax({
        type: "POST",
        url: base + "recommendations?artist=" + query,
        success: function(data) {
            if (!(data.length > 0) || 'error' in data) {
                $('.error').show();
                $('#errorMsg').html("No results found!");
                $('#findRecommendations').removeAttr("disabled");
                return false;
            }
            playlist_data = data;
            show_recommendations(playlist_data)
        },
        dataType: 'json'
    });
    $('#findRecommendations').removeAttr("disabled");
}

$("#query").on("keydown", function(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        findRecommendations(e);
    }
});

$("#findRecommendations").click(function(e) {
    findRecommendations(e);
});


function play_recommendation(recommendation) {
    $.ajax({
        type: "POST",
        url: base + "video?recommendation=" + recommendation,
        success: function(data) {
            playlist_data = data;
            $("#player").html("<iframe style=\"width:100%; height:400px;margin:0px;border:0px\" src='https://www.youtube.com/embed/" + data.id + "?rel=0&amp; allow="autoplay'></iframe>");
            $('.notification').show();
            $('#title').html(recommendation);
            if ($('#showYouTubeVideo').is(':checked')) {
                $('#songTitle').html(recommendation);
                $('.modal').modal('show');
            }
        },
        dataType: 'json'
    });

}

$("#title").click(function() {
    $('#songTitle').html($(this).html());
    $('.modal').modal('show');
});

$("#playList").click(function(e) {
    e.preventDefault();
});


function show_recommendations(playlist_data) {
    $("#resultsArea").html("");
    var rec_data = "<table class='table table-light'><tbody>";
	if (!(playlist_data.length)){
        $('.error').show();
        $('#errorMsg').html("No results found!");
        $('#findRecommendations').removeAttr("disabled");
        return false;
	}
    $.each(playlist_data, function(index, item) {
		var s = item.split('-');
		var artist = s[s.length - 1];
        rec_data += "<tr><td onclick='play_recommendation(\"" + item + "\")'><i class='fas fa-play-circle'></i> " + item + "</td><td><button onclick='moreLike(\""+ artist+"\")' class = 'btn btn-outline'>More like this</button></td></tr>"

    });
    rec_data += "</tbody></table>"
    $("#resultsArea").append(rec_data);
    $('#playList').fadeIn();
}
