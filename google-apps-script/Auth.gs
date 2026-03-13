/**
 * Authentication helper functions
 */

function handleLogin(data) {
  var props = PropertiesService.getScriptProperties();
  var storedHash = props.getProperty('ADMIN_PASSWORD_HASH');

  if (!storedHash) {
    return errorResponse('Admin password not configured. Run setInitialPassword() first.');
  }

  if (data.passwordHash !== storedHash) {
    return errorResponse('Invalid password', 401);
  }

  // Generate token
  var token = generateToken();
  return jsonResponse({
    success: true,
    token: token.value,
    expiresAt: token.expiresAt
  });
}

function generateToken() {
  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty('HMAC_SECRET');

  var now = new Date().getTime();
  var expiresAt = now + (8 * 60 * 60 * 1000); // 8 hours
  var nonce = Utilities.getUuid();
  var payload = now + ':' + nonce + ':' + expiresAt;

  var signature = Utilities.computeHmacSha256Signature(payload, secret);
  var signatureB64 = Utilities.base64Encode(signature);

  return {
    value: payload + ':' + signatureB64,
    expiresAt: expiresAt
  };
}

function validateToken(token) {
  if (!token) return false;

  var parts = token.split(':');
  if (parts.length < 4) return false;

  var timestamp = parseInt(parts[0]);
  var nonce = parts[1];
  var expiresAt = parseInt(parts[2]);
  var signature = parts.slice(3).join(':');

  // Check expiration
  if (new Date().getTime() > expiresAt) return false;

  // Verify signature
  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty('HMAC_SECRET');
  var payload = timestamp + ':' + nonce + ':' + expiresAt;
  var expectedSig = Utilities.base64Encode(
    Utilities.computeHmacSha256Signature(payload, secret)
  );

  return signature === expectedSig;
}

function requireAuth(e, callback) {
  var token = e.parameter.token;
  if (!validateToken(token)) {
    return errorResponse('Unauthorized. Please login again.', 401);
  }
  return callback();
}
