// vite.config.ts
import { defineConfig } from "file:///C:/Users/Jante/WebstormProjects/Team-S-Production/.yarn/__virtual__/vite-virtual-e439e57f48/0/cache/vite-npm-4.5.1-567bbcf9ff-2ea9c030a5.zip/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Jante/WebstormProjects/Team-S-Production/.yarn/__virtual__/@vitejs-plugin-react-swc-virtual-34362bd81b/0/cache/@vitejs-plugin-react-swc-npm-3.5.0-750c0d5a74-ca3315e200.zip/node_modules/@vitejs/plugin-react-swc/index.mjs";
import eslint from "file:///C:/Users/Jante/WebstormProjects/Team-S-Production/.yarn/__virtual__/vite-plugin-eslint-virtual-1f4e08d8c3/0/cache/vite-plugin-eslint-npm-1.8.1-844ad445f5-65598893e2.zip/node_modules/vite-plugin-eslint/dist/index.mjs";
import * as process from "process";
console.log(process.env.FRONTEND_PORT);
var vite_config_default = defineConfig({
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@mui/material": "@mui/material",
    },
  },
  server: {
    host: "0.0.0.0",
    port: parseInt(process.env.FRONTEND_PORT),
    proxy: {
      "/api": process.env.BACKEND_SOURCE + ":" + process.env.BACKEND_PORT,
    },
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: "build",
  },
  plugins: [react(), eslint()],
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxKYW50ZVxcXFxXZWJzdG9ybVByb2plY3RzXFxcXFRlYW0tUy1Qcm9kdWN0aW9uXFxcXGFwcHNcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEphbnRlXFxcXFdlYnN0b3JtUHJvamVjdHNcXFxcVGVhbS1TLVByb2R1Y3Rpb25cXFxcYXBwc1xcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvSmFudGUvV2Vic3Rvcm1Qcm9qZWN0cy9UZWFtLVMtUHJvZHVjdGlvbi9hcHBzL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgZXNsaW50IGZyb20gXCJ2aXRlLXBsdWdpbi1lc2xpbnRcIjtcbmltcG9ydCAqIGFzIHByb2Nlc3MgZnJvbSBcInByb2Nlc3NcIjtcbmNvbnNvbGUubG9nKHByb2Nlc3MuZW52LkZST05URU5EX1BPUlQpO1xuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJlc29sdmU6IHtcbiAgICBwcmVzZXJ2ZVN5bWxpbmtzOiB0cnVlLFxuICAgIGFsaWFzOiB7XG4gICAgICBcIkBtdWkvbWF0ZXJpYWxcIjogXCJAbXVpL21hdGVyaWFsXCIsXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCIwLjAuMC4wXCIsXG4gICAgcG9ydDogcGFyc2VJbnQocHJvY2Vzcy5lbnYuRlJPTlRFTkRfUE9SVCksXG4gICAgcHJveHk6IHtcbiAgICAgIFwiL2FwaVwiOiBwcm9jZXNzLmVudi5CQUNLRU5EX1NPVVJDRSArIFwiOlwiICsgcHJvY2Vzcy5lbnYuQkFDS0VORF9QT1JULFxuICAgIH0sXG4gICAgd2F0Y2g6IHtcbiAgICAgIHVzZVBvbGxpbmc6IHRydWUsXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6IFwiYnVpbGRcIixcbiAgfSxcbiAgcGx1Z2luczogW3JlYWN0KCksIGVzbGludCgpXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2WCxTQUFTLG9CQUFvQjtBQUMxWixPQUFPLFdBQVc7QUFDbEIsT0FBTyxZQUFZO0FBQ25CLFlBQVksYUFBYTtBQUN6QixRQUFRLElBQVksWUFBSSxhQUFhO0FBRXJDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLGtCQUFrQjtBQUFBLElBQ2xCLE9BQU87QUFBQSxNQUNMLGlCQUFpQjtBQUFBLElBQ25CO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTSxTQUFpQixZQUFJLGFBQWE7QUFBQSxJQUN4QyxPQUFPO0FBQUEsTUFDTCxRQUFnQixZQUFJLGlCQUFpQixNQUFjLFlBQUk7QUFBQSxJQUN6RDtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsWUFBWTtBQUFBLElBQ2Q7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsU0FBUyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFDN0IsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
