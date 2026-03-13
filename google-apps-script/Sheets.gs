/**
 * Google Sheets read/write utility functions
 */

// Cache the spreadsheet reference
var _spreadsheet = null;

function getSpreadsheet() {
  if (!_spreadsheet) {
    var props = PropertiesService.getScriptProperties();
    var sheetId = props.getProperty('SPREADSHEET_ID');

    if (sheetId) {
      _spreadsheet = SpreadsheetApp.openById(sheetId);
    } else {
      // Fallback: use the active spreadsheet (when bound to a sheet)
      _spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }
  }
  return _spreadsheet;
}

/**
 * Read all data from a sheet and return as array of objects
 * Uses first row as header/keys
 */
function getSheetData(sheet) {
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  var headers = data[0];
  var result = [];

  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      var val = data[i][j];
      // Convert Date objects to ISO strings
      if (val instanceof Date) {
        val = val.toISOString();
      }
      row[headers[j]] = val;
    }
    // Skip empty rows
    if (row.id || row.pageId || row.date || row.key) {
      result.push(row);
    }
  }

  return result;
}

/**
 * Find row index by ID (column A)
 * Returns 1-based row number or -1 if not found
 */
function findRowById(sheet, id) {
  var data = sheet.getRange('A:A').getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) return i + 1;
  }
  return -1;
}

/**
 * Get column index by header name
 * Returns 1-based column number or -1 if not found
 */
function getColumnByHeader(sheet, headerName) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var idx = headers.indexOf(headerName);
  return idx >= 0 ? idx + 1 : -1;
}

/**
 * String.padStart polyfill for older GAS runtime
 */
if (!String.prototype.padStart) {
  String.prototype.padStart = function(targetLength, padString) {
    targetLength = targetLength >> 0;
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (this.length >= targetLength) return String(this);
    targetLength = targetLength - this.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length);
    }
    return padString.slice(0, targetLength) + String(this);
  };
}
