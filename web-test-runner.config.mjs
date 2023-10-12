import { fromRollup } from "@web/dev-server-rollup";
import { esbuildPlugin } from "@web/dev-server-esbuild";
import _commonjs from "@rollup/plugin-commonjs";
import { playwrightLauncher } from "@web/test-runner-playwright";

const commonjs = fromRollup(_commonjs);

export default {
    files: "src/**/*.test.ts",
    browsers: [
        playwrightLauncher({ product: "chromium" }),
        playwrightLauncher({ product: "firefox" }),
        playwrightLauncher({ product: "webkit" }),
    ],
    nodeResolve: { browser: true },
    plugins: [commonjs(), esbuildPlugin({ ts: true })],
};
