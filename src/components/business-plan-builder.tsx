"use client";

import { useActionState, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { saveBusinessPlan, type BusinessPlanSaveState } from "@/app/hub/actions";
import { DocumentVersionHistory, type DocumentVersionSummary } from "@/components/document-version-history";
import {
  planReviewStatuses,
  planSectionLabels,
  reviewBusinessPlan,
  type BusinessPlanSettings,
  type PlanReviewStatus,
  type PlanSectionKey,
  type ThreeYearLabels,
  type ThreeYearNumbers,
} from "@/lib/business-plan";

type BuilderTab = "overview" | PlanSectionKey | "review" | "versions";

const tabs: { id: BuilderTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "program", label: "Program" },
  { id: "pricing", label: "Pricing" },
  { id: "operations", label: "People & place" },
  { id: "finance", label: "Finance" },
  { id: "evidence", label: "Evidence & risk" },
  { id: "review", label: "Review & export" },
  { id: "versions", label: "Versions" },
];

const initialSaveState: BusinessPlanSaveState = { status: "idle", message: "" };

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const wholeNumber = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const statusLabels: Record<PlanReviewStatus, string> = {
  working: "Working",
  needs_review: "Needs review",
  approved: "Approved",
};

function formatSavedDate(value: string) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function Field({ label, hint, className = "", children }: { label: string; hint?: string; className?: string; children: ReactNode }) {
  return <label className={`business-plan-field ${className}`}>{label}{children}{hint ? <small>{hint}</small> : null}</label>;
}

function CurrencyInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <span className="business-plan-prefixed-input business-plan-currency-input">
      <i aria-hidden="true">$</i>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9,]*"
        value={wholeNumber.format(value)}
        onChange={(event) => {
          const digits = event.target.value.replace(/[^0-9]/g, "");
          onChange(digits ? Number(digits) : 0);
        }}
      />
    </span>
  );
}

function SectionReview({ section, value, onChange }: { section: PlanSectionKey; value: PlanReviewStatus; onChange: (value: PlanReviewStatus) => void }) {
  return (
    <label className="business-plan-review-control">
      <span>Section status</span>
      <select aria-label={`${planSectionLabels[section]} review status`} value={value} onChange={(event) => onChange(event.target.value as PlanReviewStatus)}>
        {planReviewStatuses.map((status) => <option value={status} key={status}>{statusLabels[status]}</option>)}
      </select>
    </label>
  );
}

function YearInputs({ label, values, onChange, prefix }: { label: string; values: ThreeYearNumbers; onChange: (values: ThreeYearNumbers) => void; prefix?: string }) {
  return (
    <fieldset className="business-plan-year-field">
      <legend>{label}</legend>
      <div>
        {values.map((value, index) => (
          <label key={index}>
            <span>Year {index + 1}</span>
            {prefix ? (
              <CurrencyInput value={value} onChange={(nextValue) => { const next = [...values] as ThreeYearNumbers; next[index] = nextValue; onChange(next); }} />
            ) : (
              <input type="number" min="0" value={value} onChange={(event) => { const next = [...values] as ThreeYearNumbers; next[index] = Number(event.target.value); onChange(next); }} />
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function YearTextInputs({ label, values, onChange }: { label: string; values: ThreeYearLabels; onChange: (values: ThreeYearLabels) => void }) {
  return (
    <fieldset className="business-plan-year-field">
      <legend>{label}</legend>
      <div>
        {values.map((value, index) => (
          <label key={index}><span>Year {index + 1}</span><input value={value} onChange={(event) => { const next = [...values] as ThreeYearLabels; next[index] = event.target.value; onChange(next); }} /></label>
        ))}
      </div>
    </fieldset>
  );
}

export function BusinessPlanBuilder({ initialPlan, storageConfigured, versions }: { initialPlan: BusinessPlanSettings; storageConfigured: boolean; versions: DocumentVersionSummary[] }) {
  const [plan, setPlan] = useState(initialPlan);
  const [activeTab, setActiveTab] = useState<BuilderTab>("overview");
  const [dirty, setDirty] = useState(false);
  const [autosaveState, setAutosaveState] = useState<BusinessPlanSaveState>(initialSaveState);
  const autosaveRevision = useRef(0);
  const [saveState, saveAction, saving] = useActionState(
    async (previousState: BusinessPlanSaveState, formData: FormData) => {
      const result = await saveBusinessPlan(previousState, formData);
      setDirty(result.status !== "success");
      if (result.status === "success" && result.savedAt) {
        setPlan((current) => ({ ...current, updatedAt: result.savedAt! }));
      }
      return result;
    },
    initialSaveState,
  );

  const issues = useMemo(() => reviewBusinessPlan(plan), [plan]);
  const blockers = issues.filter((issue) => issue.level === "blocker");
  const approvals = Object.values(plan.sectionStatus).filter((status) => status === "approved").length;
  const campaignPercent = plan.finance.foundingCampaignTarget
    ? Math.min(999, Math.round(plan.finance.foundingCampaignSecured / plan.finance.foundingCampaignTarget * 100))
    : 0;
  const operatingResults = plan.finance.projectedRevenue.map((revenue, index) => revenue - plan.finance.projectedExpenses[index]);
  const exportReady = storageConfigured && !dirty && !saving && saveState.status !== "error" && blockers.length === 0;
  const currentPayload = useMemo(() => JSON.stringify(plan), [plan]);

  useEffect(() => {
    const revision = ++autosaveRevision.current;
    if (!storageConfigured || !dirty || saving) return;
    const timeout = window.setTimeout(async () => {
      const formData = new FormData();
      formData.set("businessPlan", currentPayload);
      const result = await saveBusinessPlan(initialSaveState, formData);
      if (revision !== autosaveRevision.current) return;
      setAutosaveState(result);
      if (result.status === "success") {
        setDirty(false);
        if (result.savedAt) {
          setPlan((current) => ({ ...current, updatedAt: result.savedAt! }));
        }
      }
    }, 1200);
    return () => window.clearTimeout(timeout);
  }, [currentPayload, dirty, saving, storageConfigured]);

  function change(next: BusinessPlanSettings) {
    setPlan(next);
    setDirty(true);
  }

  function updateTop<K extends keyof BusinessPlanSettings>(key: K, value: BusinessPlanSettings[K]) {
    change({ ...plan, [key]: value });
  }

  function updateSection<K extends "program" | "pricing" | "operations" | "finance" | "evidence">(
    section: K,
    patch: Partial<BusinessPlanSettings[K]>,
  ) {
    change({ ...plan, [section]: { ...plan[section], ...patch } });
  }

  function updateReviewStatus(section: PlanSectionKey, status: PlanReviewStatus) {
    change({ ...plan, sectionStatus: { ...plan.sectionStatus, [section]: status } });
  }

  return (
    <div className="business-plan-builder">
      <div className="planner-command-bar business-plan-command-bar">
        <div>
          <span className={`planner-unsaved ${dirty || saveState.status === "error" ? "visible" : ""}`}>
            {dirty ? "Autosave pending" : autosaveState.status === "success" || saveState.status === "success" ? "All changes autosaved" : "Current plan loaded"}
          </span>
          <small>Last saved {formatSavedDate(autosaveState.savedAt ?? saveState.savedAt ?? plan.updatedAt)}</small>
        </div>
        <form action={saveAction}>
          <input type="hidden" name="businessPlan" value={JSON.stringify(plan)} />
          <button className="hub-save-button" type="submit" disabled={!storageConfigured || saving || !dirty}>
            {saving ? "Saving..." : "Save now"}
          </button>
        </form>
      </div>

      {saveState.message ? <div className={`planner-save-message ${saveState.status}`} role={saveState.status === "error" ? "alert" : "status"}>{saveState.message}</div> : null}

      <nav className="planner-tabs business-plan-tabs" aria-label="Business plan sections">
        {tabs.map((tab) => <button className={activeTab === tab.id ? "active" : ""} key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}>{tab.label}{tab.id === "review" && issues.length ? <span>{issues.length}</span> : null}</button>)}
      </nav>

      {activeTab === "overview" ? (
        <div className="planner-panel business-plan-panel">
          <section className="business-plan-hero">
            <div><p className="eyebrow">Current edition</p><h2>{plan.revisionTitle || "Untitled revision"}</h2><p>{plan.overallStatus}</p></div>
            <div className="business-plan-date"><span>Revised</span><strong>{plan.revisedDate || "Not dated"}</strong><small>{plan.planningHorizon}</small></div>
          </section>

          <section className="planner-metrics business-plan-metrics" aria-label="Business plan status">
            <article><span>Review</span><strong>{approvals}/5</strong><p>Sections approved</p></article>
            <article><span>Campaign</span><strong>{campaignPercent}%</strong><p>{currency.format(plan.finance.foundingCampaignSecured)} secured</p></article>
            <article><span>Year 1</span><strong>{currency.format(operatingResults[0])}</strong><p>Projected operating result</p></article>
            <article><span>Issues</span><strong>{issues.length}</strong><p>{blockers.length} blocking export</p></article>
          </section>

          <section className="planner-card business-plan-edition-card">
            <div className="planner-card-heading"><div><p className="eyebrow">Edition details</p><h3>Name this revision and explain what changed</h3></div></div>
            <div className="business-plan-form-grid two">
              <Field label="Revision title"><input value={plan.revisionTitle} onChange={(event) => updateTop("revisionTitle", event.target.value)} /></Field>
              <Field label="Revision date"><input type="date" value={plan.revisedDate} onChange={(event) => updateTop("revisedDate", event.target.value)} /></Field>
              <Field label="Planning horizon"><input value={plan.planningHorizon} onChange={(event) => updateTop("planningHorizon", event.target.value)} /></Field>
              <Field label="Document status"><input value={plan.overallStatus} onChange={(event) => updateTop("overallStatus", event.target.value)} /></Field>
              <Field className="wide" label="What changed in this revision" hint="This appears near the beginning of the exported plan."><textarea rows={4} value={plan.changeSummary} onChange={(event) => updateTop("changeSummary", event.target.value)} /></Field>
            </div>
          </section>

          <section className="business-plan-section-directory">
            {(Object.keys(planSectionLabels) as PlanSectionKey[]).map((section) => {
              const sectionIssues = issues.filter((issue) => issue.section === section).length;
              return <button type="button" key={section} onClick={() => setActiveTab(section)}><span className={`business-plan-status status-${plan.sectionStatus[section]}`}>{statusLabels[plan.sectionStatus[section]]}</span><strong>{planSectionLabels[section]}</strong><small>{sectionIssues ? `${sectionIssues} review item${sectionIssues === 1 ? "" : "s"}` : "No automated concerns"}</small><b aria-hidden="true">→</b></button>;
            })}
          </section>
        </div>
      ) : null}

      {activeTab === "program" ? (
        <div className="planner-panel business-plan-panel">
          <section className="business-plan-section-head"><div><p className="eyebrow">Program and schedule</p><h2>Current operating model</h2><p>Dates, capacity, and three-year participation targets flow into the plan, financial sections, and offline home page.</p></div><SectionReview section="program" value={plan.sectionStatus.program} onChange={(value) => updateReviewStatus("program", value)} /></section>
          <section className="planner-card"><div className="business-plan-form-grid four">
            <Field label="Cycle starts"><input type="date" value={plan.program.launchStartDate} onChange={(event) => updateSection("program", { launchStartDate: event.target.value })} /></Field>
            <Field label="Cycle ends"><input type="date" value={plan.program.launchEndDate} onChange={(event) => updateSection("program", { launchEndDate: event.target.value })} /></Field>
            <Field label="Family orientation"><input type="date" value={plan.program.orientationDate} onChange={(event) => updateSection("program", { orientationDate: event.target.value })} /></Field>
            <Field label="Demonstration or contingency"><input type="date" value={plan.program.demonstrationDate} onChange={(event) => updateSection("program", { demonstrationDate: event.target.value })} /></Field>
            <Field className="wide" label="Cycle schedule"><textarea rows={3} value={plan.program.cycleSchedule} onChange={(event) => updateSection("program", { cycleSchedule: event.target.value })} /></Field>
            <Field className="wide" label="Service location"><input value={plan.program.location} onChange={(event) => updateSection("program", { location: event.target.value })} /></Field>
            <Field label="Cohort capacity"><input type="number" min="1" value={plan.program.capacity} onChange={(event) => updateSection("program", { capacity: Number(event.target.value) })} /></Field>
            <Field label="Minimum enrollment"><input type="number" min="1" value={plan.program.minimumEnrollment} onChange={(event) => updateSection("program", { minimumEnrollment: Number(event.target.value) })} /></Field>
            <Field label="Intensive capacity"><input type="number" min="1" value={plan.program.intensiveCapacity} onChange={(event) => updateSection("program", { intensiveCapacity: Number(event.target.value) })} /></Field>
            <Field label="Year 1 public clinics"><input type="number" min="0" value={plan.program.clinicsYearOne} onChange={(event) => updateSection("program", { clinicsYearOne: Number(event.target.value) })} /></Field>
            <Field label="Year 1 Playgrounds"><input type="number" min="0" value={plan.program.playgroundsYearOne} onChange={(event) => updateSection("program", { playgroundsYearOne: Number(event.target.value) })} /></Field>
          </div></section>
          <section className="business-plan-year-grid">
            <YearInputs label="Core seat-enrollments" values={plan.program.coreEnrollments} onChange={(values) => updateSection("program", { coreEnrollments: values })} />
            <YearInputs label="8th Grade Intensive enrollments" values={plan.program.intensiveEnrollments} onChange={(values) => updateSection("program", { intensiveEnrollments: values })} />
            <YearInputs label="Public-clinic participants" values={plan.program.clinicParticipants} onChange={(values) => updateSection("program", { clinicParticipants: values })} />
            <YearInputs label="Percussion Playground participants" values={plan.program.playgroundParticipants} onChange={(values) => updateSection("program", { playgroundParticipants: values })} />
            <YearTextInputs label="Active school relationships" values={plan.program.schoolRelationships} onChange={(values) => updateSection("program", { schoolRelationships: values })} />
            <YearTextInputs label="Teaching fellows" values={plan.program.teachingFellows} onChange={(values) => updateSection("program", { teachingFellows: values })} />
          </section>
        </div>
      ) : null}

      {activeTab === "pricing" ? (
        <div className="planner-panel business-plan-panel">
          <section className="business-plan-section-head"><div><p className="eyebrow">Pricing and access</p><h2>Family-facing terms</h2><p>These figures update the pricing table, unit economics, refund language, and current assumptions.</p></div><SectionReview section="pricing" value={plan.sectionStatus.pricing} onChange={(value) => updateReviewStatus("pricing", value)} /></section>
          <section className="planner-card"><div className="business-plan-form-grid three">
            {([[
              "Core eight-week tuition", "coreTuition"], ["8th Grade Intensive tuition", "intensiveTuition"], ["Enrollment deposit", "deposit"], ["Public clinic participant", "clinicParticipant"], ["Public clinic observer", "clinicObserver"], ["Playground participant", "playgroundParticipant"], ["Playground observer", "playgroundObserver"]] as [string, keyof BusinessPlanSettings["pricing"]][]).map(([label, key]) => <Field label={label} key={key}><CurrencyInput value={plan.pricing[key] as number} onChange={(value) => updateSection("pricing", { [key]: value })} /></Field>)}
            <Field label="Aid allowance"><span className="business-plan-suffixed-input"><input type="number" min="0" max="100" value={plan.pricing.financialAidRate} onChange={(event) => updateSection("pricing", { financialAidRate: Number(event.target.value) })} /><i>%</i></span></Field>
            <Field className="wide" label="Refund and cancellation policy" hint="This must be concrete enough for a family to understand before paying a deposit."><textarea rows={6} value={plan.pricing.refundPolicy} onChange={(event) => updateSection("pricing", { refundPolicy: event.target.value })} /></Field>
          </div></section>
        </div>
      ) : null}

      {activeTab === "operations" ? (
        <div className="planner-panel business-plan-panel">
          <section className="business-plan-section-head"><div><p className="eyebrow">People, facilities, and partners</p><h2>What is confirmed now</h2><p>Use names and concrete status language when decisions are final. The review will flag obvious placeholders.</p></div><SectionReview section="operations" value={plan.sectionStatus.operations} onChange={(value) => updateReviewStatus("operations", value)} /></section>
          <section className="planner-card"><div className="business-plan-form-grid two">
            <Field label="Lead educator"><input value={plan.operations.leadEducator} onChange={(event) => updateSection("operations", { leadEducator: event.target.value })} /></Field>
            <Field label="Rehearsal site"><input value={plan.operations.rehearsalSite} onChange={(event) => updateSection("operations", { rehearsalSite: event.target.value })} /></Field>
            <Field className="wide" label="Staffing plan"><textarea rows={4} value={plan.operations.staffingPlan} onChange={(event) => updateSection("operations", { staffingPlan: event.target.value })} /></Field>
            <Field className="wide" label="Facility status"><textarea rows={4} value={plan.operations.facilityStatus} onChange={(event) => updateSection("operations", { facilityStatus: event.target.value })} /></Field>
            <Field label="Active school relationships"><textarea rows={4} value={plan.operations.activeSchoolRelationships} onChange={(event) => updateSection("operations", { activeSchoolRelationships: event.target.value })} /></Field>
            <Field label="Institutional partners"><textarea rows={4} value={plan.operations.institutionalPartners} onChange={(event) => updateSection("operations", { institutionalPartners: event.target.value })} /></Field>
            <Field className="wide" label="Governance update"><textarea rows={5} value={plan.operations.governanceUpdate} onChange={(event) => updateSection("operations", { governanceUpdate: event.target.value })} /></Field>
          </div></section>
        </div>
      ) : null}

      {activeTab === "finance" ? (
        <div className="planner-panel business-plan-panel">
          <section className="business-plan-section-head"><div><p className="eyebrow">Financial outlook</p><h2>Campaign and three-year projection</h2><p>Operating results calculate automatically. The export presents these as planning assumptions, not adopted commitments.</p></div><SectionReview section="finance" value={plan.sectionStatus.finance} onChange={(value) => updateReviewStatus("finance", value)} /></section>
          <section className="business-plan-finance-summary">
            <article><span>Target</span><strong>{currency.format(plan.finance.foundingCampaignTarget)}</strong></article>
            <article><span>Secured</span><strong>{currency.format(plan.finance.foundingCampaignSecured)}</strong></article>
            <article><span>Remaining</span><strong>{currency.format(Math.max(0, plan.finance.foundingCampaignTarget - plan.finance.foundingCampaignSecured))}</strong></article>
            <article><span>Funding gate</span><strong>{currency.format(Math.round(plan.finance.foundingCampaignTarget * .75))}</strong></article>
          </section>
          <section className="planner-card business-plan-campaign-card"><div className="business-plan-form-grid two">
            <Field label="Founding campaign target"><CurrencyInput value={plan.finance.foundingCampaignTarget} onChange={(value) => updateSection("finance", { foundingCampaignTarget: value })} /></Field>
            <Field label="Founding support secured"><CurrencyInput value={plan.finance.foundingCampaignSecured} onChange={(value) => updateSection("finance", { foundingCampaignSecured: value })} /></Field>
            <Field className="wide" label="Current campaign priority"><textarea rows={3} value={plan.finance.campaignPriority} onChange={(event) => updateSection("finance", { campaignPriority: event.target.value })} /></Field>
          </div></section>
          <section className="business-plan-year-grid finance">
            <YearInputs prefix="$" label="Projected cash revenue" values={plan.finance.projectedRevenue} onChange={(values) => updateSection("finance", { projectedRevenue: values })} />
            <YearInputs prefix="$" label="Projected cash expenses" values={plan.finance.projectedExpenses} onChange={(values) => updateSection("finance", { projectedExpenses: values })} />
          </section>
          <section className="business-plan-result-table"><div><span>Operating result</span><span>Year 1</span><span>Year 2</span><span>Year 3</span></div><div><strong>Revenue less expenses</strong>{operatingResults.map((value, index) => <b className={value < 0 ? "negative" : ""} key={index}>{currency.format(value)}</b>)}</div></section>
        </div>
      ) : null}

      {activeTab === "evidence" ? (
        <div className="planner-panel business-plan-panel">
          <section className="business-plan-section-head"><div><p className="eyebrow">Evidence, risks, and growth</p><h2>What the organization knows now</h2><p>These updates keep the plan current without rewriting the durable educational and operating principles.</p></div><SectionReview section="evidence" value={plan.sectionStatus.evidence} onChange={(value) => updateReviewStatus("evidence", value)} /></section>
          <section className="planner-card"><div className="business-plan-form-grid two">
            <Field label="Demand and enrollment evidence"><textarea rows={5} value={plan.evidence.demandUpdate} onChange={(event) => updateSection("evidence", { demandUpdate: event.target.value })} /></Field>
            <Field label="Recruitment performance"><textarea rows={5} value={plan.evidence.recruitmentUpdate} onChange={(event) => updateSection("evidence", { recruitmentUpdate: event.target.value })} /></Field>
            <Field label="Outcomes and measurement"><textarea rows={5} value={plan.evidence.outcomeUpdate} onChange={(event) => updateSection("evidence", { outcomeUpdate: event.target.value })} /></Field>
            <Field label="Current risk review"><textarea rows={5} value={plan.evidence.riskUpdate} onChange={(event) => updateSection("evidence", { riskUpdate: event.target.value })} /></Field>
            <Field label="Growth priorities"><textarea rows={5} value={plan.evidence.growthPriorities} onChange={(event) => updateSection("evidence", { growthPriorities: event.target.value })} /></Field>
            <Field label="Launch milestones"><textarea rows={5} value={plan.evidence.launchMilestones} onChange={(event) => updateSection("evidence", { launchMilestones: event.target.value })} /></Field>
          </div></section>
        </div>
      ) : null}

      {activeTab === "review" ? (
        <div className="planner-panel business-plan-panel">
          <section className="business-plan-review-hero">
            <div><p className="eyebrow">Review and export</p><h2>{blockers.length ? "The plan needs attention." : dirty ? "Save this revision before export." : "This revision is ready to export."}</h2><p>The ZIP contains the updated business plan, six chapter views, continuous print view, both pressure tests, offline search, source Markdown, and USB instructions.</p></div>
            <div className={`business-plan-readiness ${blockers.length ? "blocked" : dirty ? "unsaved" : "ready"}`}><span>{blockers.length ? "Blocked" : dirty ? "Unsaved" : "Ready"}</span><strong>{issues.length}</strong><small>review items</small></div>
          </section>

          <section className="business-plan-review-grid">
            {(Object.keys(planSectionLabels) as PlanSectionKey[]).map((section) => <article key={section}><span className={`business-plan-status status-${plan.sectionStatus[section]}`}>{statusLabels[plan.sectionStatus[section]]}</span><h3>{planSectionLabels[section]}</h3><p>{issues.filter((issue) => issue.section === section).length ? `${issues.filter((issue) => issue.section === section).length} item(s) flagged below.` : "No automated concerns."}</p><button type="button" onClick={() => setActiveTab(section)}>Review section</button></article>)}
          </section>

          <section className="planner-card business-plan-assumption-review">
            <div className="planner-card-heading"><div><p className="eyebrow">Export snapshot</p><h3>Current assumptions</h3></div><span>{plan.revisionTitle}</span></div>
            <dl>
              <div><dt>Founding cycle</dt><dd>{plan.program.launchStartDate} to {plan.program.launchEndDate}</dd></div>
              <div><dt>Cohort</dt><dd>{plan.program.minimumEnrollment} minimum · {plan.program.capacity} capacity</dd></div>
              <div><dt>Core tuition</dt><dd>{currency.format(plan.pricing.coreTuition)} · {currency.format(plan.pricing.deposit)} deposit</dd></div>
              <div><dt>Lead educator</dt><dd>{plan.operations.leadEducator}</dd></div>
              <div><dt>Rehearsal site</dt><dd>{plan.operations.rehearsalSite}</dd></div>
              <div><dt>Founding campaign</dt><dd>{currency.format(plan.finance.foundingCampaignSecured)} of {currency.format(plan.finance.foundingCampaignTarget)} secured</dd></div>
            </dl>
          </section>

          {issues.length ? <section className="business-plan-issue-list"><div className="business-plan-issue-heading"><h3>Review findings</h3><p>Attention items may be exported as working assumptions. Blocking items must be resolved.</p></div>{issues.map((issue, index) => <button type="button" onClick={() => setActiveTab(issue.section)} className={`business-plan-issue ${issue.level}`} key={`${issue.section}-${index}`}><span>{issue.level === "blocker" ? "Blocker" : "Attention"}</span><strong>{planSectionLabels[issue.section]}</strong><p>{issue.message}</p><b aria-hidden="true">→</b></button>)}</section> : <section className="business-plan-no-issues"><strong>No automated review concerns.</strong><p>Confirm the substantive judgments and approval statuses before sharing the plan.</p></section>}

          <section className="business-plan-export-card">
            <div><p className="eyebrow light">Portable offline edition</p><h3>Generate the complete ZIP</h3><p>{!storageConfigured ? "Connect secure storage before export." : blockers.length ? "Resolve the blocking findings first." : dirty ? "Save the current revision before downloading." : "The download will use the saved values shown above."}</p></div>
            {exportReady ? <a className="business-plan-export-button" href="/hub/business-plan/export">Download updated ZIP <span aria-hidden="true">↓</span></a> : <button className="business-plan-export-button" type="button" disabled>Download updated ZIP <span aria-hidden="true">↓</span></button>}
          </section>
        </div>
      ) : null}

      {activeTab === "versions" ? (
        <div className="planner-panel business-plan-panel">
          <DocumentVersionHistory
            documentType="business_plan"
            currentPayload={currentPayload}
            defaultTitle={plan.revisionTitle}
            defaultDate={plan.revisedDate}
            versions={versions}
            finalizationBlocked={blockers.length > 0}
          />
        </div>
      ) : null}
    </div>
  );
}
