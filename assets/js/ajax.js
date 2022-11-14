$(function () {
    $(document).ajaxStart(function () {
        $("#spin").show();
    });

    $(document).ajaxComplete(function () {
        $("#spin").hide();
    });
});
