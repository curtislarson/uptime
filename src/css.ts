import type {
  Preset,
  UserConfig,
} from "https://esm.quack.id/@unocss/core@0.58.0";
import { UnoGenerator } from "https://esm.quack.id/@unocss/core@0.58.0";
import presetTypeography from "https://esm.quack.id/@unocss/preset-typography@0.58.0?bundle";
import presetUno from "https://esm.quack.id/@unocss/preset-uno@0.58.0?bundle";
import { PurgeCSS } from "https://esm.quack.id/purgecss@5.0.0";
import { UNO_RESET_CSS } from "./assets/reset-css.ts";

export function createCSSPurger() {
  const purgecss = new PurgeCSS();
  return async function purge(rawContent: string, rawCss: string[]) {
    return await purgecss.purge({
      content: [{ extension: "html", raw: rawContent }],
      css: rawCss.map((raw) => ({ raw })),
    });
  };
}

export function createCSSProcessor(config?: UserConfig) {
  const uno = new UnoGenerator({
    presets: [
      presetUno(),
      presetTypeography({
        cssExtend: {
          "h1": {
            color: "#BD93F9",
            "font-size": "1.75em",
          },
          "h2,h3,h4,h5": {
            color: "#BD93F9",
            "margin-top": ".5em",
          },
          "a": {
            color: "#8BE9FD",
            "text-decoration-line": "underline",
            cursor: "pointer",
          },
        },
      }),
    ] as unknown as Preset[],
    ...config,
  });
  const purge = createCSSPurger();

  async function generate(body: string) {
    const { css } = await uno.generate(body);
    return [UNO_RESET_CSS, css];
  }

  return {
    purge,
    generate,
  };
}
