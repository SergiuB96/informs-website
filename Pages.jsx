/* ══════════════════════════════════════
   SERVICE DETAIL - template
══════════════════════════════════════ */
function ServiceDetailPage({ onNav, service }) {
  const go = (p) => { onNav(p); window.scrollTo({ top: 0, behavior: 'instant' }); };

  const data = {
    'analiza-si-solutii': {
      title: 'Analiză și soluții personalizate',
      sub: 'Soluții concrete bazate pe date reale',
      desc: 'Pe baza datelor de intrare solicitate, analizăm situația prezentată și îți oferim soluții concrete, aplicate, care să răspundă tuturor cerințelor și obiectivelor stabilite.',
      items: ['Evaluare și analiză expertă', 'Soluții personalizate pentru fiecare nevoie', 'Rapoarte detaliate', 'Implementare asistată'],
      img: 'https://static.wixstatic.com/media/ab6452_9bdced09566642e99bef512302a368d7~mv2.webp/v1/fill/w_954,h_972,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Layer%203.webp',
      video: 'assets/videos_library/achizitii-publice.mp4',
      split: true,
    },
    'achizitii-publice': {
      title: 'Achiziții publice',
      sub: 'Documentații complete pentru proceduri de achiziție',
      desc: 'Elaborăm documentații complete în domeniul achizițiilor publice. Oferim asistență și suport în derularea procedurilor, de la elaborarea documentelor până la evaluarea ofertelor.',
      items: ['Documentații de atribuire', 'Servicii de ofertare (calificare, tehnic, financiar)', 'Evaluarea ofertelor depuse', 'Răspunsuri în fața CNSC și curților de apel'],
      img: 'https://static.wixstatic.com/media/ab6452_990466dc460d40a1b91200dc7080f012~mv2.webp/v1/fill/w_968,h_958,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Layer%201.webp',
      video: 'assets/videos_library/achizitii-publice.mp4',
      split: true,
    },
    'delegare-servicii': {
      title: 'Delegare servicii de utilități publice',
      sub: 'Documentații complete pentru gestiunea serviciilor',
      desc: 'Elaborăm documentații complete pentru gestiunea serviciilor de utilități publice, adaptate conform legislației în vigoare.',
      items: ['Salubrizare', 'Transport public', 'Iluminat public', 'Alte servicii de utilitate publică'],
      img: 'https://static.wixstatic.com/media/ab6452_9bdced09566642e99bef512302a368d7~mv2.webp/v1/fill/w_954,h_972,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Layer%203.webp',
      video: 'assets/videos_library/Delegare-Servicii-Utilitati-Publice.mp4',
      split: true,
    },
    'modele-excel': {
      title: 'Modele de lucru EXCEL',
      sub: 'Instrumente avansate în format Excel',
      desc: 'Complexitatea și volumul informațiilor nu trebuie să reprezinte un impediment. Instrumentele Excel sunt concepute pentru a simplifica activitatea și a reduce erorile umane.',
      items: ['Aplicabilitate generală', 'Aplicabilitate specifică domeniului', 'Format editabil și personalizabil', 'Actualizate conform legislației'],
      img: 'https://static.wixstatic.com/media/ab6452_dfa86221bf384275a44be40c2b4a1bf0~mv2.webp/v1/fill/w_650,h_424,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Layer%205.webp',
      video: 'assets/videos_library/excel-doc.mp4',
      split: true,
    },
    'modele-word': {
      title: 'Modele de lucru WORD',
      sub: 'Documente tipizate și formulare personalizabile',
      desc: 'Cererile și formularele tipizate clasice în format scanat sunt de domeniul trecutului. Digitalizează-ți activitatea și zilnic salvezi timp prețios.',
      items: ['Formulare tipizate', 'Cereri standardizate', 'Documente administrative', 'Format editabil'],
      img: 'https://static.wixstatic.com/media/ab6452_f425c6e6bc7d4aad8604f8e2f0b758bd~mv2.webp/v1/fill/w_650,h_424,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Layer%202.webp',
      video: 'assets/videos_library/word-doc.mp4',
      split: true,
    },
    'modele-pdf': {
      title: 'Modele de lucru PDF inteligent',
      sub: 'Formulare electronice interactive',
      desc: 'E timpul să renunți la completarea clasică. Lucrează în mod inteligent cu modele standard în format electronic, ușor de completat și de arhivat.',
      items: ['Formulare interactive', 'Câmpuri de completare automată', 'Format standardizat', 'Compatibil Adobe Acrobat'],
      img: 'https://static.wixstatic.com/media/ab6452_6c32cfd5b5744ffaa00d4c5cf86916c1~mv2.webp/v1/fill/w_650,h_424,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Layer%204.webp',
      video: 'assets/videos_library/pdf-doc.mp4',
      split: true,
    },
  };

  const d = data[service] || data['analiza-si-solutii'];

  return (
    <>
      <div className={`pg-hero${d.video ? ' pg-hero-video pg-hero-svc' : ''}`}>
        {d.video && (
          <video key={d.video} className={`pg-hero-vid${d.split ? ' pg-hero-vid-right' : ''}`} autoPlay muted playsInline preload="none">
            <source src={d.video} type="video/mp4" />
            <track kind="captions" src="" label="Română" srclang="ro" default />
          </video>
        )}
        <div className="container">
          <div className="tag-label" style={{ background: 'rgba(6,24,48,.08)', color: 'var(--navy)', marginBottom: '18px', cursor: 'pointer', display:'inline-flex', alignItems:'center', gap:'6px' }} onClick={() => go('servicii')}>
            <IcoLeftAlt size={14} /> Servicii
          </div>
          <h1 style={{ color: 'var(--navy)' }}>{fmtTitle(d.title)}</h1>
          <p style={{ color: 'var(--text-2)' }}>{d.sub}</p>
        </div>
      </div>

      <section className="sec">
        <div className="container">
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>
            <FadeUp>
              <p style={{ fontSize: '1.12rem', lineHeight: '1.82', color: 'var(--text-muted)', marginBottom: '34px' }}>{d.desc}</p>
              <h4 style={{ marginBottom: '18px', color: 'var(--navy)' }}>Ce include:</h4>
              <ul className="bullet-list" style={{ marginBottom: '38px' }}>
                {d.items.map((item, i) => (
                  <li key={i}><span className="bullet-dot"></span>{item}</li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => go('contact')}>Solicită ofertă</button>
                <button className="btn btn-outline" onClick={() => go('servicii')}>Toate serviciile</button>
              </div>
            </FadeUp>

            <FadeUp delay={160}>
              <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', background: 'var(--blue-light)', marginBottom: '24px' }}>
                <img src={d.img} alt={d.title} style={{ width: '100%', display: 'block' }} onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div style={{ background: 'var(--blue-pale)', borderRadius: '16px', padding: '28px' }}>
                <h4 style={{ marginBottom: '16px', color: 'var(--navy)' }}>Cui ne adresăm?</h4>
                {['Instituții publice', 'Companii private', 'Liber-profesioniști'].map((item, i, arr) => (
                  <div key={i} style={{ padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14.5px', fontWeight: 500 }}>
                    <span className="bullet-dot"></span>{item}
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}

Object.assign(window, { ServiceDetailPage });
