import { renderToString, h, JSX } from "../deps.ts";
import { createCSSProcessor } from "./css.ts";
import HTMLDocument from "./components/HtmlDocument.tsx";

const cssProcessor = createCSSProcessor();

export async function renderToHtml(body: JSX.Element) {
  const bodyHtml = renderToString(body);
  const css = await cssProcessor.generate(bodyHtml);
  const purgedCss = await cssProcessor.purge(bodyHtml, css);

  const doc = <HTMLDocument body={bodyHtml} styles={purgedCss.map((p) => p.css)} />;

  return `<!DOCTYPE html>\n${renderToString(doc)}`;
}
