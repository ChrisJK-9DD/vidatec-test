import React, { Component } from "react";
 
class List extends Component {
    componentDidMount() {
        localStorage.setItem('sightingsArray', []);
        var checking = localStorage.getItem('sightingsArray');
        if(checking === "" || checking === null) {
            console.log("There are no sightings");
            console.log("Creating sighting data");
            var defaultSightings = [];
            var dumbledore = {
                bird: "Phoenix",
                date: "2020-01-01",
                name: "Albus Dumbledore",
                place: "Hogwarts",
                confidence: 1
            }
            var bob = {
                bird: "Pigeon",
                date: "2019-12-25",
                name: "Bob Hope",
                place: "London",
                confidence: 0
            }
            defaultSightings.push(JSON.stringify(dumbledore));
            defaultSightings.push(JSON.stringify(bob));
            localStorage.setItem('sightingsArray', defaultSightings);
            this.displayItems();
        } else {
            this.displayItems();
        }
        
        var addButton = document.getElementsByClassName("addSighting")[0];
        addButton.addEventListener("click", function() {
            var panel = this.nextElementSibling;
            var scrollHeight = panel.scrollHeight + 7;
            panel.style.maxHeight = scrollHeight + "px";
            panel.style.paddingBottom = "5px"
        });

        var filterButton = document.getElementById("filterButton");
        filterButton.addEventListener("click", function() {
            var filterDropDown = document.getElementById("filterDropdown");
            var filterValue = filterDropDown.options[filterDropDown.selectedIndex].value;
            var hideNonConfident = document.getElementsByClassName("confident");
            var hideConfident = document.getElementsByClassName("notConfident");
            if(filterValue === "notConfident") {
                Array.from(hideNonConfident).forEach((el) => {
                    el.style.display = "none";
                });
                Array.from(hideConfident).forEach((el) => {
                    el.style.display = "block";
                });
            } else if(filterValue === "confident") {
                Array.from(hideConfident).forEach((el) => {
                    el.style.display = "none";
                });
                Array.from(hideNonConfident).forEach((el) => {
                    el.style.display = "block";
                });
            }
        });

        var resetButton = document.getElementById("reset");
        resetButton.addEventListener("click", function() {
            var listItems = document.getElementsByTagName("li");
            Array.from(listItems).forEach((el) => {
                el.style.display = "block";
            });
        });
    }

    addItem() {
        var panel = document.getElementsByClassName("form")[0];
        panel.style.maxHeight = null;
        panel.style.paddingBottom = "0px"
        var bird = document.getElementById("bird").value;
        var date = document.getElementById("date").value;
        var name = document.getElementById("name").value;
        var place = document.getElementById("place").value;
        var confidence = document.getElementById("confidence").value;
        confidence = parseInt(confidence);
        
        if (bird !== "" || date !== "" || name !== "" || place !== "" || confidence !== "") {

            var newSighting = {
                bird: bird,
                date: date,
                name: name,
                place: place,
                confidence: confidence
            };

            var oldSightings = localStorage.getItem('sightingsArray');
            oldSightings = oldSightings + "," + JSON.stringify(newSighting);
            localStorage.setItem('sightingsArray', oldSightings);

            var ul = document.getElementById("list");
            ul.innerHTML = "";
            var fetchSightings = localStorage.getItem('sightingsArray');
            fetchSightings = fetchSightings.split("},{");
            var displayArray = [];
            fetchSightings.forEach(element => {
                var startingCharacter = element.charAt(0);
                var lastCharacter = element.charAt(element.length-1);
                if(startingCharacter !== "{") {
                    element = "{" + element;
                }
                if(lastCharacter !== "}"){
                    element = element + "}"
                }
                displayArray.push(JSON.parse(element));
            });

            function compareDate(a, b) {
                var aDate = a.date;
                aDate = aDate.split("-");
                aDate = aDate[0] + aDate[1] + aDate[2];
                aDate = parseInt(aDate);
                var bDate = b.date;
                bDate = bDate.split("-");
                bDate = bDate[0] + bDate[1] + bDate[2];
                bDate = parseInt(bDate);
                return bDate - aDate;
            }
            displayArray.sort(compareDate);

            displayArray.forEach(element => {
                var currentList = document.createElement("li");
                var dateSpan = document.createElement("span");
                var date = element.date;
                date = date.split("-");
                var newDate = date[2] + "/" + date[1] + "/" + date[0]
                dateSpan.appendChild(document.createTextNode(newDate));
                dateSpan.classList.add("date");

                var typeBird = document.createElement("div");
                typeBird.classList.add("birdType");
                typeBird.appendChild(document.createTextNode(element.bird));

                var confidenceOfSighting = document.createElement("div");
                confidenceOfSighting.classList.add("confidenceSighting");
                var confidenceString = "";
                if(element.confidence === 0) {
                    confidenceString = "Not Confident";
                    currentList.classList.add("notConfident");
                } else {
                    confidenceString = "Confident";
                    currentList.classList.add("confident");
                }
                confidenceOfSighting.appendChild(document.createTextNode(confidenceString));


                var sightingPlace = document.createElement("div");
                sightingPlace.classList.add("sightingPlace");
                sightingPlace.appendChild(document.createTextNode(element.place));

                var sighter = document.createElement("div");
                sighter.classList.add("sighter");
                sighter.appendChild(document.createTextNode(element.name));

                var visibleWrapper = document.createElement("div");
                visibleWrapper.classList.add("visibleWrapper");

                visibleWrapper.append(dateSpan);
                visibleWrapper.append(typeBird);
                visibleWrapper.append(confidenceOfSighting);

                var invisibleWrapper = document.createElement("div");
                invisibleWrapper.classList.add("invisibleWrapper");
                invisibleWrapper.append(sighter);
                invisibleWrapper.append(sightingPlace);

                currentList.append(visibleWrapper);
                currentList.append(invisibleWrapper)

                ul.append(currentList);
            });

            var acc = document.getElementsByClassName("visibleWrapper");
            var i;

            for (i = 0; i < acc.length; i++) {
                acc[i].addEventListener("click", function() {
                    var panel = this.nextElementSibling;
                    for (var j = 0; j < acc.length; j++) {
                        if(acc[j] !== this){
                            if(acc[j].classList.contains("active")){
                                acc[j].classList.remove("active");
                                panel.style.maxHeight = null;
                            }
                        }
                    }
                    this.classList.toggle("active");
                    if (panel.style.maxHeight){
                        panel.style.maxHeight = null;
                    } else {
                        var scrollHeight = panel.scrollHeight + 7
                        panel.style.maxHeight = scrollHeight + "px";
                    } 
                });
            }
        }
    }

    displayItems() {
        var ul = document.getElementById("list");
        var fetchSightings = localStorage.getItem('sightingsArray');
        fetchSightings = fetchSightings.split("},{");
        var displayArray = [];
        fetchSightings.forEach(element => {
            var startingCharacter = element.charAt(0);
            if(startingCharacter === "{") {
                element = element + "}";
            } else {
                element = "{" + element;
            }
            displayArray.push(JSON.parse(element));
        });

        function compareDate(a, b) {
            var aDate = a.date;
            aDate = aDate.split("-");
            aDate = aDate[0] + aDate[1] + aDate[2];
            aDate = parseInt(aDate);
            var bDate = b.date;
            bDate = bDate.split("-");
            bDate = bDate[0] + bDate[1] + bDate[2];
            bDate = parseInt(bDate);
            return bDate - aDate;
        }
        displayArray.sort(compareDate);

        displayArray.forEach(element => {
            var currentList = document.createElement("li");
            var dateSpan = document.createElement("span");
            var date = element.date;
            date = date.split("-");
            var newDate = date[2] + "/" + date[1] + "/" + date[0]
            dateSpan.appendChild(document.createTextNode(newDate));
            dateSpan.classList.add("date");
            
            var typeBird = document.createElement("div");
            typeBird.classList.add("birdType");
            typeBird.appendChild(document.createTextNode(element.bird));
            
            var confidenceOfSighting = document.createElement("div");
            confidenceOfSighting.classList.add("confidenceSighting");
            var confidenceString = "";
            if(element.confidence === 0) {
                confidenceString = "Not Confident";
                currentList.classList.add("notConfident");
            } else {
                confidenceString = "Confident";
                currentList.classList.add("confident");
            }
            confidenceOfSighting.appendChild(document.createTextNode(confidenceString));

            var sightingPlace = document.createElement("div");
            sightingPlace.classList.add("sightingPlace");
            sightingPlace.appendChild(document.createTextNode(element.place));

            var sighter = document.createElement("div");
            sighter.classList.add("sighter");
            sighter.appendChild(document.createTextNode(element.name));

            var visibleWrapper = document.createElement("div");
            visibleWrapper.classList.add("visibleWrapper");

            visibleWrapper.append(dateSpan);
            visibleWrapper.append(typeBird);
            visibleWrapper.append(confidenceOfSighting);

            var invisibleWrapper = document.createElement("div");
            invisibleWrapper.classList.add("invisibleWrapper");
            invisibleWrapper.append(sighter);
            invisibleWrapper.append(sightingPlace);

            currentList.append(visibleWrapper);
            currentList.append(invisibleWrapper)

            ul.append(currentList);
        });
        var acc = document.getElementsByClassName("visibleWrapper");
        var i;

        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function() {
                var panel = this.nextElementSibling;
                for (var j = 0; j < acc.length; j++) {
                    if(acc[j] !== this){
                        if(acc[j].classList.contains("active")){
                            acc[j].classList.remove("active");
                            panel.style.maxHeight = null;
                        }
                    }
                }
                this.classList.toggle("active");
                if (panel.style.maxHeight){
                    panel.style.maxHeight = null;
                } else {
                    var scrollHeight = panel.scrollHeight + 7
                    panel.style.maxHeight = scrollHeight + "px";
                } 
            });
        }
    }

    render() {
    return (
      <div className="todoListMain">
            <div className="header">
                <button className="addSighting">Add New Sighting</button>
                <div className="form">
                    <label>Name of Bird</label><input id="bird" type="text" name="bird" placeholder="Bird Type" />
                    <label>Date of sighting</label><input id="date" type="date" name="date" />
                    <label>Name of Sighter</label><input id="name" type="text" name="sighter" placeholder="Name of Sighter" />
                    <label>Place of Sighting</label><input id="place" type="text" name="place" placeholder="Place of Sighting" />
                    <label>Confidence of Sighting</label><select id="confidence"><option value="0">Not Confident</option><option value="1">Confident</option></select>
                    <button onClick={this.addItem} type="submit">Submit</button>
                </div>
            </div>
            <div id="filter">
                <span>Confidence Filter: </span>
                <select id="filterDropdown">
                    <option value="notConfident">Not Confident</option>
                    <option value="confident">Confident</option>
                </select>
                <button id="filterButton">Filter</button>
                <button id="reset">Reset</button>
            </div>
            <ul id="list"></ul>
      </div>
    );
    }
}

export default List;