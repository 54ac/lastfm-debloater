import { getAllStorage } from "./storage";
import { Options } from "./defaults";

const calculateStyles = async () => {
	const stylesArr: string[] = [];

	const options = (await getAllStorage()) as Options;

	if (options.artistFirst) {
		stylesArr.push(`
		.chartlist--with-artist:not(.chartlist--with-bar) .chartlist-artist {
			flex-grow: 0 !important;
			width: inherit !important;
		}`);

		stylesArr.push(`
		.chartlist--with-artist:not(.chartlist--with-bar) .chartlist-name {
			width: inherit !important;
		}`);

		stylesArr.push(`
		.chartlist--with-artist.chartlist--with-bar .chartlist-artist {
			flex-grow: 0 !important;
			position: static !important;
			margin-top: inherit !important;
			margin-right: 7.5px !important;
		}`);

		stylesArr.push(`
		.chartlist--with-artist.chartlist--with-bar .chartlist-name {
			margin-bottom: inherit !important;
		}`);
	}

	if (options.squareAvatars)
		stylesArr.push(`
		.avatar::after, .avatar img {
			border-radius: 0 !important;
		}`);

	if (options.compactCharts)
		stylesArr.push(`
		.chartlist-row {
			padding-top: 4px !important;
			padding-bottom: 4px !important;
			min-height: 0 !important;
		}`);

	if (options.barColor)
		stylesArr.push(`
		.chartlist-count-bar-slug {
			background-color: ${options.barColorPicker} !important;
		}`);

	if (options.barFontInvert) {
		stylesArr.push(`
		.chartlist-count-bar-value {
			color: #ffffff !important;
		}`);

		if (options.barColor)
			stylesArr.push(`
		.chartlist-count-bar-link {
			background-color: ${options.barColorPicker} !important;
		}`);
	}

	if (options.scrobbleText)
		stylesArr.push(`
		.stat-name {
			display: none !important;
		}`);

	if (options.fontWeight)
		stylesArr.push(`
		.chartlist-name {
			font-weight: inherit !important;
		}`);

	if (options.compactArtistHeader) {
		stylesArr.push(`
		.artist-header-featured-item {
			margin-top: 16px !important;
		}`);

		stylesArr.push(`
		.header-new-content {
			padding-top: 16px !important;
			padding-bottom: 16px !important;
		}`);
	}

	if (options.fontFamily)
		stylesArr.push(`
		body {
			font-family: Open Sans, Lucida Grande, Helvetica Neue, Helvetica, Arial, sans-serif !important;
		}`);

	if (options.fontColor)
		stylesArr.push(`
		body {
			color: #000000 !important;
		}`);

	if (options.fontSize)
		stylesArr.push(`
		body {
			font-size: 16px !important;
		}`);

	if (options.wideColumn) {
		stylesArr.push(`
		.page-content, .page-content .row .col-main {
			width: 100% !important;
		}`);

		stylesArr.push(`
		.page-content .row {
			display: flex !important;
		}`);

		stylesArr.push(`
		.page-content .row .col-main .col-sidebar {
			flex-shrink: 0 !important;
		}`);
	}

	return stylesArr;
};

export default calculateStyles;
