import mammoth from 'mammoth';
import puppeteer from 'puppeteer';
import logger from '../logger.js';

/**
 * Converts a DOCX file buffer to HTML
 * @param {Buffer} buffer - The DOCX file buffer
 * @returns {Promise<string>} The HTML content
 */
export async function docxToHtml(buffer) {
  try {
    logger.info('Converting DOCX to HTML');
    const result = await mammoth.convertToHtml({ buffer });
    
    if (result.messages.length > 0) {
      for (const message of result.messages) {
        logger.warn(`Mammoth conversion message: ${message.type} - ${message.message}`);
      }
    }
    
    return result.value;
  } catch (error) {
    logger.error(`Error converting DOCX to HTML: ${error.message}`);
    throw new Error('Failed to convert DOCX to HTML');
  }
}

/**
 * Converts HTML content to a PDF buffer
 * @param {string} html - The HTML content
 * @returns {Promise<Buffer>} The PDF file buffer
 */
export async function htmlToPdf(html) {
  let browser = null;
  
  try {
    logger.info('Converting HTML to PDF');
    
    const styledHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              margin: 40px;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 20px;
              margin-bottom: 10px;
            }
            p {
              margin-bottom: 15px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 15px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
            }
            th {
              background-color: #f2f2f2;
            }
            img {
              max-width: 100%;
            }
            @page {
              margin: 40px;
            }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `;
    
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    } catch (error) {
      logger.warn(`Failed to launch browser with default config: ${error.message}`);
      
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: process.platform === 'darwin' 
          ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' 
          : process.platform === 'win32'
            ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
            : '/usr/bin/google-chrome'
      });
    }
    
    const page = await browser.newPage();
    await page.setContent(styledHtml, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '40px', right: '40px', bottom: '40px', left: '40px' }
    });
    
    return pdfBuffer;
  } catch (error) {
    logger.error(`Error converting HTML to PDF: ${error.message}`);
    throw new Error('Failed to convert HTML to PDF');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Converts a DOCX file buffer to a PDF buffer
 * @param {Buffer} buffer - The DOCX file buffer
 * @returns {Promise<Buffer>} The PDF file buffer
 */
export async function docxToPdf(buffer) {
  try {
    logger.info('Starting DOCX to PDF conversion');
    const html = await docxToHtml(buffer);
    const pdfBuffer = await htmlToPdf(html);
    logger.info('DOCX to PDF conversion completed successfully');
    return pdfBuffer;
  } catch (error) {
    logger.error(`DOCX to PDF conversion failed: ${error.message}`);
    throw error;
  }
} 