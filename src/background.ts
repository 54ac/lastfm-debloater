import calculateStyles from "./components/calculateStyles";
import { Options, defaults } from "./components/defaults";
import { getAllStorage, setStorage } from "./components/storage";

const init = async () => {
	const optionsStorage = (await getAllStorage()) as Options;

	//initialize default settings
	Object.keys(defaults).forEach(async (key) => {
		if (
			optionsStorage === null ||
			optionsStorage[key as keyof Options] === undefined
		)
			if (key === "styles") calculateStyles();
			else
				await setStorage({
					[key]: defaults[key as keyof Options]
				});
	});
};
init();

chrome.runtime.onMessage.addListener(
	(message: { action: string }) =>
		message.action === "openOptions" && chrome.runtime.openOptionsPage()
);
