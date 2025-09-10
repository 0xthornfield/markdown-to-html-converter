#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function parseMarkdown(content) {
    let html = content;
    
    // Basic header parsing
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
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
        
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted Document</title>
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