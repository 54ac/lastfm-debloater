const options = [
	"artistFirst",
	"titleSpace",
	"squareAvatars",
	"compactCharts",
	"compactArtistHeader",
	"barColor",
	"barFontInvert",
	"fontWeight",
	"scrobbleText"
];
// remember to add new options here as well

function debloat() {
	options.forEach(o => {
		browser.storage.local.get(o).then(res => {
			// have to check typeof because of false
			if (res[o] === true || typeof res[o] === "undefined") {
				if (o === "artistFirst" || o === "titleSpace") {
					const elements = document.getElementsByClassName(
						"chartlist--with-artist"
					);
					for (const e of elements) {
						if (!e.classList.contains("chartlist--with-bar")) {
							for (const row of e.getElementsByClassName("chartlist-row")) {
								// contains(o) to monitor class list to not fall into endless loop
								if (!row.classList.contains(o)) {
									const artist = row.getElementsByClassName(
										"chartlist-artist"
									)[0];
									const songName = row.getElementsByClassName(
										"chartlist-name"
									)[0];

									if (o === "titleSpace") {
										artist.style.flexGrow = "0";
										artist.style.flexShrink = "0";
										artist.style.width = "inherit";
										songName.style.width = "inherit";
									}

									if (o === "artistFirst") {
										row.insertBefore(artist, songName);

										const emDash = document.createElement("span");
										emDash.textContent = "—";
										emDash.className = "emDash";

										if (row.getElementsByClassName("emDash").length === 0)
											// only insert if necessary
											row.insertBefore(emDash, songName);
									}
									row.classList.add(o); // class list monitoring purposes
								}
							}
						} else if (e.classList.contains("chartlist--with-bar")) {
							for (const row of e.getElementsByClassName("chartlist-row")) {
								if (!row.classList.contains(o)) {
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
										artist.style.marginRight = "7.5px";
										songName.style.marginBottom = "inherit";

										row.insertBefore(artist, songName);

										const emDash = document.createElement("span");
										emDash.textContent = "—";
										emDash.className = "emDash";

										if (row.getElementsByClassName("emDash").length === 0)
											row.insertBefore(emDash, songName);
										row.classList.add(o);
									}
								}
							}
						}
					}
				}

				if (o === "squareAvatars") {
					// horrible workaround for css pseudoclass
					const rule = ".avatar::after { border-radius: 0px !important; }";
					if (document.styleSheets[0].cssRules[0].cssText !== rule)
						document.styleSheets[0].insertRule(rule, 0);

					const elements = document.getElementsByClassName("avatar");

					for (const e of elements) {
						if (!e.classList.contains(o)) {
							e.classList.add(o);
							const img = e.getElementsByTagName("img");
							for (const i of img) {
								i.style.borderRadius = "0";
							}
						}
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
						if (!e.classList.contains(o)) {
							if (o === "compactCharts") {
								e.style.paddingTop = "4px";
								e.style.paddingBottom = "4px";
								e.style.minHeight = "0px";
							}

							if (e.getElementsByClassName("chartlist-bar").length > 0) {
								if (o === "barColor") {
									browser.storage.local.get("barColorPicker").then(color => {
										e.getElementsByClassName(
											"chartlist-count-bar-slug"
										)[0].style.backgroundColor =
											color.barColorPicker || "#b90000";
									});
								}

								if (o === "barFontInvert") {
									e.getElementsByClassName(
										"chartlist-count-bar-value"
									)[0].style.color = "#ffffff";
								}

								if (o === "scrobbleText") {
									e.getElementsByClassName("stat-name")[0].style.display =
										"none";
								}
							}

							if (o === "fontWeight")
								e.getElementsByClassName("chartlist-name")[0].style.fontWeight =
									"inherit";

							e.classList.add(o);
						}
					}
				}

				if (o === "compactArtistHeader") {
					let header = document.getElementsByClassName("header-new-content");
					if (header.length > 0) [header] = header;

					if (header && !header.classList.contains(o)) {
						header.getElementsByClassName(
							"artist-header-featured-items"
						)[0].style.marginTop = "16px";

						header.style.paddingTop = "16px";
						header.style.paddingBottom = "16px";
						header.classList.add(o);
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
