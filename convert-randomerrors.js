import fs from 'fs';

const filePath = process.argv[2];

if (!fs.existsSync(filePath)) {
  console.error('File not found');
  process.exit(1);
}

fs.copyFileSync(filePath, `${filePath}.bak`);

const responsesFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
responsesFile.responses.forEach(response => {
  let addDynamicRetryAfter = false;

  if (response.addDynamicRetryAfter) {
    addDynamicRetryAfter = true;
    delete response.addDynamicRetryAfter;
  }

  // v0.14-beta.5 -> v0.14-beta.6
  if (response.headers) {
    response.headers = Object.getOwnPropertyNames(response.headers).map(headerName => {
      return {
        name: headerName,
        value: response.headers[headerName]
      }
    });
  }
  else {
    response.headers = [];
  }

  if (addDynamicRetryAfter) {
    response.headers.push({ name: 'Retry-After', value: '@dynamic' });
  }

  if (response.headers.length === 0) {
    delete response.headers;
  }
});

fs.writeFileSync(filePath, JSON.stringify(responsesFile, null, 2));