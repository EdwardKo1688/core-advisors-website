// ===== XinDrive SVG Charts =====

// --- Line Chart ---
export function lineChart(data, { width = 500, height = 200, color = '#00B4D8', labels = [] } = {}) {
  const pad = { top: 20, right: 20, bottom: 30, left: 50 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = pad.left + (i / Math.max(data.length - 1, 1)) * w;
    const y = pad.top + h - ((v - min) / range) * h;
    return `${x},${y}`;
  });

  const areaPoints = points.join(' ') + ` ${pad.left + w},${pad.top + h} ${pad.left},${pad.top + h}`;

  let labelsHTML = '';
  if (labels.length) {
    labelsHTML = labels.map((l, i) => {
      const x = pad.left + (i / Math.max(labels.length - 1, 1)) * w;
      return `<text x="${x}" y="${height - 5}" text-anchor="middle" font-size="11" fill="#64748B">${l}</text>`;
    }).join('');
  }

  // Y-axis ticks
  const ticks = 4;
  let yAxisHTML = '';
  for (let i = 0; i <= ticks; i++) {
    const val = min + (range / ticks) * i;
    const y = pad.top + h - (i / ticks) * h;
    yAxisHTML += `<line x1="${pad.left}" y1="${y}" x2="${pad.left + w}" y2="${y}" stroke="#E2E8F0" stroke-dasharray="4"/>`;
    yAxisHTML += `<text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="#94A3B8">${formatNum(val)}</text>`;
  }

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.innerHTML = `
    ${yAxisHTML}
    <polygon points="${areaPoints}" fill="${color}" opacity="0.08"/>
    <polyline points="${points.join(' ')}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${points.map(p => `<circle cx="${p.split(',')[0]}" cy="${p.split(',')[1]}" r="4" fill="${color}" stroke="white" stroke-width="2"/>`).join('')}
    ${labelsHTML}
  `;
  return svg;
}

// --- Bar Chart ---
export function barChart(data, { width = 500, height = 200, colors = [], labels = [] } = {}) {
  const pad = { top: 20, right: 20, bottom: 30, left: 50 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;
  const max = Math.max(...data, 1);
  const barW = Math.min(w / data.length * 0.6, 40);
  const gap = w / data.length;
  const defaultColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  let bars = '';
  data.forEach((v, i) => {
    const barH = (v / max) * h;
    const x = pad.left + gap * i + (gap - barW) / 2;
    const y = pad.top + h - barH;
    const c = colors[i] || defaultColors[i % defaultColors.length];
    bars += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="4" fill="${c}" opacity="0.85"/>`;
    bars += `<text x="${x + barW / 2}" y="${y - 6}" text-anchor="middle" font-size="10" font-weight="600" fill="${c}">${formatNum(v)}</text>`;
    if (labels[i]) {
      bars += `<text x="${x + barW / 2}" y="${height - 5}" text-anchor="middle" font-size="10" fill="#64748B">${labels[i]}</text>`;
    }
  });

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.innerHTML = `
    <line x1="${pad.left}" y1="${pad.top + h}" x2="${pad.left + w}" y2="${pad.top + h}" stroke="#E2E8F0"/>
    ${bars}
  `;
  return svg;
}

// --- Radar Chart ---
export function radarChart(datasets, { size = 280, labels = [], maxVal = 10 } = {}) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 40;
  const n = labels.length;
  const angleStep = (2 * Math.PI) / n;
  const colors = ['#3B82F6', '#10B981', '#F59E0B'];
  const alphas = ['0.2', '0.15', '0.1'];

  // Grid
  let grid = '';
  for (let ring = 1; ring <= 5; ring++) {
    const rr = (ring / 5) * r;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = angleStep * i - Math.PI / 2;
      pts.push(`${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`);
    }
    grid += `<polygon points="${pts.join(' ')}" fill="none" stroke="#E2E8F0" stroke-width="1"/>`;
  }

  // Axes + labels
  let axes = '';
  for (let i = 0; i < n; i++) {
    const a = angleStep * i - Math.PI / 2;
    const x2 = cx + r * Math.cos(a);
    const y2 = cy + r * Math.sin(a);
    axes += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#E2E8F0"/>`;
    const lx = cx + (r + 18) * Math.cos(a);
    const ly = cy + (r + 18) * Math.sin(a);
    axes += `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="#64748B">${labels[i]}</text>`;
  }

  // Datasets
  let dataPaths = '';
  datasets.forEach((ds, di) => {
    const pts = ds.data.map((v, i) => {
      const a = angleStep * i - Math.PI / 2;
      const rr = (v / maxVal) * r;
      return `${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`;
    });
    const c = ds.color || colors[di % colors.length];
    dataPaths += `<polygon points="${pts.join(' ')}" fill="${c}" fill-opacity="${alphas[di] || '0.15'}" stroke="${c}" stroke-width="2"/>`;
    pts.forEach(p => {
      dataPaths += `<circle cx="${p.split(',')[0]}" cy="${p.split(',')[1]}" r="3" fill="${c}" stroke="white" stroke-width="1.5"/>`;
    });
  });

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.innerHTML = grid + axes + dataPaths;
  return svg;
}

// --- Progress Ring ---
export function progressRing(percent, { size = 80, color = '#00B4D8', stroke = 6 } = {}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.innerHTML = `
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#E2E8F0" stroke-width="${stroke}"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}"
      stroke-dasharray="${c}" stroke-dashoffset="${offset}" stroke-linecap="round"
      transform="rotate(-90 ${size / 2} ${size / 2})" style="transition:stroke-dashoffset .8s ease"/>
    <text x="${size / 2}" y="${size / 2}" text-anchor="middle" dominant-baseline="middle"
      font-size="${size / 4}" font-weight="700" fill="#1E293B">${percent}%</text>
  `;
  return svg;
}

function formatNum(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e4 ? 0 : 1) + 'K';
  return Math.round(n).toString();
}
