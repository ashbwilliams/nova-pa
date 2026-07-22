import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";
import type { FundraisingPackageSettings } from "@/lib/fundraising-package";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function escapeHtml(value: string | number) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function displayDate(value: string) {
  if (!value) return "Undated";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

function safeLink(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? escapeHtml(url.toString())
      : "#";
  } catch {
    return "#";
  }
}

function paragraphs(value: string) {
  return value
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`)
    .join("");
}

const stylesheet = String.raw`
:root{--ink:#0b1118;--slate:#20332d;--slate-2:#2c4740;--paper:#edf2ee;--white:#fbfcfa;--muted:#5e6e67;--line:#c7d2cb;--moss:#4f6f66;--moss-light:#afc4b8;--firefly:#edf5cc;--gold:#c8a95b;--content:1160px;--sans:"Helvetica Neue",Helvetica,Arial,sans-serif;--serif:Georgia,"Times New Roman",serif}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.65}a{color:inherit}.site-nav{position:sticky;z-index:20;top:0;display:flex;align-items:center;justify-content:space-between;gap:2rem;padding:.85rem max(1.25rem,calc((100vw - var(--content))/2));border-bottom:1px solid rgba(255,255,255,.16);background:rgba(32,51,45,.97);color:var(--white)}.brand{display:flex;align-items:center;gap:.75rem;text-decoration:none}.brand img{width:34px;height:38px;object-fit:contain}.brand span{font-size:.69rem;font-weight:800;letter-spacing:.11em;text-transform:uppercase}.nav-links{display:flex;align-items:center;gap:1.15rem}.nav-links a,.nav-links button{padding:0;border:0;border-bottom:1px solid transparent;background:transparent;color:rgba(255,255,255,.76);font:inherit;font-size:.64rem;font-weight:750;letter-spacing:.07em;text-decoration:none;text-transform:uppercase;cursor:pointer}.nav-links a:hover,.nav-links button:hover{border-color:var(--moss-light);color:white}.hero{position:relative;overflow:hidden;min-height:660px;background:var(--slate);color:var(--white)}.hero-inner{position:relative;z-index:2;display:grid;max-width:var(--content);min-height:660px;grid-template-columns:minmax(0,1.4fr) minmax(280px,.6fr);gap:4rem;align-items:center;margin:auto;padding:5.5rem 1.25rem}.hero-copy{max-width:760px}.eyebrow{margin:0;color:var(--moss);font-size:.68rem;font-weight:850;letter-spacing:.12em;text-transform:uppercase}.eyebrow.light{color:var(--moss-light)}h1,h2,h3{font-family:var(--serif);font-weight:600}h1{max-width:780px;margin:.7rem 0 1.1rem;font-size:clamp(3.7rem,7vw,7.4rem);line-height:.91;letter-spacing:-.045em}h1 em{display:block;color:var(--firefly);font-style:normal}.hero-subtitle{max-width:680px;margin:0;color:rgba(255,255,255,.76);font-size:clamp(1.08rem,2vw,1.35rem);line-height:1.6}.recipient{max-width:640px;margin:1.5rem 0 0;padding:1rem 1.1rem;border-left:3px solid var(--moss-light);background:rgba(255,255,255,.06);color:rgba(255,255,255,.78);font-size:.88rem}.hero-actions{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:2rem}.button{display:inline-flex;min-height:49px;align-items:center;justify-content:center;padding:0 1.2rem;border:1px solid var(--moss-light);background:var(--moss-light);color:var(--slate);font-size:.7rem;font-weight:850;letter-spacing:.05em;text-decoration:none;text-transform:uppercase}.button.secondary{background:transparent;color:var(--white)}.hero-mark{position:absolute;right:-7rem;bottom:-8rem;width:520px;opacity:.1}.goal-card{position:relative;z-index:2;padding:1.6rem;border:1px solid rgba(255,255,255,.2);background:rgba(11,17,24,.22)}.goal-card>span{color:rgba(255,255,255,.58);font-size:.65rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.goal-card strong{display:block;margin:.3rem 0;color:var(--firefly);font-family:var(--serif);font-size:3.3rem;font-weight:600}.goal-card p{margin:.25rem 0 0;color:rgba(255,255,255,.68);font-size:.75rem}.progress{height:7px;margin:1.15rem 0 .5rem;background:rgba(255,255,255,.14)}.progress i{display:block;height:100%;background:var(--moss-light)}.goal-meta{display:flex;justify-content:space-between;color:rgba(255,255,255,.6);font-size:.67rem}.section{max-width:var(--content);margin:auto;padding:5.5rem 1.25rem}.section-heading{display:grid;grid-template-columns:.72fr 1.28fr;gap:4rem;align-items:start;margin-bottom:2.5rem}.section-heading h2{max-width:670px;margin:.3rem 0 0;font-size:clamp(2.5rem,5vw,4.5rem);line-height:1}.section-heading p{max-width:670px;margin:0;color:var(--muted);font-size:1rem}.case-lead{max-width:900px;margin:0 0 2.5rem;font-family:var(--serif);font-size:clamp(1.45rem,2.8vw,2.15rem);line-height:1.42}.story-grid{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line);background:var(--white)}.story-grid article{min-height:250px;padding:1.6rem;border-right:1px solid var(--line)}.story-grid article:last-child{border-right:0}.story-grid span{color:var(--moss);font-size:.65rem;font-weight:850;letter-spacing:.1em;text-transform:uppercase}.story-grid h3{margin:.55rem 0 .8rem;font-size:1.55rem}.story-grid p{margin:0;color:var(--muted);font-size:.82rem}.principles{display:grid;grid-template-columns:1fr 1fr;background:var(--slate);color:var(--white)}.principles article{padding:clamp(2rem,5vw,4.5rem)}.principles article:first-child{border-right:1px solid rgba(255,255,255,.16)}.principles h2{max-width:620px;margin:.5rem 0 1rem;font-size:clamp(2.2rem,4vw,3.8rem);line-height:1.05}.principles p{max-width:660px;margin:0;color:rgba(255,255,255,.72)}.funding-shell{background:#e5ece6}.funding-layout{display:grid;grid-template-columns:.9fr 1.1fr;gap:3rem}.allocation-list{border-top:1px solid var(--line)}.allocation{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.4rem 1rem;padding:1rem 0;border-bottom:1px solid var(--line)}.allocation h3{margin:0;font-family:var(--sans);font-size:.86rem}.allocation strong{color:var(--slate);font-family:var(--serif);font-size:1.15rem}.allocation p{grid-column:1/-1;margin:0;color:var(--muted);font-size:.72rem}.bar{grid-column:1/-1;height:4px;background:#cdd9d0}.bar i{display:block;height:100%;background:var(--moss)}.campaign-note{align-self:start;padding:2rem;background:var(--white);border-top:5px solid var(--moss)}.campaign-note strong{display:block;margin:.3rem 0 .85rem;font-family:var(--serif);font-size:2rem;line-height:1.1}.campaign-note p{margin:0;color:var(--muted)}.giving-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}.giving-card{display:grid;min-height:245px;align-content:start;padding:1.4rem;border:1px solid var(--line);background:var(--white)}.giving-card strong{color:var(--moss);font-family:var(--serif);font-size:1.75rem}.giving-card h3{margin:.45rem 0 .65rem;font-size:1.35rem}.giving-card p{margin:0;color:var(--muted);font-size:.78rem}.giving-card:last-child:nth-child(3n+2){grid-column:span 2}.impact-section{background:var(--slate);color:var(--white)}.impact-section .section-heading p{color:rgba(255,255,255,.67)}.impact-grid{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid rgba(255,255,255,.18)}.impact-grid article{min-height:190px;padding:1.4rem;border-right:1px solid rgba(255,255,255,.18)}.impact-grid article:last-child{border-right:0}.impact-grid strong{display:block;color:var(--firefly);font-family:var(--serif);font-size:2.8rem}.impact-grid h3{margin:.25rem 0;font-family:var(--sans);font-size:.78rem;text-transform:uppercase}.impact-grid p{margin:0;color:rgba(255,255,255,.62);font-size:.72rem}.timeline{display:grid;grid-template-columns:repeat(4,1fr);margin-top:2rem}.timeline article{position:relative;padding:1.6rem 1.2rem 0;border-top:1px solid rgba(255,255,255,.25)}.timeline article:before{position:absolute;top:-5px;left:1.2rem;width:9px;height:9px;border-radius:50%;background:var(--moss-light);content:""}.timeline span{color:var(--moss-light);font-size:.63rem;font-weight:850;text-transform:uppercase}.timeline h3{margin:.35rem 0;font-size:1.2rem}.timeline p{margin:0;color:rgba(255,255,255,.62);font-size:.7rem}.donate-section{display:grid;max-width:var(--content);grid-template-columns:1.25fr .75fr;gap:4rem;align-items:center;margin:auto;padding:5.5rem 1.25rem}.donate-section h2{margin:.4rem 0 1rem;font-size:clamp(2.8rem,5vw,5rem);line-height:.96}.donate-section p{max-width:680px;color:var(--muted)}.contact-lines{display:flex;flex-wrap:wrap;gap:.35rem 1rem;margin-top:1rem;color:var(--slate);font-size:.78rem}.contact-lines a{font-weight:700}.qr-card{padding:1.4rem;border:1px solid var(--line);background:var(--white);text-align:center}.qr-card img{width:min(230px,100%);height:auto}.qr-card strong{display:block;margin:.7rem 0 .2rem}.qr-card small{display:block;color:var(--muted)}.legal{max-width:var(--content);margin:auto;padding:2.5rem 1.25rem;border-top:1px solid var(--line);color:var(--muted);font-size:.7rem}.footer{padding:2.5rem max(1.25rem,calc((100vw - var(--content))/2));background:var(--ink);color:rgba(255,255,255,.7)}.footer strong{display:block;color:var(--white);font-family:var(--serif);font-size:1.55rem}.footer div{display:flex;justify-content:space-between;gap:2rem;align-items:end}.footer p{max-width:600px;margin:.5rem 0 0;font-size:.73rem}.footer span{font-size:.65rem}@media(max-width:820px){.site-nav{position:relative}.nav-links a{display:none}.hero-inner,.section-heading,.funding-layout,.principles,.donate-section{grid-template-columns:1fr}.hero-inner{gap:2rem}.goal-card{max-width:460px}.story-grid,.giving-grid,.impact-grid,.timeline{grid-template-columns:1fr 1fr}.story-grid article:nth-child(2){border-right:0}.story-grid article:last-child{border-top:1px solid var(--line)}.principles article:first-child{border-right:0;border-bottom:1px solid rgba(255,255,255,.16)}.impact-grid article:nth-child(2){border-right:0}.impact-grid article:nth-child(-n+2){border-bottom:1px solid rgba(255,255,255,.18)}.giving-card:last-child:nth-child(3n+2){grid-column:auto}}@media(max-width:540px){.hero,.hero-inner{min-height:auto}.hero-inner{padding-top:4rem;padding-bottom:4rem}h1{font-size:3.4rem}.story-grid,.giving-grid,.impact-grid,.timeline{grid-template-columns:1fr}.story-grid article,.impact-grid article{min-height:auto;border-right:0;border-bottom:1px solid var(--line)}.impact-grid article{border-color:rgba(255,255,255,.18)}.timeline article{padding-bottom:1rem}.footer div{display:block}.footer span{display:block;margin-top:1rem}}@media print{html{scroll-behavior:auto}body{background:white;font-size:10.5pt}.site-nav,.hero-actions,.button{display:none!important}.hero,.impact-section,.principles,.footer{-webkit-print-color-adjust:exact;print-color-adjust:exact}.hero,.hero-inner{min-height:0}.hero-inner{padding-top:.55in;padding-bottom:.55in}.hero-mark{width:360px}h1{font-size:46pt}.section{padding-top:.45in;padding-bottom:.45in}.section-heading{margin-bottom:.25in}.section-heading h2{font-size:28pt}.story-grid article{min-height:0}.principles article{padding:.45in}.funding-shell,.impact-section,.donate-section{break-before:page}.giving-card{min-height:0;break-inside:avoid}.impact-grid article{min-height:0}.timeline article{break-inside:avoid}.donate-section{padding-top:.65in;padding-bottom:.45in}.qr-card img{width:1.55in}.footer{padding:.3in}.legal{padding-top:.25in;padding-bottom:.25in}}
`;

export async function buildFundraisingPackageHtml(settings: FundraisingPackageSettings) {
  const mark = await fs.readFile(
    path.join(process.cwd(), "src", "content", "business-plan", "nova-mark.base64"),
    "utf8",
  );
  const markData = `data:image/png;base64,${mark.trim()}`;
  const qrData = settings.donationUrl
    ? await QRCode.toDataURL(settings.donationUrl, {
        width: 360,
        margin: 1,
        color: { dark: "#20332d", light: "#fbfcfa" },
        errorCorrectionLevel: "M",
      })
    : "";
  const remaining = Math.max(0, settings.campaignGoal - settings.amountSecured);
  const securedPercent = settings.campaignGoal
    ? Math.min(100, Math.round((settings.amountSecured / settings.campaignGoal) * 100))
    : 0;
  const maxUse = Math.max(1, ...settings.fundingUses.map((item) => item.amount));
  const preparedFor = settings.preparedFor
    ? `<p class="eyebrow light">Prepared for ${escapeHtml(settings.preparedFor)}</p>`
    : `<p class="eyebrow light">NOVA 8 founding campaign</p>`;
  const recipient = settings.recipientIntroduction
    ? `<div class="recipient">${paragraphs(settings.recipientIntroduction)}</div>`
    : "";
  const fundingUses = settings.fundingUses.map((item) => `
    <article class="allocation">
      <h3>${escapeHtml(item.title)}</h3><strong>${currency.format(item.amount)}</strong>
      <p>${escapeHtml(item.description)}</p>
      <div class="bar"><i style="width:${Math.max(3, Math.round((item.amount / maxUse) * 100))}%"></i></div>
    </article>`).join("");
  const opportunities = settings.givingOpportunities.map((item) => `
    <article class="giving-card">
      <strong>${currency.format(item.amount)}</strong>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
    </article>`).join("");
  const impact = settings.impactMetrics.map((item) => `
    <article><strong>${escapeHtml(item.value)}</strong><h3>${escapeHtml(item.label)}</h3><p>${escapeHtml(item.description)}</p></article>`).join("");
  const timeline = settings.timeline.map((item) => `
    <article><span>${escapeHtml(item.period)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></article>`).join("");
  const contactParts = [
    settings.contactEmail ? `<a href="mailto:${escapeHtml(settings.contactEmail)}">${escapeHtml(settings.contactEmail)}</a>` : "",
    settings.contactPhone ? `<a href="tel:${escapeHtml(settings.contactPhone.replace(/[^+\d]/g, ""))}">${escapeHtml(settings.contactPhone)}</a>` : "",
    settings.contactUrl ? `<a href="${safeLink(settings.contactUrl)}">Contact online</a>` : "",
  ].filter(Boolean).join("");
  const ein = settings.ein ? ` · EIN ${escapeHtml(settings.ein)}` : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(settings.campaignTitle)} | NOVA Performing Arts</title>
  <meta name="description" content="${escapeHtml(settings.campaignSubtitle)}">
  <style>${stylesheet}</style>
</head>
<body>
  <nav class="site-nav" aria-label="Fundraising package">
    <a class="brand" href="#top"><img src="${markData}" alt=""><span>NOVA Performing Arts</span></a>
    <div class="nav-links"><a href="#case">Why NOVA 8</a><a href="#funding">Funding</a><a href="#impact">Impact</a><a href="#give">Give</a><button type="button" onclick="window.print()">Print</button></div>
  </nav>
  <header class="hero" id="top">
    <div class="hero-inner">
      <div class="hero-copy">${preparedFor}<h1>${escapeHtml(settings.campaignTitle)} <em>${escapeHtml(settings.campaignSubtitle)}</em></h1>${recipient}<div class="hero-actions"><a class="button" href="${safeLink(settings.donationUrl)}">Support NOVA 8</a><a class="button secondary" href="#case">Read the case</a></div></div>
      <aside class="goal-card"><span>Founding campaign goal</span><strong>${currency.format(settings.campaignGoal)}</strong><div class="progress"><i style="width:${securedPercent}%"></i></div><div class="goal-meta"><span>${currency.format(settings.amountSecured)} secured</span><span>${securedPercent}%</span></div><p>${currency.format(remaining)} remains to fully fund the campaign.</p></aside>
      <img class="hero-mark" src="${markData}" alt="">
    </div>
  </header>
  <main>
    <section class="section" id="case">
      <div class="section-heading"><div><p class="eyebrow">The case for support</p><h2>More time changes what becomes possible.</h2></div><p>NOVA 8 is designed to complement school music programs while giving students an additional place to develop durable skills, confidence, and belonging.</p></div>
      <div class="case-lead">${paragraphs(settings.caseForSupport)}</div>
      <div class="story-grid"><article><span>01 · The need</span><h3>Development needs time.</h3>${paragraphs(settings.needStatement)}</article><article><span>02 · The response</span><h3>A sustained pathway.</h3>${paragraphs(settings.solutionStatement)}</article><article><span>03 · Why now</span><h3>Ready to deliver.</h3>${paragraphs(settings.readinessStatement)}</article></div>
    </section>
    <section class="principles"><article><p class="eyebrow light">Open student access</p><h2>Families may enroll directly.</h2><p>No director referral, approval, or formal school partnership is required. NOVA controls readiness assessment and placement.</p></article><article><p class="eyebrow light">School-respecting cooperation</p><h2>Built to strengthen, not compete.</h2>${paragraphs(settings.cooperativeStatement)}</article></section>
    <section class="funding-shell" id="funding"><div class="section"><div class="section-heading"><div><p class="eyebrow">The founding campaign</p><h2>Every dollar activates the program.</h2></div><p>The instruments and electronics are already in place. Founding support pays for the people, access, space, safeguards, and operating capacity that turn equipment into a lasting program.</p></div><div class="funding-layout"><div class="allocation-list">${fundingUses}</div><aside class="campaign-note"><p class="eyebrow">Campaign purpose</p><strong>${currency.format(settings.campaignGoal)} for launch readiness</strong><p>Funding supports program delivery and responsible operating commitments, not a major capital-equipment purchase.</p></aside></div></div></section>
    <section class="section"><div class="section-heading"><div><p class="eyebrow">Ways to participate</p><h2>Choose a place to make an impact.</h2></div><p>These opportunities provide useful entry points for individuals, companies, foundations, and community partners. Gifts may be combined or tailored through conversation.</p></div><div class="giving-grid">${opportunities}</div></section>
    <section class="impact-section" id="impact"><div class="section"><div class="section-heading"><div><p class="eyebrow light">Expected Year 1 reach</p><h2>Founding support creates measurable access.</h2></div><p>These are planning targets, not past results. NOVA will report actual enrollment, attendance, student growth, family trust, school usefulness, and return intent after each cycle.</p></div><div class="impact-grid">${impact}</div><div class="timeline">${timeline}</div></div></section>
    <section class="donate-section" id="give"><div><p class="eyebrow">Take the next step</p><h2>Help bring NOVA 8 to life.</h2>${paragraphs(settings.donationInstructions)}<div class="hero-actions"><a class="button" href="${safeLink(settings.donationUrl)}">Open donation page</a></div><div class="contact-lines"><strong>${escapeHtml(settings.contactName)}</strong>${contactParts}</div></div><aside class="qr-card">${qrData ? `<img src="${qrData}" alt="QR code for NOVA's online donation page">` : ""}<strong>Give online</strong><small>Internet access is required to complete a donation.</small></aside></section>
    <section class="legal"><strong>NOVA Performing Arts${ein}</strong>${paragraphs(settings.taxStatus)}<p>This package reflects the ${escapeHtml(settings.revisionTitle)}, revised ${escapeHtml(displayDate(settings.revisedDate))}. Financial and program figures are current planning information and may be updated as commitments are confirmed.</p></section>
  </main>
  <footer class="footer"><div><div><strong>NOVA 8 Percussion</strong><p>Named for the final count before an ensemble begins, NOVA 8 prepares young musicians for what comes next.</p></div><span>© ${new Date().getUTCFullYear()} NOVA Performing Arts</span></div></footer>
</body>
</html>`;
}
