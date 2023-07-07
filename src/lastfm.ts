import calculateStyles from "./components/calculateStyles";
import { Options } from "./components/defaults";
import { getAllStorage } from "./components/storage";

const dash = () => {
	const newDash = document.createElement("span");
	newDash.textContent = "–";
	newDash.className = "debloat-dash";
	return newDash;
};

const addStyles = async () => {
	const stylesArr: string[] = await calculateStyles();
	if (!stylesArr.length) return;

	const styleEl = document.createElement("style");
	styleEl.id = "debloat-style";
	document.head.appendChild(styleEl);

	styleEl.innerText = stylesArr.join(" ");
};
if (!document.getElementById("debloat-style")) addStyles();

const mainEl = document.querySelector("#content");
const mainObserver = new MutationObserver(async () => {
	const options = (await getAllStorage()) as Options;

	if (options.artistFirst) {
		const artistFirstEl = document.querySelectorAll(
			".chartlist--with-artist .chartlist-row"
		);

		artistFirstEl.forEach((row) => {
			const artist = row.querySelector(
				".chartlist-artist:not(.debloat-artist-first)"
			) as HTMLElement;
			const songName = row.querySelector(
				".chartlist-name:not(.debloat-artist-first)"
			) as HTMLElement;

			if (artist && songName) {
				row.insertBefore(artist, songName);
				if (!row.querySelector(".debloat-dash") && artist.textContent?.trim())
					row.insertBefore(dash(), songName);

				artist.classList.add("debloat-artist-first");
				songName.classList.add("debloat-artist-first");
			}
		});
	}

	if (options.timestampSwap) {
		const timestampEls = document.querySelectorAll(".chartlist-timestamp");

		timestampEls.forEach((el) => {
			const spanEl = el.querySelector(
				"span:not(.chartlist-now-scrobbling):not(.debloat-timestamp-swap)"
			) as HTMLSpanElement;
			const spanTitle = spanEl?.title;
			const spanText = spanEl?.textContent;

			if (!spanEl || !spanTitle || !spanText) return;

			const elDate = new Date(spanTitle.split(",")[0].trim());
			const nowDate = new Date();

			if (
				elDate &&
				elDate.getFullYear() === nowDate.getFullYear() &&
				elDate.getMonth() === nowDate.getMonth() &&
				elDate.getDate() === nowDate.getDate()
			)
				spanEl.textContent = spanTitle.split(",")[1].trim();
			else spanEl.textContent = spanTitle.trim();

			spanEl.classList.add("debloat-timestamp-swap");
		});
	}
});
mainEl && mainObserver.observe(mainEl, { childList: true, subtree: true });
