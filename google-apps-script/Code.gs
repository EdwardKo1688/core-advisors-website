/**
 * Core Consultant - Google Apps Script API
 * Main router for all API endpoints
 */

// ===== CORS & Response Helpers =====

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function errorResponse(message, code) {
  return jsonResponse({ success: false, error: message, code: code || 400 });
}

// ===== Main Routers =====

function doPost(e) {
  try {
    var action = e.parameter.action;
    var data = JSON.parse(e.postData.contents || '{}');

    switch (action) {
      // Public
      case 'submitAssessment':
        return submitAssessment(data);
      case 'submitBooking':
        return submitBooking(data);
      // Auth
      case 'login':
        return handleLogin(data);
      // Admin (require auth)
      case 'updateAssessmentStatus':
        return requireAuth(e, function() { return updateAssessmentStatus(data); });
      case 'updateBookingStatus':
        return requireAuth(e, function() { return updateBookingStatus(data); });
      case 'updateSlots':
        return requireAuth(e, function() { return updateSlots(data); });
      case 'updateCmsContent':
        return requireAuth(e, function() { return updateCmsContent(data); });
      case 'changePassword':
        return requireAuth(e, function() { return changePassword(data); });
      default:
        return errorResponse('Unknown action: ' + action);
    }
  } catch (err) {
    return errorResponse('Server error: ' + err.message, 500);
  }
}

function doGet(e) {
  try {
    var action = e.parameter.action;

    switch (action) {
      // Public
      case 'getAvailableSlots':
        return getAvailableSlots(e.parameter);
      case 'getCmsContent':
        return getCmsContent(e.parameter);
      // Admin (require auth)
      case 'getAssessments':
        return requireAuth(e, function() { return getAssessments(e.parameter); });
      case 'getAssessmentById':
        return requireAuth(e, function() { return getAssessmentById(e.parameter); });
      case 'getDashboardStats':
        return requireAuth(e, function() { return getDashboardStats(); });
      case 'getBookings':
        return requireAuth(e, function() { return getBookings(e.parameter); });
      case 'exportAssessments':
        return requireAuth(e, function() { return exportAssessments(e.parameter); });
      case 'ping':
        return jsonResponse({ success: true, message: 'API is running' });
      default:
        return errorResponse('Unknown action: ' + action);
    }
  } catch (err) {
    return errorResponse('Server error: ' + err.message, 500);
  }
}

// ===== Assessment Endpoints =====

function submitAssessment(data) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('assessments');

  var id = Utilities.getUuid();
  var timestamp = new Date().toISOString();

  // Calculate dimension scores (simple average of 5 questions per dimension)
  var dims = calculateDimensionScores(data.answers || {});
  var totalScore = Math.round(dims.reduce(function(a, b) { return a + b; }, 0) / 6);
  var maturityLevel = getMaturityLevel(totalScore);

  var row = [
    id, timestamp,
    data.companyName || '', data.industry || '', data.companySize || '',
    data.department || '', data.userName || '', data.jobTitle || '',
    data.userEmail || '', data.userPhone || ''
  ];

  // Add q1-q30 answers
  for (var i = 1; i <= 30; i++) {
    var ans = data.answers ? data.answers['q' + i] : '';
    row.push(Array.isArray(ans) ? ans.join(', ') : (ans || ''));
  }

  row.push(totalScore, maturityLevel);
  row.push.apply(row, dims); // dim1-dim6
  row.push('new'); // status

  sheet.appendRow(row);

  return jsonResponse({
    success: true,
    id: id,
    totalScore: totalScore,
    maturityLevel: maturityLevel,
    dimensionScores: dims
  });
}

function getAssessments(params) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('assessments');
  var data = getSheetData(sheet);

  // Filter
  if (params.search) {
    var search = params.search.toLowerCase();
    data = data.filter(function(row) {
      return (row.companyName || '').toLowerCase().indexOf(search) >= 0 ||
             (row.userName || '').toLowerCase().indexOf(search) >= 0 ||
             (row.userEmail || '').toLowerCase().indexOf(search) >= 0;
    });
  }
  if (params.industry && params.industry !== 'all') {
    data = data.filter(function(row) { return row.industry === params.industry; });
  }
  if (params.status && params.status !== 'all') {
    data = data.filter(function(row) { return row.status === params.status; });
  }

  // Sort by timestamp desc
  data.sort(function(a, b) {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  // Pagination
  var page = parseInt(params.page) || 1;
  var limit = parseInt(params.limit) || 20;
  var total = data.length;
  var start = (page - 1) * limit;
  var paged = data.slice(start, start + limit);

  return jsonResponse({
    success: true,
    data: paged,
    total: total,
    page: page,
    totalPages: Math.ceil(total / limit)
  });
}

function getAssessmentById(params) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('assessments');
  var data = getSheetData(sheet);
  var record = data.filter(function(r) { return r.id === params.id; })[0];

  if (!record) return errorResponse('Record not found', 404);
  return jsonResponse({ success: true, data: record });
}

function updateAssessmentStatus(data) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('assessments');
  var allData = sheet.getDataRange().getValues();

  for (var i = 1; i < allData.length; i++) {
    if (allData[i][0] === data.id) {
      var statusCol = allData[0].indexOf('status') + 1;
      if (statusCol > 0) {
        sheet.getRange(i + 1, statusCol).setValue(data.status);
        return jsonResponse({ success: true });
      }
    }
  }
  return errorResponse('Record not found', 404);
}

function exportAssessments(params) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('assessments');
  var allData = sheet.getDataRange().getValues();

  if (allData.length === 0) return jsonResponse({ success: true, csv: '' });

  var csv = allData.map(function(row) {
    return row.map(function(cell) {
      var str = String(cell);
      if (str.indexOf(',') >= 0 || str.indexOf('"') >= 0 || str.indexOf('\n') >= 0) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    }).join(',');
  }).join('\n');

  return jsonResponse({ success: true, csv: csv });
}

// ===== Booking Endpoints =====

function submitBooking(data) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('bookings');

  var id = Utilities.getUuid();
  var timestamp = new Date().toISOString();

  sheet.appendRow([
    id, timestamp,
    data.name || '', data.email || '', data.phone || '',
    data.company || '', data.date || '', data.timeSlot || '',
    data.topic || '', data.message || '', 'pending'
  ]);

  return jsonResponse({ success: true, id: id });
}

function getBookings(params) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('bookings');
  var data = getSheetData(sheet);

  if (params.status && params.status !== 'all') {
    data = data.filter(function(row) { return row.status === params.status; });
  }

  data.sort(function(a, b) {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return jsonResponse({ success: true, data: data });
}

function updateBookingStatus(data) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('bookings');
  var allData = sheet.getDataRange().getValues();

  for (var i = 1; i < allData.length; i++) {
    if (allData[i][0] === data.id) {
      var statusCol = allData[0].indexOf('status') + 1;
      if (statusCol > 0) {
        sheet.getRange(i + 1, statusCol).setValue(data.status);
        return jsonResponse({ success: true });
      }
    }
  }
  return errorResponse('Booking not found', 404);
}

function getAvailableSlots(params) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('available_slots');
  var data = getSheetData(sheet);

  var month = params.month; // e.g., "2026-03"
  if (month) {
    data = data.filter(function(row) {
      return row.date && row.date.indexOf(month) === 0 && row.isAvailable === true;
    });
  }

  // Also check existing bookings to remove taken slots
  var bookingsSheet = ss.getSheetByName('bookings');
  var bookings = getSheetData(bookingsSheet);
  var takenSlots = {};
  bookings.forEach(function(b) {
    if (b.status !== 'cancelled') {
      takenSlots[b.date + '_' + b.timeSlot] = true;
    }
  });

  data = data.filter(function(slot) {
    return !takenSlots[slot.date + '_' + slot.timeSlot];
  });

  return jsonResponse({ success: true, data: data });
}

function updateSlots(data) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('available_slots');

  // Clear and rewrite slots
  if (data.slots && Array.isArray(data.slots)) {
    // Clear existing data (keep header)
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, 3).clearContent();
    }

    // Write new slots
    data.slots.forEach(function(slot) {
      sheet.appendRow([slot.date, slot.timeSlot, slot.isAvailable !== false]);
    });
  }

  return jsonResponse({ success: true });
}

// ===== CMS Endpoints =====

function getCmsContent(params) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('cms_content');
  var data = getSheetData(sheet);

  if (params.page) {
    data = data.filter(function(row) { return row.pageId === params.page; });
  }

  return jsonResponse({ success: true, data: data });
}

function updateCmsContent(data) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('cms_content');
  var allData = sheet.getDataRange().getValues();
  var found = false;

  for (var i = 1; i < allData.length; i++) {
    if (allData[i][0] === data.pageId && allData[i][1] === data.sectionId) {
      sheet.getRange(i + 1, 3).setValue(data.content);
      sheet.getRange(i + 1, 4).setValue(new Date().toISOString());
      found = true;
      break;
    }
  }

  if (!found) {
    sheet.appendRow([data.pageId, data.sectionId, data.content, new Date().toISOString()]);
  }

  return jsonResponse({ success: true });
}

// ===== Dashboard =====

function getDashboardStats() {
  var ss = getSpreadsheet();

  // Assessments stats
  var assessSheet = ss.getSheetByName('assessments');
  var assessData = getSheetData(assessSheet);

  var now = new Date();
  var thisMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

  var monthlyCount = assessData.filter(function(r) {
    return r.timestamp && r.timestamp.indexOf(thisMonth) === 0;
  }).length;

  var totalScore = 0;
  var scoreCount = 0;
  assessData.forEach(function(r) {
    if (r.totalScore) { totalScore += Number(r.totalScore); scoreCount++; }
  });

  // Industry distribution
  var industries = {};
  assessData.forEach(function(r) {
    if (r.industry) {
      industries[r.industry] = (industries[r.industry] || 0) + 1;
    }
  });

  // Dimension averages
  var dimTotals = [0, 0, 0, 0, 0, 0];
  var dimCount = 0;
  assessData.forEach(function(r) {
    if (r.dim1Score) {
      dimTotals[0] += Number(r.dim1Score || 0);
      dimTotals[1] += Number(r.dim2Score || 0);
      dimTotals[2] += Number(r.dim3Score || 0);
      dimTotals[3] += Number(r.dim4Score || 0);
      dimTotals[4] += Number(r.dim5Score || 0);
      dimTotals[5] += Number(r.dim6Score || 0);
      dimCount++;
    }
  });

  // Monthly trend (last 6 months)
  var monthlyTrend = [];
  for (var m = 5; m >= 0; m--) {
    var d = new Date(now.getFullYear(), now.getMonth() - m, 1);
    var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    var count = assessData.filter(function(r) {
      return r.timestamp && r.timestamp.indexOf(key) === 0;
    }).length;
    monthlyTrend.push({ month: key, count: count });
  }

  // Bookings stats
  var bookSheet = ss.getSheetByName('bookings');
  var bookData = getSheetData(bookSheet);
  var pendingBookings = bookData.filter(function(r) { return r.status === 'pending'; }).length;

  // Recent activity
  var recent = assessData.slice(-5).reverse().map(function(r) {
    return {
      type: 'assessment',
      company: r.companyName,
      user: r.userName,
      date: r.timestamp,
      score: r.totalScore
    };
  });

  return jsonResponse({
    success: true,
    data: {
      totalAssessments: assessData.length,
      monthlyAssessments: monthlyCount,
      averageScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
      pendingBookings: pendingBookings,
      industries: industries,
      dimensionAverages: dimCount > 0 ? dimTotals.map(function(t) { return Math.round(t / dimCount); }) : [0,0,0,0,0,0],
      monthlyTrend: monthlyTrend,
      recentActivity: recent
    }
  });
}

// ===== Password Change =====

function changePassword(data) {
  var props = PropertiesService.getScriptProperties();
  var currentHash = props.getProperty('ADMIN_PASSWORD_HASH');

  if (data.currentPasswordHash !== currentHash) {
    return errorResponse('Current password incorrect');
  }

  props.setProperty('ADMIN_PASSWORD_HASH', data.newPasswordHash);
  return jsonResponse({ success: true });
}

// ===== Score Calculation Helpers =====

function calculateDimensionScores(answers) {
  // 6 dimensions, 5 questions each (q1-5, q6-10, q11-15, q16-20, q21-25, q26-30)
  var dims = [];
  for (var d = 0; d < 6; d++) {
    var total = 0;
    var count = 0;
    for (var q = 1; q <= 5; q++) {
      var key = 'q' + (d * 5 + q);
      var val = answers[key];
      if (val !== undefined && val !== null && val !== '') {
        if (Array.isArray(val)) {
          // Multi-select: score based on number of selections (more = higher awareness)
          total += Math.min(val.length * 20, 100);
        } else if (!isNaN(val)) {
          // Rating (1-10) or single select (1-5)
          var num = Number(val);
          if (num <= 10) {
            total += num <= 5 ? num * 20 : num * 10;
          }
        } else {
          // Text answer: give moderate score
          total += 50;
        }
        count++;
      }
    }
    dims.push(count > 0 ? Math.round(total / count) : 0);
  }
  return dims;
}

function getMaturityLevel(score) {
  if (score >= 80) return '領導期';
  if (score >= 65) return '擴展期';
  if (score >= 50) return '整合期';
  if (score >= 35) return '發展期';
  return '探索期';
}

// ===== Sheet Setup (run once) =====

function setupSheets() {
  var ss = getSpreadsheet();

  // assessments
  var s1 = ss.getSheetByName('assessments') || ss.insertSheet('assessments');
  if (s1.getLastRow() === 0) {
    var headers = ['id', 'timestamp', 'companyName', 'industry', 'companySize',
      'department', 'userName', 'jobTitle', 'userEmail', 'userPhone'];
    for (var i = 1; i <= 30; i++) headers.push('q' + i);
    headers.push('totalScore', 'maturityLevel',
      'dim1Score', 'dim2Score', 'dim3Score', 'dim4Score', 'dim5Score', 'dim6Score',
      'status');
    s1.appendRow(headers);
  }

  // bookings
  var s2 = ss.getSheetByName('bookings') || ss.insertSheet('bookings');
  if (s2.getLastRow() === 0) {
    s2.appendRow(['id', 'timestamp', 'name', 'email', 'phone', 'company',
      'date', 'timeSlot', 'topic', 'message', 'status']);
  }

  // cms_content
  var s3 = ss.getSheetByName('cms_content') || ss.insertSheet('cms_content');
  if (s3.getLastRow() === 0) {
    s3.appendRow(['pageId', 'sectionId', 'content', 'lastModified']);
  }

  // available_slots
  var s4 = ss.getSheetByName('available_slots') || ss.insertSheet('available_slots');
  if (s4.getLastRow() === 0) {
    s4.appendRow(['date', 'timeSlot', 'isAvailable']);
  }

  // config
  var s5 = ss.getSheetByName('config') || ss.insertSheet('config');
  if (s5.getLastRow() === 0) {
    s5.appendRow(['key', 'value']);
  }

  Logger.log('All sheets created successfully!');
}

// Run this once to set the initial admin password
function setInitialPassword() {
  var props = PropertiesService.getScriptProperties();
  // Default password hash for "admin123" (SHA-256)
  // Change this after first login!
  var defaultHash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';
  props.setProperty('ADMIN_PASSWORD_HASH', defaultHash);
  props.setProperty('HMAC_SECRET', Utilities.getUuid());
  Logger.log('Initial password set. Remember to change it after first login!');
}
