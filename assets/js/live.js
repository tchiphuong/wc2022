var jsonUrl = "../assets/lib/api.json";
$(function () {
    var callAPI = function (json) {
        lstChannel = json.channel;
    };
    $.ajax({
        url: jsonUrl,
        dataType: "json",
        async: false,
        success: callAPI,
    });

    $("#list-channels").empty();
    lstChannel.forEach((element, index) => {
        if (index === 0) {
            $("#list-channels").append(`
                <li class="flex flex-col">
                    <button id="${element.name}" type="button"
                        class="channel-item text-white bg-blue-600 h-16 flex flex-col items-center justify-center hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-700">
                        <img class="max-w-full max-h-full" src="../assets/img/channel/${element.name}.png" alt="">
                    </button>
                    <div class="text-center">${element.title}</div>
                </li>
            `);
        } else {
            $("#list-channels").append(`
                <li>
                    <button id="${element.name}" type="button"
                        class="channel-item text-gray-900 w-full bg-white h-16 flex items-center justify-center border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                        <img class="max-w-full max-h-full" src="../assets/img/channel/${element.name}.png" alt="">
                    </button>
                    <div class="text-center">${element.title}</div>
                </li>
            `);
        }
    });
    $(".channel-item").on("click", function () {
        const id = $(this).attr("id");
        $("#list-quality").empty();
        var video = videojs("stream");
        let streamUrl = lstChannel[0].link[0].url;

        $(this)
            .parents("ul")
            .find("button")
            .each(function () {
                $(this)
                    .removeClass(
                        "bg-blue-600 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-700"
                    )
                    .addClass(
                        "border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    );
            });
        $(this)
            .addClass(
                "bg-blue-600 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-700"
            )
            .removeClass(
                "border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            );

        lstChannel.forEach((element, index) => {
            if (element.name === id) {
                streamUrl = element.link[0].url;
                $("#channel-title").text(`LIVE | ${element.title}`);
                element.link.forEach((sub_element) => {
                    $("#list-quality").append(`
                    <li>
                        <button type="button" stream-url="${sub_element.url}" class="quality-item text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        ${sub_element.title}
                        </button>
                    </li>
                    `);
                });
            }
        });

        video.src(streamUrl);
        video.play();

        $(".quality-item").click(function () {
            streamUrl = $(this).attr("stream-url");
            video.src(streamUrl);
            video.play();
        });
    });
    $($("#list-channels").find("button")[0]).trigger("click");
});
