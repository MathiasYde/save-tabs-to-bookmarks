const tablist = document.getElementById("TAB_LIST");

let openTabs = [];
let parentFolder = null;

function fetchParentFolder() {
	chrome.bookmarks.search({
		title: "Saved Tabs"
	}, function (results) {
		if (results.length == 0) {
			chrome.bookmarks.create({
				title: "Saved Tabs",
				index: 0
			}, function (bookmark) {
				parentFolder = bookmark.id;
			});
		} else {
			parentFolder = results[0].id;
		}
	});
}
fetchParentFolder();

function removetab(index) {
	openTabs.splice(index, 1)
	previewtabs()
}

function previewtabs() {
	// Remove tiles
	while (tablist.firstChild) {
		tablist.removeChild(tablist.firstChild);
	}

	// Add tiles
	for (let i = 0; i < openTabs.length; i++) {
		const tab = openTabs[i];

		console.log(tab.group);

		listtile = document.createElement("li");
		listtile.classList = "listtile mt4 ml4 mb4 p4";

		title = document.createElement("span");
		title.innerHTML = tab.title;
		listtile.appendChild(title);

		button = document.createElement("button");
		button.innerHTML = "&times;";
		button.classList = "trailing p8";
		button.addEventListener("click", (event) => {
			removetab(i)
		});
		listtile.appendChild(button);

		tablist.appendChild(listtile);
	}
}

function getSessionName() {
	const now = new Date();
	let name = "Session {MM}-{DD} {hh}-{mm}-{ss}"
	name = name.replace("{MM}", now.toString().substring(4, 7));
	name = name.replace("{DD}", now.toString().substring(8, 10));
	name = name.replace("{hh}", now.toString().substring(16, 18));
	name = name.replace("{mm}", now.toString().substring(19, 21));
	name = name.replace("{ss}", now.toString().substring(22, 24));
	return name
}

chrome.tabs.query({
	currentWindow: true
}, function (tabs) {
	tabs.forEach((tab) => openTabs.push(tab));
	previewtabs();
});

document.getElementById("SAVE_SESSION").addEventListener("click", (event) => {
	const sessionName = getSessionName();

	chrome.bookmarks.create({
		"parentId": parentFolder,
		"title": sessionName
	},
		function (folder) {

			openTabs.forEach(tab => chrome.bookmarks.create({
				parentId: folder.id,
				title: tab.title,
				url: tab.url
			}));
		});
});
