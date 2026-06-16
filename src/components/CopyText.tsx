import { useState } from 'react';
import { Icon } from './Icons';

// Inline copy-to-clipboard chip. Used next to Order IDs and any other long
// reference number a retailer needs to paste somewhere (support chat, invoice).

export default function CopyText({ value, className = '' }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Older browsers — fall back to the legacy execCommand path
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <button
      className={`copy-text ${className}`}
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : `Copy ${value}`}
      title={copied ? 'Copied!' : 'Copy'}
    >
      <span className="copy-text-icon">
        {copied ? <Icon.Check /> : <Icon.Copy />}
      </span>
      <span className="copy-text-value mono">{value}</span>
    </button>
  );
}
