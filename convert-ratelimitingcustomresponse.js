import fs from 'fs';

const filePath = process.argv[2];

if (!fs.existsSync(filePath)) {
  console.error('File not found');
  process.exit(1);
}

fs.copyFileSync(filePath, `${filePath}.bak`);

const responseFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
let response;
// < v0.14 -> v0.14-beta.5
if (responseFile.responseHeaders) {
  response = {
    statusCode: responseFile.responseCode,
    headers: responseFile.responseHeaders,
    body: responseFile.responseBody
  }
}
// v0.14-beta.5 -> v0.14-beta.6
else {
  response = {
    statusCode: responseFile.statusCode,
    headers: Object.getOwnPropertyNames(responseFile.headers).map(headerName => {
      return {
        name: headerName,
        value: responseFile.headers[headerName]
      }
    }),
    body: responseFile.body
  }
}

fs.writeFileSync(filePath, JSON.stringify(response, null, 2));