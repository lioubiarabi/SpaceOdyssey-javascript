//get the missions from localStorage
let missions = JSON.parse(localStorage.getItem("missions"));
let agencies = [], years = [];


if (missions) {
    putItems(missions);
} else {
    (async () => {
        const getMissions = await fetch("./assets/missions.json");
        const data = await getMissions.json();
        missions = data;
        putItems(data);
        //add the missions to the main storage
        localStorage.setItem("missions", JSON.stringify(data));
    })();
}

function putItems(items) {
    // check if the agency in filters and add elements in the table list
    items.forEach(data => {

        // check if the agency exist in agencies array
        data.agency.split("/").forEach(agency => {
            if (!agencies.includes(agency)) agencies.push(agency);
        });
        // check if the year exist in years array
        let year = new Date(data.launchDate).getFullYear();
        if (!years.includes(year)) years.push(year);


        //render the items in the page
        document.getElementById("missionsTable").innerHTML += `<tr>
                                <td class="cover">
                                    <img class="cover-thumb" src="${data.image}">
                                </td>
                                <td class="mission">
                                    <div class="missionInfo">
                                        <span class="mission-name">${data.name} </span>
                                        <div class="mission-agency">${data.agency}</div>
                                    </div>
                                    <div class="missionAction"><img src="${data.favorite ? "./assets/icons/star-full.png" : "./assets/icons/star.png"}" id="favorite-${data.id}"  class="favorite"><img src="./assets/icons/edit.png" class="edit"><img src="./assets/icons/delete.png" class="delete"></div>
                                </td>
                                <td class="objective">
                                    ${data.objective}
                                </td>
                                <td class="launch">${data.launchDate}</td>
                            </tr>`;
    });

    //render the filters options
    agencies.sort().forEach(agency => document.getElementById("agency-filter").innerHTML += `<option value="${agency}">${agency}</option>`);
    years.sort((a, b) => a - b).forEach(year => document.getElementById("year-filter").innerHTML += `<option value="${year}">${year}</option>`);

}

// check if new mission modal are non empty
var form = document.getElementById("addNewMissionForm");
var addNewMissionButton = document.getElementById("addNewMissionButton");
form.addEventListener("input", () => {
    // disable the button until the user fill the form
    addNewMissionButton.disabled = true;
    form.checkValidity() && (addNewMissionButton.disabled = false);
})

// add new mission
addNewMissionButton.addEventListener("click", () => {
    var inputs = form.querySelectorAll(".addNewMissionForm");
    missions.push({
        "id": missions.length,
        "name": inputs[0].value,
        "agency": inputs[1].value,
        "objective": inputs[2].value,
        "launchDate": inputs[3].value,
        "image": URL.createObjectURL(inputs[4].files[0]) 
    });
})

