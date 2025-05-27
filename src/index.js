import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { docxToPdf } from './services/converter.js';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Serve UI from root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/convert', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      logger.warn('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    if (!req.file.mimetype.includes('docx') && !req.file.originalname.endsWith('.docx')) {
      logger.warn(`Invalid file type: ${req.file.mimetype}`);
      return res.status(400).json({ error: 'Invalid file type. Only DOCX files are accepted' });
    }
    
    logger.info(`Processing file: ${req.file.originalname} (${req.file.size} bytes)`);
    
    const pdfBuffer = await docxToPdf(req.file.buffer);
    
    const filename = req.file.originalname.replace(/\.docx$/, '.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    logger.info(`Conversion successful. Sending PDF: ${filename}`);
    res.send(pdfBuffer);
  } catch (error) {
    logger.error(`Error in conversion: ${error.message}`);
    res.status(500).json({ error: 'Failed to convert document' });
  }
});

app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Open http://localhost:${PORT} in your browser to use the converter`);
}); 