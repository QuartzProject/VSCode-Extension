// Copies the TextMate grammar and language configuration from a checkout of QuartzProject/Grammars.
import { copyFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const grammars = resolve(process.env.QUARTZ_GRAMMARS ?? process.argv[2] ?? "../Grammars");
const source = join(grammars, "textmate");
if (!existsSync(join(source, "quartz.tmLanguage.json"))) {
    console.error(`no TextMate grammar in ${source}; pass the Grammars checkout as an argument or QUARTZ_GRAMMARS`);
    process.exit(1);
}
copyFileSync(join(source, "quartz.tmLanguage.json"), "syntaxes/quartz.tmLanguage.json");
copyFileSync(join(source, "language-configuration.json"), "language-configuration.json");
console.log(`copied the grammar from ${source}`);
