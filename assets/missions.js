//get the missions from localStorage
let missions = JSON.parse(localStorage.getItem("missions"));
let agencies = [], years = [], filteredMissions = [];
let favoriteList = false;


if (missions) {
    putItems(missions.items);
} else {
    (async () => {
        const getMissions = await fetch("./assets/missions.json");
        const data = await getMissions.json();
        missions = data;
        putItems(data.items);
        //add the missions to the main storage
        localStorage.setItem("missions", JSON.stringify(data));
    })();
}

function putItems(items) {
    if (items.length != 0) {
        // remove no missions alert if its on
        document.getElementById("noMissionsAlert").style.display = "none";

        // remove all the items in the missions table to render the new item
        document.getElementById("missionsTable").innerHTML = '';
        document.getElementById("agency-filter").innerHTML = `<option value="" disabled selected>Agency</option> <option value="all">all</option>`;
        document.getElementById("year-filter").innerHTML = `<option value="" disabled selected>Year</option> <option value="all">all</option>`;

        // check if the agency in filters and add elements in the table list
        items.forEach(item => {

            // check if the agency exist in agencies array
            item.agency.split("/").forEach(agency => {
                if (!agencies.includes(agency)) agencies.push(agency);
            });
            // check if the year exist in years array
            let year = new Date(item.launchDate).getFullYear();
            if (!years.includes(year)) years.push(year);

            //render the items in the page
            document.getElementById("missionsTable").innerHTML += `<tr ${item.hide && 'style="display:none"'}>
                                <td class="cover">
                                    <img class="cover-thumb" src="${item.image}">
                                </td>
                                <td class="mission">
                                    <div class="missionInfo">
                                        <span class="mission-name">${item.name} </span>
                                        <div class="mission-agency">${item.agency}</div>
                                    </div>
                                    <div class="missionAction"><img src="${item.favorite ? "./assets/icons/star-full.png" : "./assets/icons/star.png"}" onclick="favorite(${item.id}, ${!item.favorite})"  class="favorite"><img src="./assets/icons/edit.png" onclick="edit(${item.id})" class="edit"><img src="./assets/icons/delete.png" onclick="deleteItem(${item.id}, '${item.name}')" class="delete"></div>
                                </td>
                                <td class="objective">
                                    ${item.objective}
                                </td>
                                <td class="launch">${item.launchDate}</td>
                            </tr>`;
        });

        //render the filters options
        agencies.sort().forEach(agency => document.getElementById("agency-filter").innerHTML += `<option value="${agency}">${agency}</option>`);
        years.sort((a, b) => a - b).forEach(year => document.getElementById("year-filter").innerHTML += `<option value="${year}">${year}</option>`);

    }
    else {
        // clean mission table list
        document.getElementById("missionsTable").innerHTML = '';
        // show there no missions alert
         document.getElementById("noMissionsAlert").style.display = "block";
    }
}

// check if new mission modal are non empty
var form = document.getElementById("missionForm");
var missionModalButton = document.getElementById("missionModalButton");
form.addEventListener("input", () => {
    // disable the button until the user fill the form
    missionModalButton.disabled = true;
    form.checkValidity() && (missionModalButton.disabled = false);

})

// add new mission when clicking add new mission button
function newMission() {
    // change the modal title to add new mission when click add new button and clear the form
    missionModalButton.disabled = true;
    document.getElementById('missionModalLabel').innerText = 'Add New Mission';
    document.getElementById("newMissionCoverLabel").innerText = "Mission cover:";
    document.getElementById('newMissionCover').required = true;
    document.getElementById("missionForm").reset();

    // set the button to add new mission function

    missionModalButton.addEventListener("click", () => {
        var inputs = form.querySelectorAll(".missionForm");

        // add the mission to the missions object
        missions.info.missionsCount++;
        missions.items.push({
            "id": missions.info.missionsCount,
            "name": inputs[0].value,
            "agency": inputs[1].value.toUpperCase().replace(/\s/g, ''),
            "objective": inputs[2].value,
            "launchDate": inputs[3].value,
            "image": URL.createObjectURL(inputs[4].files[0])
        });
        // render the new item in the table
        putItems(missions.items);

        //update the new mission object in localstorage
        localStorage.setItem("missions", JSON.stringify(missions));

        //clean the form and close the modale
        form.reset();
        $('#missionModal').modal('hide');
        missionModalButton.disabled = true;

    })

}


function deleteItem(id, missionName) {
    //showing the confirmation model
    $('#confirmationModel').modal('show');

    // change the title of the mission in the model
    document.getElementById("deleteMissionTitle").innerText = missionName;

    document.getElementById("deleteMissionButton").addEventListener("click", () => {

        // found element by its id, delete it and render the items again
        missions.items = missions.items.filter(item => item.id != id);
        putItems(missions.items)

        // update localStorage
        localStorage.setItem("missions", JSON.stringify(missions));
        $('#confirmationModel').modal('hide');
    });


}

function favorite(id, action) {
    // search an item by id then change or add favorite item as true of false
    var missionIndex = missions.items.findIndex(mission => mission.id == id);
    missions.items[missionIndex].favorite = action;
    putItems(missions.items)

    // update localStorage
    localStorage.setItem("missions", JSON.stringify(missions));
}

function edit(id) {

    // show the modal to edit
    $('#missionModal').modal('show');

    //fill the modal inputs with the mission value
    var missionIndex = missions.items.findIndex(mission => mission.id == id);
    var missionInfo = missions.items[missionIndex];
    var inputs = form.querySelectorAll(".missionForm");
    inputs[0].value = missionInfo.name;
    inputs[1].value = missionInfo.agency;
    inputs[2].value = missionInfo.objective;
    inputs[3].value = missionInfo.launchDate;

    // change the modal title and the cover input to not required
    missionModalButton.disabled = false;
    document.getElementById("missionModalLabel").innerText = "Edit: " + missionInfo.name;
    document.getElementById("newMissionCoverLabel").innerText = "Mission cover: (not required)";
    inputs[4].required = false;

    // set the button to edit function
    missionModalButton.addEventListener('click', () => {
        // change the mission info in missions object and render them
        missions.items[missionIndex] = {
            "name": inputs[0].value,
            "agency": inputs[1].value.toUpperCase().replace(/\s/g, ''),
            "objective": inputs[2].value,
            "launchDate": inputs[3].value,
            "image": inputs[4].files[0] ? URL.createObjectURL(inputs[4].files[0]) : missionInfo.image
        }
        putItems(missions.items)

        // update localStorage and close the modal
        localStorage.setItem("missions", JSON.stringify(missions));
        $('#missionModal').modal('hide');

    })
}

// filters
var agencyFilter = document.getElementById("agency-filter"),
    yearFilter = document.getElementById("year-filter"),
    searchFilter = document.getElementById("search-filter");

function filter() {
    filteredMissions = [...missions.items];
    const prevAgency = agencyFilter.value, prevYear = yearFilter.value;
    // search if the agnecy included in the agencies of each item
    if (agencyFilter.value != "all") {
        filteredMissions = filteredMissions.filter(item => item.agency.includes(agencyFilter.value))
    }
    if (yearFilter.value != "all") {
        filteredMissions = filteredMissions.filter(item => item.launchDate.includes(yearFilter.value))
    }
    // search filter
    searchFilter.value && (
        filteredMissions = filteredMissions.filter(item =>
            Object.values(item).some(val => val.toString().toLowerCase().includes(searchFilter.value.toLowerCase()))
        )
    )

    putItems(filteredMissions);
    // to keep the filters values so they can work together
    agencyFilter.value = prevAgency;
    yearFilter.value = prevYear;
}

agencyFilter.addEventListener("change", filter);
yearFilter.addEventListener("change", filter);
searchFilter.addEventListener("input", filter);

// favorite list
let favoriteBar = document.getElementById("favorite-bar");
var favoriteListButton = document.getElementById("favorite-list");
var favoriteListIcon = document.getElementById("favorite-icon");
var closeFavoriteListIcon = document.getElementById("closeFmsIcon");

// favoriteListButton.addEventListener("click", () => {
//     if (!favoriteList) {
//         // render the favorite missions
//         let favoriteItems = missions.items.filter(item => item.favorite);
//         putItems(favoriteItems);

//         // change the fav button
//         favoriteListButton.style.background = 'white';
//         favoriteListIcon.src = "./assets/icons/lightb-star.png";

//         favoriteList = true;

//     } else {
//         // render all the missions;
//         putItems(missions.items);

//         // change the fav button
//         favoriteListButton.style.background = 'var(--lightb)';
//         favoriteListIcon.src = "./assets/icons/white-star.png";

//         favoriteList = false;

//     }
// })

favoriteListIcon.addEventListener('click', ()=>{
    favoriteBar.classList.remove("close-fms");
})
closeFavoriteListIcon.addEventListener('click', ()=>{
    favoriteBar.classList.add("close-fms");
})
