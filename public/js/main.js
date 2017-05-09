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

$('.dot').each(function (index, element) {
    $(this).on('click', function (event) {
        $('.dot').removeClass('active');
        $(this).addClass('active');
        $('.project.active').fadeOut(250, function () {
            $(this).removeClass('active');
            $('.project').eq(index).fadeIn(250).addClass('active');
        });
    });
});

var currentProject = 0;
var projects = $('.project');
var dots = $('.dot');

$('#left-arrow').on('click', function (event) {
    projects.eq(currentProject).fadeOut(250, function () {
        projects.eq(currentProject).removeClass('active');
        dots.eq(currentProject).removeClass('active');

        if (currentProject == 0) {
            currentProject = projects.length - 1;
        } else {
            currentProject--;
        }

        projects.eq(currentProject).fadeIn(250).addClass('active');
        dots.eq(currentProject).addClass('active');
    });
});

$('#right-arrow').on('click', function (event) {
    projects.eq(currentProject).fadeOut(250, function () {
        projects.eq(currentProject).removeClass('active');
        dots.eq(currentProject).removeClass('active');

        if (currentProject == projects.length -1) {
            currentProject = 0;
        } else {
            currentProject++;
        }

        projects.eq(currentProject).fadeIn(250).addClass('active');
        dots.eq(currentProject).addClass('active');
    });
});