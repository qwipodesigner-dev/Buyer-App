import { useState } from 'react';

// Reasons the buyer can pick from when cancelling. Stored centrally so we can
// extend the list in one place — today there's only one approved option.
const REASONS = [
  { id: 'seller-not-accepting', label: 'Seller is not accepting orders' },
];

export default function CancelOrderDialog({ orderId, onClose, onConfirm }: any) {
  const [reasonId, setReasonId] = useState<string>('');

  const canConfirm = reasonId !== '';

  return (
    <div className="dlg-backdrop" onClick={onClose}>
      <div
        className="dlg-card"
        role="dialog"
        aria-labelledby="cancel-dlg-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dlg-title" id="cancel-dlg-title">
          Do you want to cancel this order?
        </div>

        <div className="dlg-field">
          <label className="dlg-label">Select a reason</label>
          <div className="dlg-select-wrap">
            <select
              className="dlg-select"
              value={reasonId}
              onChange={(e) => setReasonId(e.target.value)}
            >
              <option value="" disabled>
                Select reason
              </option>
              {REASONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
            <span className="dlg-select-chev" aria-hidden="true">⌄</span>
          </div>
        </div>

        <div className="dlg-actions">
          <button className="dlg-btn ghost" onClick={onClose}>
            No
          </button>
          <button
            className="dlg-btn primary"
            disabled={!canConfirm}
            onClick={() => {
              const reason = REASONS.find((r) => r.id === reasonId);
              onConfirm?.({ orderId, reason: reason?.label || '' });
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
