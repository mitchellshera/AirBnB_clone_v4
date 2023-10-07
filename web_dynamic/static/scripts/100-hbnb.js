$(document).ready(function () {
    const amenities = {};
    const statesCities = {};

    // Function to check API status and fetch places
    function checkApiStatus() {
        $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
            if (data.status === 'OK') {
                $('#api_status').addClass('available');
            } else {
                $('#api_status').removeClass('available');
            }
        });
    }

    // Function to fetch places from the API
    function fetchPlaces() {
        const data = {
            amenities: Object.values(amenities),
            states: Object.values(statesCities)
        };

        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data), // Include checked amenities, states, and cities
            success: function (data) {
                displayPlaces(data);
            },
            error: function (error) {
                console.error('Error fetching places:', error);
            }
        });
    }

    // Function to display places
    function displayPlaces(places) {
        var placesSection = $('section.places');
        placesSection.empty(); // Clear the existing content

        places.forEach(function (place) {
            var article = $('<article>');
            article.html(
                '<div class="title_box">' +
                '<h2>' + place.name + '</h2>' +
                '<div class="price_by_night">$' + place.price_by_night + '</div>' +
                '</div>' +
                '<div class="information">' +
                '<div class="max_guest">' + place.max_guest + ' Guest' + (place.max_guest !== 1 ? 's' : '') + '</div>' +
                '<div class="number_rooms">' + place.number_rooms + ' Bedroom' + (place.number_rooms !== 1 ? 's' : '') + '</div>' +
                '<div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom' + (place.number_bathrooms !== 1 ? 's' : '') + '</div>' +
                '</div>' +
                '<div class="description">' + place.description + '</div>'
            );

            placesSection.append(article);
        });
    }

    // Event handler for changes in input checkboxes for amenities
    $("section.amenities input[type=checkbox]").change(function () {
        if (this.checked) {
            amenities[this.dataset.id] = this.dataset.name;
        } else {
            delete amenities[this.dataset.id];
        }
        $(".amenities h4").text(Object.values(amenities).join(', '));
    });

    // Event handler for changes in input checkboxes for states and cities
    $("div.popover input[type=checkbox]").change(function () {
        if (this.checked) {
            statesCities[this.dataset.id] = this.dataset.name;
        } else {
            delete statesCities[this.dataset.id];
        }
        $(".locations h4").text(Object.values(statesCities).join(', '));
    });

    // Event handler for the button click
    $('button').click(function () {
        // Fetch places with checked amenities, states, and cities
        fetchPlaces();
    });

    // Initial check and then check every 5 seconds
    checkApiStatus();
    setInterval(checkApiStatus, 5000);
});
