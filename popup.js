//Preview active tabs when popup.html is loaded
function previewTabs() {
	for (i=0; i < openTabsArray.length; i++) {
		//text += tabsURL[i] + "\n";
		var para = document.createElement("li");
		para.appendChild(document.createTextNode(openTabsArray[i]));
		var paraX = document.createElement("span");
		paraX.className = "close"
		paraX.innerHTML = "&times;";
		para.appendChild(paraX);
		var element = document.getElementById("SITE_LIST");
		element.appendChild(para);
	}
}

//Save active tabs as session
document.getElementById("SAVE_SESSION").onclick = function saveSession() {
	//openTabsArray = [];
	//chrome.tabs.query({currentWindow: true}, function(tabs) {
	//	tabs.forEach(function(tab) { //For each tab in current window
	//		openTabsArray.push( //Push to array
	//			tab.url
	//		);
	//	});

	//Get value of session name text input
	string = document.getElementById("SESSION_NAME").value;
	formattedString = "";

	now = new Date(); //Get local time

	formattedString = string.replace("{MM}", now.toString().substring(4, 7)); //{MM} Month (01-12)
	formattedString = formattedString.replace("{DD}", now.toString().substring(8, 10)); //{DD} Day (01-31)
	formattedString = formattedString.replace("{hh}", now.toString().substring(16, 18)); //{hh} Hour (00-23)
	formattedString = formattedString.replace("{mm}", now.toString().substring(19, 21)); //{mm} Minute (00-59)
	formattedString = formattedString.replace("{ss}", now.toString().substring(22, 24)); //{ss} Second (00-59)

	//Create session folder
	chrome.bookmarks.create({title: formattedString, index: 0, parentId: folderToSaveTo}, function (bookmark) {
		for (i=0; i < openTabsArray.length; i++) {
			//Save each open tab to sesion folder
			chrome.bookmarks.create({parentId: bookmark.id, title: openTabsArray[i], url: openTabsArray[i]});
		}
	});
}

//When popup.html is loaded
document.addEventListener("DOMContentLoaded", function() {
	var closebtns = document.getElementsByClassName("close");
	var i;

	for (i = 0; i < closebtns.length; i++) {
  		closebtns[i].addEventListener("click", function() {
    		this.parentElement.style.display = 'none';
  		});
	}

	//Search for "Saved Tabs" named folder
	chrome.bookmarks.search({title:"Saved Tabs"}, function (results) {
		if (results.length == 0) { //Length is 0
			//Create folder
			chrome.bookmarks.create({title: "Saved Tabs", index: 0}, function (bookmark) {
				folderToSaveTo = bookmark.id;
			});
		} else { //Does exist or length is greater than 0 (min 1)
			folderToSaveTo = results[0].id;
		}
	});


	//Get all open tabs in active window
	chrome.tabs.query({currentWindow: true}, function(tabs) {
		tabs.forEach(function(tab) { //For each tab in current window
			openTabsArray.push(
				tab.url
			);
		});
		previewTabs();
	});
});

var openTabsArray = [];
var folderToSaveTo = ""; //The "Saved Tabs" folder **id**

/*
Things to add/make/remove/improve on:
1. Make the search function narrower (Include "index: 0, parentId: "2"")
2. Make saved tabs under session folders title the same as the tab title **optional**
3. Make a prettier design on the popup
4. Website filter ("Don't include: **list** https://www.google.com", Only include: **list** https://www.battle.net)
5. Single click remove tabs on <textarea>
6. That damn option page
7. Make text not wrap on <textarea>
8. Autodelete old folders?

*/
