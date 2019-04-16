$(document).ready(function () {
  $('.delete-book').on('click', function (e) {
    $target = $(e.target);
    const id = $target.attr('data-id');
    // console.log($target, id);
    $ajax({
      type: 'DELETE',
      url: '/book/' + id,
      success: function (response) {
        alert('Deleting book');
        window.location.href = '/';
      },
      error: function () {
        console.log(err);
      }
    });
  });
});
