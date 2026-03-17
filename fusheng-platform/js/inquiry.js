// ===== Inquiry Page Logic =====

// Service type display name → pricing key mapping
const SERVICE_PRICING_MAP = {
  'S90小件': 's90',
  '1.9噸配送': '1.9ton',
  '3.5噸配送': '3.5ton',
  '專車棧板': 'special',
  '第三地出貨': '3pl',
};

// URL param → service display name mapping
const URL_SERVICE_MAP = {
  's90': 'S90小件',
  '1.9ton': '1.9噸配送',
  '3.5ton': '3.5噸配送',
  'special': '專車棧板',
  '3pl': '第三地出貨',
};

function updatePriceEstimate() {
  const select = document.getElementById('serviceType');
  const estimateArea = document.getElementById('priceEstimate');
  if (!select || !estimateArea) return;

  const serviceName = select.value;
  const pricingKey = SERVICE_PRICING_MAP[serviceName];

  if (!pricingKey) {
    estimateArea.innerHTML = '<span class="estimate-placeholder">請選擇服務類型以查看預估價格</span>';
    estimateArea.classList.remove('has-estimate');
    return;
  }

  const price = estimatePrice(pricingKey);
  estimateArea.innerHTML = `
    <div class="estimate-label">預估價格範圍</div>
    <div class="estimate-price">NT$ ${price.min.toLocaleString()} ~ ${price.max.toLocaleString()}</div>
    <div class="estimate-note">實際報價依距離、貨物規格等因素調整</div>
  `;
  estimateArea.classList.add('has-estimate');
}

function setFieldError(fieldId, show) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  const group = field.closest('.form-group');
  if (group) {
    if (show) group.classList.add('error');
    else group.classList.remove('error');
  }
}

function validateInquiryForm() {
  const fields = [
    { id: 'serviceType', check: v => v !== '' },
    { id: 'fromAddress', check: v => v.trim() !== '' },
    { id: 'toAddress', check: v => v.trim() !== '' },
    { id: 'contactName', check: v => v.trim() !== '' },
    { id: 'contactPhone', check: v => v.trim() !== '' },
  ];

  let valid = true;
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    const ok = el && f.check(el.value);
    setFieldError(f.id, !ok);
    if (!ok) valid = false;
  });
  return valid;
}

function submitInquiry() {
  if (!validateInquiryForm()) return;

  const inquiryId = generateInquiryId();
  const form = document.getElementById('inquiryForm');
  const success = document.getElementById('inquirySuccess');
  const idDisplay = document.getElementById('inquiryIdDisplay');

  if (idDisplay) idDisplay.textContent = inquiryId;
  if (form) form.style.display = 'none';
  if (success) success.style.display = 'block';
}

function validateContactForm() {
  const fields = [
    { id: 'contactFormName', check: v => v.trim() !== '' },
    { id: 'contactFormEmail', check: v => v.trim() !== '' },
    { id: 'contactFormSubject', check: v => v.trim() !== '' },
    { id: 'contactFormMessage', check: v => v.trim() !== '' },
  ];

  let valid = true;
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    const ok = el && f.check(el.value);
    setFieldError(f.id, !ok);
    if (!ok) valid = false;
  });
  return valid;
}

function submitContact() {
  if (!validateContactForm()) return;

  const form = document.getElementById('contactForm');
  const success = document.getElementById('contactSuccess');

  if (form) form.style.display = 'none';
  if (success) success.style.display = 'block';
}

function initInquiryPage() {
  // Read URL params and pre-select service type
  const params = new URLSearchParams(window.location.search);
  const serviceParam = params.get('service');
  if (serviceParam && URL_SERVICE_MAP[serviceParam]) {
    const select = document.getElementById('serviceType');
    if (select) {
      select.value = URL_SERVICE_MAP[serviceParam];
      updatePriceEstimate();
    }
  }

  // Attach event listeners
  const serviceSelect = document.getElementById('serviceType');
  if (serviceSelect) {
    serviceSelect.addEventListener('change', updatePriceEstimate);
  }

  const inquiryBtn = document.getElementById('inquirySubmitBtn');
  if (inquiryBtn) {
    inquiryBtn.addEventListener('click', function(e) {
      e.preventDefault();
      submitInquiry();
    });
  }

  const contactBtn = document.getElementById('contactSubmitBtn');
  if (contactBtn) {
    contactBtn.addEventListener('click', function(e) {
      e.preventDefault();
      submitContact();
    });
  }

  // Clear error on input
  document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => {
    el.addEventListener('input', () => {
      const group = el.closest('.form-group');
      if (group) group.classList.remove('error');
    });
  });
}

document.addEventListener('DOMContentLoaded', initInquiryPage);
