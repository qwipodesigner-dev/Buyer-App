import { useState } from 'react';
import { Icon, StatusBar } from '../../components/Icons';
import { useI18n, LANGUAGES, type LangCode } from '../../i18n';

export default function LanguageScreen({ onBack }: any) {
  const { lang, setLang, t } = useI18n();
  const [toast, setToast] = useState<string>('');

  const handlePick = (code: LangCode) => {
    setLang(code);
    setToast(t('lang.applied'));
    setTimeout(() => setToast(''), 1600);
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
            <h1>{t('account.language')}</h1>
          </div>
        </div>

        <div className="lang-intro">
          <div className="lang-intro-title">{t('lang.choose_language')}</div>
          <div className="lang-intro-sub">{t('lang.choose_language_sub')}</div>
        </div>

        <div className="lang-list">
          {LANGUAGES.map((l) => {
            const isActive = lang === l.code;
            return (
              <button
                key={l.code}
                className={`lang-item ${isActive ? 'on' : ''}`}
                onClick={() => handlePick(l.code)}
                aria-pressed={isActive}
              >
                <div className="lang-item-text">
                  <div className="lang-item-native">{l.nativeName}</div>
                  <div className="lang-item-english">{l.name}</div>
                </div>
                <div className={`lang-radio ${isActive ? 'on' : ''}`}>
                  {isActive && <span className="lang-radio-dot" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {toast && (
        <div className="toast" role="status">
          <Icon.Check /> {toast}
        </div>
      )}
    </>
  );
}
