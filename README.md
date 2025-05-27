# DOCX to PDF Converter API

A Node.js API that converts DOCX files to PDF while preserving formatting.

## Features

- Converts DOCX files to PDF via a POST endpoint
- No dependencies on LibreOffice or other Office software
- Uses mammoth for DOCX to HTML conversion
- Uses puppeteer for HTML to PDF rendering

## Prerequisites

- Node.js 16+
- npm or yarn
- Google Chrome installed (for Puppeteer)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ashutoshvjti/docx2pdf-node.git
   cd docx2pdf-node
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server runs on port 3000 by default. Set the `PORT` environment variable to change this.

## API Usage

### Convert DOCX to PDF

**Endpoint:** `POST /convert`

**Request:**
- Content-Type: `multipart/form-data`
- Form field: `file` (DOCX file)

**cURL Example:**
```bash
curl -X POST \
  http://localhost:3000/convert \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@/path/to/document.docx' \
  --output document.pdf
```

**Response:**
- Content-Type: `application/pdf`
- Body: PDF file as binary data

## Troubleshooting

If you encounter issues with Puppeteer failing to launch Chrome:

1. Make sure Chrome is installed on your system
2. Install with `PUPPETEER_SKIP_DOWNLOAD=true npm install`

## License

ISC 