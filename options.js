const options = document.getElementsByClassName("option");

function saveOptions(o) {
	if (o.id === "barColorPicker")
		browser.storage.local.set({
			[o.id]: document.getElementById(o.id).value
		});
	else
		browser.storage.local.set({
			[o.id]: document.getElementById(o.id).checked
		});

	if (o.id === "barColor")
		o.checked
			? (document.getElementById("barColorPicker").disabled = false)
			: (document.getElementById("barColorPicker").disabled = true);
}

function restoreOptions() {
	for (const o of options) {
		browser.storage.local.get(o.id).then(res => {
			// have to check typeof because of false
			if (typeof res[o.id] !== "undefined") {
				o.id === "barColorPicker"
					? (document.getElementById(o.id).value = res[o.id])
					: (document.getElementById(o.id).checked = res[o.id]);

				if (o.id === "barColor" && res[o.id] === false)
					document.getElementById("barColorPicker").disabled = true;
			} else {
				// defaults
				document.getElementById(o.id).checked = true;
				document.getElementById("barColorPicker").value = "#b90000";
			}
		});
	}
}

document.addEventListener("DOMContentLoaded", restoreOptions);

for (const o of options) {
	// save immediately when changed
	o.addEventListener("change", option => saveOptions(option.target));
}

// i18n of options menu
const _ = browser.i18n.getMessage;
const labels = document.getElementsByTagName("label");
for (const l of labels) l.textContent = _(l.htmlFor);
