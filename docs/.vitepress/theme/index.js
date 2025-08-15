import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import HomeFrame from "./components/HomeFrame.vue";
import "./theme.css";

export default {
	extends: DefaultTheme,
	Layout() {
		return h(DefaultTheme.Layout, null, {
			"home-features-after": () => [h(HomeFrame)],
		});
	},
};
