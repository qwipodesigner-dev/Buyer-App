import { useState } from 'react';
import { Icon, StatusBar } from '../../components/Icons';
import { savedAddresses as initialAddresses } from '../../data/mockData';

export default function AddressesScreen({ onBack }: any) {
  const [addresses, setAddresses] = useState(initialAddresses);

  const setDefault = (id) => {
    setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        <div className="top-bar">
          <button className="icon-btn" onClick={onBack}>
            <Icon.Back />
          </button>
          <div className="top-title">
            <h1>Saved Addresses</h1>
            <p>{addresses.length} delivery locations</p>
          </div>
        </div>

        <div className="addr-list">
          {addresses.map((a) => (
            <div key={a.id} className={`addr-card ${a.isDefault ? 'is-default' : ''}`}>
              <div className="addr-card-head">
                <div className="addr-card-icon">{a.icon}</div>
                <div className="addr-card-title-row">
                  <span className="addr-card-type">{a.type}</span>
                  {a.isDefault && <span className="addr-default-pill">Default</span>}
                </div>
                <button className="addr-card-more">⋯</button>
              </div>
              <div className="addr-card-name">{a.name}</div>
              <div className="addr-card-lines">
                {a.line1}, {a.line2}
                <br />
                {a.city}, {a.state} – {a.pincode}
              </div>
              <div className="addr-card-contact">
                <Icon.Phone /> {a.contact}
              </div>
              <div className="addr-card-actions">
                <button className="order-action-btn ghost">Edit</button>
                {!a.isDefault && (
                  <button className="order-action-btn primary" onClick={() => setDefault(a.id)}>
                    Set Default
                  </button>
                )}
              </div>
            </div>
          ))}

          <button className="addr-add-btn">
            <span style={{ fontSize: 18 }}>+</span>
            Add new address
          </button>
        </div>
      </div>
    </>
  );
}
