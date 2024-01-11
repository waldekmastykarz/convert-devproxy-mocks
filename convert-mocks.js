import fs from 'fs';

const filePath = process.argv[2];

if (!fs.existsSync(filePath)) {
  console.error('File not found');
  process.exit(1);
}

fs.copyFileSync(filePath, `${filePath}.bak`);

const responsesFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const mocksFile = { mocks: [] };
// < v0.14 -> v0.14-beta.5
if (responsesFile.responses) {
  mocksFile.mocks = responsesFile.responses.map(response => {
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
  });
}
// v0.14-beta.5 -> v0.14-beta.6
else {
  mocksFile.mocks = responsesFile.mocks.map(mock => {
    return {
      request: mock.request,
      response: {
        statusCode: mock.response.statusCode,
        headers: mock.response.headers ? Object.getOwnPropertyNames(mock.response.headers).map(headerName => {
          return {
            name: headerName,
            value: mock.response.headers[headerName]
          }
        }) : undefined,
        body: mock.response.body
      }
    }
  });
}

fs.writeFileSync(filePath, JSON.stringify(mocksFile, null, 2));