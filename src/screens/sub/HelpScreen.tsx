import { Icon, StatusBar } from '../../components/Icons';
import { helpTopics } from '../../data/mockData';

// Qwipo customer care contact (matches KYC Failed screen so the numbers
// stay in sync). Update SUPPORT_PHONE / SUPPORT_EMAIL in one place per file
// if these change.
const SUPPORT_PHONE = '+91 91212 22836';
const SUPPORT_EMAIL = 'info@qwipo.com';

export default function HelpScreen({
  onBack,
  onOpenChat,
}: {
  onBack: () => void;
  onOpenChat: (seed?: string) => void;
}) {
  const telHref = `tel:${SUPPORT_PHONE.replace(/\s/g, '')}`;
  const mailHref = `mailto:${SUPPORT_EMAIL}`;
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
            <button
              className="help-contact-card"
              onClick={() => onOpenChat()}
            >
              <div className="help-contact-icon" style={{ background: '#dbeafe' }}>💬</div>
              <div className="help-contact-label">Chat with us</div>
              <div className="help-contact-detail">Avg reply 2 min</div>
            </button>
            <a className="help-contact-card" href={telHref}>
              <div className="help-contact-icon" style={{ background: '#d1fae5' }}>📞</div>
              <div className="help-contact-label">Call support</div>
              <div className="help-contact-detail">24/7 · toll-free</div>
            </a>
            <a className="help-contact-card" href={mailHref}>
              <div className="help-contact-icon" style={{ background: '#fef3c7' }}>📧</div>
              <div className="help-contact-label">Email us</div>
              <div className="help-contact-detail">Reply in 24h</div>
            </a>
          </div>
        </div>

        {/* Topics — tapping a question drops the buyer into the chatbot with
            that question as the opening user message, so the bot can answer
            it immediately. */}
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
                    onClick={() => onOpenChat(q)}
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
