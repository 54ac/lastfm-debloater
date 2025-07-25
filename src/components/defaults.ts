export interface Options {
	artistFirst: boolean;
	squareAvatars: boolean;
	noImageBorder: boolean;
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
	wideTopTrackTitle: boolean;
	styles: string;
}

export const defaults: Options = {
	artistFirst: true,
	squareAvatars: true,
	noImageBorder: false,
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
	wideColumn: false,
	wideTopTrackTitle: true,
	styles: ""
};
