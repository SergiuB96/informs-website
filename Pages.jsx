const { useState } = React;

const ArrowIcon = () => <IcoRightAlt size={14} />;

/* ══════════════════════════════════════
   DESPRE NOI
══════════════════════════════════════ */
function AboutPage({ onNav }) {
  const go = (p) => { onNav(p); window.scrollTo({ top: 0, behavior: 'instant' }); };

  return (
    <>
      <div className="pg-hero pg-hero-video">
        <video className="pg-hero-vid" autoPlay muted playsInline preload="none">
          <source src="assets/videos_library/documentatii-achizitii-publice-digitale-informs.mp4" type="video/mp4" />
          <track kind="captions" src="" label="Română" srclang="ro" default />
        </video>
        <div className="pg-hero-overlay"></div>
        <div className="container">
          <div className="tag-label" style={{ background: 'rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.82)', marginBottom: '18px' }}>
            Cine suntem
          </div>
          <h1>Despre noi</h1>
          <p>Optimizăm și eficientizăm fluxul de lucru cu instrumente profesionale cu aplicabilitate directă.</p>
        </div>
      </div>

      {/* 15 ANI */}
      <section className="sec">
        <div className="container">
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
            <FadeUp>
              <div className="tag-label" style={{ marginBottom: '18px' }}>Experiență</div>
              <h2 style={{ marginBottom: '22px' }}>15 ani în achiziții</h2>
              <p style={{ fontSize: '1.12rem', lineHeight: '1.82', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Totul transpus în cunoștințe acumulate, testări, consultanță generală, cât și unu la unu, livrabile individuale și documentații complete.
              </p>
              <p style={{ fontSize: '1.12rem', lineHeight: '1.82', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Parteneri și colaboratori de încredere, dedicați serviciilor de calitate și îndeplinirii obiectivelor stabilite.
              </p>
              <p style={{ fontSize: '1.12rem', lineHeight: '1.82', color: 'var(--text-muted)' }}>
                Ne extindem continuu domeniile de expertiză și ne îmbunătățim constant serviciile în funcție de cerințele fiecărui beneficiar.
              </p>
            </FadeUp>
            <FadeUp delay={180}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {[
                  { num: '15+', label: 'Ani de experiență' },
                  { num: '500+', label: 'Ore consultanță/an' },
                  { num: '100%', label: 'Dedicare' },
                  { num: '3', label: 'Formate de lucru' },
                ].map((s, i) => (
                  <div key={i} className="card" style={{ padding: '28px', textAlign: 'center' }}>
                    <div className="stat-num">{s.num}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* O SINGURĂ VIZIUNE */}
      <section className="sec sec-light">
        <div className="container">
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
            <FadeUp>
              <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', background: 'var(--blue-light)' }}>
                <img
                  src="https://static.wixstatic.com/media/ab6452_973096b654dc46358c274ec6723db63d~mv2.webp/v1/fill/w_484,h_455,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/business-idea-generation-plan-development-pensive-man-with-lightbulb-cartoon-character-tec.webp"
                  alt="O singură viziune"
                  style={{ width: '100%', display: 'block' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </FadeUp>
            <FadeUp delay={160}>
              <div className="tag-label" style={{ marginBottom: '18px' }}>Echipa noastră</div>
              <h2 style={{ marginBottom: '22px' }}>O singură viziune</h2>
              <p style={{ fontSize: '1.12rem', lineHeight: '1.82', color: 'var(--text-muted)', marginBottom: '24px' }}>
                O echipă de profesioniști cu specializări în domeniile juridic, economic, achiziții publice, IT, statistică și managementul afacerilor.
              </p>
              <blockquote style={{ borderLeft: '3px solid var(--blue-accent)', paddingLeft: '22px', fontStyle: 'italic', fontSize: '1.08rem', color: 'var(--navy)', lineHeight: '1.72' }}>
                „Performanță și eficiență prin simplificarea și inovarea proceselor de lucru."
              </blockquote>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CONSULTANȚĂ */}
      <section className="sec">
        <div className="container">
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
            <FadeUp>
              <div className="tag-label" style={{ marginBottom: '18px' }}>Consultanță</div>
              <h2 style={{ marginBottom: '22px' }}>Peste 500 ore/an</h2>
              <p style={{ fontSize: '1.12rem', lineHeight: '1.82', color: 'var(--text-muted)', marginBottom: '18px' }}>
                Consultanță unu la unu pentru instituțiile publice și companiile private care au apelat la serviciile noastre.
              </p>
              <p style={{ fontSize: '1.12rem', lineHeight: '1.82', color: 'var(--text-muted)', marginBottom: '34px' }}>
                Asistență tehnico-economică de specialitate și instruirea personalului în asimilarea și utilizarea termenilor și a dispozițiilor legale cu grad ridicat de complexitate.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => go('achizitii-publice')}>Achiziții publice</button>
                <button className="btn btn-outline" onClick={() => go('delegare-servicii')}>Delegare servicii</button>
              </div>
            </FadeUp>
            <FadeUp delay={160}>
              <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', background: 'var(--blue-light)' }}>
                <img
                  src="https://static.wixstatic.com/media/ab6452_50c8e137fc03415c9b44c9d8cd5d68c2~mv2.webp/v1/fill/w_623,h_592,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/statistics-data-analysis-financial-administration-circular-diagram-with-colorful-segments-.webp"
                  alt="Analiză și statistici"
                  style={{ width: '100%', display: 'block' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* INSTRUMENTE */}
      <section className="sec sec-light">
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '52px' }}>
              <div className="tag-label">Produse</div>
              <h2 style={{ marginTop: '16px' }}>Instrumente actualizate constant</h2>
              <p className="lead" style={{ maxWidth: 520, margin: '14px auto 0' }}>
                Transpuse în Microsoft Excel, Microsoft Word și Adobe PDF.
              </p>
            </div>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              { title: 'Modele EXCEL', desc: 'Instrumente avansate de calcul și analiză pentru domenii specifice.', page: 'modele-excel' },
              { title: 'Modele WORD', desc: 'Documente tipizate și formulare personalizabile în format Word.', page: 'modele-word' },
              { title: 'Modele PDF inteligent', desc: 'Formulare electronice interactive în format PDF standardizat.', page: 'modele-pdf' },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 100}>
                <div className="card" style={{ padding: '28px', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }} onClick={() => go(item.page)}>
                  <h3 style={{ marginBottom: '10px' }}>{item.title}</h3>
                  <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', flex: 1 }}>{item.desc}</p>
                  <span className="card-link">Detalii <ArrowIcon /></span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════
   CONTACT
══════════════════════════════════════ */
function ContactPage() {
  const [form, setForm] = useState({ nume: '', email: '', telefon: '', subiect: '', mesaj: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nume.trim() || !form.email.trim() || !form.mesaj.trim()) {
      setError('Te rugăm să completezi câmpurile obligatorii (*).');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.ok) setSent(true);
      else setError('Mesajul nu a putut fi trimis. Încearcă din nou sau sună direct.');
    } catch {
      setError('Eroare de rețea. Încearcă din nou sau sună direct.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="pg-hero pg-hero-video">
        <video className="pg-hero-vid" autoPlay muted playsInline preload="none">
          <source src="assets/videos_library/contact-informs.mp4" type="video/mp4" />
          <track kind="captions" src="" label="Română" srclang="ro" default />
        </video>
        <div className="pg-hero-overlay"></div>
        <div className="container">
          <div className="tag-label" style={{ background: 'rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.82)', marginBottom: '18px' }}>
            Ia legătura cu noi
          </div>
          <h1>Contact</h1>
          <p>Suntem disponibili pentru întrebări și pentru a-ți oferi soluții personalizate.</p>
        </div>
      </div>

      <section className="sec">
        <div className="container">
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '48px', alignItems: 'start' }}>
            <FadeUp>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '72px 32px', background: 'var(--blue-pale)', borderRadius: '20px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--blue-lt)', color: 'var(--blue-a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <IcoCheck size={30} />
                  </div>
                  <h3 style={{ marginBottom: '12px' }}>Mesaj trimis cu succes!</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Te vom contacta în cel mai scurt timp posibil.</p>
                </div>
              ) : (
                <form className="form-wrap" onSubmit={handleSubmit}>
                  <h2 style={{ marginBottom: '32px', fontSize: '1.7rem' }}>Trimite-ne un mesaj</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-row">
                      <div className="fg">
                        <label>Nume și prenume *</label>
                        <input type="text" placeholder="Ion Popescu" value={form.nume} onChange={set('nume')} />
                      </div>
                      <div className="fg">
                        <label>Adresă de email *</label>
                        <input type="email" placeholder="ion@exemplu.ro" value={form.email} onChange={set('email')} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="fg">
                        <label>Telefon</label>
                        <input type="tel" placeholder="+40 7xx xxx xxx" value={form.telefon} onChange={set('telefon')} />
                      </div>
                      <div className="fg">
                        <label>Subiect</label>
                        <input type="text" placeholder="Ex: Achiziții publice" value={form.subiect} onChange={set('subiect')} />
                      </div>
                    </div>
                    <div className="fg">
                      <label>Mesaj *</label>
                      <textarea placeholder="Descrie pe scurt ce te interesează..." value={form.mesaj} onChange={set('mesaj')}></textarea>
                    </div>
                    {error && (
                      <p style={{ color: '#c53030', fontSize: '14px', background: '#fff5f5', padding: '12px 16px', borderRadius: '8px', border: '1px solid #fed7d7' }}>
                        {error}
                      </p>
                    )}
                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', fontSize: '15px', padding: '14px 32px' }} disabled={loading}>
                      {loading ? 'Se trimite...' : 'Trimite mesajul'}
                    </button>
                  </div>
                </form>
              )}
            </FadeUp>

            <FadeUp delay={160}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div className="card" style={{ padding: '28px' }}>
                  <h4 style={{ marginBottom: '20px', color: 'var(--navy)' }}>Informații de contact</h4>
                  {[
                    { label: 'Email', val: 'office@informs.ro', href: 'mailto:office@informs.ro' },
                    { label: 'Website', val: 'www.informs.ro' },
                    { label: 'Companie', val: 'MILBAC MANAGEMENT S.R.L.' },
                    { label: 'Program', val: 'Luni – Vineri, 09:00 – 17:00' },
                  ].map((r, i, arr) => (
                    <div key={i} style={{ paddingBottom: i < arr.length - 1 ? '16px' : 0, marginBottom: i < arr.length - 1 ? '16px' : 0, borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '4px' }}>{r.label}</div>
                      {r.href
                        ? <a href={r.href} style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--blue-a)', textDecoration: 'none' }}>{r.val}</a>
                        : <div style={{ fontSize: '14.5px', fontWeight: 500 }}>{r.val}</div>
                      }
                    </div>
                  ))}
                </div>

                <div className="card" style={{ padding: '28px', background: 'var(--blue-pale)', border: 'none' }}>
                  <h4 style={{ marginBottom: '10px', color: 'var(--navy)' }}>Agatha Plus</h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: '1.65' }}>
                    Digitalizează achizițiile publice și simplifică modul de lucru.
                  </p>
                  <a href="https://agathaplus.ro/" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: '14px', display:'inline-flex', alignItems:'center', gap:'6px' }}>
                    Vizitează <IcoShareLib size={13} />
                  </a>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════
   SERVICII — OVERVIEW
══════════════════════════════════════ */
function ServicesPage({ onNav }) {
  const go = (p) => { onNav(p); window.scrollTo({ top: 0, behavior: 'instant' }); };

  const list = [
    { page: 'analiza-si-solutii', title: 'Analiză și soluții personalizate', desc: 'Analizăm situația prezentată și oferim soluții concrete, aplicate, care răspund tuturor cerințelor.', tag: 'Consultanță' },
    { page: 'achizitii-publice', title: 'Achiziții publice', desc: 'Documentații complete pentru atribuirea contractelor de servicii, produse și lucrări.', tag: 'Documentații' },
    { page: 'delegare-servicii', title: 'Delegare servicii de utilități publice', desc: 'Documentații pentru gestiunea serviciilor de utilități publice: salubrizare, transport, iluminat.', tag: 'Documentații' },
    { page: 'modele-excel', title: 'Modele de lucru EXCEL', desc: 'Instrumente de lucru cu aplicabilitate generală și specifică, în format editabil Excel.', tag: 'Instrumente' },
    { page: 'modele-word', title: 'Modele de lucru WORD', desc: 'Instrumente de lucru cu aplicabilitate generală și specifică, în format editabil Word.', tag: 'Instrumente' },
    { page: 'modele-pdf', title: 'Modele de lucru PDF inteligent', desc: 'Instrumente de lucru cu aplicabilitate generală și specifică, în format PDF inteligent.', tag: 'Instrumente' },
  ];

  return (
    <>
      <div className="pg-hero pg-hero-video">
        <video className="pg-hero-vid" autoPlay muted playsInline preload="none">
          <source src="assets/videos_library/documentatii-achizitii-publice-digitale-informs.mp4" type="video/mp4" />
        </video>
        <div className="container">
          <div className="tag-label" style={{ background: 'rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.82)', marginBottom: '18px' }}>
            Ce oferim
          </div>
          <h1>Servicii</h1>
          <p>Soluții complete pentru instituții publice, companii și liber-profesioniști.</p>
        </div>
      </div>

      <section className="sec">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {list.map((s, i) => (
              <FadeUp key={i} delay={i * 60}>
                <div className="card" style={{ padding: '28px', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }} onClick={() => go(s.page)}>
                  <span className="tag-label" style={{ marginBottom: '16px', alignSelf: 'flex-start' }}>{s.tag}</span>
                  <h3 style={{ marginBottom: '10px' }}>{s.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.72', flex: 1 }}>{s.desc}</p>
                  <span className="card-link">Detalii <ArrowIcon /></span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════
   SERVICE DETAIL — template
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

/* ══════════════════════════════════════
   MATERIALE GRATUITE
══════════════════════════════════════ */
function MaterialeGratuitePage({ onNav }) {
  const go = (p) => { onNav(p); window.scrollTo({ top: 0, behavior: 'instant' }); };
  return (
    <>
      <div className="pg-hero pg-hero-video">
        <video className="pg-hero-vid" autoPlay muted playsInline preload="none">
          <source src="assets/videos_library/formulare-pdf-inteligent-institutii-publice.mp4" type="video/mp4" />
          <track kind="captions" src="" label="Română" srclang="ro" default />
        </video>
        <div className="pg-hero-overlay"></div>
        <div className="container">
          <div className="tag-label" style={{ background: 'rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.82)', marginBottom: '18px' }}>Gratuit</div>
          <h1>Materiale gratuite</h1>
          <p>Resurse utile disponibile gratuit pentru a-ți facilita munca.</p>
        </div>
      </div>
      <section className="sec">
        <div className="container" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', padding: '72px 40px', background: 'var(--blue-pale)', borderRadius: '24px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>Secțiune în pregătire</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '36px', fontSize: '1.05rem', lineHeight: '1.75' }}>
                Lucrăm la pregătirea materialelor gratuite. Revino în curând sau contactează-ne pentru informații suplimentare.
              </p>
              <button className="btn btn-primary" onClick={() => go('contact')}>Contactează-ne</button>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════
   PAGINI POLITICI
══════════════════════════════════════ */
const policyStyles = {
  h2: { fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', marginTop: '36px', marginBottom: '10px' },
  p:  { color: 'var(--text-2)', fontSize: '0.97rem', lineHeight: '1.82', marginBottom: '14px' },
  ul: { color: 'var(--text-2)', fontSize: '0.97rem', lineHeight: '1.82', paddingLeft: '22px', marginBottom: '14px' },
  divider: { borderTop: '1px solid var(--border)', margin: '32px 0' },
  meta: { fontSize: '0.82rem', color: 'var(--text-2)', marginBottom: '32px' },
};

function PrivacyPage({ onNav }) {
  const go = (p) => { onNav(p); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const S = policyStyles;
  return (
    <>
      <div className="pg-hero">
        <div className="container">
          <h1>Politica de confidențialitate</h1>
          <p>Informații privind prelucrarea datelor cu caracter personal.</p>
        </div>
      </div>
      <section className="sec">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card" style={{ padding: '40px 44px' }}>
            <p style={S.meta}>Ultima actualizare: 30 mai 2025</p>
            <p style={S.p}>MILBAC MANAGEMENT S.R.L., cu sediul în România, operator al platformei <strong>INFORMS</strong> (www.informs.ro), se angajează să protejeze confidențialitatea și securitatea datelor cu caracter personal ale utilizatorilor săi. Prezenta politică descrie ce date colectăm, în ce scop le utilizăm și care sunt drepturile dumneavoastră în conformitate cu Regulamentul (UE) 2016/679 (GDPR) și Legea nr. 190/2018.</p>
            <div style={S.divider} />
            <h2 style={S.h2}>1. Operatorul de date</h2>
            <p style={S.p}><strong>MILBAC MANAGEMENT S.R.L.</strong><br />Platformă: INFORMS - www.informs.ro<br />Email: <a href="mailto:office@informs.ro" style={{ color: 'var(--blue-a)' }}>office@informs.ro</a><br />Program: Luni - Vineri, 09:00 - 17:00</p>
            <div style={S.divider} />
            <h2 style={S.h2}>2. Datele pe care le colectăm</h2>
            <p style={S.p}>Colectăm date cu caracter personal exclusiv atunci când dumneavoastră ni le furnizați voluntar, în special prin intermediul formularului de contact:</p>
            <ul style={S.ul}>
              <li><strong>Nume și prenume</strong> - pentru identificare și corespondență</li>
              <li><strong>Adresă de email</strong> - pentru comunicarea răspunsului la solicitare</li>
              <li><strong>Număr de telefon</strong> (opțional) - pentru contact telefonic, dacă este solicitat</li>
              <li><strong>Subiect și mesaj</strong> - conținutul solicitării dumneavoastră</li>
            </ul>
            <p style={S.p}>De asemenea, serverul nostru web poate înregistra automat date tehnice (adresa IP, tipul de browser, pagina accesată, data și ora accesului) în scopuri de securitate și analiză statistică agregată.</p>
            <div style={S.divider} />
            <h2 style={S.h2}>3. Scopurile și temeiurile juridice ale prelucrării</h2>
            <ul style={S.ul}>
              <li><strong>Răspuns la solicitări</strong> - temeiul juridic: executarea unui contract sau măsuri precontractuale (art. 6 alin. 1 lit. b GDPR)</li>
              <li><strong>Comunicări comerciale</strong> (oferte, noutăți despre servicii) - temeiul juridic: consimțământul dumneavoastră explicit (art. 6 alin. 1 lit. a GDPR); vă puteți retrage consimțământul oricând</li>
              <li><strong>Obligații legale</strong> (facturare, contabilitate) - temeiul juridic: obligație legală (art. 6 alin. 1 lit. c GDPR)</li>
              <li><strong>Interesul legitim</strong> al operatorului în îmbunătățirea serviciilor și securitatea sistemelor (art. 6 alin. 1 lit. f GDPR)</li>
            </ul>
            <div style={S.divider} />
            <h2 style={S.h2}>4. Durata stocării datelor</h2>
            <p style={S.p}>Datele transmise prin formularul de contact se păstrează pe durata necesară soluționării solicitării, iar ulterior maximum <strong>3 ani</strong> în scopuri de evidență internă, cu excepția cazurilor în care legea impune o durată mai mare (ex. documente contabile - 10 ani). Datele pentru care v-ați retras consimțământul vor fi șterse în termen de 30 de zile.</p>
            <div style={S.divider} />
            <h2 style={S.h2}>5. Destinatarii datelor</h2>
            <p style={S.p}>Datele dumneavoastră nu sunt vândute sau cedate terților în scopuri de marketing. Le putem divulga exclusiv:</p>
            <ul style={S.ul}>
              <li>Prestatorilor de servicii IT (hosting, email) care acționează ca <strong>persoane împuternicite</strong> și sunt obligați contractual să respecte GDPR</li>
              <li>Autorităților publice, când legea o impune</li>
            </ul>
            <p style={S.p}>Nu transferăm date în afara Spațiului Economic European fără garanții adecvate.</p>
            <div style={S.divider} />
            <h2 style={S.h2}>6. Cookie-uri și tehnologii similare</h2>
            <p style={S.p}>Website-ul poate utiliza cookie-uri strict necesare pentru funcționarea corectă a paginilor. Nu utilizăm cookie-uri de tracking sau publicitate fără consimțământul dumneavoastră prealabil. Puteți gestiona preferințele cookie prin setările browserului.</p>
            <div style={S.divider} />
            <h2 style={S.h2}>7. Drepturile dumneavoastră</h2>
            <p style={S.p}>În conformitate cu GDPR, beneficiați de următoarele drepturi:</p>
            <ul style={S.ul}>
              <li><strong>Dreptul de acces</strong> - să obțineți o confirmare cu privire la prelucrarea datelor și o copie a acestora</li>
              <li><strong>Dreptul la rectificare</strong> - corectarea datelor inexacte sau completarea celor incomplete</li>
              <li><strong>Dreptul la ștergere („dreptul de a fi uitat")</strong> - ștergerea datelor atunci când nu mai sunt necesare</li>
              <li><strong>Dreptul la restricționarea prelucrării</strong> - limitarea prelucrării în anumite situații prevăzute de lege</li>
              <li><strong>Dreptul la portabilitatea datelor</strong> - primirea datelor într-un format structurat și transferul lor</li>
              <li><strong>Dreptul la opoziție</strong> - opoziție față de prelucrarea bazată pe interesul legitim</li>
              <li><strong>Dreptul de a retrage consimțământul</strong> - oricând, fără a afecta legalitatea prelucrării anterioare</li>
            </ul>
            <p style={S.p}>Pentru exercitarea oricăruia dintre aceste drepturi, trimiteți o cerere la <a href="mailto:office@informs.ro" style={{ color: 'var(--blue-a)' }}>office@informs.ro</a>. Vom răspunde în termen de maximum <strong>30 de zile calendaristice</strong>.</p>
            <div style={S.divider} />
            <h2 style={S.h2}>8. Dreptul de a depune o plângere</h2>
            <p style={S.p}>Dacă considerați că drepturile dumneavoastră au fost încălcate, puteți depune o plângere la <strong>Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)</strong>, cu sediul la Bd. G-ral. Gheorghe Magheru 28-30, sector 1, București, website: www.dataprotection.ro.</p>
            <div style={S.divider} />
            <h2 style={S.h2}>9. Securitatea datelor</h2>
            <p style={S.p}>Implementăm măsuri tehnice și organizatorice adecvate pentru a proteja datele împotriva accesului neautorizat, divulgării, alterării sau distrugerii, inclusiv criptarea transmisiilor prin HTTPS și restricționarea accesului la sistemele de procesare.</p>
            <div style={S.divider} />
            <h2 style={S.h2}>10. Modificări ale politicii</h2>
            <p style={S.p}>Ne rezervăm dreptul de a actualiza prezenta politică pentru a reflecta modificările legislative sau operaționale. Versiunea actualizată va fi publicată pe această pagină cu data revizuirii. Vă recomandăm să consultați periodic această secțiune.</p>
            <div style={S.divider} />
            <button className="btn btn-outline" onClick={() => go('contact')}>Întrebări? Contactează-ne</button>
          </div>
        </div>
      </section>
    </>
  );
}

function TermsPage({ onNav }) {
  const go = (p) => { onNav(p); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const S = policyStyles;
  return (
    <>
      <div className="pg-hero">
        <div className="container">
          <h1>Termeni și condiții</h1>
          <p>Termenii și condițiile de utilizare a serviciilor INFORMS.</p>
        </div>
      </div>
      <section className="sec">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card" style={{ padding: '40px 44px' }}>
            <p style={S.meta}>Ultima actualizare: 30 mai 2025</p>
            <p style={S.p}>Vă rugăm să citiți cu atenție prezentul document înainte de a utiliza platforma <strong>INFORMS</strong> (www.informs.ro), operată de <strong>MILBAC MANAGEMENT S.R.L.</strong>, societate înregistrată în România. Prin accesarea sau utilizarea website-ului, acceptați integral termenii și condițiile de mai jos.</p>
            <div style={S.divider} />
            <h2 style={S.h2}>1. Operatorul platformei</h2>
            <p style={S.p}><strong>MILBAC MANAGEMENT S.R.L.</strong><br />Platformă: INFORMS - www.informs.ro<br />Email: <a href="mailto:office@informs.ro" style={{ color: 'var(--blue-a)' }}>office@informs.ro</a><br />Program: Luni - Vineri, 09:00 - 17:00</p>
            <div style={S.divider} />
            <h2 style={S.h2}>2. Obiectul serviciilor</h2>
            <p style={S.p}>INFORMS oferă servicii de consultanță, documentare și instrumente de lucru specializate în domeniul achizițiilor publice, inclusiv, dar fără a se limita la:</p>
            <ul style={S.ul}>
              <li>Elaborarea și verificarea documentațiilor de atribuire</li>
              <li>Consultanță privind procedurile de achiziție publică</li>
              <li>Modele și instrumente Excel pentru calcule specifice</li>
              <li>Asistență în gestionarea contestațiilor și a relației cu autoritățile de supraveghere</li>
              <li>Materiale gratuite de informare (ghiduri, modele)</li>
            </ul>
            <div style={S.divider} />
            <h2 style={S.h2}>3. Utilizarea website-ului</h2>
            <p style={S.p}>Utilizatorul se obligă să:</p>
            <ul style={S.ul}>
              <li>Furnizeze informații corecte și complete atunci când completează formulare</li>
              <li>Nu utilizeze website-ul în scopuri ilegale sau frauduloase</li>
              <li>Nu încerce să acceseze, modifice sau deterioreze sistemele informatice ale INFORMS</li>
              <li>Nu reproducă, distribuie sau comercializeze conținutul protejat fără acordul scris prealabil al MILBAC MANAGEMENT S.R.L.</li>
            </ul>
            <div style={S.divider} />
            <h2 style={S.h2}>4. Proprietatea intelectuală</h2>
            <p style={S.p}>Întregul conținut al website-ului - texte, grafice, logo-uri, instrumente, modele, structuri de documente - reprezintă proprietatea exclusivă a MILBAC MANAGEMENT S.R.L. sau este utilizat în baza unor licențe valabile și este protejat de legislația română și internațională privind drepturile de autor.</p>
            <p style={S.p}>Este permisă vizualizarea conținutului în scop personal și necomercial. Orice altă utilizare necesită acordul scris al operatorului.</p>
            <div style={S.divider} />
            <h2 style={S.h2}>5. Servicii cu plată și materiale</h2>
            <p style={S.p}>Anumite servicii INFORMS pot fi contractate contra cost. Detaliile comerciale (prețuri, termene de livrare, modalități de plată) sunt stabilite în mod individual prin ofertă și contract încheiat cu fiecare client. Materialele gratuite puse la dispoziție pe platformă sunt oferite cu titlu informativ și nu constituie consultanță juridică.</p>
            <div style={S.divider} />
            <h2 style={S.h2}>6. Limitarea răspunderii</h2>
            <p style={S.p}>INFORMS depune toate eforturile pentru a menține informațiile de pe website actualizate și conforme legislației în vigoare. Cu toate acestea, nu garantăm exhaustivitatea sau acuratețea absolută a conținutului și nu ne asumăm răspunderea pentru:</p>
            <ul style={S.ul}>
              <li>Decizii luate de utilizatori exclusiv pe baza informațiilor publicate pe website, fără consultanță contractuală</li>
              <li>Pierderi sau pagube indirecte, incidentale sau consecutive cauzate de utilizarea platformei</li>
              <li>Întreruperi temporare ale accesului la website cauzate de motive tehnice sau de forță majoră</li>
            </ul>
            <p style={S.p}>Răspunderea noastră contractuală față de clienți este limitată la prevederile contractului individual încheiat.</p>
            <div style={S.divider} />
            <h2 style={S.h2}>7. Link-uri către terți</h2>
            <p style={S.p}>Website-ul poate conține link-uri către resurse externe (legislație, ghiduri ANAP, SEAP etc.). INFORMS nu controlează și nu răspunde pentru conținutul acestor website-uri terțe.</p>
            <div style={S.divider} />
            <h2 style={S.h2}>8. Confidențialitate</h2>
            <p style={S.p}>Prelucrarea datelor cu caracter personal colectate prin intermediul website-ului este guvernată de <a href="#" onClick={(e) => { e.preventDefault(); go('politica-confidentialitate'); }} style={{ color: 'var(--blue-a)' }}>Politica de confidențialitate</a>, care face parte integrantă din prezentele condiții.</p>
            <div style={S.divider} />
            <h2 style={S.h2}>9. Legea aplicabilă și soluționarea litigiilor</h2>
            <p style={S.p}>Prezentele condiții sunt guvernate de legislația română. Orice litigiu va fi soluționat pe cale amiabilă. În cazul în care nu se ajunge la un acord, litigiul va fi supus spre soluționare instanțelor judecătorești competente din România.</p>
            <p style={S.p}>Utilizatorii care au calitatea de consumatori pot apela și la platforma europeană de soluționare online a litigiilor (SOL): ec.europa.eu/consumers/odr.</p>
            <div style={S.divider} />
            <h2 style={S.h2}>10. Modificarea termenilor</h2>
            <p style={S.p}>MILBAC MANAGEMENT S.R.L. își rezervă dreptul de a modifica oricând prezentele condiții. Modificările intră în vigoare la data publicării pe website. Continuarea utilizării website-ului după publicarea modificărilor constituie acceptarea acestora.</p>
            <div style={S.divider} />
            <button className="btn btn-outline" onClick={() => go('contact')}>Întrebări? Contactează-ne</button>
          </div>
        </div>
      </section>
    </>
  );
}

function PolicyPage({ onNav, type }) {
  if (type === 'politica-confidentialitate') return <PrivacyPage onNav={onNav} />;
  return <TermsPage onNav={onNav} />;
}

Object.assign(window, { AboutPage, ContactPage, ServicesPage, ServiceDetailPage, PolicyPage });
