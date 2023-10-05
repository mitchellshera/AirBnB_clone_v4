$(document).ready(function () {
    const amenities = {};
  
    $('input[type="checkbox"]').change(function () {
      const id = $(this).data('id');
      const name = $(this).data('name');
  
      if ($(this).is(':checked')) {
        amenities[id] = name;
      } else {
        delete amenities[id];
      }
  
      $('.amenities h4').text(Object.values(amenities).join(', '));
    });
  });
  