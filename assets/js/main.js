var lstUrl = "";
var jsonUrl = "./assets/lib/api.json";
$(function () {
    var callAPI = function (json) {
        lstUrl = json;
    };
    $.ajax({
        url: jsonUrl,
        dataType: "json",
        async: false,
        success: callAPI,
    });

    let worldcup = new WorldCup(lstUrl);
    $("#list-group li").on("click", function () {
        $(this)
            .parents("ul")
            .find("a")
            .removeClass("text-blue-600 bg-gray-100 active dark:bg-gray-800 dark:text-blue-500")
            .addClass(
                "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            );
        $(this)
            .find("a")
            .addClass("text-blue-600 bg-gray-100 active dark:bg-gray-800 dark:text-blue-500")
            .removeClass(
                "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            );
        $("#list-stading li").hide();
        $(`${$(this).find("a").attr("href")}`).show();
    });
});

class WorldCup {
    constructor(lstUrl) {
        this.lstUrl = lstUrl;
        this.GetGroup(this.lstUrl.group);
        this.GetStanding(this.lstUrl.standing);
    }
    GetGroup(lstUrl) {
        $.ajax({
            type: "get",
            url: lstUrl,
            async: false,
            dataType: "json",
            success: function (response) {
                $("#list-group").empty();
                $("#list-stading").empty();
                response.groups.forEach((element, index) => {
                    if (index == 0) {
                        $("#list-group").append(`
                        <li class="mr-2">
                            <a href="#${element.groupTitle
                                .replace(" ", "-")
                                .toLowerCase()}" class="inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500"><span class="md:hidden">${element.groupTitle.replace(
                            "Group ",
                            ""
                        )}</span><span class="hidden md:block">${element.groupTitle}</span></a>
                        </li>
                        `);
                    } else {
                        $("#list-group").append(`
                        <li class="mr-2">
                            <a href="#${element.groupTitle
                                .replace(" ", "-")
                                .toLowerCase()}" class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"><span class="md:hidden">${element.groupTitle.replace(
                            "Group ",
                            ""
                        )}</span><span class="hidden md:block">${element.groupTitle}</span></a>
                        </li>`);
                    }
                    $("#list-stading").append(`
                        <li id="${element.groupTitle.replace(" ", "-").toLowerCase()}" ${
                        index > 0 ? "class='hidden'" : ""
                    }>
                            <div class="overflow-x-auto relative">
                                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 border">
                                    <thead
                                        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" class="py-3 px-3 text-center">

                                            </th>
                                            <th scope="col" class="py-3 px-3 text-center">

                                            </th>
                                            <th scope="col" class="py-3 px-3 text-center">
                                                P
                                            </th>
                                            <th scope="col" class="py-3 px-3 text-center">
                                                W
                                            </th>
                                            <th scope="col" class="py-3 px-3 text-center">
                                                D
                                            </th>
                                            </th>
                                            <th scope="col" class="py-3 px-3 text-center">
                                                L
                                            </th>
                                            <th scope="col" class="py-3 px-3 text-center">
                                                GD
                                            </th>
                                            <th scope="col" class="py-3 px-3 text-center">
                                                Pst
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </li>
                    `);
                });
            },
        });
    }
    GetStanding(lstUrl) {
        $.ajax({
            type: "get",
            url: lstUrl,
            async: false,
            dataType: "json",
            success: function (response) {
                response.Results.forEach((element) => {
                    const tbody = $(
                        `#${element.Group[0].Description.replace(" ", "-").toLowerCase()}`
                    ).find("tbody");
                    tbody.append(`
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300">
                            <td scope="row" class="px-2 text-center">${element.Position}</td>
                            <th scope="row"
                                class="py-4 px-3 flex items-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <img class="border h-5" src="${element.Team.PictureUrl.replace(
                                    "{size}",
                                    2
                                ).replace("{format}", "sq")}"
                                    alt="">
                                <span class="px-2">${element.Team.Name[0].Description}</span>
                            </th>
                            <td class="py-4 px-3 text-center">
                                0
                            </td>
                            <td class="py-4 px-3 text-center">
                                0
                            </td>
                            <td class="py-4 px-3 text-center">
                                0
                            </td>
                            <td class="py-4 px-3 text-center">
                                0
                            </td>
                            <td class="py-4 px-3 text-center">
                                0
                            </td>
                            <td class="py-4 px-3 text-center">
                                0
                            </td>
                        </tr>
                    `);
                });
            },
        });
    }
}
