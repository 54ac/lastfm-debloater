const options = document.getElementsByClassName("option");

const saveOptions = (o) => {
	if (o.id === "barColorPicker")
		browser.storage.local.set({
			[o.id]: document.getElementById(o.id).value
		});
	else
		browser.storage.local.set({
			[o.id]: document.getElementById(o.id).checked
		});

	if (o.id === "barColor" && o.checked) {
		document.getElementById("barColorPicker").disabled = false;
		document.getElementById("barColorDefault").disabled = false;
	} else if (o.id === "barColor" && !o.checked) {
		document.getElementById("barColorPicker").disabled = true;
		document.getElementById("barColorDefault").disabled = true;
	}
};

const restoreOptions = () => {
	for (const o of options) {
		browser.storage.local.get(o.id).then((res) => {
			// have to check typeof because of false
			if (typeof res[o.id] !== "undefined") {
				o.id === "barColorPicker"
					? (document.getElementById(o.id).value = res[o.id])
					: (document.getElementById(o.id).checked = res[o.id]);

				if (o.id === "barColor" && res[o.id] === false) {
					document.getElementById("barColorPicker").disabled = true;
					document.getElementById("barColorDefault").disabled = true;
				}
			}
			// defaults
			else if (o.id === "barColorPicker")
				document.getElementById("barColorPicker").value = "#b90000";
			else if (
				o.id === "barColor" ||
				o.id === "barFontInvert" ||
				o.id === "fontSize" ||
				o.id === "timestampSwap"
			)
				document.getElementById(o.id).checked = false;
			else document.getElementById(o.id).checked = true;
		});
	}
};

document.addEventListener("DOMContentLoaded", restoreOptions);

for (const o of options) {
	// save immediately when changed
	o.addEventListener("change", (option) => saveOptions(option.target));
}

document.getElementById("barColorDefault").addEventListener("click", (e) => {
	e.preventDefault();
	document.getElementById("barColorPicker").value = "#b90000";
	saveOptions(document.getElementById("barColorPicker"));
});

// i18n of options menu
const _ = browser.i18n.getMessage;
const labels = document.getElementsByTagName("label");
for (const l of labels) l.textContent = _(l.htmlFor);
const buttons = document.getElementsByTagName("button");
for (const b of buttons) b.textContent = _(b.id);
