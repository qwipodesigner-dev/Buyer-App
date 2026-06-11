import { Icon, StatusBar } from '../../components/Icons';
import { helpTopics } from '../../data/mockData';

export default function HelpScreen({ onBack }: any) {
  return (
    <>
      <StatusBar />
      <div className="screen-body">
        <div className="top-bar">
          <button className="icon-btn" onClick={onBack}>
            <Icon.Back />
          </button>
          <div className="top-title">
            <h1>Help & Support</h1>
            <p>We're here to help</p>
          </div>
        </div>

        {/* Contact card */}
        <div className="profile-section">
          <div className="help-contact-row">
            <button className="help-contact-card">
              <div className="help-contact-icon" style={{ background: '#dbeafe' }}>💬</div>
              <div className="help-contact-label">Chat with us</div>
              <div className="help-contact-detail">Avg reply 2 min</div>
            </button>
            <button className="help-contact-card">
              <div className="help-contact-icon" style={{ background: '#d1fae5' }}>📞</div>
              <div className="help-contact-label">Call support</div>
              <div className="help-contact-detail">9 AM – 9 PM IST</div>
            </button>
            <button className="help-contact-card">
              <div className="help-contact-icon" style={{ background: '#fef3c7' }}>📧</div>
              <div className="help-contact-label">Email us</div>
              <div className="help-contact-detail">Reply in 24h</div>
            </button>
          </div>
        </div>

        {/* Topics */}
        <div className="profile-section" style={{ paddingBottom: 30 }}>
          <div className="profile-section-title">Browse by Topic</div>
          {helpTopics.map((topic) => (
            <div key={topic.id} className="help-topic">
              <div className="help-topic-head">
                <span className="help-topic-icon">{topic.icon}</span>
                <span className="help-topic-title">{topic.title}</span>
              </div>
              <div className="profile-card" style={{ marginTop: 8 }}>
                {topic.items.map((q, idx) => (
                  <button
                    key={idx}
                    className={`profile-menu-item ${idx === topic.items.length - 1 ? 'last' : ''}`}
                  >
                    <div className="profile-menu-text">
                      <div className="profile-menu-label" style={{ fontSize: 13 }}>{q}</div>
                    </div>
                    <Icon.ChevronRight />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
