import { BrowserWindow } from "electron";

function UpsertKeyValue(
  obj: Record<string, string[]> | Record<string, string> | undefined,
  keyToChange: string,
  value: string[]
) {
  const keyToChangeLower = keyToChange.toLowerCase();
  if (!obj) {
    return;
  }
  for (const key of Object.keys(obj)) {
    if (key.toLowerCase() === keyToChangeLower) {
      obj[key] = value;
      return;
    }
  }
  obj[keyToChange] = value;
}

const bypassCors = (mainWindow: BrowserWindow) => {
  //Fix CORS
  // mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
  //   (details, callback) => {
  //     const { requestHeaders } = details;
  //     UpsertKeyValue(requestHeaders, 'Access-Control-Allow-Origin', ['*']);
  //     callback({ requestHeaders });
  //   },
  // );

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const { responseHeaders } = details;
    UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Origin', ['*']);
    UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Headers', ['*']);
    UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Methods', ['GET,PUT,POST,DELETE,OPTIONS']);
    callback({
      responseHeaders,
    });
  });
}

export default bypassCors