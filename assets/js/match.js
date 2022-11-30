var jsonUrl = "../assets/lib/api.json";
var matchId = new URLSearchParams(window.location.search).get("id") || "";
var isLive = false;
var hasNewGoal = false;
var goalLength = 0;
var first = true;
$(function () {
    var callAPI = function (json) {
        url = json.match.url.concat("/", matchId);
    };
    $.ajax({
        url: jsonUrl,
        dataType: "json",
        async: false,
        success: callAPI,
    });
    GetData();
});
function GetData() {
    $.ajax({
        type: "get",
        url: url,
        async: false,
        dataType: "json",
        success: function (response) {
            isLive = response.MatchStatus == 3;
            $("#current-match").text(
                response.HomeTeam.ShortClubName + " - " + response.AwayTeam.ShortClubName
            );
            $("#match").empty();
            $("#match").append(`
            <div class="p-3 my-2 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <div class="flex items-center justify-center pb-3">
                    <span>${
                        response.StageName[0].GroupName || response.StageName[0].Description
                    }</span>
                </div>
                <div class="flex py-2 border border-l-0 border-r-0">
                    <div class="flex flex-col justify-start w-5/12">
                        <div class="flex flex-col items-center px-6 md:flex-row-reverse">
                            <img class="h-16 mx-2 border border-yellow-500" src="${response.HomeTeam.PictureUrl.replace(
                                "{size}",
                                4
                            ).replace("{format}", "sq")}" alt="">
                            <div class="px-2 text-lg text-center md:text-right">${
                                response.HomeTeam.ShortClubName
                            }</div>
                        </div>
                    </div>
                    <div class="w-2/12 flex-col">
                    <div class="flex items-start justify-center py-6 text-2xl">
                        <span>${response.HomeTeam.Score}</span>
                        <span class="px-1">-</span>
                        <span>${response.AwayTeam.Score}</span>
                        </div>
                        <div class="text-center">${
                            response.MatchTime != "0'" ? response.MatchTime : ""
                        }</div>
                    </div>
                    <div class="flex flex-col justify-start w-5/12">
                        <div class="flex flex-col items-center px-6 md:flex-row">
                            <img class="h-16 mx-2 border border-yellow-500" src="${response.AwayTeam.PictureUrl.replace(
                                "{size}",
                                4
                            ).replace("{format}", "sq")}" alt="">
                            <div class="px-2 text-lg text-center md:text-left">${
                                response.AwayTeam.ShortClubName
                            }</div>
                        </div>
                    </div>
                </div>
                <ul id="goals">
                </ul>
                <div class="items-center justify-center pt-3 md:flex">
                    <div class="flex items-center justify-center px-4">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 20 20" 
                        xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clip-rule="evenodd"></path>
                        </svg>
                        <span class="px-2">${moment(response.LocalDate).format("L")}</span>
                    </div>
                    <div class="flex items-center justify-center px-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z">
                            </path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span class="px-2">${response.Stadium.Name[0].Description}</span>
                    </div>
                </div>
            </div>
            `);
            var goals = [];
            response.HomeTeam.Goals.forEach((element) => {
                goals.push({
                    Minute: element.Minute,
                    IdPlayer: element.IdPlayer,
                    IsHome: true,
                });
            });
            response.AwayTeam.Goals.forEach((element) => {
                goals.push({
                    Minute: element.Minute,
                    IdPlayer: element.IdPlayer,
                    IsHome: false,
                });
            });
            goals = goals.sort(function (a, b) {
                var keyA = parseInt(a.Minute),
                    keyB = parseInt(b.Minute);
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });
            hasNewGoal = goals.length > goalLength;
            goalLength = goals.length;
            goals.forEach((element) => {
                if (element.IsHome) {
                    $("#goals").append(`
                        <li class="w-full text-right capitalize">
                            <div class="w-5/12 pr-8">
                                <span class="px-1">
                                ${response.HomeTeam.Players.find(
                                    (x) => x.IdPlayer == element.IdPlayer
                                ).ShortName[0].Description.toLowerCase()}</span>
                                <span>${element.Minute}</span>
                            </div>
                        </li>
                    `);
                } else {
                    $("#goals").append(`
                        <li class="flex w-full capitalize">
                            <div class="w-5/12 pl-8 ml-7/12" style="margin-left: 58.333333%;">
                                <span>${element.Minute}</span>
                                <span class="px-1">
                                ${response.AwayTeam.Players.find(
                                    (x) => x.IdPlayer == element.IdPlayer
                                ).ShortName[0].Description.toLowerCase()}</span>
                            </div>
                        </li>
                    `);
                }
            });
            $("#lineup-home").empty();
            $("#sub-home").empty();
            response.HomeTeam.Players.forEach((element) => {
                if (element.Status == 1) {
                    $("#lineup-home").append(`
                        <li class="relative flex items-center justify-end w-full p-2 m-1 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 ${
                            element.Captain ? "border-2 border-yellow-500" : ""
                        }">
                            <span class="z-10 p-3 capitalize">${element.ShortName[0].Description.toLowerCase()}</span>
                            <img class="hidden object-cover w-16 h-16 border-2 rounded-full md:inline-block"
                                src="${
                                    element.PlayerPicture.PictureUrl
                                }?io=transform:fill,width:256,height:128"
                                alt="${element.ShortName[0].Description.toLowerCase()}">
                            <span
                                class="absolute top-0 flex items-center text-white capitalize left-2 text-8xl">${
                                    element.ShirtNumber
                                }</span>
                        </li>
                    `);
                } else {
                    $("#sub-home").append(`
                        <li class="relative flex items-center justify-end w-full p-2 m-1 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                            <span class="z-10 p-3 capitalize">${element.ShortName[0].Description.toLowerCase()}</span>
                            <img class="hidden object-cover w-16 h-16 border-2 rounded-full md:inline-block"
                                src="${
                                    element.PlayerPicture.PictureUrl
                                }?io=transform:fill,width:256,height:128"
                                alt="${element.ShortName[0].Description.toLowerCase()}">
                            <span
                                class="absolute top-0 flex items-center text-white capitalize left-2 text-8xl">${
                                    element.ShirtNumber
                                }</span>
                        </li>
                    `);
                }
            });
            $("#lineup-away").empty();
            $("#sub-away").empty();
            response.AwayTeam.Players.forEach((element) => {
                if (element.Status == 1) {
                    $("#lineup-away").append(`
                    <li class="relative flex items-center justify-start w-full p-2 m-1 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 ${
                        element.Captain ? "border-2 border-yellow-500" : ""
                    }">
                        <img class="hidden object-cover w-16 h-16 border-2 rounded-full md:inline-block"
                            src="${
                                element.PlayerPicture.PictureUrl
                            }?io=transform:fill,width:256,height:128"
                            alt="${element.ShortName[0].Description.toLowerCase()}">
                        <span class="z-10 p-3 capitalize">${element.ShortName[0].Description.toLowerCase()}</span>
                        <span
                            class="absolute top-0 flex items-center text-white capitalize right-2 text-8xl">${
                                element.ShirtNumber
                            }</span>
                    </li>
                `);
                } else {
                    $("#sub-away").append(`
                        <li class="relative flex items-center justify-start w-full p-2 m-1 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                            <img class="hidden object-cover w-16 h-16 border-2 rounded-full md:inline-block"
                                src="${
                                    element.PlayerPicture.PictureUrl
                                }?io=transform:fill,width:256,height:128"
                                alt="${element.ShortName[0].Description.toLowerCase()}">
                            <span class="z-10 p-3 capitalize">${element.ShortName[0].Description.toLowerCase()}</span>
                            <span
                                class="absolute top-0 flex items-center text-white capitalize right-2 text-8xl">${
                                    element.ShirtNumber
                                }</span>
                        </li>
                    `);
                }
            });
            if (isLive) {
                setTimeout(() => {
                    GetData();
                }, 1000);
            }
            if (hasNewGoal && !first) {
                SendNotification(response, goals);
            }
            first = false;
        },
    });
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function SendNotification(response, goals) {
    if (goals.length > 0) {
        const playerName = capitalizeFirstLetter(
            response.HomeTeam.Players.find(
                (x) => x.IdPlayer == goals[goals.length - 1].IdPlayer
            ).ShortName[0].Description.toLowerCase()
        );
        const title = goals[goals.length - 1].IsHome
            ? `${response.HomeTeam.ShortClubName} [${response.HomeTeam.Score}] - ${response.AwayTeam.Score} ${response.AwayTeam.ShortClubName}`
            : `${response.HomeTeam.ShortClubName} ${response.HomeTeam.Score} - [${response.AwayTeam.Score}] ${response.AwayTeam.ShortClubName}`;
        var notification = new Notification(title, {
            icon: "../assets/img/favicon.png",
            body: `[${playerName}] has just scored another goal!`,
        });
        notification.onclick = function () {
            return (location.href = `./index.html?id=${matchId}`);
        };
    }
}
