import { promises as fs } from 'fs';
import * as path from 'path';
import { marked } from 'marked';

async function convertMarkdownToHTML(inputFile: string, outputFile: string) {
    const markdown = await fs.readFile(inputFile, 'utf-8');
    const content = marked(markdown);

    // componentsフォルダのパスを正しく指定
    const headerPath = path.join(__dirname, '../../src/components/header.html');
    const footerPath = path.join(__dirname, '../../src/components/footer.html');

    const header = await fs.readFile(headerPath, 'utf-8');
    const footer = await fs.readFile(footerPath, 'utf-8');

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${path.basename(inputFile, '.md')}</title>
    <link rel="stylesheet" href="../../styles/style.css">
</head>
<body>
    ${header}
    <main>
        ${content}
    </main>
    ${footer}
</body>
</html>`;

    await fs.writeFile(outputFile, html, 'utf-8');
    console.log(`Converted ${inputFile} to ${outputFile}`);
}

async function main() {
    const blogDir = path.join(__dirname, '../../blog');
    const outputDir = path.join(__dirname, '../../public/blog');

    await fs.mkdir(outputDir, { recursive: true });

    const files = await fs.readdir(blogDir);
    for (const file of files) {
        if (path.extname(file) === '.md') {
            const inputFile = path.join(blogDir, file);
            const outputFile = path.join(outputDir, path.basename(file, '.md') + '.html');
            await convertMarkdownToHTML(inputFile, outputFile);
        }
    }
}

main().catch(console.error);
