#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function parseMarkdown(content) {
    let html = content;
    
    // Basic header parsing
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Unordered lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    
    // Wrap consecutive list items in <ul> tags
    html = html.replace(/(<li>.*<\/li>(\n<li>.*<\/li>)*)/gim, '<ul>$1</ul>');
    
    // Links and images
    html = html.replace(/!\[([^\]]*)\]\(([^\)]+)\)/gim, '<img src="$2" alt="$1">');
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>');
    
    // Bold and italic
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
    
    // Line breaks
    html = html.replace(/\n/gim, '<br>');
    
    return html;
}

function convertFile(inputPath, outputPath) {
    try {
        const content = fs.readFileSync(inputPath, 'utf8');
        const html = parseMarkdown(content);
        
        const cssPath = path.join(__dirname, 'template.css');
        let cssContent = '';
        try {
            cssContent = fs.readFileSync(cssPath, 'utf8');
        } catch (e) {
            // CSS file not found, use default styles
        }
        
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted Document</title>
    <style>
        ${cssContent}
    </style>
</head>
<body>
    ${html}
</body>
</html>`;
        
        fs.writeFileSync(outputPath, fullHtml);
        console.log(`Converted ${inputPath} to ${outputPath}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Basic CLI
const args = process.argv.slice(2);
if (args.length < 1) {
    console.log('Usage: node index.js <input.md> [output.html]');
    process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1] || inputFile.replace('.md', '.html');

convertFile(inputFile, outputFile);