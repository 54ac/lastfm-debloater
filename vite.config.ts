import { defineConfig } from "vite";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import eslint from "vite-plugin-eslint";

function generateManifest() {
	const manifest = readJsonFile("src/manifest.json");
	const pkg = readJsonFile("package.json");
	return {
		version: pkg.version,
		...manifest
	};
}

export default defineConfig({
	plugins: [
		eslint(),
		webExtension({
			manifest: generateManifest,
			watchFilePaths: ["package.json", "manifest.json"],
			browser: process.env.TARGET,
			webExtConfig: {
				startUrl: "about:addons"
			}
		})
	],
	build: {
		outDir: process.env.TARGET === "firefox" ? "dist-firefox" : "dist-chrome",
		emptyOutDir: true
	}
});
