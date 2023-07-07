import { setStorage, getAllStorage } from "./components/storage";
import { Options, defaults } from "./components/defaults";

const optionEls = Array.from(
	document.getElementsByClassName("option")
) as HTMLInputElement[];

const updateVisibility = (el: HTMLInputElement) => {
	const dataEl = Array.from(
		document.querySelectorAll(`[data-parent="${el.id}"]`)
	) as HTMLElement[];
	dataEl.forEach((d) => (d.style.visibility = el.checked ? "" : "hidden"));
};

const saveOption = async (o: HTMLInputElement) => {
	if (o.type === "checkbox") updateVisibility(o);

	if (o.type === "checkbox")
		await setStorage({
			[o.id]: o.checked
		});
	else
		await setStorage({
			[o.id]: o.value
		});
};

const restoreOptions = async () => {
	const optionsStorage = (await getAllStorage()) as Options;
	optionEls.forEach((o: HTMLInputElement) => {
		const el = document.getElementById(o.id) as HTMLInputElement;
		if (!el) return;

		const optionStorage = optionsStorage[o.id as keyof Options];
		if (optionStorage === undefined) return;

		if (typeof optionStorage === "boolean") el.checked = optionStorage;
		else if (typeof optionStorage === "string") el.value = optionStorage;

		if (o.type === "checkbox") updateVisibility(o);

		el.onchange = (e) => saveOption(e.target as HTMLInputElement);
	});
};
restoreOptions();

const barColorDefaultButton = document.getElementById("barColorDefault");
if (barColorDefaultButton)
	barColorDefaultButton.onclick = () => {
		const barColorPicker = document.getElementById(
			"barColorPicker"
		) as HTMLInputElement;
		if (!barColorPicker) return;

		barColorPicker.value = defaults.barColorPicker;
		saveOption(barColorPicker);
	};

const _ = chrome.i18n.getMessage;

const labelEl = Array.from(
	document.getElementsByTagName("label")
) as HTMLLabelElement[];
labelEl.forEach((l) => l.htmlFor && (l.textContent = _(l.htmlFor)));

const buttonEl = Array.from(
	document.getElementsByTagName("button")
) as HTMLButtonElement[];
buttonEl.forEach((o) => o.id && (o.textContent = _(o.id)));
