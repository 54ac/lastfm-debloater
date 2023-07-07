import { Options, defaults } from "./components/defaults";
import { getAllStorage, setStorage } from "./components/storage";

const init = async () => {
	const optionsStorage = (await getAllStorage()) as Options;

	Object.keys(defaults).forEach(
		(key) =>
			(optionsStorage === null ||
				optionsStorage[key as keyof Options] === null) &&
			setStorage({
				[key]: defaults[key as keyof typeof defaults]
			})
	);
};
init();
