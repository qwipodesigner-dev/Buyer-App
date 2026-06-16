// Reusable "Apply changes?" popup. Used to gate non-undoable preference
// changes (theme switch, language switch) behind an explicit confirmation.
//
// Renders the same .dlg-card surface as CancelOrderDialog so theme/light
// behaviour stays consistent.

interface Props {
  title: string;
  body?: string;
  applyLabel?: string;
  cancelLabel?: string;
  onCancel: () => void;
  onApply: () => void;
}

export default function ConfirmChangesDialog({
  title,
  body,
  applyLabel = 'Apply',
  cancelLabel = 'Cancel',
  onCancel,
  onApply,
}: Props) {
  return (
    <div className="dlg-backdrop" onClick={onCancel}>
      <div
        className="dlg-card"
        role="dialog"
        aria-labelledby="confirm-dlg-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dlg-title-neutral" id="confirm-dlg-title">
          {title}
        </div>
        {body && <div className="dlg-body">{body}</div>}
        <div className="dlg-actions">
          <button className="dlg-btn ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="dlg-btn primary" onClick={onApply}>
            {applyLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
