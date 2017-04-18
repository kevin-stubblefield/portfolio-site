var lengthOfPreview = 30;

$('.blog-preview').each(function () {
    var preview = $(this).text().trim();
    var words = preview.split(' ').slice(0, lengthOfPreview - 1);
    $(this).text(words.join(' '));
});

$('#blog-link').on('click', function (event) {
    if (event.ctrlKey) {
        $(this).attr('href', '/blog/createPost');
    }
});