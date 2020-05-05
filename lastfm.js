const options = [
	"artistFirstRecent",
	"titleSpace",
	"squareAvatars",
	"compactCharts",
	"compactArtistHeader",
	"barColor",
	"barFontInvert",
	"fontWeight",
	"scrobbleText",
	"artistFirstTop"
];
//remember to add new options here as well

function debloat() {
	options.forEach(o => {
		browser.storage.sync.get(o).then(res => {
			//have to check typeof because of false
			if (res[o] === true || typeof res[o] === "undefined") {
				if (
					o === "artistFirstRecent" ||
					o === "titleSpace" ||
					o === "artistFirstTop"
				) {
					let elements = document.getElementsByClassName(
						"chartlist--with-artist"
					);
					for (let e of elements) {
						if (e.parentNode.id === "recent-tracks-section") {
							for (let row of e.getElementsByClassName("chartlist-row")) {
								//contains(o) to monitor class list to not fall into endless loop
								if (!row.classList.contains(o)) {
									let artist = row.getElementsByClassName(
										"chartlist-artist"
									)[0];
									let songName = row.getElementsByClassName(
										"chartlist-name"
									)[0];

									if (o === "titleSpace") {
										artist.style.flexGrow = "0";
										artist.style.flexShrink = "0";
										artist.style.width = "inherit";
										songName.style.width = "inherit";
									}

									if (o === "artistFirstRecent") {
										row.insertBefore(artist, songName);

										let emDash = document.createElement("span");
										emDash.textContent = "—";
										emDash.className = "emDash";

										if (row.getElementsByClassName("emDash").length === 0)
											//only insert if necessary
											row.insertBefore(emDash, songName);
									}
									row.classList.add(o); //class list monitoring purposes
								}
							}
						} else if (e.parentNode.parentNode.id === "top-tracks") {
							for (let row of e.getElementsByClassName("chartlist-row")) {
								if (!row.classList.contains(o)) {
									if (o === "artistFirstTop") {
										let artist = row.getElementsByClassName(
											"chartlist-artist"
										)[0];
										let songName = row.getElementsByClassName(
											"chartlist-name"
										)[0];

										artist.style.flexGrow = "0";
										artist.style.flexShrink = "0";
										artist.style.position = "static";
										artist.style.marginTop = "inherit";
										artist.style.marginRight = "7.5px";
										songName.style.marginBottom = "inherit";

										row.insertBefore(artist, songName);

										let emDash = document.createElement("span");
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
					//horrible workaround for css pseudoclass
					let rule = ".avatar::after { border-radius: 0px !important; }";
					if (document.styleSheets[0].cssRules[0].cssText !== rule)
						document.styleSheets[0].insertRule(rule, 0);

					let elements = document.getElementsByClassName("avatar");

					for (let e of elements) {
						if (!e.classList.contains(o)) {
							e.classList.add(o);
							let img = e.getElementsByTagName("img");
							for (let i of img) {
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
					let elements = document.getElementsByClassName("chartlist-row");
					for (let e of elements) {
						if (!e.classList.contains(o)) {
							if (o === "compactCharts") {
								e.style.paddingTop = "4px";
								e.style.paddingBottom = "4px";
								e.style.minHeight = "0px";
							}

							if (e.getElementsByClassName("chartlist-bar").length > 0) {
								if (o === "barColor") {
									browser.storage.sync.get("barColorPicker").then(color => {
										e.getElementsByClassName(
											"chartlist-count-bar-slug"
										)[0].style.backgroundColor =
											color["barColorPicker"] || "#b90000";
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
					if (header.length > 0) header = header[0];

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

//add mutation observer due to ajax
const targetNode = document.body;
const observerOptions = {
	childList: true,
	subtree: true
};

const observer = new MutationObserver(debloat);
observer.observe(targetNode, observerOptions);
