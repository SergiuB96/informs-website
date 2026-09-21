(function(){
const {
  useState
} = React;
const ArrowIcon = () => /*#__PURE__*/React.createElement(IcoRightAlt, {
  size: 14
});

/* ══════════════════════════════════════
   DESPRE NOI
══════════════════════════════════════ */
function AboutPage({
  onNav
}) {
  const go = p => {
    onNav(p);
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "pg-hero pg-hero-video"
  }, /*#__PURE__*/React.createElement("video", {
    className: "pg-hero-vid",
    autoPlay: true,
    muted: true,
    playsInline: true,
    preload: "none"
  }, /*#__PURE__*/React.createElement("source", {
    src: "assets/videos_library/documentatii-achizitii-publice-digitale-informs.mp4",
    type: "video/mp4"
  }), /*#__PURE__*/React.createElement("track", {
    kind: "captions",
    src: "",
    label: "Rom\xE2n\u0103",
    srclang: "ro",
    default: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "pg-hero-overlay"
  }), /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tag-label",
    style: {
      background: 'rgba(255,255,255,0.13)',
      color: 'rgba(255,255,255,0.82)',
      marginBottom: '18px'
    }
  }, "Cine suntem"), /*#__PURE__*/React.createElement("h1", null, "Despre noi"), /*#__PURE__*/React.createElement("p", null, "Optimiz\u0103m \u0219i eficientiz\u0103m fluxul de lucru cu instrumente profesionale cu aplicabilitate direct\u0103."))), /*#__PURE__*/React.createElement("section", {
    className: "sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "two-col",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '64px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(FadeUp, null, /*#__PURE__*/React.createElement("div", {
    className: "tag-label",
    style: {
      marginBottom: '18px'
    }
  }, "Experien\u021B\u0103"), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginBottom: '22px'
    }
  }, "15 ani \xEEn achizi\u021Bii"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '1.12rem',
      lineHeight: '1.82',
      color: 'var(--text-muted)',
      marginBottom: '16px'
    }
  }, "Totul transpus \xEEn cuno\u0219tin\u021Be acumulate, test\u0103ri, consultan\u021B\u0103 general\u0103, c\xE2t \u0219i unu la unu, livrabile individuale \u0219i documenta\u021Bii complete."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '1.12rem',
      lineHeight: '1.82',
      color: 'var(--text-muted)',
      marginBottom: '16px'
    }
  }, "Parteneri \u0219i colaboratori de \xEEncredere, dedica\u021Bi serviciilor de calitate \u0219i \xEEndeplinirii obiectivelor stabilite."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '1.12rem',
      lineHeight: '1.82',
      color: 'var(--text-muted)'
    }
  }, "Ne extindem continuu domeniile de expertiz\u0103 \u0219i ne \xEEmbun\u0103t\u0103\u021Bim constant serviciile \xEEn func\u021Bie de cerin\u021Bele fiec\u0103rui beneficiar.")), /*#__PURE__*/React.createElement(FadeUp, {
    delay: 180
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px'
    }
  }, [{
    num: '15+',
    label: 'Ani de experiență'
  }, {
    num: '500+',
    label: 'Ore consultanță/an'
  }, {
    num: '100%',
    label: 'Dedicare'
  }, {
    num: '3',
    label: 'Formate de lucru'
  }].map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "card",
    style: {
      padding: '28px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-num"
  }, s.num), /*#__PURE__*/React.createElement("div", {
    className: "stat-label"
  }, s.label)))))))), /*#__PURE__*/React.createElement("section", {
    className: "sec sec-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "two-col",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '64px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(FadeUp, null, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)',
      background: 'var(--blue-light)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://static.wixstatic.com/media/ab6452_973096b654dc46358c274ec6723db63d~mv2.webp/v1/fill/w_484,h_455,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/business-idea-generation-plan-development-pensive-man-with-lightbulb-cartoon-character-tec.webp",
    alt: "O singur\u0103 viziune",
    style: {
      width: '100%',
      display: 'block'
    },
    onError: e => {
      e.target.style.display = 'none';
    }
  }))), /*#__PURE__*/React.createElement(FadeUp, {
    delay: 160
  }, /*#__PURE__*/React.createElement("div", {
    className: "tag-label",
    style: {
      marginBottom: '18px'
    }
  }, "Echipa noastr\u0103"), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginBottom: '22px'
    }
  }, "O singur\u0103 viziune"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '1.12rem',
      lineHeight: '1.82',
      color: 'var(--text-muted)',
      marginBottom: '24px'
    }
  }, "O echip\u0103 de profesioni\u0219ti cu specializ\u0103ri \xEEn domeniile juridic, economic, achizi\u021Bii publice, IT, statistic\u0103 \u0219i managementul afacerilor."), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      borderLeft: '3px solid var(--blue-accent)',
      paddingLeft: '22px',
      fontStyle: 'italic',
      fontSize: '1.08rem',
      color: 'var(--navy)',
      lineHeight: '1.72'
    }
  }, "\u201EPerforman\u021B\u0103 \u0219i eficien\u021B\u0103 prin simplificarea \u0219i inovarea proceselor de lucru.\""))))), /*#__PURE__*/React.createElement("section", {
    className: "sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "two-col",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '64px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(FadeUp, null, /*#__PURE__*/React.createElement("div", {
    className: "tag-label",
    style: {
      marginBottom: '18px'
    }
  }, "Consultan\u021B\u0103"), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginBottom: '22px'
    }
  }, "Peste 500 ore/an"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '1.12rem',
      lineHeight: '1.82',
      color: 'var(--text-muted)',
      marginBottom: '18px'
    }
  }, "Consultan\u021B\u0103 unu la unu pentru institu\u021Biile publice \u0219i companiile private care au apelat la serviciile noastre."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '1.12rem',
      lineHeight: '1.82',
      color: 'var(--text-muted)',
      marginBottom: '34px'
    }
  }, "Asisten\u021B\u0103 tehnico-economic\u0103 de specialitate \u0219i instruirea personalului \xEEn asimilarea \u0219i utilizarea termenilor \u0219i a dispozi\u021Biilor legale cu grad ridicat de complexitate."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '14px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => go('achizitii-publice')
  }, "Achizi\u021Bii publice"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline",
    onClick: () => go('delegare-servicii')
  }, "Delegare servicii"))), /*#__PURE__*/React.createElement(FadeUp, {
    delay: 160
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)',
      background: 'var(--blue-light)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://static.wixstatic.com/media/ab6452_50c8e137fc03415c9b44c9d8cd5d68c2~mv2.webp/v1/fill/w_623,h_592,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/statistics-data-analysis-financial-administration-circular-diagram-with-colorful-segments-.webp",
    alt: "Analiz\u0103 \u0219i statistici",
    style: {
      width: '100%',
      display: 'block'
    },
    onError: e => {
      e.target.style.display = 'none';
    }
  })))))), /*#__PURE__*/React.createElement("section", {
    className: "sec sec-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(FadeUp, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: '52px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "tag-label"
  }, "Produse"), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: '16px'
    }
  }, "Instrumente actualizate constant"), /*#__PURE__*/React.createElement("p", {
    className: "lead",
    style: {
      maxWidth: 520,
      margin: '14px auto 0'
    }
  }, "Transpuse \xEEn Microsoft Excel, Microsoft Word \u0219i Adobe PDF."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '24px'
    }
  }, [{
    title: 'Modele EXCEL',
    desc: 'Instrumente avansate de calcul și analiză pentru domenii specifice.',
    page: 'modele-excel'
  }, {
    title: 'Modele WORD',
    desc: 'Documente tipizate și formulare personalizabile în format Word.',
    page: 'modele-word'
  }, {
    title: 'Modele PDF inteligent',
    desc: 'Formulare electronice interactive în format PDF standardizat.',
    page: 'modele-pdf'
  }].map((item, i) => /*#__PURE__*/React.createElement(FadeUp, {
    key: i,
    delay: i * 100
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: '28px',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    onClick: () => go(item.page)
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      marginBottom: '10px'
    }
  }, item.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '15.5px',
      color: 'var(--text-muted)',
      flex: 1
    }
  }, item.desc), /*#__PURE__*/React.createElement("span", {
    className: "card-link"
  }, "Detalii ", /*#__PURE__*/React.createElement(ArrowIcon, null)))))))));
}

/* ══════════════════════════════════════
   SERVICII - OVERVIEW
══════════════════════════════════════ */
function ServicesPage({
  onNav
}) {
  const go = p => {
    onNav(p);
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  };
  const list = [{
    page: 'analiza-si-solutii',
    title: 'Analiză și soluții personalizate',
    desc: 'Analizăm situația prezentată și oferim soluții concrete, aplicate, care răspund tuturor cerințelor.',
    tag: 'Consultanță'
  }, {
    page: 'achizitii-publice',
    title: 'Achiziții publice',
    desc: 'Documentații complete pentru atribuirea contractelor de servicii, produse și lucrări.',
    tag: 'Documentații'
  }, {
    page: 'delegare-servicii',
    title: 'Delegare servicii de utilități publice',
    desc: 'Documentații pentru gestiunea serviciilor de utilități publice: salubrizare, transport, iluminat.',
    tag: 'Documentații'
  }, {
    page: 'modele-excel',
    title: 'Modele de lucru EXCEL',
    desc: 'Instrumente de lucru cu aplicabilitate generală și specifică, în format editabil Excel.',
    tag: 'Instrumente'
  }, {
    page: 'modele-word',
    title: 'Modele de lucru WORD',
    desc: 'Instrumente de lucru cu aplicabilitate generală și specifică, în format editabil Word.',
    tag: 'Instrumente'
  }, {
    page: 'modele-pdf',
    title: 'Modele de lucru PDF inteligent',
    desc: 'Instrumente de lucru cu aplicabilitate generală și specifică, în format PDF inteligent.',
    tag: 'Instrumente'
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "pg-hero pg-hero-video"
  }, /*#__PURE__*/React.createElement("video", {
    className: "pg-hero-vid",
    autoPlay: true,
    muted: true,
    playsInline: true,
    preload: "none"
  }, /*#__PURE__*/React.createElement("source", {
    src: "assets/videos_library/documentatii-achizitii-publice-digitale-informs.mp4",
    type: "video/mp4"
  })), /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tag-label",
    style: {
      background: 'rgba(255,255,255,0.13)',
      color: 'rgba(255,255,255,0.82)',
      marginBottom: '18px'
    }
  }, "Ce oferim"), /*#__PURE__*/React.createElement("h1", null, "Servicii"), /*#__PURE__*/React.createElement("p", null, "Solu\u021Bii complete pentru institu\u021Bii publice, companii \u0219i liber-profesioni\u0219ti."))), /*#__PURE__*/React.createElement("section", {
    className: "sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px'
    }
  }, list.map((s, i) => /*#__PURE__*/React.createElement(FadeUp, {
    key: i,
    delay: i * 60
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: '28px',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    onClick: () => go(s.page)
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag-label",
    style: {
      marginBottom: '16px',
      alignSelf: 'flex-start'
    }
  }, s.tag), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginBottom: '10px'
    }
  }, s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '14px',
      color: 'var(--text-muted)',
      lineHeight: '1.72',
      flex: 1
    }
  }, s.desc), /*#__PURE__*/React.createElement("span", {
    className: "card-link"
  }, "Detalii ", /*#__PURE__*/React.createElement(ArrowIcon, null)))))))));
}

/* ══════════════════════════════════════
   SERVICE DETAIL - template
══════════════════════════════════════ */
function ServiceDetailPage({
  onNav,
  service
}) {
  const go = p => {
    onNav(p);
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  };
  const data = {
    'analiza-si-solutii': {
      title: 'Analiză și soluții personalizate',
      sub: 'Soluții concrete bazate pe date reale',
      desc: 'Pe baza datelor de intrare solicitate, analizăm situația prezentată și îți oferim soluții concrete, aplicate, care să răspundă tuturor cerințelor și obiectivelor stabilite.',
      items: ['Evaluare și analiză expertă', 'Soluții personalizate pentru fiecare nevoie', 'Rapoarte detaliate', 'Implementare asistată'],
      img: 'https://static.wixstatic.com/media/ab6452_9bdced09566642e99bef512302a368d7~mv2.webp/v1/fill/w_954,h_972,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Layer%203.webp',
      video: 'assets/videos_library/achizitii-publice.mp4',
      split: true
    },
    'achizitii-publice': {
      title: 'Achiziții publice',
      sub: 'Documentații complete pentru proceduri de achiziție',
      desc: 'Elaborăm documentații complete în domeniul achizițiilor publice. Oferim asistență și suport în derularea procedurilor, de la elaborarea documentelor până la evaluarea ofertelor.',
      items: ['Documentații de atribuire', 'Servicii de ofertare (calificare, tehnic, financiar)', 'Evaluarea ofertelor depuse', 'Răspunsuri în fața CNSC și curților de apel'],
      img: 'https://static.wixstatic.com/media/ab6452_990466dc460d40a1b91200dc7080f012~mv2.webp/v1/fill/w_968,h_958,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Layer%201.webp',
      video: 'assets/videos_library/achizitii-publice.mp4',
      split: true
    },
    'delegare-servicii': {
      title: 'Delegare servicii de utilități publice',
      sub: 'Documentații complete pentru gestiunea serviciilor',
      desc: 'Elaborăm documentații complete pentru gestiunea serviciilor de utilități publice, adaptate conform legislației în vigoare.',
      items: ['Salubrizare', 'Transport public', 'Iluminat public', 'Alte servicii de utilitate publică'],
      img: 'https://static.wixstatic.com/media/ab6452_9bdced09566642e99bef512302a368d7~mv2.webp/v1/fill/w_954,h_972,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Layer%203.webp',
      video: 'assets/videos_library/Delegare-Servicii-Utilitati-Publice.mp4',
      split: true
    },
    'modele-excel': {
      title: 'Modele de lucru EXCEL',
      sub: 'Instrumente avansate în format Excel',
      desc: 'Complexitatea și volumul informațiilor nu trebuie să reprezinte un impediment. Instrumentele Excel sunt concepute pentru a simplifica activitatea și a reduce erorile umane.',
      items: ['Aplicabilitate generală', 'Aplicabilitate specifică domeniului', 'Format editabil și personalizabil', 'Actualizate conform legislației'],
      img: 'https://static.wixstatic.com/media/ab6452_dfa86221bf384275a44be40c2b4a1bf0~mv2.webp/v1/fill/w_650,h_424,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Layer%205.webp',
      video: 'assets/videos_library/excel-doc.mp4',
      split: true
    },
    'modele-word': {
      title: 'Modele de lucru WORD',
      sub: 'Documente tipizate și formulare personalizabile',
      desc: 'Cererile și formularele tipizate clasice în format scanat sunt de domeniul trecutului. Digitalizează-ți activitatea și zilnic salvezi timp prețios.',
      items: ['Formulare tipizate', 'Cereri standardizate', 'Documente administrative', 'Format editabil'],
      img: 'https://static.wixstatic.com/media/ab6452_f425c6e6bc7d4aad8604f8e2f0b758bd~mv2.webp/v1/fill/w_650,h_424,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Layer%202.webp',
      video: 'assets/videos_library/word-doc.mp4',
      split: true
    },
    'modele-pdf': {
      title: 'Modele de lucru PDF inteligent',
      sub: 'Formulare electronice interactive',
      desc: 'E timpul să renunți la completarea clasică. Lucrează în mod inteligent cu modele standard în format electronic, ușor de completat și de arhivat.',
      items: ['Formulare interactive', 'Câmpuri de completare automată', 'Format standardizat', 'Compatibil Adobe Acrobat'],
      img: 'https://static.wixstatic.com/media/ab6452_6c32cfd5b5744ffaa00d4c5cf86916c1~mv2.webp/v1/fill/w_650,h_424,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Layer%204.webp',
      video: 'assets/videos_library/pdf-doc.mp4',
      split: true
    }
  };
  const d = data[service] || data['analiza-si-solutii'];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: `pg-hero${d.video ? ' pg-hero-video pg-hero-svc' : ''}`
  }, d.video && /*#__PURE__*/React.createElement("video", {
    key: d.video,
    className: `pg-hero-vid${d.split ? ' pg-hero-vid-right' : ''}`,
    autoPlay: true,
    muted: true,
    playsInline: true,
    preload: "none"
  }, /*#__PURE__*/React.createElement("source", {
    src: d.video,
    type: "video/mp4"
  }), /*#__PURE__*/React.createElement("track", {
    kind: "captions",
    src: "",
    label: "Rom\xE2n\u0103",
    srclang: "ro",
    default: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tag-label",
    style: {
      background: 'rgba(6,24,48,.08)',
      color: 'var(--navy)',
      marginBottom: '18px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    },
    onClick: () => go('servicii')
  }, /*#__PURE__*/React.createElement(IcoLeftAlt, {
    size: 14
  }), " Servicii"), /*#__PURE__*/React.createElement("h1", {
    style: {
      color: 'var(--navy)'
    }
  }, fmtTitle(d.title)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-2)'
    }
  }, d.sub))), /*#__PURE__*/React.createElement("section", {
    className: "sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "two-col",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '64px',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(FadeUp, null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '1.12rem',
      lineHeight: '1.82',
      color: 'var(--text-muted)',
      marginBottom: '34px'
    }
  }, d.desc), /*#__PURE__*/React.createElement("h4", {
    style: {
      marginBottom: '18px',
      color: 'var(--navy)'
    }
  }, "Ce include:"), /*#__PURE__*/React.createElement("ul", {
    className: "bullet-list",
    style: {
      marginBottom: '38px'
    }
  }, d.items.map((item, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "bullet-dot"
  }), item))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '14px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => go('contact')
  }, "Solicit\u0103 ofert\u0103"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline",
    onClick: () => go('servicii')
  }, "Toate serviciile"))), /*#__PURE__*/React.createElement(FadeUp, {
    delay: 160
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)',
      background: 'var(--blue-light)',
      marginBottom: '24px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: d.img,
    alt: d.title,
    style: {
      width: '100%',
      display: 'block'
    },
    onError: e => {
      e.target.style.display = 'none';
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--blue-pale)',
      borderRadius: '16px',
      padding: '28px'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      marginBottom: '16px',
      color: 'var(--navy)'
    }
  }, "Cui ne adres\u0103m?"), ['Instituții publice', 'Companii private', 'Liber-profesioniști'].map((item, i, arr) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: '12px 0',
      borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14.5px',
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "bullet-dot"
  }), item))))))));
}

/* ══════════════════════════════════════
   MATERIALE GRATUITE
══════════════════════════════════════ */
function MaterialeGratuitePage({
  onNav
}) {
  const go = p => {
    onNav(p);
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "pg-hero pg-hero-video"
  }, /*#__PURE__*/React.createElement("video", {
    className: "pg-hero-vid",
    autoPlay: true,
    muted: true,
    playsInline: true,
    preload: "none"
  }, /*#__PURE__*/React.createElement("source", {
    src: "assets/videos_library/formulare-pdf-inteligent-institutii-publice.mp4",
    type: "video/mp4"
  }), /*#__PURE__*/React.createElement("track", {
    kind: "captions",
    src: "",
    label: "Rom\xE2n\u0103",
    srclang: "ro",
    default: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "pg-hero-overlay"
  }), /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tag-label",
    style: {
      background: 'rgba(255,255,255,0.13)',
      color: 'rgba(255,255,255,0.82)',
      marginBottom: '18px'
    }
  }, "Gratuit"), /*#__PURE__*/React.createElement("h1", null, "Materiale gratuite"), /*#__PURE__*/React.createElement("p", null, "Resurse utile disponibile gratuit pentru a-\u021Bi facilita munca."))), /*#__PURE__*/React.createElement("section", {
    className: "sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      maxWidth: '640px',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(FadeUp, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '72px 40px',
      background: 'var(--blue-pale)',
      borderRadius: '24px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      marginBottom: '16px',
      fontSize: '1.5rem'
    }
  }, "Sec\u021Biune \xEEn preg\u0103tire"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      marginBottom: '36px',
      fontSize: '1.05rem',
      lineHeight: '1.75'
    }
  }, "Lucr\u0103m la preg\u0103tirea materialelor gratuite. Revino \xEEn cur\xE2nd sau contacteaz\u0103-ne pentru informa\u021Bii suplimentare."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => go('contact')
  }, "Contacteaz\u0103-ne"))))));
}
Object.assign(window, {
  AboutPage,
  ServicesPage,
  ServiceDetailPage
});

})();