//get the missions from localStorage
let missions = JSON.parse(localStorage.getItem("missions"));

if (missions) {
    putItems(missions);
} else {
    (async () => {
    const getMissions = await fetch("./assets/missions.json");
    const data = await getMissions.json();
    putItems(data);
    
    //add the missions to the main storage
        localStorage.setItem("missions", JSON.stringify(data));
}) ();
}

function putItems(data) {
    for (let i = 0; i < data.length; i++) {
        document.getElementById("missionsTable").innerHTML += `<tr>
                                <td class="cover">
                                    <img class="cover-thumb" src="${data[i].image}">
                                </td>
                                <td class="mission">
                                    <div class="missionInfo">
                                        <span class="mission-name">${data[i].name} </span>
                                        <div class="mission-agency">${data[i].agency}</div>
                                    </div>
                                    <div class="missionAction"><img src="${data[i].favorite? "./assets/icons/star-full.png" : "./assets/icons/star.png" }" id="favorite-${data[i].id}"  class="favorite"><img src="./assets/icons/edit.png" class="edit"></div>
                                </td>
                                <td class="objective">
                                    ${data[i].objective}
                                </td>
                                <td class="launch">${data[i].launchDate}</td>
                            </tr>`;
    }
}