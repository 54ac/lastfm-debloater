const options = document.getElementsByClassName("option");

function saveOptions(o) {
	if (o.id === "barColorPicker") {
		browser.storage.sync.set({
			[o.id]: document.getElementById(o.id).value
		});
	} else {
		browser.storage.sync.set({
			[o.id]: document.getElementById(o.id).checked
		});
	}
	if (o.id === "barColor") {
		if (o.checked) {
			document.getElementById("barColorPicker").disabled = false;
		} else {
			document.getElementById("barColorPicker").disabled = true;
		}
	}
}

function restoreOptions() {
	for (let o of options) {
		browser.storage.sync.get(o.id).then(res => {
			//have to check typeof because of false
			if (typeof res[o.id] !== "undefined") {
				if (o.id === "barColorPicker") {
					document.getElementById(o.id).value = res[o.id];
				} else {
					document.getElementById(o.id).checked = res[o.id];
				}
				if (o.id === "barColor" && res[o.id] === false)
					document.getElementById("barColorPicker").disabled = true;
			} else {
				//defaults
				document.getElementById(o.id).checked = true;
				document.getElementById("barColorPicker").value = "#b90000";
			}
		});
	}
}

document.addEventListener("DOMContentLoaded", restoreOptions);

for (let o of options) {
	//save immediately when changed
	o.addEventListener("change", o => saveOptions(o.target));
}

//i18n of options menu
const _ = browser.i18n.getMessage;
const labels = document.getElementsByTagName("label");
for (let l of labels) {
	l.textContent = _(l.htmlFor);
}
