// ===== XinDrive Kanban Board =====
import { h } from './ui.js';

export function kanban(columns, { onCardClick, onCardMove } = {}) {
  const board = h('div', { className: 'kanban-board' });

  function render() {
    board.innerHTML = '';
    columns.forEach(col => {
      const column = h('div', { className: `kanban-column ${col.className || ''}` });
      column.dataset.stage = col.id;

      const totalAmount = col.cards.reduce((s, c) => s + (c.amount || 0), 0);
      const header = h('div', { className: 'kanban-column-header' }, [
        h('div', {}, [
          h('span', {}, col.title),
          h('span', { className: 'col-count' }, ` (${col.cards.length})`),
        ]),
        h('div', { className: 'col-amount' }, formatMoney(totalAmount)),
      ]);
      column.appendChild(header);

      const cardsArea = h('div', { className: 'kanban-cards' });
      cardsArea.addEventListener('dragover', (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
      cardsArea.addEventListener('drop', (e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('text/plain');
        if (onCardMove) onCardMove(cardId, col.id);
      });

      col.cards.forEach(card => {
        const cardEl = renderCard(card, onCardClick);
        cardsArea.appendChild(cardEl);
      });
      column.appendChild(cardsArea);
      board.appendChild(column);
    });
  }

  function renderCard(card, onClick) {
    const probClass = card.probability >= 70 ? 'high' : card.probability >= 40 ? 'mid' : 'low';
    const el = h('div', {
      className: 'kanban-card',
      draggable: 'true',
      onClick: onClick ? () => onClick(card) : undefined,
    }, [
      h('div', { className: 'deal-name' }, card.title),
      h('div', { className: 'deal-customer' }, card.customer),
      h('div', { className: 'deal-amount' }, formatMoney(card.amount)),
      h('div', { className: 'deal-footer' }, [
        h('span', { className: `deal-prob ${probClass}` }, `${card.probability}%`),
        h('span', { className: 'deal-date' }, card.expected_close || ''),
      ]),
    ]);

    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', card.id);
      el.classList.add('dragging');
    });
    el.addEventListener('dragend', () => el.classList.remove('dragging'));

    return el;
  }

  render();
  board.refresh = (newColumns) => { columns = newColumns; render(); };
  return board;
}

function formatMoney(n) {
  if (!n) return '$0';
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n}`;
}
