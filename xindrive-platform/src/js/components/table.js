// ===== XinDrive DataTable =====
import { h } from './ui.js';

export function dataTable(columns, data, { onRowClick, sortable = true } = {}) {
  let sortCol = null, sortDir = 'asc';
  const container = h('div', { className: 'overflow-x-auto' });

  function render() {
    let sorted = [...data];
    if (sortCol !== null) {
      const col = columns[sortCol];
      sorted.sort((a, b) => {
        const va = col.value ? col.value(a) : a[col.key];
        const vb = col.value ? col.value(b) : b[col.key];
        if (va < vb) return sortDir === 'asc' ? -1 : 1;
        if (va > vb) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const table = h('table', { className: 'customer-table' });
    const thead = h('thead');
    const headerRow = h('tr');
    columns.forEach((col, ci) => {
      const th = h('th', {
        style: col.width ? { width: col.width } : {},
        className: sortable ? 'cursor-pointer' : '',
        onClick: sortable ? () => {
          if (sortCol === ci) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
          else { sortCol = ci; sortDir = 'asc'; }
          render();
        } : undefined,
      }, col.label + (sortCol === ci ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''));
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = h('tbody');
    sorted.forEach(row => {
      const tr = h('tr', { onClick: onRowClick ? () => onRowClick(row) : undefined });
      columns.forEach(col => {
        const val = col.render ? col.render(row) : (col.value ? col.value(row) : row[col.key]);
        const td = h('td');
        if (val instanceof HTMLElement) td.appendChild(val);
        else td.textContent = val ?? '';
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    container.innerHTML = '';
    container.appendChild(table);
  }

  render();
  container.refresh = (newData) => { data = newData; render(); };
  return container;
}
