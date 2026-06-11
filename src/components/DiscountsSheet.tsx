import { useState } from 'react';
import { Icon } from './Icons';
import { SheetHeader, useSheetSwipe, PercentIcon } from './SheetBase';

// Compute 3-tier qty price slabs from variant base price + margin
function computeSlabs(variant) {
  const basePrice = variant.sellingPrice;
  const baseMargin = variant.margin;
  return [
    { range: '> 5 Cases', margin: baseMargin + 5, price: Math.round(basePrice * 0.93 * 100) / 100 },
    { range: '3 - 4 Cases', margin: baseMargin + 2, price: Math.round(basePrice * 0.97 * 100) / 100 },
    { range: '1 - 2 Cases', margin: baseMargin, price: Math.round(basePrice * 100) / 100 },
  ];
}

// Build the list of offers from the variant's scheme + defaults
function computeOffers(variant) {
  const offers = [];

  if (variant.scheme) {
    let saveAmount = Math.round(variant.casePrice / variant.casePcs);
    if (variant.scheme.match(/Buy (\d+)/i)) {
      const n = parseInt(variant.scheme.match(/Buy (\d+)/i)[1], 10);
      saveAmount = Math.round(variant.casePrice / n);
    }
    if (variant.scheme.includes('Flat')) {
      const match = variant.scheme.match(/₹(\d+)/);
      if (match) saveAmount = parseInt(match[1], 10);
    }
    offers.push({
      id: 'scheme',
      icon: '🎁',
      iconBg: '#FEF3C7',
      iconColor: '#92400E',
      title: variant.scheme,
      description: `On purchases of ${variant.casePack}`,
      savings: saveAmount,
    });
  }

  offers.push({
    id: 'pct',
    icon: '%',
    iconBg: '#DBEAFE',
    iconColor: '#1D4ED8',
    title: '5% Off',
    description: 'Get 5% off on your order above ₹500 upto ₹100',
    savings: 100,
  });

  offers.push({
    id: 'fr',
    icon: '🚚',
    iconBg: '#D1FAE5',
    iconColor: '#065F46',
    title: 'Free Delivery',
    description: 'Free shipping on orders above ₹3,000',
    savings: 60,
  });

  return offers;
}

export default function DiscountsSheet({ product, variant, onClose }: any) {
  const { dragHandlers, sheetStyle } = useSheetSwipe(onClose);
  const slabs = computeSlabs(variant);
  const offers = computeOffers(variant);

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet"
        style={sheetStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <SheetHeader
          icon={<PercentIcon />}
          title="Offer & Schemes"
          subtitle="Please review the following before proceeding"
          onClose={onClose}
          dragHandlers={dragHandlers}
        />

        <div className="sheet-body" style={{ padding: '16px 20px 24px' }}>
          {/* Quantity Price Slab table */}
          <div className="discount-section-title">Quantity Price Slab</div>
          <div className="slab-table">
            <div className="slab-row slab-head">
              <div>Quantity</div>
              <div>Margin %</div>
              <div>Unit Price</div>
            </div>
            {slabs.map((s, i) => (
              <div
                key={s.range}
                className={`slab-row ${i === slabs.length - 1 ? 'last' : ''}`}
              >
                <div className="slab-qty">{s.range}</div>
                <div className="slab-margin">{s.margin} %</div>
                <div className="slab-price">₹{s.price.toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Other offers — accordions */}
          <div className="discount-section-title" style={{ marginTop: 18 }}>
            Other Offers
          </div>
          <div className="offers-list">
            {offers.map((o) => (
              <OfferAccordion key={o.id} offer={o} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OfferAccordion({ offer }: any) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`offer-accordion ${open ? 'open' : ''}`}>
      <button className="offer-accordion-head" onClick={() => setOpen(!open)}>
        <div
          className="offer-accordion-icon"
          style={{ background: offer.iconBg, color: offer.iconColor }}
        >
          {offer.icon}
        </div>
        <div className="offer-accordion-text">
          <div className="offer-accordion-title">{offer.title}</div>
          <div className="offer-accordion-desc">{offer.description}</div>
        </div>
        <div className={`offer-accordion-chev ${open ? 'open' : ''}`}>
          <Icon.ChevronDown />
        </div>
      </button>
      {open && (
        <div className="offer-accordion-body">
          <div className="offer-savings-box">
            <div className="offer-savings-amount">
              Save up to ₹{offer.savings.toLocaleString('en-IN')}
            </div>
            <div className="offer-savings-label">Your Savings</div>
          </div>
        </div>
      )}
    </div>
  );
}
