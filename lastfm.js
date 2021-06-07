const options = [
	"artistFirst",
	"squareAvatars",
	"compactCharts",
	"compactArtistHeader",
	"barColor",
	"barFontInvert",
	"fontFamily",
	"fontColor",
	"fontWeight",
	"scrobbleText",
	"timestampSwap"
];
// remember to add new options here as well

const dash = () => {
	const newDash = document.createElement("span");
	newDash.textContent = "–";
	newDash.className = "dash";
	return newDash;
};

function debloat() {
	options.forEach((o) => {
		browser.storage.local.get(o).then((res) => {
			if (res[o] === false) return;
			if (o === "artistFirst") {
				const elements = document.getElementsByClassName(
					"chartlist--with-artist"
				);
				for (const e of elements) {
					if (!e.classList.contains("chartlist--with-bar")) {
						for (const row of e.getElementsByClassName("chartlist-row")) {
							// contains(o) to monitor class list to not fall into endless loop
							if (row.classList.contains(o)) return;
							const artist = row.getElementsByClassName("chartlist-artist")[0];
							const songName = row.getElementsByClassName("chartlist-name")[0];

							if (o === "artistFirst") {
								artist.style.flexGrow = "0";
								artist.style.flexShrink = "0";
								artist.style.width = "inherit";
								songName.style.width = "inherit";

								row.insertBefore(artist, songName);

								if (row.getElementsByClassName("dash").length === 0)
									// only if necessary
									row.insertBefore(dash(), songName);
							}
							row.classList.add(o); // class list monitoring purposes
						}
					} else if (e.classList.contains("chartlist--with-bar")) {
						for (const row of e.getElementsByClassName("chartlist-row")) {
							if (row.classList.contains(o)) return;
							if (o === "artistFirst") {
								const artist = row.getElementsByClassName(
									"chartlist-artist"
								)[0];
								const songName = row.getElementsByClassName(
									"chartlist-name"
								)[0];

								artist.style.flexGrow = "0";
								artist.style.flexShrink = "0";
								artist.style.position = "static";
								artist.style.marginTop = "inherit";
								// margin copied from tracks chart - otherwise width gets changed on hover
								artist.style.marginRight = "7.5px";
								songName.style.marginBottom = "inherit";

								row.insertBefore(artist, songName);

								// only if artist field is not empty
								if (
									row.getElementsByClassName("dash").length === 0 &&
									artist.textContent.trim().length > 0
								)
									row.insertBefore(dash(), songName);
								row.classList.add(o);
							}
						}
					}
				}
			}

			if (o === "squareAvatars") {
				// horrible workaround for css pseudoclass
				const rule = ".avatar::after { border-radius: 0px !important; }";
				if (
					document.styleSheets.length > 0 &&
					document.styleSheets[0].cssRules.length > 0 &&
					document.styleSheets[0].cssRules[0].cssText !== rule
				)
					document.styleSheets[0].insertRule(rule, 0);

				const elements = document.getElementsByClassName("avatar");

				for (const e of elements) {
					if (e.classList.contains(o)) return;

					e.classList.add(o);
					const img = e.getElementsByTagName("img");
					for (const i of img) i.style.borderRadius = "0";
				}
			}

			if (
				o === "compactCharts" ||
				o === "barColor" ||
				o === "barFontInvert" ||
				o === "fontWeight" ||
				o === "scrobbleText"
			) {
				const elements = document.getElementsByClassName("chartlist-row");
				for (const e of elements) {
					if (e.classList.contains(o)) return;
					if (o === "compactCharts") {
						e.style.paddingTop = "4px";
						e.style.paddingBottom = "4px";
						e.style.minHeight = "0px";
					}

					if (e.getElementsByClassName("chartlist-bar").length > 0) {
						if (o === "barColor")
							browser.storage.local
								.get("barColorPicker")
								.then(
									(color) =>
										(e.getElementsByClassName(
											"chartlist-count-bar-slug"
										)[0].style.backgroundColor =
											color.barColorPicker || "#b90000")
								);

						if (o === "barFontInvert") {
							e.getElementsByClassName(
								"chartlist-count-bar-value"
							)[0].style.color = "#ffffff";

							// white on white workaround
							browser.storage.local.get("barColorPicker").then(
								(color) =>
									(e.getElementsByClassName(
										"chartlist-count-bar-link"
									)[0].style.backgroundColor =
										color.barColorPicker ||
										// no clue why getComputedStyle has to be used here
										window
											.getComputedStyle(
												e.getElementsByClassName("chartlist-count-bar-slug")[0]
											)
											.getPropertyValue("background-color"))
							);
						}

						if (o === "scrobbleText")
							e.getElementsByClassName("stat-name")[0].style.display = "none";
					}

					if (o === "fontWeight")
						e.getElementsByClassName("chartlist-name")[0].style.fontWeight =
							"inherit";

					e.classList.add(o);
				}
			}

			if (o === "compactArtistHeader") {
				let header = document.getElementsByClassName("header-new-content");
				if (header.length > 0) [header] = header;

				if (header?.classList?.contains(o)) {
					header.getElementsByClassName(
						"artist-header-featured-items"
					)[0].style.marginTop = "16px";

					header.style.paddingTop = "16px";
					header.style.paddingBottom = "16px";
					header.classList.add(o);
				}
			}

			if (o === "fontFamily") {
				const fontList = window
					.getComputedStyle(document.body)
					.getPropertyValue("font-family")
					.split(",");

				if (fontList[0] === "Barlow")
					document.body.style.fontFamily = fontList.slice(1).join(",");
			}

			if (o === "fontColor") document.body.style.color = "#000";

			if (o === "timestampSwap") {
				const elements = document.getElementsByClassName("chartlist-timestamp");

				for (const e of elements) {
					const eSpan = e.getElementsByTagName("span")[0];
					const spanTitle = eSpan?.title;
					const spanText = eSpan?.textContent;

					if (
						!eSpan.classList?.contains("chartlist-now-scrobbling") &&
						!eSpan.classList?.contains(o) &&
						spanTitle &&
						spanText
					) {
						const eDate = new Date(spanTitle.split(",")[0].trim());
						const dateNow = new Date();
						if (
							eDate &&
							eDate.getFullYear() === dateNow.getFullYear() &&
							eDate.getMonth() === dateNow.getMonth() &&
							eDate.getDate() === dateNow.getDate()
						)
							eSpan.textContent = spanTitle.split(",")[1].trim();
						else eSpan.textContent = spanTitle.trim();

						eSpan.title = spanText.trim();
						eSpan.classList.add("timestampSwap");
					}
				}
			}
		});
	});
}
debloat();

// add mutation observer due to ajax
const targetNode = document.body;
const observerOptions = {
	childList: true,
	subtree: true
};

const observer = new MutationObserver(debloat);
observer.observe(targetNode, observerOptions);
