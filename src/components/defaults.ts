export type Options = {
	artistFirst: boolean;
	squareAvatars: boolean;
	compactCharts: boolean;
	compactArtistHeader: boolean;
	barColor: boolean;
	barColorPicker: string;
	barFontInvert: boolean;
	fontFamily: boolean;
	fontColor: boolean;
	fontWeight: boolean;
	fontSize: boolean;
	scrobbleText: boolean;
	timestampSwap: boolean;
	wideColumn: boolean;
};

export const defaults: Options = {
	artistFirst: true,
	squareAvatars: true,
	compactCharts: true,
	compactArtistHeader: true,
	barColor: false,
	barColorPicker: "#b90000",
	barFontInvert: false,
	fontFamily: true,
	fontColor: true,
	fontWeight: true,
	fontSize: false,
	scrobbleText: true,
	timestampSwap: false,
	wideColumn: true
};
