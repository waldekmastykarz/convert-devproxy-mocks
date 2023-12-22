import fs from 'fs';

const filePath = process.argv[2];

if (!fs.existsSync(filePath)) {
  console.error('File not found');
  process.exit(1);
}

fs.copyFileSync(filePath, `${filePath}.bak`);

const responsesFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
responsesFile.responses.forEach(response => {
  if (!response.addDynamicRetryAfter) {
    return;
  }

  delete response.addDynamicRetryAfter;

  if (!response.headers) {
    response.headers = {};
  }

  response.headers['Retry-After'] = '@dynamic';
});

fs.writeFileSync(filePath, JSON.stringify(responsesFile, null, 2));