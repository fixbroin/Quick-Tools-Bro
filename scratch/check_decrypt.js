const decryptLib = require('@pdfsmaller/pdf-decrypt');
console.log('Keys of @pdfsmaller/pdf-decrypt:', Object.keys(decryptLib));
console.log('Type of main export:', typeof decryptLib.decryptPDF || typeof decryptLib);
