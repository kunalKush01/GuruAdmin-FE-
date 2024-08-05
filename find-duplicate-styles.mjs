import fs from "fs-extra";
import postcss from "postcss";
import safeParser from "postcss-safe-parser";

const cssFilePath = "src/styles/common.css"; // Path to your CSS file

async function findDuplicateStyles() {
  try {
    const cssContent = await fs.readFile(cssFilePath, "utf8");
    const root = postcss.parse(cssContent, { parser: safeParser });

    const selectorMap = new Map();

    root.walkRules((rule) => {
      const selector = rule.selector;
      const declarations = rule.nodes.map((node) => node.toString()).join("; ");

      if (selectorMap.has(selector)) {
        const existingDeclarations = selectorMap.get(selector);
        if (existingDeclarations.includes(declarations)) {
          console.log(`Duplicate style found for selector: ${selector}`);
          console.log(`Declarations: ${declarations}`);
          console.log("-------------------------");
        } else {
          selectorMap.set(selector, [...existingDeclarations, declarations]);
        }
      } else {
        selectorMap.set(selector, [declarations]);
      }
    });

    console.log("Duplicate style detection complete.");
  } catch (error) {
    console.error("Error finding duplicate styles:", error);
  }
}

findDuplicateStyles();
