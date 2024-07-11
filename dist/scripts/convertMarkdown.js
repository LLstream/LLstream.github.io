"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = __importStar(require("path"));
const marked_1 = require("marked");
function convertMarkdownToHTML(inputFile, outputFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const markdown = yield fs_1.promises.readFile(inputFile, 'utf-8');
        const content = (0, marked_1.marked)(markdown);
        // componentsフォルダのパスを正しく指定
        const headerPath = path.join(__dirname, '../../src/components/header.html');
        const footerPath = path.join(__dirname, '../../src/components/footer.html');
        const header = yield fs_1.promises.readFile(headerPath, 'utf-8');
        const footer = yield fs_1.promises.readFile(footerPath, 'utf-8');
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
        yield fs_1.promises.writeFile(outputFile, html, 'utf-8');
        console.log(`Converted ${inputFile} to ${outputFile}`);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const blogDir = path.join(__dirname, '../../blog');
        const outputDir = path.join(__dirname, '../../public/blog');
        yield fs_1.promises.mkdir(outputDir, { recursive: true });
        const files = yield fs_1.promises.readdir(blogDir);
        for (const file of files) {
            if (path.extname(file) === '.md') {
                const inputFile = path.join(blogDir, file);
                const outputFile = path.join(outputDir, path.basename(file, '.md') + '.html');
                yield convertMarkdownToHTML(inputFile, outputFile);
            }
        }
    });
}
main().catch(console.error);
