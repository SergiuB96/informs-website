(function(){
const {
  useState,
  useEffect,
  useRef
} = React;

/* ── Animated headline: cuvinte dezvăluite secvențial ── */
function AnimatedHeadline({
  lines,
  startDelay = 0.28
}) {
  let wi = 0;
  return /*#__PURE__*/React.createElement("h1", {
    style: {
      color: '#fff',
      marginBottom: '20px'
    }
  }, lines.map((line, li) => /*#__PURE__*/React.createElement("span", {
    key: li,
    style: {
      display: 'block'
    }
  }, line.split(' ').map((word, idx) => {
    const delay = startDelay + wi++ * 0.085;
    return /*#__PURE__*/React.createElement("span", {
      key: idx,
      className: "h-word",
      style: {
        animationDelay: `${delay}s`
      }
    }, word, idx < line.split(' ').length - 1 ? '\u00A0' : '');
  }))));
}
function HomePage({
  onNav
}) {
  const go = p => {
    onNav(p);
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  };
  const features = [{
    icon: /*#__PURE__*/React.createElement(IcoGear, {
      size: 22
    }),
    title: 'OPTIMIZEAZĂ',
    desc: 'Organizează fluxul de lucru eficient și performant'
  }, {
    icon: /*#__PURE__*/React.createElement(IcoDoc, {
      size: 22
    }),
    title: 'APLICĂ DIRECT',
    desc: 'Modele cu aplicare directă, conform legislației în vigoare'
  }, {
    icon: /*#__PURE__*/React.createElement(IcoShieldLib, {
      size: 22
    }),
    title: 'DOCUMENTAȚII COMPLETE',
    desc: 'Documentații complete și asistență tehnico-economică'
  }];
  const domains = [{
    icon: /*#__PURE__*/React.createElement(IcoDoc, {
      size: 24
    }),
    num: '01',
    label: 'Achiziții publice',
    desc: 'Documentații complete pentru proceduri de atribuire - servicii, produse și lucrări. Conformitate legislativă garantată.'
  }, {
    icon: /*#__PURE__*/React.createElement(IcoHomeAlt, {
      size: 24
    }),
    num: '02',
    label: 'Delegare servicii utilități publice',
    desc: 'Studii de oportunitate și documentații complete pentru gestiunea serviciilor de salubrizare, transport și iluminat.'
  }, {
    icon: /*#__PURE__*/React.createElement(IcoDash, {
      size: 24
    }),
    num: '03',
    label: 'Management de proiect',
    desc: 'Instrumente pentru planificarea, monitorizarea și raportarea proiectelor finanțate din fonduri publice sau europene.'
  }, {
    icon: /*#__PURE__*/React.createElement(IcoSyncLib, {
      size: 24
    }),
    num: '04',
    label: 'Digitalizare',
    desc: 'Automatizarea fluxurilor documentare prin modele Excel, Word și PDF inteligent, adaptate activității tale specifice.'
  }];
  const models = [{
    title: 'Modele EXCEL',
    desc: 'Instrumente avansate de calcul. Complexitatea nu trebuie să fie un impediment.',
    page: 'modele-excel',
    tag: 'XLS',
    cv: 'excel',
    pills: ['.xlsx', 'Calcul automat', 'Editabil']
  }, {
    title: 'Modele PDF inteligent',
    desc: 'Formulare electronice interactive. Standardizare completă a documentelor.',
    page: 'modele-pdf',
    tag: 'PDF',
    cv: 'pdf',
    pills: ['.pdf', 'Câmpuri interactive', 'Adobe Acrobat']
  }, {
    title: 'Modele WORD',
    desc: 'Formulare tipizate digitale. Cererile scanate sunt de domeniul trecutului.',
    page: 'modele-word',
    tag: 'DOC',
    cv: 'word',
    pills: ['.docx', 'Editabil', 'Formulare tipizate']
  }, {
    title: 'Procese verbale & Rapoarte',
    desc: 'Modele adaptate pentru situații complexe din domeniul achizițiilor.',
    page: 'contact',
    tag: 'RPT',
    cv: 'rpt',
    pills: ['Situații complexe', 'Achiziții publice']
  }, {
    title: 'Documentații de atribuire',
    desc: 'Documentații complete pentru proceduri de atribuire a contractelor publice.',
    page: 'achizitii-publice',
    tag: 'ATR',
    cv: 'atr',
    pills: ['Servicii', 'Produse', 'Lucrări']
  }];
  const objectives = [{
    num: '01',
    key: 'Reducerea',
    rest: ' timpului de lucru',
    desc: 'Reducerea considerabilă a timpului de lucru și eliminarea în proporție de cel puțin 90% a erorilor umane prin standardizarea documentelor.'
  }, {
    num: '02',
    key: 'Simplificare',
    rest: ' și eficientizare',
    desc: 'Modalități de lucru care simplifică interpretarea informațiilor complexe. Ecosisteme eficiente cu rezultate ce au impact real.'
  }, {
    num: '03',
    key: 'Digitalizare',
    rest: ' și standardizare',
    desc: 'Digitalizarea activităților administrative prin instrumente personalizate. Performanța apare când toți respectă un mod de lucru comun.'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "home-page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hbg",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hbg-grid"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hbg-b1"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hbg-b2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hbg-b3"
  })), /*#__PURE__*/React.createElement("section", {
    className: "hero hero-video-section"
  }, /*#__PURE__*/React.createElement("video", {
    className: "hero-video",
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    preload: "metadata"
  }, /*#__PURE__*/React.createElement("source", {
    src: "assets/videos_library/retea-date-digitala-achizitii-publice-informs.mp4",
    type: "video/mp4"
  }), /*#__PURE__*/React.createElement("track", {
    kind: "captions",
    src: "",
    label: "Rom\xE2n\u0103",
    srclang: "ro",
    default: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "hero-video-overlay"
  }), /*#__PURE__*/React.createElement("div", {
    className: "container hero-center-content"
  }, /*#__PURE__*/React.createElement("p", {
    className: "h-label"
  }, "Achizi\u021Bii publice \xA0\xB7\xA0 Delegare servicii de utilit\u0103\u021Bi publice \xA0\xB7\xA0 Digitalizare"), /*#__PURE__*/React.createElement(AnimatedHeadline, {
    lines: ['Formulare inteligente.', 'Documentații complete.'],
    startDelay: 0.28
  }), /*#__PURE__*/React.createElement("p", {
    className: "hero-sub h-sub",
    style: {
      animationDelay: '0.72s'
    }
  }, "Solu\u021Bii adaptate pentru sectorul public \u0219i privat - modele de lucru conforme legisla\u021Biei, asisten\u021B\u0103 tehnic\u0103 de specialitate \u0219i documenta\u021Bii complete."), /*#__PURE__*/React.createElement("div", {
    className: "hero-actions h-actions",
    style: {
      animationDelay: '0.92s',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, "Autoritate contractant\u0103"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, "Ofertant")))), /*#__PURE__*/React.createElement("div", {
    className: "stats-strip"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "stats-strip-inner"
  }, [{
    to: 15,
    suffix: '+',
    lbl: 'Ani în achiziții publice',
    det: 'experiență acumulată',
    icon: /*#__PURE__*/React.createElement(IcoNote, {
      size: 38
    })
  }, {
    to: 500,
    suffix: '+',
    lbl: 'Ore consultanță/an',
    det: 'unu la unu',
    icon: /*#__PURE__*/React.createElement(IcoUserAlt, {
      size: 38
    })
  }, {
    to: 90,
    suffix: '%',
    lbl: 'Reducere erori umane',
    det: 'prin standardizare',
    icon: /*#__PURE__*/React.createElement(IcoShieldLib, {
      size: 38
    })
  }, {
    to: 3,
    suffix: '',
    lbl: 'Formate de lucru',
    det: 'Excel · Word · PDF',
    icon: /*#__PURE__*/React.createElement(IcoDoc, {
      size: 38
    })
  }].map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "stat-col"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '10px',
      color: 'rgba(255,255,255,.6)'
    }
  }, s.icon), /*#__PURE__*/React.createElement("div", {
    className: "s-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "stat-num-anim"
  }, s.to, s.suffix)), /*#__PURE__*/React.createElement("div", {
    className: "s-lbl",
    style: {
      fontSize: '16px'
    }
  }, s.lbl), /*#__PURE__*/React.createElement("div", {
    className: "s-det",
    style: {
      fontSize: '13px'
    }
  }, s.det)))))), /*#__PURE__*/React.createElement("div", {
    className: "trust-strip"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "trust-inner"
  }, ['Conform legislației în vigoare', 'Actualizat constant', 'Aplicabilitate directă', 'Asistență tehnică inclusă', 'Excel · Word · PDF inteligent'].map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "trust-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "trust-dot"
  }), /*#__PURE__*/React.createElement("span", null, t)))))), /*#__PURE__*/React.createElement("section", {
    className: "sec sec-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(FadeUp, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: '48px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "badge",
    style: {
      marginBottom: '14px'
    }
  }, "Context opera\u021Bional"), /*#__PURE__*/React.createElement("h2", null, "Provoc\u0103ri"), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: '560px',
      margin: '12px auto 0',
      fontSize: '16.5px'
    }
  }, "Mediul administrativ \u0219i de achizi\u021Bii publice genereaz\u0103, \xEEn mod obiectiv, o serie de dificult\u0103\u021Bi recurente ce pot afecta eficien\u021Ba institu\u021Bional\u0103."))), /*#__PURE__*/React.createElement(FadeUp, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    className: "prov-two-cards"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prov-card prov-card-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prov-card-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prov-icon-x"
  }, "!"), /*#__PURE__*/React.createElement("span", {
    className: "prov-header-label prov-header-label-left"
  }, "Provoc\u0103ri")), [{
    title: 'Documentații cu lacune procedurale',
    desc: 'Absența unor elemente obligatorii în documentații generează vulnerabilități juridice și riscuri de contestație.'
  }, {
    title: 'Inconsistențe generate de procesarea manuală',
    desc: 'Redactarea manuală a documentelor standardizate este susceptibilă la erori repetitive și neuniformitate în aplicare.'
  }, {
    title: 'Cadru legislativ în continuă evoluție',
    desc: 'Modificările frecvente ale legislației impun actualizarea constantă a documentelor și procedurilor aplicabile.'
  }, {
    title: 'Resurse temporale alocate documentației',
    desc: 'Elaborarea documentelor de rutină consumă resurse semnificative ce ar putea fi direcționate spre activități cu valoare adăugată superioară.'
  }].map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "prov-card-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prov-icon-x"
  }, "!"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "prov-item-title"
  }, item.title), /*#__PURE__*/React.createElement("div", {
    className: "prov-item-desc"
  }, item.desc))))), /*#__PURE__*/React.createElement("div", {
    className: "prov-card prov-card-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prov-card-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prov-icon-check"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", {
    className: "prov-header-label prov-header-label-right"
  }, "Ce facem la INFORMS")), [{
    title: 'Modele integral verificate juridic',
    desc: 'Fiecare instrument respectă cerințele legale în vigoare, reducând expunerea instituțională la erori procedurale.'
  }, {
    title: 'Standardizare și automatizare',
    desc: 'Modelele structurate elimină variabilitatea umană, asigurând uniformitate și o rată de eroare redusă cu până la 90%.'
  }, {
    title: 'Actualizare permanentă',
    desc: 'Instrumentele INFORMS sunt revizuite și actualizate în concordanță cu orice modificare legislativă relevantă.'
  }, {
    title: 'Eficiență operațională imediată',
    desc: 'Aplicabilitatea directă a instrumentelor reduce substanțial timpul alocat documentației administrative.'
  }].map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "prov-card-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prov-icon-check"
  }, "\u2713"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "prov-item-title"
  }, item.title), /*#__PURE__*/React.createElement("div", {
    className: "prov-item-desc"
  }, item.desc))))))), /*#__PURE__*/React.createElement(FadeUp, {
    delay: 320
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: '40px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => go('contact')
  }, "Solicit\u0103 o consultare"))))), /*#__PURE__*/React.createElement("div", {
    className: "feat-strip"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "feat-grid"
  }, features.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "feat-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "feat-icon"
  }, f.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, f.title), /*#__PURE__*/React.createElement("p", null, f.desc))))))), /*#__PURE__*/React.createElement("section", {
    className: "sec dom-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(FadeUp, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: '56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "badge badge-white",
    style: {
      marginBottom: '16px'
    }
  }, "Domenii de activitate"), /*#__PURE__*/React.createElement("h2", {
    style: {
      color: '#fff'
    }
  }, "Expertiz\u0103 \xEEn domenii-cheie"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,255,255,.58)',
      maxWidth: '520px',
      margin: '14px auto 0',
      fontSize: '16.5px',
      lineHeight: 1.75
    }
  }, "Peste 15 ani de experien\u021B\u0103 concentrat\u0103 \xEEn domeniile cu cel mai mare impact pentru administra\u021Bia public\u0103."))), /*#__PURE__*/React.createElement("div", {
    className: "dom-grid"
  }, domains.map((d, i) => /*#__PURE__*/React.createElement(FadeUp, {
    key: i,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("div", {
    className: "dom-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dom-card-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dom-icon"
  }, d.icon), /*#__PURE__*/React.createElement("span", {
    className: "dom-num"
  }, d.num)), /*#__PURE__*/React.createElement("h3", {
    className: "dom-title"
  }, d.label), /*#__PURE__*/React.createElement("p", {
    className: "dom-desc"
  }, d.desc))))))), /*#__PURE__*/React.createElement("section", {
    className: "sec sec-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(FadeUp, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: '48px',
      flexWrap: 'wrap',
      gap: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "badge",
    style: {
      marginBottom: '14px'
    }
  }, "Ce oferim"), /*#__PURE__*/React.createElement("h2", null, "Serviciile noastre"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '1.12rem',
      color: 'var(--text-2)',
      marginTop: '10px',
      maxWidth: 480
    }
  }, "Solu\u021Bii complete pentru institu\u021Bii publice, companii \u0219i liber-profesioni\u0219ti.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline btn-sm",
    onClick: () => go('servicii')
  }, "Toate serviciile ", /*#__PURE__*/React.createElement(IcoRightAlt, {
    size: 14
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px'
    }
  }, [{
    icon: /*#__PURE__*/React.createElement(IcoNote, {
      size: 22
    }),
    title: 'Documentații complete',
    desc: 'Achiziții publice, administrație, delegare servicii, management documente.',
    items: ['Instituții publice', 'Companii', 'Liber-profesioniști'],
    page: 'achizitii-publice'
  }, {
    icon: /*#__PURE__*/React.createElement(IcoWrench, {
      size: 22
    }),
    title: 'Instrumente de lucru specifice',
    desc: 'Instrumente avansate pentru eficientizarea și standardizarea oricărei activități.',
    items: ['Modele Excel', 'Modele Word', 'PDF inteligent'],
    page: 'modele-excel'
  }, {
    icon: /*#__PURE__*/React.createElement(IcoUserAlt, {
      size: 22
    }),
    title: 'Asistență tehnică de specialitate',
    desc: 'Digitalizarea instituțiilor publice și companiilor private. Excel, Word, PDF.',
    items: ['Instruire personal', 'Implementare asistată', 'Actualizări legislative'],
    page: 'analiza-si-solutii'
  }].map((s, i) => /*#__PURE__*/React.createElement(FadeUp, {
    key: i,
    delay: i * 90
  }, /*#__PURE__*/React.createElement("div", {
    className: "card svc-feature-card",
    style: {
      padding: '32px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer'
    },
    onClick: () => go(s.page)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: '12px',
      background: 'var(--blue-lt)',
      color: 'var(--blue)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px',
      flexShrink: 0
    }
  }, s.icon), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginBottom: '10px',
      fontSize: '1.22rem'
    }
  }, s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '15.5px',
      color: 'var(--text-2)',
      lineHeight: '1.72',
      marginBottom: '20px',
      flex: 1
    }
  }, s.desc), /*#__PURE__*/React.createElement("ul", {
    className: "bullet-list",
    style: {
      marginBottom: '20px'
    }
  }, s.items.map((item, j) => /*#__PURE__*/React.createElement("li", {
    key: j
  }, /*#__PURE__*/React.createElement("span", {
    className: "bullet-dot"
  }), item))), /*#__PURE__*/React.createElement("span", {
    className: "card-link",
    style: {
      marginTop: 'auto'
    }
  }, "Detalii ", /*#__PURE__*/React.createElement(IcoRightAlt, {
    size: 14
  })))))))), /*#__PURE__*/React.createElement("section", {
    className: "sec sec-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(FadeUp, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: '40px',
      flexWrap: 'wrap',
      gap: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "badge",
    style: {
      marginBottom: '14px'
    }
  }, "Instrumente de lucru"), /*#__PURE__*/React.createElement("h2", null, "Asigur\u0103 o imagine clar\u0103 activit\u0103\u021Bii tale"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '1.12rem',
      color: 'var(--text-2)',
      marginTop: '10px'
    }
  }, "Eficientizarea a devenit regula de baz\u0103, iar timpul - un bun personal.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '18px'
    }
  }, models.map((m, i) => /*#__PURE__*/React.createElement(FadeUp, {
    key: i,
    delay: i * 65
  }, /*#__PURE__*/React.createElement("div", {
    className: "model-card",
    onClick: () => go(m.page)
  }, /*#__PURE__*/React.createElement("div", {
    className: `model-card-vis cv-${m.cv}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "mc-pat"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mc-badge"
  }, m.tag), /*#__PURE__*/React.createElement("span", {
    className: "mc-tag"
  }, m.tag)), /*#__PURE__*/React.createElement("div", {
    className: "model-card-body"
  }, /*#__PURE__*/React.createElement("h3", null, fmtTitle(m.title)), /*#__PURE__*/React.createElement("p", null, m.desc), /*#__PURE__*/React.createElement("div", {
    className: "mc-pills"
  }, m.pills.map((p, j) => /*#__PURE__*/React.createElement("span", {
    key: j,
    className: "mc-pill"
  }, p))), /*#__PURE__*/React.createElement("span", {
    className: "card-link",
    style: {
      marginTop: '13px'
    }
  }, "Detalii ", /*#__PURE__*/React.createElement(IcoRightAlt, {
    size: 14
  }))))))))), /*#__PURE__*/React.createElement("section", {
    className: "sec obj-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(FadeUp, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: '0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "badge",
    style: {
      marginBottom: '14px'
    }
  }, "Obiective"), /*#__PURE__*/React.createElement("h2", null, "Obiectivele urm\u0103rite"))), /*#__PURE__*/React.createElement("div", {
    className: "obj-grid"
  }, objectives.map((o, i) => /*#__PURE__*/React.createElement(FadeUp, {
    key: i,
    delay: i * 110
  }, /*#__PURE__*/React.createElement("div", {
    className: "obj-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "obj-num-bg"
  }, o.num), /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement("span", {
    className: "obj-key"
  }, o.key), o.rest), /*#__PURE__*/React.createElement("p", null, o.desc))))))), /*#__PURE__*/React.createElement("section", {
    className: "sec sec-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(FadeUp, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '48px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "badge",
    style: {
      marginBottom: '14px'
    }
  }, "Portofoliu servicii"), /*#__PURE__*/React.createElement("h2", null, "Ce facem la INFORMS"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '1.12rem',
      color: 'var(--text-2)',
      marginTop: '10px',
      maxWidth: 520
    }
  }, "Servicii specializate, structurate \xEEn func\u021Bie de rolul t\u0103u \xEEn procedura de achizi\u021Bie."))), /*#__PURE__*/React.createElement("div", {
    className: "audience-grid"
  }, /*#__PURE__*/React.createElement(FadeUp, null, /*#__PURE__*/React.createElement("div", {
    className: "audience-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "audience-accent"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "audience-type-badge"
  }, "Autoritate contractant\u0103"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '16px 0 8px',
      fontSize: '1.3rem'
    }
  }, "Achizitor public"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '15.5px',
      color: 'var(--text-2)',
      lineHeight: 1.72,
      marginBottom: '24px'
    }
  }, "Documenta\u021Bii complete \u0219i instrumente de lucru pentru organizarea \u0219i derularea procedurilor de achizi\u021Bie public\u0103."), /*#__PURE__*/React.createElement("div", {
    className: "audience-links"
  }, [['achizitii-publice', 'Documentații de atribuire servicii, produse, lucrări'], ['delegare-servicii', 'Delegare servicii de utilități publice'], ['analiza-si-solutii', 'Analiză și soluții personalizate'], ['modele-excel', 'Instrumente Excel pentru calcul și monitorizare'], ['modele-word', 'Formulare și documente tipizate Word'], ['modele-pdf', 'Formulare PDF interactive standardizate']].map(([page, label], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "audience-link-item",
    onClick: () => go(page)
  }, /*#__PURE__*/React.createElement(IcoCheck, {
    size: 14
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, label), /*#__PURE__*/React.createElement(IcoRightAlt, {
    size: 12
  })))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      marginTop: '28px',
      width: '100%',
      justifyContent: 'center'
    },
    onClick: () => go('achizitii-publice')
  }, "Portofoliu achizitor ", /*#__PURE__*/React.createElement(IcoRightAlt, {
    size: 14
  }))))), /*#__PURE__*/React.createElement(FadeUp, {
    delay: 120
  }, /*#__PURE__*/React.createElement("div", {
    className: "audience-card audience-card-navy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "audience-accent audience-accent-light"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "audience-type-badge audience-type-badge-light"
  }, "Ofertant"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '16px 0 8px',
      fontSize: '1.3rem',
      color: '#fff'
    }
  }, "Participant la licita\u021Bii"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '15.5px',
      color: 'rgba(255,255,255,.6)',
      lineHeight: 1.72,
      marginBottom: '24px'
    }
  }, "Instrumente \u0219i servicii pentru preg\u0103tirea ofertelor, calificarea \xEEn proceduri \u0219i contestarea deciziilor nefavorabile."), /*#__PURE__*/React.createElement("div", {
    className: "audience-links"
  }, [['analiza-si-solutii', 'Ofertare completă - tehnic, financiar, calificare'], ['achizitii-publice', 'Contestații CNSC și curți de apel'], ['analiza-si-solutii', 'Analiză de risc și strategie de ofertare'], ['modele-excel', 'Calcul automat preț ofertă'], ['modele-pdf', 'Formulare interactive pentru depunere'], ['achizitii-publice', 'Documentații de calificare complete']].map(([page, label], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "audience-link-item audience-link-item-light",
    onClick: () => go(page)
  }, /*#__PURE__*/React.createElement(IcoCheck, {
    size: 14
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, label), /*#__PURE__*/React.createElement(IcoRightAlt, {
    size: 12
  })))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    style: {
      marginTop: '28px',
      width: '100%',
      justifyContent: 'center'
    },
    onClick: () => go('contact')
  }, "Solicit\u0103 ofert\u0103 ", /*#__PURE__*/React.createElement(IcoRightAlt, {
    size: 14
  })))))))), /*#__PURE__*/React.createElement("section", {
    className: "sec proc-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(FadeUp, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "badge",
    style: {
      marginBottom: '14px'
    }
  }, "Cum lucr\u0103m"), /*#__PURE__*/React.createElement("h2", null, "Un proces simplu, rezultate clare"), /*#__PURE__*/React.createElement("p", {
    className: "lead",
    style: {
      maxWidth: 520,
      margin: '12px auto 0'
    }
  }, "De la prima discu\u021Bie p\xE2n\u0103 la implementarea complet\u0103 - fiecare pas este structurat \u0219i transparent."))), /*#__PURE__*/React.createElement("div", {
    className: "process-grid"
  }, [{
    num: '01',
    title: 'Analizăm',
    desc: 'Înțelegem situația, obiectivele și cerințele specifice ale activității tale'
  }, {
    num: '02',
    title: 'Elaborăm',
    desc: 'Creăm sau adaptăm documentațiile conform nevoilor și legislației în vigoare'
  }, {
    num: '03',
    title: 'Implementăm',
    desc: 'Te însoțim pas cu pas în aplicarea corectă a instrumentelor de lucru'
  }, {
    num: '04',
    title: 'Actualizăm',
    desc: 'Documentele rămân permanent conforme cu modificările legislative'
  }].map((s, i) => /*#__PURE__*/React.createElement(FadeUp, {
    key: i,
    delay: i * 90
  }, /*#__PURE__*/React.createElement("div", {
    className: "proc-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proc-num"
  }, s.num), /*#__PURE__*/React.createElement("h4", null, s.title), /*#__PURE__*/React.createElement("p", null, s.desc))))))), /*#__PURE__*/React.createElement("section", {
    className: "sec sec-pale"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(FadeUp, null, /*#__PURE__*/React.createElement("div", {
    className: "quote-card"
  }, /*#__PURE__*/React.createElement("blockquote", {
    className: "quote-text"
  }, "Exist\u0103 un singur tip de succes - acela de a-\u021Bi putea petrece timpul a\u0219a cum \xEE\u021Bi dore\u0219ti."), /*#__PURE__*/React.createElement("p", {
    className: "quote-author"
  }, "Christopher Morley"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      fontSize: '15px',
      padding: '13px 36px'
    },
    onClick: () => go('contact')
  }, "Contacteaz\u0103-ne"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    style: {
      fontSize: '15px',
      padding: '13px 36px'
    },
    onClick: () => go('servicii')
  }, "Descoper\u0103 serviciile")))))));
}
Object.assign(window, {
  HomePage
});

})();