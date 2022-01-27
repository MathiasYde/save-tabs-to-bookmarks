async function main() {
	let [tab] = await chrome.tabs.query({
		active: true, currentWindow: true
	});

	chrome.tabs.update(tab.id, {
		url: `https://web.archive.org/web/*/${tab.url}`
	});
}

chrome.action.onClicked.addListener(main);