const { PDFDocument } = require('pdf-lib');
console.log('PDFDocument keys:', Object.keys(PDFDocument.prototype).filter(k => k.toLowerCase().includes('pass') || k.toLowerCase().includes('crypt') || k.toLowerCase().includes('sec')));
