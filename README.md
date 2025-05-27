# DOCX to PDF Converter

Node.js API to convert DOCX files to PDF with formatting preserved.

## Features

- Simple web UI for file uploads
- Convert via POST endpoint
- No LibreOffice dependency
- Uses mammoth and puppeteer

## Setup

1. Clone and install dependencies:
   ```bash
   git clone https://github.com/ashutoshvjti/docx2pdf-node.git
   cd docx2pdf-node
   npm install
   ```

2. Run the server:
   ```bash
   npm start
   ```

The app runs on port 3000 by default.

## Usage

### Web Interface

Open http://localhost:3000 and upload your DOCX files.

### API

```bash
curl -X POST \
  http://localhost:3000/convert \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@/path/to/document.docx' \
  --output document.pdf
```

## Troubleshooting

If Puppeteer fails to launch Chrome:
- Make sure Chrome is installed
- Try `PUPPETEER_SKIP_DOWNLOAD=true npm install`

## License

ISC 