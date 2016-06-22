$(document).ready(function() {
    $('.unanswered-getter').submit(function(e) {
        e.preventDefault();
        // zero out results if previous search has run
        $('.results').html('');
        // get the value of the tags the user submitted
        var tags = $(this).find("input[name='tags']").val();
        getUnanswered(tags);
    });
    $('.inspiration-getter').submit(function(event) {
    	event.preventDefault();
    	$('.results').html('');
    	var tags = $(this).find("input[name='answers']").val();
        getAnswers(tags);
        console.log(query);
    });

    // Users can submit a topic they want to find top answerers for on Stack Overflow.
    // The app makes an AJAX call to the appropriate endpoint on the StackExchange API (there are a few hints below)
    // The DOM is updated with information about top answerers (if any) after the response is returned.



    // this function takes the question object returned by the StackOverflow request
    // and returns new result to be appended to DOM
    var showQuestion = function(question) {

        // clone our result template code
        var result = $('.templates .question').clone();

        // Set the question properties in result
        var questionElem = result.find('.question-text a');
        questionElem.attr('href', question.link);
        questionElem.text(question.title);

        // set the date asked property in result
        var asked = result.find('.asked-date');
        var date = new Date(1000 * question.creation_date);
        asked.text(date.toString());

        // set the .viewed for question property in result
        var viewed = result.find('.viewed');
        viewed.text(question.view_count);

        // set some properties related to asker
        var asker = result.find('.asker');
        asker.html('<p>Name: <a target="_blank" ' +
            'href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
            question.owner.display_name +
            '</a></p>' +
            '<p>Reputation: ' + question.owner.reputation + '</p>'
        );

        return result;
    };

    var showAnswer = function(answer) {
        // clones result answer code
        var answerResult = $('.templates .answer').clone();


    }


    // this function takes the results object from StackOverflow
    // and returns the number of results and tags to be appended to DOM
    var showSearchResults = function(query, resultNum) {
        var results = resultNum + ' results for <strong>' + query + '</strong>';
        return results;
    };

    // takes error string and turns it into displayable DOM element
    var showError = function(error) {
        var errorElem = $('.templates .error').clone();
        var errorText = '<p>' + error + '</p>';
        errorElem.append(errorText);
    };

    // takes a string of semi-colon separated tags to be searched
    // for on StackOverflow
    var getUnanswered = function(tags) {

        // the parameters we need to pass in our request to StackOverflow's API
        var request = {
            tagged: tags,
            site: 'stackoverflow',
            order: 'desc',
            sort: 'creation'
        };

        $.ajax({
            url: "http://api.stackexchange.com/2.2/questions/unanswered",
            data: request,
            dataType: "jsonp", //use jsonp to avoid cross origin issues
            type: "GET",
        })
            .done(function(result) { //this waits for the ajax to return with a succesful promise object
                var searchResults = showSearchResults(request.tagged, result.items.length);

                $('.search-results').html(searchResults);
                //$.each is a higher order function. It takes an array and a function as an argument.
                //The function is executed once for each item in the array.
                $.each(result.items, function(i, item) {
                    var question = showQuestion(item);
                    $('.results').append(question);
                });
            })
            .fail(function(jqXHR, error) { //this waits for the ajax to return with an error promise object
                var errorElem = showError(error);
                $('.search-results').append(errorElem);
            });
    };

    var getAnswers = function(tags) {
    		var query = $('#search').val();
    		console.log(query);
    		var url = "http://api.stackexchange./2.2/tags/" + query + "/top-answerers/all_time";
        var request = {
            tagged: tags,
            site: 'stackoverflow',
            order: 'desc',
            sort: 'creation'
        };

        $.ajax({
            url: url,
            data: request,
            dataType: "jsonp", //use jsonp to avoid cross origin issues
            type: "GET",
        })

        .done(function(result) {
            var answerResults = showSearchResults(request.tagged, result.items.length);
            $('.search-results').html(answerResults);
            $.each(result.items, function(i, item) {
                var answer = showAnswer(item);
                $('.results').append(answer);
                console.log(query);
            });
        })
    }

    // {
    //     "user": {
    //         "reputation": 415327,
    //         "user_id": 13249,
    //         "user_type": "moderator",
    //         "accept_rate": 100,
    //         "profile_image": "https://i.stack.imgur.com/nGCYr.jpg?s=128&g=1",
    //         "display_name": "Nick Craver",
    //         "link": "http://stackoverflow.com/users/13249/nick-craver"
    //     },
    //     "post_count": 4655,
    //     "score": 32989





});