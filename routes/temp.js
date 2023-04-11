// split.pdf.js
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
var appRoot = require("app-root-path");

const splitPDF = async (pdfFilePath, outputDirectory, separatePage, fileNameSave) => {
  const writePdf = await PDFDocument.create();
  var pdfA = await PDFDocument.load(fs.readFileSync(pdfFilePath));
  console.log(pdfA);
  var pageMerge = [];
  for (var i = 0; i < separatePage; i++){
    pageMerge.push(i);
  }
  console.log(pageMerge);

  var copiedPagesA = await writePdf.copyPages(pdfA, pageMerge);
  copiedPagesA.forEach((page) => writePdf.addPage(page));
  const bytes = await writePdf.save();
  const outputPath2 = path.join(outputDirectory, `${fileNameSave}_sub.pdf`);
  await fs.promises.writeFile(outputPath2, bytes)
  
};

splitPDF("D:\\CTU\\4.HKII\\4.An-toan-he-thong\\Thuc-hanh\\_Yêu Cầu Thực Hành\\LAB-02-FootPrinting.pdf", appRoot + '/public/uploads/ebookPDF', 3, 'test_pdf')
.then(() =>
  console.log('All invoices have been split!')
)
.catch(console.error)