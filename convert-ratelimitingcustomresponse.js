import fs from 'fs';

const filePath = process.argv[2];

if (!fs.existsSync(filePath)) {
  console.error('File not found');
  process.exit(1);
}

fs.copyFileSync(filePath, `${filePath}.bak`);

const responseFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const response = {
  statusCode: responseFile.responseCode,
  headers: responseFile.responseHeaders,
  body: responseFile.responseBody
}

fs.writeFileSync(filePath, JSON.stringify(response, null, 2));