//get the missions from localStorage
let missions = JSON.parse(localStorage.getItem("missions"));
let agencies = [], years = [];


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
    // remove all the items in the missions table to render the new item
    document.getElementById("missionsTable").innerHTML = '';

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
        document.getElementById("missionsTable").innerHTML += `<tr>
                                <td class="cover">
                                    <img class="cover-thumb" src="${item.image}">
                                </td>
                                <td class="mission">
                                    <div class="missionInfo">
                                        <span class="mission-name">${item.name} </span>
                                        <div class="mission-agency">${item.agency}</div>
                                    </div>
                                    <div class="missionAction"><img src="${item.favorite ? "./assets/icons/star-full.png" : "./assets/icons/star.png"}" onclick="favorite(${item.id}, ${!item.favorite})"  class="favorite"><img src="./assets/icons/edit.png" onclick="edit(${item.id})" class="edit"><img src="./assets/icons/delete.png" onclick="deleteItem(${item.id})" class="delete"></div>
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
            "agency": inputs[1].value,
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


function deleteItem(id) {
    // found element by its id, delete it and render the items again
    missions.items = missions.items.filter(item => item.id != id);
    putItems(missions.items)

    // update localStorage
    localStorage.setItem("missions", JSON.stringify(missions));

}

function favorite(id, action) {
    // search an item by id then change or add favorite item as true of false
    var missionIndex = missions.items.findIndex(mission => mission.id === id);
    missions.items[missionIndex].favorite = action;
    putItems(missions.items)

    // update localStorage
    localStorage.setItem("missions", JSON.stringify(missions));
}

function edit(id) {

    // show the modal to edit
    $('#missionModal').modal('show');

    //fill the modal inputs with the mission value
    var missionIndex = missions.items.findIndex(mission => mission.id === id);
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
            "id": missions.info.missionsCount,
            "name": inputs[0].value,
            "agency": inputs[1].value,
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