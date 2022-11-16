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

    new WorldCup(lstUrl);
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
        $(`${$(this).find("a").attr("target-link")}`).show();
    });
});

class WorldCup {
    constructor(lstUrl) {
        this.lstUrl = lstUrl;
        this.GetGroup(this.lstUrl.group.url);
        this.GetStanding(this.lstUrl.standing.url);
        this.GetFixture(this.lstUrl.fixture.url);
    }
    GetFixture(url) {
        $.ajax({
            type: "get",
            url: url,
            async: false,
            dataType: "json",
            success: function (response) {
                $("#fixtures").empty();
                response.Results.forEach((element) => {
                    $("#fixtures").append(`
                        <li class="relative">
                            <button data-dropdown-toggle="${element.IdMatch}"
                                class="text-white w-full font-medium rounded-lg text-sm text-center inline-flex items-center text-gray-800 border-gray-200 rounded-t-xl dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                type="button">
                                <div
                                    class="block w-full p-6 pt-0 bg-white border border-gray-200 rounded-lg shadow-md relative hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                                    <div class="text-lg my-4 pb-2 border-b-2">${
                                        element.GroupName.length > 0
                                            ? element.GroupName[0].Description
                                            : element.StageName[0].Description
                                    }</div>
                                    <div class="flex">
                                        <div class="w-4/12 flex flex-col items-center">
                                            <img class="md:h-8 h-10 border border-yellow-500" src="${
                                                element.Home !== null
                                                    ? element.Home.PictureUrl.replace(
                                                          "{size}",
                                                          4
                                                      ).replace("{format}", "sq")
                                                    : "../assets/img/undefined-img.png"
                                            }"
                                                alt="">
                                            <span class="md:text-sm text-md p-2">${
                                                element.Home !== null
                                                    ? element.Home.ShortClubName
                                                    : ""
                                            }</span>
                                        </div>
                                        <div class="flex-grow flex items-center justify-center">
                                            <span class="md:text-lg lg:text-2xl text-3xl p-1">0</span>
                                            <span class="md:text-lg lg:text-2xl text-3xl p-1">-</span>
                                            <span class="md:text-lg lg:text-2xl text-3xl p-1">0</span>
                                        </div>
                                        <div class="flex-grow flex flex-col items-center justify-center hidden">
                                            <span class="text-lg p-1 pb-0">${moment(
                                                element.Date
                                            ).format("L")}</span>
                                            <span class="text-md p-1">${moment(element.Date).format(
                                                "LT"
                                            )}</span>
                                        </div>
                                        <div class="w-4/12 flex flex-col items-center">
                                            <img class="md:h-8 h-10 border border-yellow-500" src="${
                                                element.Away !== null
                                                    ? element.Away.PictureUrl.replace(
                                                          "{size}",
                                                          4
                                                      ).replace("{format}", "sq")
                                                    : "../assets/img/undefined-img.png"
                                            }"
                                                alt="">
                                            <span class="md:text-sm text-md p-2">${
                                                element.Away !== null
                                                    ? element.Away.ShortClubName
                                                    : ""
                                            }</span>
                                        </div>
                                    </div>
                                    <a href="../live" class="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 top-4 left-3 rounded dark:bg-red-200 dark:text-red-900 absolute">LIVE</a>
                                </div>
                            </button>
                            <div id="${element.IdMatch}"
                                class="hidden z-10 inset-x-0 w-auto bg-white rounded-lg w-full divide-y divide-gray-100 shadow dark:bg-gray-700">
                                <div class="p-5 text-gray-700 dark:text-gray-200">
                                    <div>
                                        <h1 class="uppercase text-center">Line up</h1>
                                        <div class="flex h-20">
                                            <div class="w-1/2"></div>
                                            <div class="w-1/2"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <h1 class="uppercase text-center">substitute</h1>
                                        <div class="flex h-20">
                                            <div class="w-1/2"></div>
                                            <div class="w-1/2"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    `);
                });
            },
        });
    }

    GetGroup(url) {
        $.ajax({
            type: "get",
            url: url,
            async: false,
            dataType: "json",
            success: function (response) {
                $("#list-group").empty();
                $("#list-stading").empty();
                response.groups.forEach((element, index) => {
                    if (index == 0) {
                        $("#list-group").append(`
                        <li class="mr-2 cursor-pointer">
                            <a target-link="#${element.groupTitle
                                .replace(" ", "-")
                                .toLowerCase()}" class="inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500"><span class="md:hidden">${element.groupTitle.replace(
                            "Group ",
                            ""
                        )}</span><span class="hidden md:block">${element.groupTitle}</span></a>
                        </li>
                        `);
                    } else {
                        $("#list-group").append(`
                        <li class="mr-2 cursor-pointer">
                            <a target-link="#${element.groupTitle
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
                                            <th scope="col" class="py-3 px-3 text-center"></th>
                                            <th scope="col" class="py-3 px-3 text-center"></th>
                                            <th scope="col" class="py-3 px-3 text-center">
                                                <span class="md:hidden">P</span>
                                                <span class="hidden md:block">Played</span>
                                            </th>
                                            <th scope="col" class="py-3 px-3 text-center">
                                                <span class="md:hidden">W</span>
                                                <span class="hidden md:block">Won</span>
                                            </th>
                                            <th scope="col" class="py-3 px-3 text-center">
                                                <span class="md:hidden">D</span>
                                                <span class="hidden md:block">Drawn</span>
                                            </th>
                                            </th>
                                            <th scope="col" class="py-3 px-3 text-center">
                                                <span class="md:hidden">L</span>
                                                <span class="hidden md:block">Lost</span>
                                            </th>
                                            <th scope="col" class="py-3 px-3 text-center">
                                                <span class="md:hidden">GD</span>
                                                <span class="hidden md:block">Goals Diference</span>
                                            </th>
                                            <th scope="col" class="py-3 px-3 text-center">
                                                <span class="md:hidden">Pst</span>
                                                <span class="hidden md:block">Points</span>
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
    GetStanding(url) {
        $.ajax({
            type: "get",
            url: url,
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
                                ${element.Played}
                            </td>
                            <td class="py-4 px-3 text-center">
                                ${element.Won}
                            </td>
                            <td class="py-4 px-3 text-center">
                                ${element.Drawn}
                            </td>
                            <td class="py-4 px-3 text-center">
                                ${element.Lost}
                            </td>
                            <td class="py-4 px-3 text-center">
                                ${element.GoalsDiference}
                            </td>
                            <td class="py-4 px-3 text-center">
                                ${element.Points}
                            </td>
                        </tr>
                    `);
                });
            },
        });
    }
}
