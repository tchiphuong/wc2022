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

    var wc = new WorldCup(lstUrl);
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
    $(".team-item").on("click", function () {
        wc.GetSquad(lstUrl.squad.url, lstUrl.squad.url1, $(this).attr("id"));
    });
});

class WorldCup {
    constructor(lstUrl) {
        this.lstUrl = lstUrl;
        this.GetGroup(this.lstUrl.group.url);
        this.GetStanding(this.lstUrl.standing.url);
        this.GetFixture(this.lstUrl.fixture.url);
        this.GetTeam(this.lstUrl.team.url);
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
                    const isStarted =
                        element.Home !== null &&
                        element.Home.Score !== null &&
                        element.Away !== null &&
                        element.Home.Score !== null;
                    $("#fixtures").append(`
                        <li class="relative">
                            <a href="/match/index.html?id=${element.IdMatch}"
                                class="text-white w-full h-full font-medium rounded-lg text-sm text-center inline-flex items-center text-gray-800 border-gray-200 rounded-t-xl dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                                <div
                                    class="block w-full h-full p-6 pt-0 bg-white border border-gray-200 rounded-lg shadow-md relative hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                                    <div class="text-lg my-4 pb-2 border-b-2 dark:border-gray-700 dark:text-gray-100">${
                                        element.GroupName.length > 0
                                            ? element.GroupName[0].Description
                                            : element.StageName[0].Description
                                    }</div>
                                    <div class="flex dark:text-gray-100">
                                        <div class="w-4/12 flex flex-col items-center">
                                            <img class="md:h-8 h-10 border border-yellow-500" src="${
                                                element.Home !== null
                                                    ? element.Home.PictureUrl.replace(
                                                          "{size}",
                                                          4
                                                      ).replace("{format}", "sq")
                                                    : "./assets/img/undefined-img.png"
                                            }"
                                                alt="">
                                            <span class="md:text-sm text-md p-2">${
                                                element.Home !== null
                                                    ? element.Home.ShortClubName
                                                    : ""
                                            }</span>
                                        </div>
                                        ${
                                            element.MatchStatus === 0 || element.MatchStatus === 3
                                                ? `<div class="flex-grow flex items-center justify-center">
                                                        <span class="md:text-lg lg:text-2xl text-3xl p-1">${element.Home.Score}</span>
                                                        <span class="md:text-lg lg:text-2xl text-3xl p-1">-</span>
                                                        <span class="md:text-lg lg:text-2xl text-3xl p-1">${element.Away.Score}</span>
                                                    </div>`
                                                : ""
                                        }
                                        ${
                                            element.MatchStatus === 1
                                                ? `<div class="flex-grow flex flex-col items-center justify-center">
                                                        <span class="text-lg p-1 pb-0">${moment(
                                                            element.Date
                                                        ).format("L")}</span>
                                                        <span class="text-md p-1">${moment(
                                                            element.Date
                                                        ).format("LT")}</span>
                                                    </div>`
                                                : ""
                                        }
                                        <div class="w-4/12 flex flex-col items-center">
                                            <img class="md:h-8 h-10 border border-yellow-500" src="${
                                                element.Away !== null
                                                    ? element.Away.PictureUrl.replace(
                                                          "{size}",
                                                          4
                                                      ).replace("{format}", "sq")
                                                    : "./assets/img/undefined-img.png"
                                            }"
                                                alt="">
                                            <span class="md:text-sm text-md p-2">${
                                                element.Away !== null
                                                    ? element.Away.ShortClubName
                                                    : ""
                                            }</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            ${
                                element.MatchStatus === 3
                                    ? '<a href="./live" class="text-xs text-red-600 flex items-center font-semibold mr-2 p-0.5 top-4 left-3 h-6 rounded dark:bg-red-200 dark:text-red-900 absolute"><img class="h-6 mr-1" src="./assets/img/live.gif" alt="">LIVE</a>'
                                    : ""
                            }
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
                                .toLowerCase()}" class="inline-block p-4 overflow-hidden h-full text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500"><span class="md:hidden">${element.groupTitle.replace(
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
                                .toLowerCase()}" class="inline-block p-4 overflow-hidden h-full rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"><span class="md:hidden">${element.groupTitle.replace(
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
                                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 dark:border-gray-700">
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
    GetTeam(url) {
        $.ajax({
            type: "get",
            url: url,
            async: false,
            dataType: "json",
            success: function (response) {
                response.Results.forEach((element) => {
                    $("#list-team").append(`
                        <li id="${element.IdTeam}"
                            class="flex flex-col items-center block px-5 py-4 text-sm font-medium text-center rounded-lg shadow-md border cursor-pointer team-item md:py-7 hover:bg-gray-100 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                            type=" button" data-modal-toggle="model-squad">
                            <img class="h-16 border border-yellow-500 md:h-20"
                                src="${element.PictureUrl.replace("{size}", 4).replace(
                                    "{format}",
                                    "sq"
                                )}" alt="${element.ShortClubName}">
                            <span class="pt-2.5">${element.ShortClubName}</span>
                        </li>
                    `);
                });
            },
        });
    }
    GetSquad(url, url1, test) {
        const url2 = `${url}${test}${url1}`;
        const listColor = {
            Goalkeeper: "yellow",
            Defender: "blue",
            Midfielder: "green",
            Forward: "red",
        };
        $.ajax({
            type: "get",
            url: url2,
            async: false,
            dataType: "json",
            success: function (response) {
                $("#team-info").html(`
                    <img class="h-10 border border-yellow-500"
                    src="${response.PictureUrl.replace("{size}", 4).replace("{format}", "sq")}"
                    alt="">
                    <span class="px-4 py-2">${response.TeamName[0].Description}</span>
                `);
                $("#list-squad").empty();
                response.Players.forEach((element) => {
                    const color = listColor[element.PositionLocalized[0].Description];
                    const imgPlayer =
                        element.PlayerPicture.PictureUrl != null
                            ? `${element.PlayerPicture.PictureUrl}?io=transform:fill,width:256,height:128`
                            : "./assets/img/player.png";
                    if (element.PositionLocalized[0].Description === "Goalkeeper") {
                        $("#list-squad").append(`
                        <li class="flex flex-col border-2 border-${color}-500 rounded-lg shadow hover:bg-gray-100 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <div class="relative flex justify-center">
                                <span class="absolute md:text-2xl top-1 left-1 md:top-2 md:left-2">${
                                    element.JerseyNum
                                }</span>
                                <img class="right-0 object-cover h-20"
                                    src="${imgPlayer}"
                                    alt="${element.ShortName[0].Description.toLowerCase()}" style="aspect-ratio: 1/1;">
                            </div>
                            <div class="flex items-center justify-center h-full text-xs text-center capitalize">${element.ShortName[0].Description.toLowerCase()}</div>
                        </li>
                    `);
                    }
                });
                response.Players.forEach((element) => {
                    const color = listColor[element.PositionLocalized[0].Description];
                    const imgPlayer =
                        element.PlayerPicture.PictureUrl != null
                            ? `${element.PlayerPicture.PictureUrl}?io=transform:fill,width:256,height:128`
                            : "./assets/img/player.png";
                    if (element.PositionLocalized[0].Description === "Defender") {
                        $("#list-squad").append(`
                        <li class="flex flex-col border-2 border-${color}-500 rounded-lg shadow hover:bg-gray-100 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <div class="relative flex justify-center">
                                <span class="absolute md:text-2xl top-1 left-1 md:top-2 md:left-2">${
                                    element.JerseyNum
                                }</span>
                                <img class="right-0 object-cover h-20"
                                    src="${imgPlayer}"
                                    alt="${element.ShortName[0].Description.toLowerCase()}" style="aspect-ratio: 1/1;">
                            </div>
                            <div class="flex items-center justify-center h-full text-xs text-center capitalize">${element.ShortName[0].Description.toLowerCase()}</div>
                        </li>
                    `);
                    }
                });
                response.Players.forEach((element) => {
                    const color = listColor[element.PositionLocalized[0].Description];
                    const imgPlayer =
                        element.PlayerPicture.PictureUrl != null
                            ? `${element.PlayerPicture.PictureUrl}?io=transform:fill,width:256,height:128`
                            : "./assets/img/player.png";
                    if (element.PositionLocalized[0].Description === "Midfielder") {
                        $("#list-squad").append(`
                        <li class="flex flex-col border-2 border-${color}-500 rounded-lg shadow hover:bg-gray-100 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <div class="relative flex justify-center">
                                <span class="absolute md:text-2xl top-1 left-1 md:top-2 md:left-2">${
                                    element.JerseyNum
                                }</span>
                                <img class="right-0 object-cover h-20"
                                    src="${imgPlayer}"
                                    alt="${element.ShortName[0].Description.toLowerCase()}" style="aspect-ratio: 1/1;">
                            </div>
                            <div class="flex items-center justify-center h-full text-xs text-center capitalize">${element.ShortName[0].Description.toLowerCase()}</div>
                        </li>
                    `);
                    }
                });
                response.Players.forEach((element) => {
                    const color = listColor[element.PositionLocalized[0].Description];
                    const imgPlayer =
                        element.PlayerPicture.PictureUrl != null
                            ? `${element.PlayerPicture.PictureUrl}?io=transform:fill,width:256,height:128`
                            : "./assets/img/player.png";
                    if (element.PositionLocalized[0].Description === "Forward") {
                        $("#list-squad").append(`
                        <li class="flex flex-col border-2 border-${color}-500 rounded-lg shadow hover:bg-gray-100 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <div class="relative flex justify-center">
                                <span class="absolute md:text-2xl top-1 left-1 md:top-2 md:left-2">${
                                    element.JerseyNum
                                }</span>
                                <img class="right-0 object-cover h-20"
                                    src="${imgPlayer}"
                                    alt="${element.ShortName[0].Description.toLowerCase()}" style="aspect-ratio: 1/1;">
                            </div>
                            <div class="flex items-center justify-center h-full text-xs text-center capitalize">${element.ShortName[0].Description.toLowerCase()}</div>
                        </li>
                    `);
                    }
                });
            },
        });
    }
}
