import { Options } from "./components/defaults";
import { getAllStorage, getStorage } from "./components/storage";

const dash = () => {
	//must be in td for compatibility with last.fm's dom manipulation
	const newDashContainer = document.createElement("td");
	newDashContainer.className = "debloat-dash";

	const newDash = document.createElement("span");
	newDash.textContent = "–";

	newDashContainer.appendChild(newDash);
	return newDashContainer;
};

const addStyles = async () => {
	//get css, make new style element in head, copy rules from array to style element
	const styles = (await getStorage("styles")) as Options["styles"];
	if (!styles) return;

	const styleEl = document.createElement("style");
	styleEl.id = "debloat-style";
	document.head.appendChild(styleEl);

	styleEl.innerText = styles;
};
if (!document.getElementById("debloat-style")) addStyles();

const mainEl = document.getElementById("content");
const mainObserver = new MutationObserver(async () => {
	const options = (await getAllStorage()) as Options;

	if (options.artistFirst) {
		const artistFirstEl = document.getElementsByClassName(
			"chartlist-row--with-artist chartlist-row"
		);

		//for each row, find artist and song name elements, switch them around, then insert dash inbetween
		for (let i = 0; i < artistFirstEl.length; i++) {
			const row = artistFirstEl[i];

			const artist = row.getElementsByClassName("chartlist-artist")[0];
			const songName = row.getElementsByClassName("chartlist-name")[0];

			if (!artist || !songName) continue;

			if (!row.classList.contains("debloat-artist-first")) {
				row.insertBefore(artist, songName);
				row.classList.add("debloat-artist-first");
			}

			if (
				!row.getElementsByClassName("debloat-dash").length &&
				artist.textContent?.trim()
			)
				row.insertBefore(dash(), songName);
		}
	}

	if (options.timestampSwap) {
		const timestampEls = document.getElementsByClassName("chartlist-timestamp");

		for (let i = 0; i < timestampEls.length; i++) {
			const row = timestampEls[i];
			if (row.classList.contains("debloat-timestamp-swap")) continue;

			const spanEl = row.getElementsByTagName("span")[0];
			if (!spanEl) continue;

			//extract timestamp from title attribute
			const spanTitle = spanEl.title;
			const spanText = spanEl.textContent;

			if (!spanTitle || !spanText) continue;

			//parse timestamp as date element
			const elDate = new Date(spanTitle.split(",")[0].trim());
			const nowDate = new Date();

			//if timestamp is from today, show only time
			if (
				elDate &&
				elDate.getFullYear() === nowDate.getFullYear() &&
				elDate.getMonth() === nowDate.getMonth() &&
				elDate.getDate() === nowDate.getDate()
			)
				spanEl.textContent = spanTitle.split(",")[1].trim();
			else spanEl.textContent = spanTitle.trim();

			row.classList.add("debloat-timestamp-swap");
		}
	}

	//add options button
	const recentOptionsEl = document.getElementById("recent-tracks-settings");
	if (
		recentOptionsEl &&
		!recentOptionsEl.classList.contains("debloat-options-button")
	) {
		if (!recentOptionsEl.getElementsByClassName("form-submit").length) return;

		const newOptionsButton = document.createElement("button");
		newOptionsButton.textContent = chrome.i18n.getMessage("newOptionsButton");
		newOptionsButton.className = "btn-cancel"; //consistent styling
		newOptionsButton.onclick = () =>
			chrome.runtime.sendMessage({ action: "openOptions" });
		recentOptionsEl
			.getElementsByClassName("form-submit")[0]
			.appendChild(newOptionsButton); //next to the cancel button

		recentOptionsEl.classList.add("debloat-options-button");
	}
});
//must be observed as these elements are not available on page load
mainEl && mainObserver.observe(mainEl, { childList: true, subtree: true });
