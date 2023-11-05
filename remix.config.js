
/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverDependenciesToBundle: ["@amcharts/amcharts5/percent", "d3-shape", "d3-path", "@amcharts/amcharts5", "svg-arc-to-cubic-bezier", "@amcharts/amcharts5/themes/Responsive", "@amcharts/amcharts5/themes/Animated", "@amcharts/amcharts5/themes/Dark"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  tailwind: true,
  postcss: true,
};
