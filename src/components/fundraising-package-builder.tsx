"use client";

import { useActionState, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  saveFundraisingPackage,
  type FundraisingPackageSaveState,
} from "@/app/hub/actions";
import { DocumentVersionHistory, type DocumentVersionSummary } from "@/components/document-version-history";
import type { BusinessPlanSettings } from "@/lib/business-plan";
import {
  applyBusinessPlanToFundraisingPackage,
  fundraisingReviewStatuses,
  fundraisingSectionLabels,
  reviewFundraisingPackage,
  type CampaignMilestone,
  type FundingUse,
  type FundraisingPackageSettings,
  type FundraisingReviewStatus,
  type FundraisingSectionKey,
  type GivingOpportunity,
  type ImpactMetric,
} from "@/lib/fundraising-package";

type BuilderTab = "overview" | FundraisingSectionKey | "review" | "versions";

const tabs: { id: BuilderTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "story", label: "Case for support" },
  { id: "campaign", label: "Campaign" },
  { id: "impact", label: "Impact" },
  { id: "details", label: "Donation details" },
  { id: "review", label: "Preview & export" },
  { id: "versions", label: "Versions" },
];

const initialSaveState: FundraisingPackageSaveState = {
  status: "idle",
  message: "",
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const wholeNumber = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const statusLabels: Record<FundraisingReviewStatus, string> = {
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

function Field({
  label,
  hint,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`business-plan-field ${className}`}>
      {label}
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function CurrencyInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
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

function SectionReview({
  section,
  value,
  onChange,
}: {
  section: FundraisingSectionKey;
  value: FundraisingReviewStatus;
  onChange: (value: FundraisingReviewStatus) => void;
}) {
  return (
    <label className="business-plan-review-control">
      <span>Section status</span>
      <select
        aria-label={`${fundraisingSectionLabels[section]} review status`}
        value={value}
        onChange={(event) => onChange(event.target.value as FundraisingReviewStatus)}
      >
        {fundraisingReviewStatuses.map((status) => (
          <option value={status} key={status}>{statusLabels[status]}</option>
        ))}
      </select>
    </label>
  );
}

function RowActions({
  onRemove,
  canRemove,
}: {
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <button
      className="fundraising-remove-button"
      type="button"
      onClick={onRemove}
      disabled={!canRemove}
    >
      Remove
    </button>
  );
}

function nextId(prefix: string) {
  return `${prefix}-${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Date.now()}`;
}

export function FundraisingPackageBuilder({
  initialPackage,
  businessPlan,
  storageConfigured,
  versions,
}: {
  initialPackage: FundraisingPackageSettings;
  businessPlan: BusinessPlanSettings;
  storageConfigured: boolean;
  versions: DocumentVersionSummary[];
}) {
  const [fundraisingPackage, setFundraisingPackage] = useState(initialPackage);
  const [activeTab, setActiveTab] = useState<BuilderTab>("overview");
  const [dirty, setDirty] = useState(false);
  const [autosaveState, setAutosaveState] = useState<FundraisingPackageSaveState>(initialSaveState);
  const autosaveRevision = useRef(0);
  const [saveState, saveAction, saving] = useActionState(
    async (previousState: FundraisingPackageSaveState, formData: FormData) => {
      const result = await saveFundraisingPackage(previousState, formData);
      setDirty(result.status !== "success");
      if (result.status === "success" && result.savedAt) {
        setFundraisingPackage((current) => ({ ...current, updatedAt: result.savedAt! }));
      }
      return result;
    },
    initialSaveState,
  );

  const issues = useMemo(
    () => reviewFundraisingPackage(fundraisingPackage, businessPlan),
    [fundraisingPackage, businessPlan],
  );
  const blockers = issues.filter((issue) => issue.level === "blocker");
  const approvals = Object.values(fundraisingPackage.sectionStatus).filter(
    (status) => status === "approved",
  ).length;
  const allocated = fundraisingPackage.fundingUses.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const campaignPercent = fundraisingPackage.campaignGoal
    ? Math.min(999, Math.round(
        fundraisingPackage.amountSecured / fundraisingPackage.campaignGoal * 100,
      ))
    : 0;
  const exportReady = storageConfigured && !dirty && !saving && blockers.length === 0;
  const currentPayload = useMemo(() => JSON.stringify(fundraisingPackage), [fundraisingPackage]);

  useEffect(() => {
    const revision = ++autosaveRevision.current;
    if (!storageConfigured || !dirty || saving) return;
    const timeout = window.setTimeout(async () => {
      const formData = new FormData();
      formData.set("fundraisingPackage", currentPayload);
      const result = await saveFundraisingPackage(initialSaveState, formData);
      if (revision !== autosaveRevision.current) return;
      setAutosaveState(result);
      if (result.status === "success") {
        setDirty(false);
        if (result.savedAt) {
          setFundraisingPackage((current) => ({ ...current, updatedAt: result.savedAt! }));
        }
      }
    }, 1200);
    return () => window.clearTimeout(timeout);
  }, [currentPayload, dirty, saving, storageConfigured]);

  function change(next: FundraisingPackageSettings) {
    setFundraisingPackage(next);
    setDirty(true);
  }

  function updateTop<K extends keyof FundraisingPackageSettings>(
    key: K,
    value: FundraisingPackageSettings[K],
  ) {
    change({ ...fundraisingPackage, [key]: value });
  }

  function updateReviewStatus(
    section: FundraisingSectionKey,
    status: FundraisingReviewStatus,
  ) {
    change({
      ...fundraisingPackage,
      sectionStatus: { ...fundraisingPackage.sectionStatus, [section]: status },
    });
  }

  function updateFundingUse(index: number, patch: Partial<FundingUse>) {
    const items = fundraisingPackage.fundingUses.map((item, itemIndex) =>
      itemIndex === index ? { ...item, ...patch } : item,
    );
    updateTop("fundingUses", items);
  }

  function updateGivingOpportunity(index: number, patch: Partial<GivingOpportunity>) {
    const items = fundraisingPackage.givingOpportunities.map((item, itemIndex) =>
      itemIndex === index ? { ...item, ...patch } : item,
    );
    updateTop("givingOpportunities", items);
  }

  function updateImpactMetric(index: number, patch: Partial<ImpactMetric>) {
    const items = fundraisingPackage.impactMetrics.map((item, itemIndex) =>
      itemIndex === index ? { ...item, ...patch } : item,
    );
    updateTop("impactMetrics", items);
  }

  function updateMilestone(index: number, patch: Partial<CampaignMilestone>) {
    const items = fundraisingPackage.timeline.map((item, itemIndex) =>
      itemIndex === index ? { ...item, ...patch } : item,
    );
    updateTop("timeline", items);
  }

  function syncBusinessPlan() {
    change(applyBusinessPlanToFundraisingPackage(fundraisingPackage, businessPlan));
  }

  return (
    <div className="business-plan-builder fundraising-builder">
      <div className="planner-command-bar business-plan-command-bar">
        <div>
          <span className={`planner-unsaved ${dirty || saveState.status === "error" ? "visible" : ""}`}>
            {dirty
              ? "Autosave pending"
              : autosaveState.status === "success" || saveState.status === "success"
                ? "All changes autosaved"
                : "Current package loaded"}
          </span>
          <small>Last saved {formatSavedDate(autosaveState.savedAt ?? saveState.savedAt ?? fundraisingPackage.updatedAt)}</small>
        </div>
        <form action={saveAction}>
          <input
            type="hidden"
            name="fundraisingPackage"
            value={JSON.stringify(fundraisingPackage)}
          />
          <button
            className="hub-save-button"
            type="submit"
            disabled={!storageConfigured || saving || !dirty}
          >
            {saving ? "Saving..." : "Save now"}
          </button>
        </form>
      </div>

      {saveState.message ? (
        <div
          className={`planner-save-message ${saveState.status}`}
          role={saveState.status === "error" ? "alert" : "status"}
        >
          {saveState.message}
        </div>
      ) : null}

      <nav className="planner-tabs business-plan-tabs" aria-label="Fundraising package sections">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab.id ? "active" : ""}
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.id === "review" && issues.length ? <span>{issues.length}</span> : null}
          </button>
        ))}
      </nav>

      {activeTab === "overview" ? (
        <div className="planner-panel business-plan-panel">
          <section className="business-plan-hero fundraising-hero">
            <div>
              <p className="eyebrow">Current donor edition</p>
              <h2>{fundraisingPackage.campaignTitle}</h2>
              <p>{fundraisingPackage.campaignSubtitle}</p>
            </div>
            <div className="business-plan-date">
              <span>Campaign goal</span>
              <strong>{currency.format(fundraisingPackage.campaignGoal)}</strong>
              <small>{campaignPercent}% recorded as secured</small>
            </div>
          </section>

          <section className="planner-metrics business-plan-metrics" aria-label="Fundraising package status">
            <article><span>Review</span><strong>{approvals}/4</strong><p>Sections approved</p></article>
            <article><span>Allocated</span><strong>{currency.format(allocated)}</strong><p>Across {fundraisingPackage.fundingUses.length} uses</p></article>
            <article><span>Giving</span><strong>{fundraisingPackage.givingOpportunities.length}</strong><p>Support opportunities</p></article>
            <article><span>Issues</span><strong>{issues.length}</strong><p>{blockers.length} blocking export</p></article>
          </section>

          <section className="planner-card business-plan-edition-card">
            <div className="planner-card-heading fundraising-edition-heading">
              <div><p className="eyebrow">Edition details</p><h3>Name this package and optionally personalize it</h3></div>
              <button className="planner-secondary-button" type="button" onClick={syncBusinessPlan}>
                Sync current plan figures
              </button>
            </div>
            <div className="business-plan-form-grid two">
              <Field label="Revision title"><input value={fundraisingPackage.revisionTitle} onChange={(event) => updateTop("revisionTitle", event.target.value)} /></Field>
              <Field label="Revision date"><input type="date" value={fundraisingPackage.revisedDate} onChange={(event) => updateTop("revisedDate", event.target.value)} /></Field>
              <Field label="Prepared for" hint="Optional. Leave blank for a general campaign package."><input value={fundraisingPackage.preparedFor} onChange={(event) => updateTop("preparedFor", event.target.value)} placeholder="Organization or donor name" /></Field>
              <Field label="Campaign subtitle"><input value={fundraisingPackage.campaignSubtitle} onChange={(event) => updateTop("campaignSubtitle", event.target.value)} /></Field>
              <Field className="wide" label="Campaign title"><input value={fundraisingPackage.campaignTitle} onChange={(event) => updateTop("campaignTitle", event.target.value)} /></Field>
              <Field className="wide" label="Recipient-specific introduction" hint="Optional. Appears in the opening panel only when completed."><textarea rows={4} value={fundraisingPackage.recipientIntroduction} onChange={(event) => updateTop("recipientIntroduction", event.target.value)} /></Field>
            </div>
          </section>

          <section className="business-plan-section-directory fundraising-section-directory">
            {(Object.keys(fundraisingSectionLabels) as FundraisingSectionKey[]).map((section) => {
              const sectionIssues = issues.filter((issue) => issue.section === section).length;
              return (
                <button type="button" key={section} onClick={() => setActiveTab(section)}>
                  <span className={`business-plan-status status-${fundraisingPackage.sectionStatus[section]}`}>{statusLabels[fundraisingPackage.sectionStatus[section]]}</span>
                  <strong>{fundraisingSectionLabels[section]}</strong>
                  <small>{sectionIssues ? `${sectionIssues} review item${sectionIssues === 1 ? "" : "s"}` : "No automated concerns"}</small>
                  <b aria-hidden="true">→</b>
                </button>
              );
            })}
          </section>
        </div>
      ) : null}

      {activeTab === "story" ? (
        <div className="planner-panel business-plan-panel">
          <section className="business-plan-section-head">
            <div><p className="eyebrow">Case for support</p><h2>Why NOVA 8, why now</h2><p>Shape the donor-facing story without changing the durable business plan.</p></div>
            <SectionReview section="story" value={fundraisingPackage.sectionStatus.story} onChange={(value) => updateReviewStatus("story", value)} />
          </section>
          <section className="planner-card"><div className="business-plan-form-grid two">
            <Field className="wide" label="Case for support" hint="This becomes the main donor-facing opening statement."><textarea rows={7} value={fundraisingPackage.caseForSupport} onChange={(event) => updateTop("caseForSupport", event.target.value)} /></Field>
            <Field label="The need"><textarea rows={7} value={fundraisingPackage.needStatement} onChange={(event) => updateTop("needStatement", event.target.value)} /></Field>
            <Field label="NOVA's response"><textarea rows={7} value={fundraisingPackage.solutionStatement} onChange={(event) => updateTop("solutionStatement", event.target.value)} /></Field>
            <Field label="Why NOVA is ready"><textarea rows={6} value={fundraisingPackage.readinessStatement} onChange={(event) => updateTop("readinessStatement", event.target.value)} /></Field>
            <Field label="School-cooperation promise"><textarea rows={6} value={fundraisingPackage.cooperativeStatement} onChange={(event) => updateTop("cooperativeStatement", event.target.value)} /></Field>
          </div></section>
        </div>
      ) : null}

      {activeTab === "campaign" ? (
        <div className="planner-panel business-plan-panel">
          <section className="business-plan-section-head">
            <div><p className="eyebrow">Campaign and giving</p><h2>What support makes possible</h2><p>The funding-use total must equal the campaign goal. Drafts can still be saved while values are being reconciled.</p></div>
            <SectionReview section="campaign" value={fundraisingPackage.sectionStatus.campaign} onChange={(value) => updateReviewStatus("campaign", value)} />
          </section>
          <section className="planner-card fundraising-goal-card">
            <div className="business-plan-form-grid two">
              <Field label="Campaign goal"><CurrencyInput value={fundraisingPackage.campaignGoal} onChange={(value) => updateTop("campaignGoal", value)} /></Field>
              <Field label="Amount secured"><CurrencyInput value={fundraisingPackage.amountSecured} onChange={(value) => updateTop("amountSecured", value)} /></Field>
            </div>
            <div className={`fundraising-allocation-check ${allocated === fundraisingPackage.campaignGoal ? "balanced" : "unbalanced"}`}>
              <span>Funding uses</span><strong>{currency.format(allocated)}</strong><p>{allocated === fundraisingPackage.campaignGoal ? "Allocations match the goal." : `${currency.format(Math.abs(fundraisingPackage.campaignGoal - allocated))} ${allocated < fundraisingPackage.campaignGoal ? "remains to allocate" : "is overallocated"}.`}</p>
            </div>
          </section>

          <section className="planner-card">
            <div className="planner-card-heading"><div><p className="eyebrow">Use of funds</p><h3>Campaign allocation</h3></div><button className="planner-secondary-button" type="button" onClick={() => updateTop("fundingUses", [...fundraisingPackage.fundingUses, { id: nextId("use"), title: "", amount: 0, description: "" }])}>Add funding use</button></div>
            <div className="fundraising-row-list">
              {fundraisingPackage.fundingUses.map((item, index) => (
                <article className="fundraising-edit-row" key={item.id}>
                  <div className="fundraising-row-title"><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title || "Untitled funding use"}</strong><RowActions canRemove={fundraisingPackage.fundingUses.length > 3} onRemove={() => updateTop("fundingUses", fundraisingPackage.fundingUses.filter((_, itemIndex) => itemIndex !== index))} /></div>
                  <div className="business-plan-form-grid three"><Field label="Title"><input value={item.title} onChange={(event) => updateFundingUse(index, { title: event.target.value })} /></Field><Field label="Amount"><CurrencyInput value={item.amount} onChange={(value) => updateFundingUse(index, { amount: value })} /></Field><Field className="wide" label="Description"><textarea rows={3} value={item.description} onChange={(event) => updateFundingUse(index, { description: event.target.value })} /></Field></div>
                </article>
              ))}
            </div>
          </section>

          <section className="planner-card">
            <div className="planner-card-heading"><div><p className="eyebrow">Ways to participate</p><h3>Giving opportunities</h3></div><button className="planner-secondary-button" type="button" onClick={() => updateTop("givingOpportunities", [...fundraisingPackage.givingOpportunities, { id: nextId("gift"), title: "", amount: 0, description: "" }])}>Add opportunity</button></div>
            <div className="fundraising-row-list">
              {fundraisingPackage.givingOpportunities.map((item, index) => (
                <article className="fundraising-edit-row" key={item.id}>
                  <div className="fundraising-row-title"><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title || "Untitled giving opportunity"}</strong><RowActions canRemove={fundraisingPackage.givingOpportunities.length > 3} onRemove={() => updateTop("givingOpportunities", fundraisingPackage.givingOpportunities.filter((_, itemIndex) => itemIndex !== index))} /></div>
                  <div className="business-plan-form-grid three"><Field label="Title"><input value={item.title} onChange={(event) => updateGivingOpportunity(index, { title: event.target.value })} /></Field><Field label="Suggested amount"><CurrencyInput value={item.amount} onChange={(value) => updateGivingOpportunity(index, { amount: value })} /></Field><Field className="wide" label="Description"><textarea rows={3} value={item.description} onChange={(event) => updateGivingOpportunity(index, { description: event.target.value })} /></Field></div>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {activeTab === "impact" ? (
        <div className="planner-panel business-plan-panel">
          <section className="business-plan-section-head">
            <div><p className="eyebrow">Impact and timeline</p><h2>What donors can expect to enable</h2><p>Use planning targets clearly, then replace them with actual results as NOVA completes each cycle.</p></div>
            <SectionReview section="impact" value={fundraisingPackage.sectionStatus.impact} onChange={(value) => updateReviewStatus("impact", value)} />
          </section>
          <section className="planner-card">
            <div className="planner-card-heading"><div><p className="eyebrow">Expected Year 1 reach</p><h3>Headline measures</h3></div><button className="planner-secondary-button" type="button" onClick={() => updateTop("impactMetrics", [...fundraisingPackage.impactMetrics, { id: nextId("impact"), value: "", label: "", description: "" }])}>Add measure</button></div>
            <div className="fundraising-row-list two-column">
              {fundraisingPackage.impactMetrics.map((item, index) => (
                <article className="fundraising-edit-row" key={item.id}>
                  <div className="fundraising-row-title"><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.label || "Untitled measure"}</strong><RowActions canRemove={fundraisingPackage.impactMetrics.length > 3} onRemove={() => updateTop("impactMetrics", fundraisingPackage.impactMetrics.filter((_, itemIndex) => itemIndex !== index))} /></div>
                  <div className="business-plan-form-grid two"><Field label="Value"><input value={item.value} onChange={(event) => updateImpactMetric(index, { value: event.target.value })} /></Field><Field label="Label"><input value={item.label} onChange={(event) => updateImpactMetric(index, { label: event.target.value })} /></Field><Field className="wide" label="Explanation"><textarea rows={3} value={item.description} onChange={(event) => updateImpactMetric(index, { description: event.target.value })} /></Field></div>
                </article>
              ))}
            </div>
          </section>
          <section className="planner-card">
            <div className="planner-card-heading"><div><p className="eyebrow">Path to launch</p><h3>Campaign and program milestones</h3></div><button className="planner-secondary-button" type="button" onClick={() => updateTop("timeline", [...fundraisingPackage.timeline, { id: nextId("milestone"), period: "", title: "", description: "" }])}>Add milestone</button></div>
            <div className="fundraising-row-list two-column">
              {fundraisingPackage.timeline.map((item, index) => (
                <article className="fundraising-edit-row" key={item.id}>
                  <div className="fundraising-row-title"><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title || "Untitled milestone"}</strong><RowActions canRemove={fundraisingPackage.timeline.length > 3} onRemove={() => updateTop("timeline", fundraisingPackage.timeline.filter((_, itemIndex) => itemIndex !== index))} /></div>
                  <div className="business-plan-form-grid two"><Field label="Period"><input value={item.period} onChange={(event) => updateMilestone(index, { period: event.target.value })} /></Field><Field label="Title"><input value={item.title} onChange={(event) => updateMilestone(index, { title: event.target.value })} /></Field><Field className="wide" label="Description"><textarea rows={3} value={item.description} onChange={(event) => updateMilestone(index, { description: event.target.value })} /></Field></div>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {activeTab === "details" ? (
        <div className="planner-panel business-plan-panel">
          <section className="business-plan-section-head">
            <div><p className="eyebrow">Donation and organization details</p><h2>Give readers a clear next step</h2><p>The donation link becomes both the online button and the embedded QR code in the self-contained export.</p></div>
            <SectionReview section="details" value={fundraisingPackage.sectionStatus.details} onChange={(value) => updateReviewStatus("details", value)} />
          </section>
          <section className="planner-card"><div className="business-plan-form-grid two">
            <Field className="wide" label="Donation URL" hint="Use the complete https:// address for the page where a donor can give."><input type="url" value={fundraisingPackage.donationUrl} onChange={(event) => updateTop("donationUrl", event.target.value)} placeholder="https://" /></Field>
            <Field className="wide" label="Donation instructions"><textarea rows={5} value={fundraisingPackage.donationInstructions} onChange={(event) => updateTop("donationInstructions", event.target.value)} /></Field>
            <Field label="Contact name"><input value={fundraisingPackage.contactName} onChange={(event) => updateTop("contactName", event.target.value)} /></Field>
            <Field label="Contact email"><input type="email" value={fundraisingPackage.contactEmail} onChange={(event) => updateTop("contactEmail", event.target.value)} /></Field>
            <Field label="Contact phone"><input type="tel" value={fundraisingPackage.contactPhone} onChange={(event) => updateTop("contactPhone", event.target.value)} /></Field>
            <Field label="Contact page URL"><input type="url" value={fundraisingPackage.contactUrl} onChange={(event) => updateTop("contactUrl", event.target.value)} /></Field>
            <Field label="EIN" hint="Optional in the package, but useful for institutional donors."><input value={fundraisingPackage.ein} onChange={(event) => updateTop("ein", event.target.value)} /></Field>
            <Field className="wide" label="Tax-status and deductibility statement"><textarea rows={5} value={fundraisingPackage.taxStatus} onChange={(event) => updateTop("taxStatus", event.target.value)} /></Field>
          </div></section>
        </div>
      ) : null}

      {activeTab === "review" ? (
        <div className="planner-panel business-plan-panel fundraising-review-panel">
          <section className="business-plan-review-hero">
            <div><p className="eyebrow light">Donor-facing review</p><h2>{blockers.length ? "Complete the package before export." : "Ready for a final human review."}</h2><p>The preview below reflects the saved content structure and main visual hierarchy of the single-file HTML edition.</p></div>
            <div className={`business-plan-readiness ${blockers.length ? "" : "ready"}`}><span>Export</span><strong>{blockers.length}</strong><small>{blockers.length === 1 ? "blocker" : "blockers"}</small></div>
          </section>

          <section className="fundraising-document-preview" aria-label="Fundraising package preview">
            <div className="fundraising-preview-nav"><strong>NOVA Performing Arts</strong><span>Fundraising package</span></div>
            <div className="fundraising-preview-hero"><div><p>{fundraisingPackage.preparedFor ? `Prepared for ${fundraisingPackage.preparedFor}` : "NOVA 8 founding campaign"}</p><h3>{fundraisingPackage.campaignTitle}</h3><strong>{fundraisingPackage.campaignSubtitle}</strong></div><aside><span>Campaign goal</span><b>{currency.format(fundraisingPackage.campaignGoal)}</b><small>{currency.format(fundraisingPackage.amountSecured)} secured</small></aside></div>
            <div className="fundraising-preview-copy"><p className="eyebrow">The case for support</p><h3>More time changes what becomes possible.</h3><p>{fundraisingPackage.caseForSupport}</p></div>
            <div className="fundraising-preview-stats">{fundraisingPackage.impactMetrics.slice(0, 4).map((item) => <article key={item.id}><strong>{item.value}</strong><span>{item.label}</span></article>)}</div>
          </section>

          {issues.length ? (
            <section className="business-plan-issue-list">
              <div className="business-plan-issue-heading"><h3>Review findings</h3><p>Attention items may remain in a working edition. Blocking items must be resolved before download.</p></div>
              {issues.map((issue, index) => (
                <button type="button" onClick={() => setActiveTab(issue.section)} className={`business-plan-issue ${issue.level}`} key={`${issue.section}-${index}`}><span>{issue.level === "blocker" ? "Blocker" : "Attention"}</span><strong>{fundraisingSectionLabels[issue.section]}</strong><p>{issue.message}</p><b aria-hidden="true">→</b></button>
              ))}
            </section>
          ) : (
            <section className="business-plan-no-issues"><strong>No automated review concerns.</strong><p>Confirm names, amounts, claims, links, and donor-specific language before sharing.</p></section>
          )}

          <section className="business-plan-export-card">
            <div><p className="eyebrow light">Self-contained donor edition</p><h3>Download one HTML file</h3><p>{!storageConfigured ? "Connect secure storage before export." : blockers.length ? "Resolve the blocking findings first." : dirty ? "Save the current revision before downloading." : "The file includes its design, NOVA mark, print styles, and donation QR code."}</p></div>
            {exportReady ? <a className="business-plan-export-button" href="/hub/fundraising/export">Download HTML <span aria-hidden="true">↓</span></a> : <button className="business-plan-export-button" type="button" disabled>Download HTML <span aria-hidden="true">↓</span></button>}
          </section>
        </div>
      ) : null}

      {activeTab === "versions" ? (
        <div className="planner-panel business-plan-panel">
          <DocumentVersionHistory
            documentType="fundraising_package"
            currentPayload={currentPayload}
            defaultTitle={fundraisingPackage.revisionTitle}
            defaultDate={fundraisingPackage.revisedDate}
            versions={versions}
            finalizationBlocked={blockers.length > 0}
          />
        </div>
      ) : null}
    </div>
  );
}
