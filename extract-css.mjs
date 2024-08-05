import fs from "fs-extra";
import globPkg from "glob";
import path from "path";

const { glob } = globPkg;

// Define the path to your source files and the output CSS file
const srcPath = "src/components/**/*.js"; // Adjusted to match your directory structure
const outputCssPath = "src/styles/common.css"; // Adjusted to place the CSS in the styles directory

// Regular expression to match styled-components
const styledComponentRegex = /const\s+(\w+)\s*=\s*styled\.\w+\s*`([^`]+)`/g;

// Function to extract and consolidate CSS
async function extractCss() {
  // Find all JavaScript files in the source path
  const files = await new Promise((resolve, reject) => {
    glob(srcPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });

  let consolidatedCss = "";
  let updatedFiles = [];

  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    let match;
    let updatedContent = content;

    // Extract styled-components and generate class names
    while ((match = styledComponentRegex.exec(content)) !== null) {
      const [fullMatch, componentName, css] = match;
      const className = componentName.toLowerCase();
      consolidatedCss += `.${className} {${css}}\n`;
      updatedContent = updatedContent.replace(
        fullMatch,
        `const ${componentName} = styled.div\`\`;\n`
      );
      updatedContent = updatedContent.replace(
        new RegExp(`<${componentName}([^>]*)>`, "g"),
        `<div className="${className}"$1>`
      );
      updatedContent = updatedContent.replace(
        new RegExp(`</${componentName}>`, "g"),
        `</div>`
      );
    }

    if (consolidatedCss) {
      // Add import statement for common.css after the last existing import statement
      const importStatement = "import '../../styles/common.css';\n";
      const importRegex = /(import\s+.*?;\n)(?!import)/gs;
      if (!updatedContent.includes("import './common.css';")) {
        const match = updatedContent.match(importRegex);
        if (match) {
          const lastImport = match[match.length - 1];
          updatedContent = updatedContent.replace(
            lastImport,
            `${lastImport}${importStatement}`
          );
        } else {
          updatedContent = `${importStatement}${updatedContent}`;
        }
      }

      updatedFiles.push({ file, content: updatedContent });
    }
  }

  // Write the consolidated CSS to the output file
  await fs.outputFile(outputCssPath, consolidatedCss);

  // Update the JavaScript files with the new class names
  for (const { file, content } of updatedFiles) {
    await fs.writeFile(file, content, "utf8");
  }

  console.log("CSS extraction and consolidation complete.");
}

extractCss().catch((error) => {
  console.error("Error extracting CSS:", error);
});
