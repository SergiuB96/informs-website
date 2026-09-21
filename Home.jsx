const { useState, useEffect, useRef } = React;


/* ── Animated headline: cuvinte dezvăluite secvențial ── */
function AnimatedHeadline({ lines, startDelay = 0.28 }) {
  let wi = 0;
  return (
    <h1 style={{ color: '#fff', marginBottom: '20px' }}>
      {lines.map((line, li) => (
        <span key={li} style={{ display: 'block' }}>
          {line.split(' ').map((word, idx) => {
            const delay = startDelay + wi++ * 0.085;
            return (
              <span key={idx} className="h-word" style={{ animationDelay: `${delay}s` }}>
                {word}{idx < line.split(' ').length - 1 ? '\u00A0' : ''}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}



function HomePage({ onNav }) {
  const go = (p) => { onNav(p); window.scrollTo({ top: 0, behavior: 'instant' }); };

  const features = [
    { icon: <IcoGear size={22} />,       title: 'OPTIMIZEAZĂ',             desc: 'Organizează fluxul de lucru eficient și performant' },
    { icon: <IcoDoc size={22} />,        title: 'APLICĂ DIRECT',           desc: 'Modele cu aplicare directă, conform legislației în vigoare' },
    { icon: <IcoShieldLib size={22} />,  title: 'DOCUMENTAȚII COMPLETE',   desc: 'Documentații complete și asistență tehnico-economică' },
  ];

  const domains = [
    { icon: <IcoDoc size={24} />,      num: '01', label: 'Achiziții publice',                  desc: 'Documentații complete pentru proceduri de atribuire - servicii, produse și lucrări. Conformitate legislativă garantată.' },
    { icon: <IcoHomeAlt size={24} />,  num: '02', label: 'Delegare servicii utilități publice', desc: 'Studii de oportunitate și documentații complete pentru gestiunea serviciilor de salubrizare, transport și iluminat.' },
    { icon: <IcoDash size={24} />,     num: '03', label: 'Management de proiect',               desc: 'Instrumente pentru planificarea, monitorizarea și raportarea proiectelor finanțate din fonduri publice sau europene.' },
    { icon: <IcoSyncLib size={24} />,  num: '04', label: 'Digitalizare',                        desc: 'Automatizarea fluxurilor documentare prin modele Excel, Word și PDF inteligent, adaptate activității tale specifice.' },
  ];

  const models = [
    { title: 'Modele EXCEL',               desc: 'Instrumente avansate de calcul. Complexitatea nu trebuie să fie un impediment.',  page: 'modele-excel',     tag: 'XLS', cv: 'excel', pills: ['.xlsx', 'Calcul automat', 'Editabil'] },
    { title: 'Modele PDF inteligent',      desc: 'Formulare electronice interactive. Standardizare completă a documentelor.',        page: 'modele-pdf',       tag: 'PDF', cv: 'pdf',   pills: ['.pdf', 'Câmpuri interactive', 'Adobe Acrobat'] },
    { title: 'Modele WORD',                desc: 'Formulare tipizate digitale. Cererile scanate sunt de domeniul trecutului.',       page: 'modele-word',      tag: 'DOC', cv: 'word',  pills: ['.docx', 'Editabil', 'Formulare tipizate'] },
    { title: 'Procese verbale & Rapoarte', desc: 'Modele adaptate pentru situații complexe din domeniul achizițiilor.',              page: 'contact',          tag: 'RPT', cv: 'rpt',   pills: ['Situații complexe', 'Achiziții publice'] },
    { title: 'Documentații de atribuire',  desc: 'Documentații complete pentru proceduri de atribuire a contractelor publice.',      page: 'achizitii-publice', tag: 'ATR', cv: 'atr',  pills: ['Servicii', 'Produse', 'Lucrări'] },
  ];

  const objectives = [
    { num: '01', key: 'Reducerea', rest: ' timpului de lucru',     desc: 'Reducerea considerabilă a timpului de lucru și eliminarea în proporție de cel puțin 90% a erorilor umane prin standardizarea documentelor.' },
    { num: '02', key: 'Simplificare', rest: ' și eficientizare',  desc: 'Modalități de lucru care simplifică interpretarea informațiilor complexe. Ecosisteme eficiente cu rezultate ce au impact real.' },
    { num: '03', key: 'Digitalizare', rest: ' și standardizare',  desc: 'Digitalizarea activităților administrative prin instrumente personalizate. Performanța apare când toți respectă un mod de lucru comun.' },
  ];


  return (
    <div className="home-page">
      <div className="hbg" aria-hidden="true">
        <div className="hbg-grid"></div>
        <div className="hbg-b1"></div>
        <div className="hbg-b2"></div>
        <div className="hbg-b3"></div>
      </div>
      {/* ── HERO ── */}
      <section className="hero hero-video-section">
        <video className="hero-video" autoPlay muted loop playsInline preload="metadata">
          <source src="assets/videos_library/retea-date-digitala-achizitii-publice-informs.mp4" type="video/mp4" />
          <track kind="captions" src="" label="Română" srclang="ro" default />
        </video>
        <div className="hero-video-overlay"></div>
        <div className="container hero-center-content">
          <p className="h-label">
            Achiziții publice &nbsp;·&nbsp; Delegare servicii de utilități publice &nbsp;·&nbsp; Digitalizare
          </p>
          <AnimatedHeadline
            lines={['Formulare inteligente.', 'Documentații complete.']}
            startDelay={0.28}
          />
          <p className="hero-sub h-sub" style={{ animationDelay: '0.72s' }}>
            Soluții adaptate pentru sectorul public și privat - modele de lucru conforme legislației,
            asistență tehnică de specialitate și documentații complete.
          </p>
          <div className="hero-actions h-actions" style={{ animationDelay: '0.92s', justifyContent: 'center' }}>
            <button className="btn btn-primary">
              Autoritate contractantă
            </button>
            <button className="btn btn-primary">
              Ofertant
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="stats-strip">
        <div className="container" style={{ padding: 0 }}>
          <div className="stats-strip-inner">
            {[
              { to: 15,  suffix: '+', lbl: 'Ani în achiziții publice',  det: 'experiență acumulată', icon: <IcoNote size={38} /> },
              { to: 500, suffix: '+', lbl: 'Ore consultanță/an',        det: 'unu la unu',           icon: <IcoUserAlt size={38} /> },
              { to: 90,  suffix: '%', lbl: 'Reducere erori umane',      det: 'prin standardizare',   icon: <IcoShieldLib size={38} /> },
              { to: 3,   suffix: '',  lbl: 'Formate de lucru',          det: 'Excel · Word · PDF',   icon: <IcoDoc size={38} /> },
            ].map((s, i) => (
              <div key={i} className="stat-col">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', color: 'rgba(255,255,255,.6)' }}>
                  {s.icon}
                </div>
                <div className="s-num">
                  <span className="stat-num-anim">{s.to}{s.suffix}</span>
                </div>
                <div className="s-lbl" style={{ fontSize: '16px' }}>{s.lbl}</div>
                <div className="s-det" style={{ fontSize: '13px' }}>{s.det}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TRUST STRIP ── */}
      <div className="trust-strip">
        <div className="container">
          <div className="trust-inner">
            {[
              'Conform legislației în vigoare',
              'Actualizat constant',
              'Aplicabilitate directă',
              'Asistență tehnică inclusă',
              'Excel · Word · PDF inteligent',
            ].map((t, i) => (
              <div key={i} className="trust-item">
                <span className="trust-dot"></span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PROVOCĂRI ── */}
      <section className="sec sec-white">
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div className="badge" style={{ marginBottom: '14px' }}>Context operațional</div>
              <h2>Provocări</h2>
              <p style={{ maxWidth: '560px', margin: '12px auto 0', fontSize: '16.5px' }}>
                Mediul administrativ și de achiziții publice generează, în mod obiectiv, o serie de dificultăți recurente ce pot afecta eficiența instituțională.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={80}>
            <div className="prov-two-cards">
              <div className="prov-card prov-card-left">
                <div className="prov-card-header">
                  <div className="prov-icon-x">!</div>
                  <span className="prov-header-label prov-header-label-left">Provocări</span>
                </div>
                {[
                  { title: 'Documentații cu lacune procedurale', desc: 'Absența unor elemente obligatorii în documentații generează vulnerabilități juridice și riscuri de contestație.' },
                  { title: 'Inconsistențe generate de procesarea manuală', desc: 'Redactarea manuală a documentelor standardizate este susceptibilă la erori repetitive și neuniformitate în aplicare.' },
                  { title: 'Cadru legislativ în continuă evoluție', desc: 'Modificările frecvente ale legislației impun actualizarea constantă a documentelor și procedurilor aplicabile.' },
                  { title: 'Resurse temporale alocate documentației', desc: 'Elaborarea documentelor de rutină consumă resurse semnificative ce ar putea fi direcționate spre activități cu valoare adăugată superioară.' },
                ].map((item, i) => (
                  <div key={i} className="prov-card-row">
                    <div className="prov-icon-x">!</div>
                    <div>
                      <div className="prov-item-title">{item.title}</div>
                      <div className="prov-item-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="prov-card prov-card-right">
                <div className="prov-card-header">
                  <div className="prov-icon-check">✓</div>
                  <span className="prov-header-label prov-header-label-right">Ce facem la INFORMS</span>
                </div>
                {[
                  { title: 'Modele integral verificate juridic', desc: 'Fiecare instrument respectă cerințele legale în vigoare, reducând expunerea instituțională la erori procedurale.' },
                  { title: 'Standardizare și automatizare', desc: 'Modelele structurate elimină variabilitatea umană, asigurând uniformitate și o rată de eroare redusă cu până la 90%.' },
                  { title: 'Actualizare permanentă', desc: 'Instrumentele INFORMS sunt revizuite și actualizate în concordanță cu orice modificare legislativă relevantă.' },
                  { title: 'Eficiență operațională imediată', desc: 'Aplicabilitatea directă a instrumentelor reduce substanțial timpul alocat documentației administrative.' },
                ].map((item, i) => (
                  <div key={i} className="prov-card-row">
                    <div className="prov-icon-check">✓</div>
                    <div>
                      <div className="prov-item-title">{item.title}</div>
                      <div className="prov-item-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={320}>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button className="btn btn-primary" onClick={() => go('contact')}>
                Solicită o consultare
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FEATURE STRIP ── */}
      <div className="feat-strip">
        <div className="container" style={{ padding: 0 }}>
          <div className="feat-grid">
            {features.map((f, i) => (
              <div key={i} className="feat-item">
                <div className="feat-icon">{f.icon}</div>
                <div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* u2500u2500 DOMAINS u2500u2500 */}
      <section className="sec dom-section">
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div className="badge badge-white" style={{ marginBottom: '16px' }}>Domenii de activitate</div>
              <h2 style={{ color: '#fff' }}>Expertiză în domenii-cheie</h2>
              <p style={{ color: 'rgba(255,255,255,.58)', maxWidth: '520px', margin: '14px auto 0', fontSize: '16.5px', lineHeight: 1.75 }}>
                Peste 15 ani de experiență concentrată în domeniile cu cel mai mare impact pentru administrația publică.
              </p>
            </div>
          </FadeUp>
          <div className="dom-grid">
            {domains.map((d, i) => (
              <FadeUp key={i} delay={i * 80}>
                <div className="dom-card">
                  <div className="dom-card-top">
                    <div className="dom-icon">{d.icon}</div>
                    <span className="dom-num">{d.num}</span>
                  </div>
                  <h3 className="dom-title">{d.label}</h3>
                  <p className="dom-desc">{d.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="sec sec-white">
        <div className="container">
          <FadeUp>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div className="badge" style={{ marginBottom: '14px' }}>Ce oferim</div>
                <h2>Serviciile noastre</h2>
                <p style={{ fontSize: '1.12rem', color: 'var(--text-2)', marginTop: '10px', maxWidth: 480 }}>Soluții complete pentru instituții publice, companii și liber-profesioniști.</p>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => go('servicii')}>
                Toate serviciile <IcoRightAlt size={14} />
              </button>
            </div>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { icon: <IcoNote size={22} />,     title: 'Documentații complete',            desc: 'Achiziții publice, administrație, delegare servicii, management documente.',            items: ['Instituții publice', 'Companii', 'Liber-profesioniști'],            page: 'achizitii-publice' },
              { icon: <IcoWrench size={22} />,   title: 'Instrumente de lucru specifice',    desc: 'Instrumente avansate pentru eficientizarea și standardizarea oricărei activități.',    items: ['Modele Excel', 'Modele Word', 'PDF inteligent'],                    page: 'modele-excel' },
              { icon: <IcoUserAlt size={22} />,  title: 'Asistență tehnică de specialitate', desc: 'Digitalizarea instituțiilor publice și companiilor private. Excel, Word, PDF.',        items: ['Instruire personal', 'Implementare asistată', 'Actualizări legislative'], page: 'analiza-si-solutii' },
            ].map((s, i) => (
              <FadeUp key={i} delay={i * 90}>
                <div className="card svc-feature-card" style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => go(s.page)}>
                  <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'var(--blue-lt)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <h3 style={{ marginBottom: '10px', fontSize: '1.22rem' }}>{s.title}</h3>
                  <p style={{ fontSize: '15.5px', color: 'var(--text-2)', lineHeight: '1.72', marginBottom: '20px', flex: 1 }}>{s.desc}</p>
                  <ul className="bullet-list" style={{ marginBottom: '20px' }}>
                    {s.items.map((item, j) => <li key={j}><span className="bullet-dot"></span>{item}</li>)}
                  </ul>
                  <span className="card-link" style={{ marginTop: 'auto' }}>Detalii <IcoRightAlt size={14} /></span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORK MODELS ── */}
      <section className="sec sec-white">
        <div className="container">
          <FadeUp>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div className="badge" style={{ marginBottom: '14px' }}>Instrumente de lucru</div>
                <h2>Asigură o imagine clară activității tale</h2>
                <p style={{ fontSize: '1.12rem', color: 'var(--text-2)', marginTop: '10px' }}>Eficientizarea a devenit regula de bază, iar timpul - un bun personal.</p>
              </div>
            </div>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '18px' }}>
            {models.map((m, i) => (
              <FadeUp key={i} delay={i * 65}>
                <div className="model-card" onClick={() => go(m.page)}>
                  <div className={`model-card-vis cv-${m.cv}`}>
                    <div className="mc-pat"></div>
                    <div className="mc-badge">{m.tag}</div>
                    <span className="mc-tag">{m.tag}</span>
                  </div>
                  <div className="model-card-body">
                    <h3>{fmtTitle(m.title)}</h3>
                    <p>{m.desc}</p>
                    <div className="mc-pills">
                      {m.pills.map((p, j) => <span key={j} className="mc-pill">{p}</span>)}
                    </div>
                    <span className="card-link" style={{ marginTop: '13px' }}>Detalii <IcoRightAlt size={14} /></span>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── OBJECTIVES ── */}
      <section className="sec obj-section">
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '0' }}>
              <div className="badge" style={{ marginBottom: '14px' }}>Obiective</div>
              <h2>Obiectivele urmărite</h2>
            </div>
          </FadeUp>
          <div className="obj-grid">
            {objectives.map((o, i) => (
              <FadeUp key={i} delay={i * 110}>
                <div className="obj-item">
                  <div className="obj-num-bg">{o.num}</div>
                  <h3><span className="obj-key">{o.key}</span>{o.rest}</h3>
                  <p>{o.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CE FACEM ── */}
      <section className="sec sec-white">
        <div className="container">
          <FadeUp>
            <div style={{ marginBottom: '48px' }}>
              <div className="badge" style={{ marginBottom: '14px' }}>Portofoliu servicii</div>
              <h2>Ce facem la INFORMS</h2>
              <p style={{ fontSize: '1.12rem', color: 'var(--text-2)', marginTop: '10px', maxWidth: 520 }}>
                Servicii specializate, structurate în funcție de rolul tău în procedura de achiziție.
              </p>
            </div>
          </FadeUp>
          <div className="audience-grid">
            <FadeUp>
              <div className="audience-card">
                <div className="audience-accent"></div>
                <div style={{ padding: '32px' }}>
                  <div className="audience-type-badge">Autoritate contractantă</div>
                  <h3 style={{ margin: '16px 0 8px', fontSize: '1.3rem' }}>Achizitor public</h3>
                  <p style={{ fontSize: '15.5px', color: 'var(--text-2)', lineHeight: 1.72, marginBottom: '24px' }}>
                    Documentații complete și instrumente de lucru pentru organizarea și derularea procedurilor de achiziție publică.
                  </p>
                  <div className="audience-links">
                    {[
                      ['achizitii-publice',  'Documentații de atribuire servicii, produse, lucrări'],
                      ['delegare-servicii',  'Delegare servicii de utilități publice'],
                      ['analiza-si-solutii', 'Analiză și soluții personalizate'],
                      ['modele-excel',       'Instrumente Excel pentru calcul și monitorizare'],
                      ['modele-word',        'Formulare și documente tipizate Word'],
                      ['modele-pdf',         'Formulare PDF interactive standardizate'],
                    ].map(([page, label], i) => (
                      <div key={i} className="audience-link-item" onClick={() => go(page)}>
                        <IcoCheck size={14} />
                        <span style={{ flex: 1 }}>{label}</span>
                        <IcoRightAlt size={12} />
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-primary" style={{ marginTop: '28px', width: '100%', justifyContent: 'center' }} onClick={() => go('achizitii-publice')}>
                    Portofoliu achizitor <IcoRightAlt size={14} />
                  </button>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={120}>
              <div className="audience-card audience-card-navy">
                <div className="audience-accent audience-accent-light"></div>
                <div style={{ padding: '32px' }}>
                  <div className="audience-type-badge audience-type-badge-light">Ofertant</div>
                  <h3 style={{ margin: '16px 0 8px', fontSize: '1.3rem', color: '#fff' }}>Participant la licitații</h3>
                  <p style={{ fontSize: '15.5px', color: 'rgba(255,255,255,.6)', lineHeight: 1.72, marginBottom: '24px' }}>
                    Instrumente și servicii pentru pregătirea ofertelor, calificarea în proceduri și contestarea deciziilor nefavorabile.
                  </p>
                  <div className="audience-links">
                    {[
                      ['analiza-si-solutii', 'Ofertare completă - tehnic, financiar, calificare'],
                      ['achizitii-publice',  'Contestații CNSC și curți de apel'],
                      ['analiza-si-solutii', 'Analiză de risc și strategie de ofertare'],
                      ['modele-excel',       'Calcul automat preț ofertă'],
                      ['modele-pdf',         'Formulare interactive pentru depunere'],
                      ['achizitii-publice',  'Documentații de calificare complete'],
                    ].map(([page, label], i) => (
                      <div key={i} className="audience-link-item audience-link-item-light" onClick={() => go(page)}>
                        <IcoCheck size={14} />
                        <span style={{ flex: 1 }}>{label}</span>
                        <IcoRightAlt size={12} />
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-ghost" style={{ marginTop: '28px', width: '100%', justifyContent: 'center' }} onClick={() => go('contact')}>
                    Solicită ofertă <IcoRightAlt size={14} />
                  </button>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="sec proc-section">
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: 'center' }}>
              <p className="badge" style={{ marginBottom: '14px' }}>Cum lucrăm</p>
              <h2>Un proces simplu, rezultate clare</h2>
              <p className="lead" style={{ maxWidth: 520, margin: '12px auto 0' }}>
                De la prima discuție până la implementarea completă - fiecare pas este structurat și transparent.
              </p>
            </div>
          </FadeUp>
          <div className="process-grid">
            {[
              { num: '01', title: 'Analizăm',     desc: 'Înțelegem situația, obiectivele și cerințele specifice ale activității tale' },
              { num: '02', title: 'Elaborăm',     desc: 'Creăm sau adaptăm documentațiile conform nevoilor și legislației în vigoare' },
              { num: '03', title: 'Implementăm',  desc: 'Te însoțim pas cu pas în aplicarea corectă a instrumentelor de lucru' },
              { num: '04', title: 'Actualizăm',   desc: 'Documentele rămân permanent conforme cu modificările legislative' },
            ].map((s, i) => (
              <FadeUp key={i} delay={i * 90}>
                <div className="proc-step">
                  <div className="proc-num">{s.num}</div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE / CTA ── */}
      <section className="sec sec-pale">
        <div className="container">
          <FadeUp>
            <div className="quote-card">
              <blockquote className="quote-text">
                Există un singur tip de succes - acela de a-ți putea petrece timpul așa cum îți dorești.
              </blockquote>
              <p className="quote-author">Christopher Morley</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" style={{ fontSize: '15px', padding: '13px 36px' }} onClick={() => go('contact')}>
                  Contactează-ne
                </button>
                <button className="btn btn-ghost" style={{ fontSize: '15px', padding: '13px 36px' }} onClick={() => go('servicii')}>
                  Descoperă serviciile
                </button>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { HomePage });
