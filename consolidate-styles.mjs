import fs from "fs-extra";
import path from "path";
import postcss from "postcss";
import safeParser from "postcss-safe-parser";
import { globby } from "globby";

// Define paths
const cssFilePath = path.join("src", "styles", "common.scss"); // Path to your CSS file
const jsFilesPath = path.join("src", "components", "**", "*.js"); // Path to your JS files

// Function to find and consolidate duplicate styles
async function findAndConsolidateDuplicates() {
  try {
    // Read the CSS content
    const cssContent = await fs.readFile(cssFilePath, "utf8");
    const root = postcss.parse(cssContent, { parser: safeParser });

    const selectorMap = new Map();
    const duplicateSelectors = new Map();

    // Map selectors to their declarations
    root.walkRules((rule) => {
      const selector = rule.selector;
      const declarations = rule.nodes.map((node) => node.toString()).join("; ");

      if (selectorMap.has(declarations)) {
        const existingSelectors = selectorMap.get(declarations);
        existingSelectors.push(selector);
        selectorMap.set(declarations, existingSelectors);
      } else {
        selectorMap.set(declarations, [selector]);
      }
    });

    // Find duplicate selectors
    selectorMap.forEach((selectors, declarations) => {
      if (selectors.length > 1) {
        duplicateSelectors.set(selectors, declarations);
      }
    });

    // Consolidate duplicate selectors
    let consolidatedCss = "";
    const updatedSelectorsMap = new Map();

    duplicateSelectors.forEach((declarations, selectors) => {
      const consolidatedSelector = selectors.join(", ");
      consolidatedCss += `${consolidatedSelector} {${declarations}}\n`;
      selectors.forEach((selector) => {
        updatedSelectorsMap.set(selector, consolidatedSelector);
      });
    });

    // Write the consolidated CSS to the output file
    await fs.outputFile(cssFilePath, consolidatedCss);

    // Update JavaScript files with the new class names
    const jsFiles = await globby(jsFilesPath);
    for (const file of jsFiles) {
      let content = await fs.readFile(file, "utf8");
      updatedSelectorsMap.forEach((consolidatedSelector, originalSelector) => {
        const originalClassName = originalSelector.replace(".", "");
        const consolidatedClassName = consolidatedSelector
          .split(", ")[0]
          .replace(".", "");
        const regex = new RegExp(`\\b${originalClassName}\\b`, "g");
        content = content.replace(regex, consolidatedClassName);
      });
      await fs.writeFile(file, content, "utf8");
    }

    console.log(
      "Duplicate styles consolidated and class names updated in JavaScript files."
    );
  } catch (error) {
    console.error("Error consolidating styles:", error);
  }
}

findAndConsolidateDuplicates();
