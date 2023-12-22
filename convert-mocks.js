import fs from 'fs';

const filePath = process.argv[2];

if (!fs.existsSync(filePath)) {
  console.error('File not found');
  process.exit(1);
}

fs.copyFileSync(filePath, `${filePath}.bak`);

const responsesFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const mocks = {
  mocks: responsesFile.responses.map(response => {
    return {
      request: {
        url: response.url,
        method: response.method,
        nth: response.nth
      },
      response: {
        statusCode: response.responseCode,
        headers: response.responseHeaders,
        body: response.responseBody,
      }
    }
  })
};

fs.writeFileSync(filePath, JSON.stringify(mocks, null, 2));