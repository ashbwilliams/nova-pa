"use client";

import { useActionState, useMemo, useState, type CSSProperties } from "react";
import {
  savePlaygroundPlan,
  type PlaygroundPlanSaveState,
} from "@/app/hub/actions";
import {
  attendanceStatuses,
  dateForOffset,
  followUpCategories,
  guestCategories,
  planningStatuses,
  relativeLabel,
  rsvpStatuses,
  type PlaygroundBudgetItem,
  type PlaygroundGuest,
  type PlaygroundHost,
  type PlaygroundPlan,
  type PlaygroundRunItem,
  type PlaygroundSupportOpportunity,
  type PlaygroundTimelineTask,
  type PlaygroundWorkstream,
} from "@/lib/playground-plan";

type PlannerTab =
  | "overview"
  | "timeline"
  | "guests"
  | "production"
  | "program"
  | "budget"
  | "brief";

const tabs: { id: PlannerTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "timeline", label: "Timeline" },
  { id: "guests", label: "Guests & hosts" },
  { id: "production", label: "Production" },
  { id: "program", label: "Program" },
  { id: "budget", label: "Budget" },
  { id: "brief", label: "Event brief" },
];

const initialSaveState: PlaygroundPlanSaveState = {
  status: "idle",
  message: "",
};

const categoryColors: Record<string, { color: string; tint: string }> = {
  All: { color: "#4f6f66", tint: "#edf3f0" },
  Strategy: { color: "#5f7569", tint: "#edf2ef" },
  "Venue & production": { color: "#60778c", tint: "#edf2f6" },
  "Hosts & guests": { color: "#956b55", tint: "#f7f0ec" },
  "Creative & invitation": { color: "#826b82", tint: "#f4eff4" },
  "Hospitality & safety": { color: "#8a7849", tint: "#f7f3e8" },
  Program: { color: "#4f7b78", tint: "#eaf3f2" },
  "Event day": { color: "#955e54", tint: "#f7eeec" },
  "Follow-up": { color: "#71805d", tint: "#f0f3eb" },
  General: { color: "#69736e", tint: "#f0f2f1" },
};

type CategoryStyle = CSSProperties & {
  "--category-color": string;
  "--category-tint": string;
};

function categoryStyle(category: string): CategoryStyle {
  const colors = categoryColors[category] ?? categoryColors.General;
  return {
    "--category-color": colors.color,
    "--category-tint": colors.tint,
  };
}

const uid = (prefix: string) =>
  `${prefix}-${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Date.now()}`;

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatDate(value: string) {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function statusLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export function PlaygroundPlanner({
  initialPlan,
  storageConfigured,
}: {
  initialPlan: PlaygroundPlan;
  storageConfigured: boolean;
}) {
  const [plan, setPlan] = useState(initialPlan);
  const [activeTab, setActiveTab] = useState<PlannerTab>("overview");
  const [dirty, setDirty] = useState(false);
  const [taskFilter, setTaskFilter] = useState("All");
  const [guestSearch, setGuestSearch] = useState("");
  const [guestFilter, setGuestFilter] = useState("All");
  const [saveState, saveAction, saving] = useActionState(
    savePlaygroundPlan,
    initialSaveState,
  );

  function change(next: PlaygroundPlan) {
    setPlan(next);
    setDirty(true);
  }

  function updateEvent<K extends keyof PlaygroundPlan["event"]>(
    key: K,
    value: PlaygroundPlan["event"][K],
  ) {
    change({ ...plan, event: { ...plan.event, [key]: value } });
  }

  function updateCollection<K extends "timeline" | "guests" | "hosts" | "workstreams" | "runOfShow" | "budget" | "supportOpportunities">(
    key: K,
    id: string,
    patch: Partial<PlaygroundPlan[K][number]>,
  ) {
    change({
      ...plan,
      [key]: plan[key].map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    });
  }

  function removeFrom<K extends "timeline" | "guests" | "hosts" | "workstreams" | "runOfShow" | "budget" | "supportOpportunities">(
    key: K,
    id: string,
  ) {
    change({ ...plan, [key]: plan[key].filter((item) => item.id !== id) });
  }

  const metrics = useMemo(() => {
    const invited = plan.guests.filter((guest) => guest.rsvp !== "Not invited").length;
    const accepted = plan.guests.filter((guest) => guest.rsvp === "Accepted").length;
    const priorityFollowUps = plan.guests.filter((guest) =>
      ["Ready", "Connector", "Interested"].includes(guest.followUpCategory),
    ).length;
    const tasks = [...plan.timeline, ...plan.workstreams];
    const completeTasks = tasks.filter((task) => task.status === "complete").length;
    const readiness = tasks.length ? Math.round((completeTasks / tasks.length) * 100) : 0;
    const estimate = plan.budget.reduce((total, item) => total + item.estimate, 0);
    const actual = plan.budget.reduce((total, item) => total + item.actual, 0);
    return { invited, accepted, priorityFollowUps, readiness, estimate, actual };
  }, [plan]);

  const taskCategories = useMemo(
    () => ["All", ...Array.from(new Set(plan.timeline.map((task) => task.category)))],
    [plan.timeline],
  );

  const visibleTasks = useMemo(
    () =>
      [...plan.timeline]
        .filter((task) => taskFilter === "All" || task.category === taskFilter)
        .sort((a, b) => a.offsetDays - b.offsetDays),
    [plan.timeline, taskFilter],
  );

  const visibleGuests = useMemo(() => {
    const query = guestSearch.toLowerCase().trim();
    return plan.guests.filter((guest) => {
      const matchesSearch = !query || [guest.name, guest.organization, guest.household, guest.invitingHost]
        .join(" ")
        .toLowerCase()
        .includes(query);
      const matchesFilter = guestFilter === "All" || guest.rsvp === guestFilter || guest.followUpCategory === guestFilter;
      return matchesSearch && matchesFilter;
    });
  }, [guestFilter, guestSearch, plan.guests]);

  const hasUnsavedChanges = dirty || saveState.status === "error";

  function exportGuests() {
    const headings = [
      "Name", "Household", "Organization", "Email", "Phone", "Category", "Inviting host",
      "Relationship owner", "Affinity", "Capacity", "Influence", "RSVP", "Attendance",
      "People to meet", "Conversation notes", "Follow-up category", "Next step",
      "Follow-up owner", "Follow-up date", "Outcome",
    ];
    const rows = plan.guests.map((guest) => [
      guest.name, guest.household, guest.organization, guest.email, guest.phone, guest.category,
      guest.invitingHost, guest.relationshipOwner, guest.affinity, guest.capacity, guest.influence,
      guest.rsvp, guest.attendance, guest.peopleToMeet, guest.conversationNotes,
      guest.followUpCategory, guest.nextStep, guest.followUpOwner, guest.followUpDate, guest.outcome,
    ]);
    const csv = [headings, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
    const href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = href;
    link.download = "percussion-playground-guests.csv";
    link.click();
    URL.revokeObjectURL(href);
  }

  return (
    <div className="planner">
      <div className="planner-command-bar">
        <div>
          <span className={`planner-unsaved ${hasUnsavedChanges ? "visible" : ""}`}>
            {hasUnsavedChanges ? "Unsaved changes" : saveState.status === "success" ? "All changes saved" : "Plan loaded"}
          </span>
          {plan.updatedAt ? <small>Last saved {new Date(plan.updatedAt).toLocaleString()}</small> : null}
        </div>
        <form action={saveAction} onSubmit={() => setDirty(false)}>
          <input type="hidden" name="plan" value={JSON.stringify(plan)} />
          <button className="hub-save-button" type="submit" disabled={!storageConfigured || saving || !hasUnsavedChanges}>
            {saving ? "Saving..." : "Save event plan"}
          </button>
        </form>
      </div>

      {saveState.message ? (
        <div className={`planner-save-message ${saveState.status}`} role={saveState.status === "error" ? "alert" : "status"}>
          {saveState.message}
        </div>
      ) : null}

      <nav className="planner-tabs" aria-label="Percussion Playground planning sections">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab.id ? "active" : ""}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "overview" ? (
        <div className="planner-panel">
          <section className="planner-hero-card">
            <div>
              <p className="eyebrow">Working event</p>
              <h2>{plan.event.eventDate ? formatDate(plan.event.eventDate) : plan.event.workingMonth || "Date not yet selected"}</h2>
              <p>{plan.event.venue || "Venue to be selected"}</p>
            </div>
            <label>
              Event status
              <select value={plan.event.eventStatus} onChange={(event) => updateEvent("eventStatus", event.target.value as PlaygroundPlan["event"]["eventStatus"])}>
                {(["Concept", "Planning", "Date selected", "Confirmed", "Complete"] as const).map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
          </section>

          <section className="planner-metrics" aria-label="Event planning metrics">
            <article><span>Readiness</span><strong>{metrics.readiness}%</strong><p>Timeline and workstreams complete</p></article>
            <article><span>RSVP</span><strong>{metrics.accepted}</strong><p>{metrics.invited} invited · goal {plan.event.attendanceGoal}</p></article>
            <article><span>Follow-up</span><strong>{metrics.priorityFollowUps}</strong><p>Priority relationships identified</p></article>
            <article><span>Budget</span><strong>{money.format(metrics.estimate)}</strong><p>{money.format(metrics.actual)} actual</p></article>
          </section>

          <section className="planner-card planner-date-card">
            <div className="planner-card-heading">
              <div><p className="eyebrow">Timeline anchor</p><h3>{plan.event.eventDate ? "Fixed calendar active" : "Relative timeline active"}</h3></div>
              <span>{plan.event.eventDate ? `${plan.timeline.length} dated tasks` : "No date required yet"}</span>
            </div>
            <p>
              {plan.event.eventDate
                ? "Changing the event date will automatically move every timeline and production deadline while preserving its relative lead time."
                : "Keep planning in weeks-before mode. When the date is selected, every deadline will receive a calendar date automatically."}
            </p>
            <div className="planner-form-grid three">
              <Field label="Working month or season"><input value={plan.event.workingMonth} onChange={(event) => updateEvent("workingMonth", event.target.value)} placeholder="Fall 2026" /></Field>
              <Field label="Event date"><input type="date" value={plan.event.eventDate} onChange={(event) => updateEvent("eventDate", event.target.value)} /></Field>
              <Field label="Start time"><input type="time" value={plan.event.startTime} onChange={(event) => updateEvent("startTime", event.target.value)} /></Field>
            </div>
            {plan.event.eventDate ? <button className="planner-text-button" type="button" onClick={() => updateEvent("eventDate", "")}>Return to relative timeline</button> : null}
          </section>

          <section className="planner-overview-grid">
            <article className="planner-card">
              <div className="planner-card-heading"><div><p className="eyebrow">Immediate focus</p><h3>Next incomplete priorities</h3></div></div>
              <div className="planner-compact-list">
                {plan.timeline.filter((task) => task.status !== "complete").sort((a, b) => a.offsetDays - b.offsetDays).slice(0, 6).map((task) => (
                  <button key={task.id} type="button" onClick={() => { setTaskFilter("All"); setActiveTab("timeline"); }}>
                    <span>{plan.event.eventDate ? formatDate(dateForOffset(plan.event.eventDate, task.offsetDays)) : relativeLabel(task.offsetDays)}</span>
                    <strong>{task.title}</strong>
                  </button>
                ))}
              </div>
            </article>
            <article className="planner-card">
              <div className="planner-card-heading"><div><p className="eyebrow">Room composition</p><h3>Guest mix</h3></div><span>{plan.guests.length} prospects</span></div>
              <div className="planner-category-bars">
                {guestCategories.slice(0, -1).map((category) => {
                  const count = plan.guests.filter((guest) => guest.category === category).length;
                  const width = plan.guests.length ? Math.round((count / plan.guests.length) * 100) : 0;
                  return <div key={category}><span>{category}<b>{count}</b></span><i><em style={{ width: `${width}%` }} /></i></div>;
                })}
              </div>
            </article>
          </section>
        </div>
      ) : null}

      {activeTab === "timeline" ? (
        <div className="planner-panel">
          <SectionHeading eyebrow="Master schedule" title={plan.event.eventDate ? "Fixed event timeline" : "Relative event timeline"} detail={`${plan.timeline.length} tasks`} />
          <div className="planner-toolbar">
            <div className="planner-filter-row">
              {taskCategories.map((category) => <button className={taskFilter === category ? "active" : ""} key={category} onClick={() => setTaskFilter(category)} style={categoryStyle(category)} type="button">{category}</button>)}
            </div>
            <button className="planner-secondary-button" type="button" onClick={() => change({ ...plan, timeline: [...plan.timeline, { id: uid("timeline"), title: "New task", category: "General", offsetDays: -14, owner: "", status: "not_started", priority: "standard", notes: "" }] })}>Add task</button>
          </div>
          <div className="planner-task-list">
            {visibleTasks.map((task) => (
              <details className={`planner-task status-${task.status}`} key={task.id} style={categoryStyle(task.category)}>
                <summary>
                  <span className="planner-task-date">
                    <strong>{plan.event.eventDate ? formatDate(dateForOffset(plan.event.eventDate, task.offsetDays)) : relativeLabel(task.offsetDays)}</strong>
                    {plan.event.eventDate ? <small>{relativeLabel(task.offsetDays)}</small> : null}
                  </span>
                  <span className="planner-task-title"><strong>{task.title}</strong><small><span className="planner-task-category">{task.category}</span>{task.owner ? ` · ${task.owner}` : ""}</small></span>
                  <span className={`planner-status status-${task.status}`}>{statusLabel(task.status)}</span>
                </summary>
                <div className="planner-detail-grid">
                  <Field label="Task"><input value={task.title} onChange={(event) => updateCollection("timeline", task.id, { title: event.target.value } as Partial<PlaygroundTimelineTask>)} /></Field>
                  <Field label="Category"><input value={task.category} onChange={(event) => updateCollection("timeline", task.id, { category: event.target.value } as Partial<PlaygroundTimelineTask>)} /></Field>
                  <Field label="Days from event"><input type="number" value={task.offsetDays} onChange={(event) => updateCollection("timeline", task.id, { offsetDays: Number(event.target.value) } as Partial<PlaygroundTimelineTask>)} /><small>Use a negative number for days before.</small></Field>
                  <Field label="Owner"><input value={task.owner} onChange={(event) => updateCollection("timeline", task.id, { owner: event.target.value } as Partial<PlaygroundTimelineTask>)} /></Field>
                  <Field label="Status"><select value={task.status} onChange={(event) => updateCollection("timeline", task.id, { status: event.target.value as PlaygroundTimelineTask["status"] } as Partial<PlaygroundTimelineTask>)}>{planningStatuses.map((status) => <option value={status} key={status}>{statusLabel(status)}</option>)}</select></Field>
                  <Field label="Priority"><select value={task.priority} onChange={(event) => updateCollection("timeline", task.id, { priority: event.target.value as PlaygroundTimelineTask["priority"] } as Partial<PlaygroundTimelineTask>)}><option value="standard">Standard</option><option value="high">High</option></select></Field>
                  <Field className="wide" label="Notes"><textarea rows={3} value={task.notes} onChange={(event) => updateCollection("timeline", task.id, { notes: event.target.value } as Partial<PlaygroundTimelineTask>)} /></Field>
                  <button className="planner-delete-button" type="button" onClick={() => removeFrom("timeline", task.id)}>Remove task</button>
                </div>
              </details>
            ))}
          </div>
        </div>
      ) : null}

      {activeTab === "guests" ? (
        <div className="planner-panel">
          <section className="planner-card">
            <div className="planner-card-heading"><div><p className="eyebrow">Host circle</p><h3>Personal invitation network</h3></div><button className="planner-secondary-button" type="button" onClick={() => change({ ...plan, hosts: [...plan.hosts, { id: uid("host"), name: "", contact: "", status: "not_started", targetInvites: 10, introductionsPromised: 3, relationshipOwner: "", notes: "" }] })}>Add host</button></div>
            <div className="planner-host-grid">
              {plan.hosts.map((host) => (
                <article key={host.id}>
                  <div className="planner-row-heading"><strong>{host.name || "New host"}</strong><button type="button" onClick={() => removeFrom("hosts", host.id)} aria-label={`Remove ${host.name || "host"}`}>Remove</button></div>
                  <div className="planner-form-grid two">
                    <Field label="Name"><input value={host.name} onChange={(event) => updateCollection("hosts", host.id, { name: event.target.value } as Partial<PlaygroundHost>)} /></Field>
                    <Field label="Email or phone"><input value={host.contact} onChange={(event) => updateCollection("hosts", host.id, { contact: event.target.value } as Partial<PlaygroundHost>)} /></Field>
                    <Field label="Status"><select value={host.status} onChange={(event) => updateCollection("hosts", host.id, { status: event.target.value as PlaygroundHost["status"] } as Partial<PlaygroundHost>)}>{planningStatuses.map((status) => <option value={status} key={status}>{statusLabel(status)}</option>)}</select></Field>
                    <Field label="Relationship owner"><input value={host.relationshipOwner} onChange={(event) => updateCollection("hosts", host.id, { relationshipOwner: event.target.value } as Partial<PlaygroundHost>)} /></Field>
                    <Field label="Invitation target"><input type="number" min="0" value={host.targetInvites} onChange={(event) => updateCollection("hosts", host.id, { targetInvites: Number(event.target.value) } as Partial<PlaygroundHost>)} /></Field>
                    <Field label="Introductions promised"><input type="number" min="0" value={host.introductionsPromised} onChange={(event) => updateCollection("hosts", host.id, { introductionsPromised: Number(event.target.value) } as Partial<PlaygroundHost>)} /></Field>
                    <Field className="wide" label="Notes"><textarea rows={2} value={host.notes} onChange={(event) => updateCollection("hosts", host.id, { notes: event.target.value } as Partial<PlaygroundHost>)} /></Field>
                  </div>
                </article>
              ))}
              {!plan.hosts.length ? <EmptyState title="No hosts entered" body="Start with two anchor hosts, then build toward a circle of six to ten." /> : null}
            </div>
          </section>

          <section className="planner-card">
            <div className="planner-card-heading"><div><p className="eyebrow">Relationship map</p><h3>Invitees and follow-up</h3></div><span>{visibleGuests.length} shown · {plan.guests.length} total</span></div>
            <div className="planner-toolbar guest-toolbar">
              <input type="search" value={guestSearch} onChange={(event) => setGuestSearch(event.target.value)} placeholder="Search name, organization, host..." aria-label="Search guests" />
              <select value={guestFilter} onChange={(event) => setGuestFilter(event.target.value)} aria-label="Filter guests">
                <option>All</option>
                <optgroup label="RSVP">{rsvpStatuses.map((status) => <option key={status}>{status}</option>)}</optgroup>
                <optgroup label="Follow-up">{followUpCategories.slice(1).map((category) => <option key={category}>{category}</option>)}</optgroup>
              </select>
              <button className="planner-secondary-button" type="button" onClick={exportGuests} disabled={!plan.guests.length}>Export CSV</button>
              <button className="planner-secondary-button accent" type="button" onClick={() => change({ ...plan, guests: [...plan.guests, { id: uid("guest"), name: "", household: "", organization: "", email: "", phone: "", category: "Other", invitingHost: "", relationshipOwner: "", affinity: "", capacity: "", influence: "", rsvp: "Not invited", attendance: "Unknown", peopleToMeet: "", conversationNotes: "", followUpCategory: "Unassigned", nextStep: "", followUpOwner: "", followUpDate: "", outcome: "" }] })}>Add invitee</button>
            </div>
            <div className="planner-guest-list">
              {visibleGuests.map((guest) => (
                <details className="planner-guest" key={guest.id}>
                  <summary>
                    <span><strong>{guest.name || "New invitee"}</strong><small>{guest.organization || guest.household || guest.category}</small></span>
                    <span><small>Invited by</small><strong>{guest.invitingHost || "Unassigned"}</strong></span>
                    <span className={`planner-rsvp rsvp-${guest.rsvp.toLowerCase().replaceAll(" ", "-")}`}>{guest.rsvp}</span>
                    <span className="planner-followup-label">{guest.followUpCategory}</span>
                  </summary>
                  <div className="planner-guest-details">
                    <div className="planner-detail-section"><h4>Identity and contact</h4><div className="planner-detail-grid">
                      <Field label="Name"><input value={guest.name} onChange={(event) => updateCollection("guests", guest.id, { name: event.target.value } as Partial<PlaygroundGuest>)} /></Field>
                      <Field label="Household or couple"><input value={guest.household} onChange={(event) => updateCollection("guests", guest.id, { household: event.target.value } as Partial<PlaygroundGuest>)} /></Field>
                      <Field label="Organization"><input value={guest.organization} onChange={(event) => updateCollection("guests", guest.id, { organization: event.target.value } as Partial<PlaygroundGuest>)} /></Field>
                      <Field label="Category"><select value={guest.category} onChange={(event) => updateCollection("guests", guest.id, { category: event.target.value as PlaygroundGuest["category"] } as Partial<PlaygroundGuest>)}>{guestCategories.map((category) => <option key={category}>{category}</option>)}</select></Field>
                      <Field label="Email"><input type="email" value={guest.email} onChange={(event) => updateCollection("guests", guest.id, { email: event.target.value } as Partial<PlaygroundGuest>)} /></Field>
                      <Field label="Phone"><input type="tel" value={guest.phone} onChange={(event) => updateCollection("guests", guest.id, { phone: event.target.value } as Partial<PlaygroundGuest>)} /></Field>
                    </div></div>
                    <div className="planner-detail-section"><h4>Relationship and invitation</h4><div className="planner-detail-grid">
                      <Field label="Inviting host"><input list="playground-hosts" value={guest.invitingHost} onChange={(event) => updateCollection("guests", guest.id, { invitingHost: event.target.value } as Partial<PlaygroundGuest>)} /></Field>
                      <Field label="Relationship owner"><input value={guest.relationshipOwner} onChange={(event) => updateCollection("guests", guest.id, { relationshipOwner: event.target.value } as Partial<PlaygroundGuest>)} /></Field>
                      <Field label="Affinity"><textarea rows={2} value={guest.affinity} onChange={(event) => updateCollection("guests", guest.id, { affinity: event.target.value } as Partial<PlaygroundGuest>)} placeholder="Arts, education, marching music, Austin civic life..." /></Field>
                      <Field label="Capacity"><input value={guest.capacity} onChange={(event) => updateCollection("guests", guest.id, { capacity: event.target.value } as Partial<PlaygroundGuest>)} placeholder="High, medium, unknown, or a private note" /></Field>
                      <Field label="Influence"><input value={guest.influence} onChange={(event) => updateCollection("guests", guest.id, { influence: event.target.value } as Partial<PlaygroundGuest>)} /></Field>
                      <Field label="People to meet"><textarea rows={2} value={guest.peopleToMeet} onChange={(event) => updateCollection("guests", guest.id, { peopleToMeet: event.target.value } as Partial<PlaygroundGuest>)} /></Field>
                      <Field label="RSVP"><select value={guest.rsvp} onChange={(event) => updateCollection("guests", guest.id, { rsvp: event.target.value as PlaygroundGuest["rsvp"] } as Partial<PlaygroundGuest>)}>{rsvpStatuses.map((status) => <option key={status}>{status}</option>)}</select></Field>
                      <Field label="Attendance"><select value={guest.attendance} onChange={(event) => updateCollection("guests", guest.id, { attendance: event.target.value as PlaygroundGuest["attendance"] } as Partial<PlaygroundGuest>)}>{attendanceStatuses.map((status) => <option key={status}>{status}</option>)}</select></Field>
                    </div></div>
                    <div className="planner-detail-section"><h4>Conversation and follow-up</h4><div className="planner-detail-grid">
                      <Field className="wide" label="Conversation notes"><textarea rows={3} value={guest.conversationNotes} onChange={(event) => updateCollection("guests", guest.id, { conversationNotes: event.target.value } as Partial<PlaygroundGuest>)} /></Field>
                      <Field label="Follow-up category"><select value={guest.followUpCategory} onChange={(event) => updateCollection("guests", guest.id, { followUpCategory: event.target.value as PlaygroundGuest["followUpCategory"] } as Partial<PlaygroundGuest>)}>{followUpCategories.map((category) => <option key={category}>{category}</option>)}</select></Field>
                      <Field label="Follow-up owner"><input value={guest.followUpOwner} onChange={(event) => updateCollection("guests", guest.id, { followUpOwner: event.target.value } as Partial<PlaygroundGuest>)} /></Field>
                      <Field label="Follow-up date"><input type="date" value={guest.followUpDate} onChange={(event) => updateCollection("guests", guest.id, { followUpDate: event.target.value } as Partial<PlaygroundGuest>)} /></Field>
                      <Field className="wide" label="Recommended next step"><textarea rows={2} value={guest.nextStep} onChange={(event) => updateCollection("guests", guest.id, { nextStep: event.target.value } as Partial<PlaygroundGuest>)} /></Field>
                      <Field className="wide" label="Outcome"><textarea rows={2} value={guest.outcome} onChange={(event) => updateCollection("guests", guest.id, { outcome: event.target.value } as Partial<PlaygroundGuest>)} /></Field>
                      <button className="planner-delete-button" type="button" onClick={() => removeFrom("guests", guest.id)}>Remove invitee</button>
                    </div></div>
                  </div>
                </details>
              ))}
              {!visibleGuests.length ? <EmptyState title={plan.guests.length ? "No matching invitees" : "No invitees yet"} body={plan.guests.length ? "Change the search or filter to see more records." : "Build the first 40-person priority list before expanding it."} /> : null}
            </div>
            <datalist id="playground-hosts">{plan.hosts.map((host) => <option key={host.id} value={host.name} />)}</datalist>
          </section>
        </div>
      ) : null}

      {activeTab === "production" ? (
        <div className="planner-panel">
          <SectionHeading eyebrow="Execution" title="Venue, production, hospitality, and safety" detail={`${plan.workstreams.filter((item) => item.status === "complete").length} of ${plan.workstreams.length} complete`} />
          <section className="planner-card">
            <div className="planner-form-grid two">
              <Field label="Venue"><input value={plan.event.venue} onChange={(event) => updateEvent("venue", event.target.value)} /></Field>
              <Field label="Venue address"><input value={plan.event.venueAddress} onChange={(event) => updateEvent("venueAddress", event.target.value)} /></Field>
              <Field label="Capacity"><input type="number" min="1" value={plan.event.capacity} onChange={(event) => updateEvent("capacity", Number(event.target.value))} /></Field>
              <Field label="Attendance goal"><input type="number" min="1" value={plan.event.attendanceGoal} onChange={(event) => updateEvent("attendanceGoal", Number(event.target.value))} /></Field>
              <Field label="Attire"><input value={plan.event.attire} onChange={(event) => updateEvent("attire", event.target.value)} /></Field>
              <Field label="Parking and arrival"><textarea rows={2} value={plan.event.parking} onChange={(event) => updateEvent("parking", event.target.value)} /></Field>
              <Field className="wide" label="Accessibility"><textarea rows={2} value={plan.event.accessibility} onChange={(event) => updateEvent("accessibility", event.target.value)} /></Field>
            </div>
          </section>
          <div className="planner-workstream-grid">
            {plan.workstreams.map((item) => (
              <article className={`planner-card planner-workstream status-${item.status}`} key={item.id}>
                <div className="planner-row-heading"><span><small>{item.area}</small><strong>{item.deliverable}</strong></span><button type="button" onClick={() => removeFrom("workstreams", item.id)}>Remove</button></div>
                <div className="planner-form-grid two">
                  <Field label="Area"><input value={item.area} onChange={(event) => updateCollection("workstreams", item.id, { area: event.target.value } as Partial<PlaygroundWorkstream>)} /></Field>
                  <Field label="Owner"><input value={item.owner} onChange={(event) => updateCollection("workstreams", item.id, { owner: event.target.value } as Partial<PlaygroundWorkstream>)} /></Field>
                  <Field label="Status"><select value={item.status} onChange={(event) => updateCollection("workstreams", item.id, { status: event.target.value as PlaygroundWorkstream["status"] } as Partial<PlaygroundWorkstream>)}>{planningStatuses.map((status) => <option value={status} key={status}>{statusLabel(status)}</option>)}</select></Field>
                  <Field label={plan.event.eventDate ? "Deadline" : "Relative deadline"}>
                    {plan.event.eventDate ? <input readOnly value={formatDate(dateForOffset(plan.event.eventDate, item.offsetDays))} /> : null}
                    <input type="number" value={item.offsetDays} onChange={(event) => updateCollection("workstreams", item.id, { offsetDays: Number(event.target.value) } as Partial<PlaygroundWorkstream>)} />
                    <small>Days from event</small>
                  </Field>
                  <Field className="wide" label="Deliverable"><textarea rows={2} value={item.deliverable} onChange={(event) => updateCollection("workstreams", item.id, { deliverable: event.target.value } as Partial<PlaygroundWorkstream>)} /></Field>
                  <Field className="wide" label="Notes"><textarea rows={2} value={item.notes} onChange={(event) => updateCollection("workstreams", item.id, { notes: event.target.value } as Partial<PlaygroundWorkstream>)} /></Field>
                </div>
              </article>
            ))}
          </div>
          <button className="planner-secondary-button" type="button" onClick={() => change({ ...plan, workstreams: [...plan.workstreams, { id: uid("workstream"), area: "New area", deliverable: "", owner: "", status: "not_started", offsetDays: -14, notes: "" }] })}>Add workstream</button>
        </div>
      ) : null}

      {activeTab === "program" ? (
        <div className="planner-panel">
          <SectionHeading eyebrow="Guest journey" title="Run of show" detail={`${plan.runOfShow.reduce((total, item) => total + item.durationMinutes, 0)} planned minutes`} />
          <div className="planner-run-list">
            {[...plan.runOfShow].sort((a, b) => a.startMinute - b.startMinute).map((item) => (
              <article className="planner-run-item" key={item.id}>
                <div className="planner-run-time"><strong>+{item.startMinute}</strong><small>{item.durationMinutes} min</small></div>
                <div className="planner-run-content">
                  <div className="planner-row-heading"><span><strong>{item.segment || "New segment"}</strong><small>{item.cue}</small></span><button type="button" onClick={() => removeFrom("runOfShow", item.id)}>Remove</button></div>
                  <div className="planner-detail-grid">
                    <Field label="Start minute"><input type="number" min="0" value={item.startMinute} onChange={(event) => updateCollection("runOfShow", item.id, { startMinute: Number(event.target.value) } as Partial<PlaygroundRunItem>)} /></Field>
                    <Field label="Duration"><input type="number" min="1" value={item.durationMinutes} onChange={(event) => updateCollection("runOfShow", item.id, { durationMinutes: Number(event.target.value) } as Partial<PlaygroundRunItem>)} /></Field>
                    <Field label="Segment"><input value={item.segment} onChange={(event) => updateCollection("runOfShow", item.id, { segment: event.target.value } as Partial<PlaygroundRunItem>)} /></Field>
                    <Field label="Owner"><input value={item.owner} onChange={(event) => updateCollection("runOfShow", item.id, { owner: event.target.value } as Partial<PlaygroundRunItem>)} /></Field>
                    <Field className="wide" label="Cue or action"><textarea rows={2} value={item.cue} onChange={(event) => updateCollection("runOfShow", item.id, { cue: event.target.value } as Partial<PlaygroundRunItem>)} /></Field>
                    <Field className="wide" label="Notes"><textarea rows={2} value={item.notes} onChange={(event) => updateCollection("runOfShow", item.id, { notes: event.target.value } as Partial<PlaygroundRunItem>)} /></Field>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <button className="planner-secondary-button" type="button" onClick={() => change({ ...plan, runOfShow: [...plan.runOfShow, { id: uid("run"), startMinute: plan.runOfShow.reduce((max, item) => Math.max(max, item.startMinute + item.durationMinutes), 0), durationMinutes: 5, segment: "New segment", owner: "", cue: "", notes: "" }] })}>Add segment</button>
        </div>
      ) : null}

      {activeTab === "budget" ? (
        <div className="planner-panel">
          <SectionHeading eyebrow="Resources" title="Vendors and event budget" detail={`${money.format(metrics.estimate)} estimated`} />
          <section className="planner-budget-summary">
            <article><span>Estimated</span><strong>{money.format(metrics.estimate)}</strong></article>
            <article><span>Actual</span><strong>{money.format(metrics.actual)}</strong></article>
            <article><span>Variance</span><strong>{money.format(metrics.estimate - metrics.actual)}</strong></article>
            <article><span>Paid items</span><strong>{plan.budget.filter((item) => item.paid).length}/{plan.budget.length}</strong></article>
          </section>
          <div className="planner-budget-list">
            {plan.budget.map((item) => (
              <article key={item.id}>
                <div className="planner-row-heading"><span><small>{item.category}</small><strong>{item.item || "New budget item"}</strong></span><button type="button" onClick={() => removeFrom("budget", item.id)}>Remove</button></div>
                <div className="planner-form-grid four">
                  <Field label="Category"><input value={item.category} onChange={(event) => updateCollection("budget", item.id, { category: event.target.value } as Partial<PlaygroundBudgetItem>)} /></Field>
                  <Field label="Item"><input value={item.item} onChange={(event) => updateCollection("budget", item.id, { item: event.target.value } as Partial<PlaygroundBudgetItem>)} /></Field>
                  <Field label="Vendor"><input value={item.vendor} onChange={(event) => updateCollection("budget", item.id, { vendor: event.target.value } as Partial<PlaygroundBudgetItem>)} /></Field>
                  <Field label="Status"><select value={item.status} onChange={(event) => updateCollection("budget", item.id, { status: event.target.value as PlaygroundBudgetItem["status"] } as Partial<PlaygroundBudgetItem>)}>{planningStatuses.map((status) => <option value={status} key={status}>{statusLabel(status)}</option>)}</select></Field>
                  <Field label="Estimate"><input type="number" min="0" step="1" value={item.estimate} onChange={(event) => updateCollection("budget", item.id, { estimate: Number(event.target.value) } as Partial<PlaygroundBudgetItem>)} /></Field>
                  <Field label="Actual"><input type="number" min="0" step="1" value={item.actual} onChange={(event) => updateCollection("budget", item.id, { actual: Number(event.target.value) } as Partial<PlaygroundBudgetItem>)} /></Field>
                  <label className="planner-check"><input type="checkbox" checked={item.paid} onChange={(event) => updateCollection("budget", item.id, { paid: event.target.checked } as Partial<PlaygroundBudgetItem>)} /> Paid</label>
                  <Field label="Notes"><input value={item.notes} onChange={(event) => updateCollection("budget", item.id, { notes: event.target.value } as Partial<PlaygroundBudgetItem>)} /></Field>
                </div>
              </article>
            ))}
          </div>
          <button className="planner-secondary-button" type="button" onClick={() => change({ ...plan, budget: [...plan.budget, { id: uid("budget"), category: "Other", item: "", vendor: "", status: "not_started", estimate: 0, actual: 0, paid: false, notes: "" }] })}>Add budget item</button>
        </div>
      ) : null}

      {activeTab === "brief" ? (
        <div className="planner-panel">
          <SectionHeading eyebrow="Shared direction" title="Event brief and support framing" detail="Internal planning language" />
          <section className="planner-card">
            <div className="planner-form-grid two">
              <Field className="wide" label="Primary objective"><textarea rows={3} value={plan.event.objective} onChange={(event) => updateEvent("objective", event.target.value)} /></Field>
              <Field className="wide" label="Core event promise"><textarea rows={2} value={plan.event.promise} onChange={(event) => updateEvent("promise", event.target.value)} /></Field>
            </div>
          </section>
          <section className="planner-card">
            <div className="planner-card-heading"><div><p className="eyebrow">Prepared next steps</p><h3>Support opportunities</h3></div><button className="planner-secondary-button" type="button" onClick={() => change({ ...plan, supportOpportunities: [...plan.supportOpportunities, { id: uid("support"), title: "", amount: "", description: "", status: "not_started" }] })}>Add opportunity</button></div>
            <div className="planner-support-grid">
              {plan.supportOpportunities.map((item) => (
                <article key={item.id}>
                  <div className="planner-row-heading"><strong>{item.title || "New opportunity"}</strong><button type="button" onClick={() => removeFrom("supportOpportunities", item.id)}>Remove</button></div>
                  <Field label="Title"><input value={item.title} onChange={(event) => updateCollection("supportOpportunities", item.id, { title: event.target.value } as Partial<PlaygroundSupportOpportunity>)} /></Field>
                  <Field label="Amount or range"><input value={item.amount} onChange={(event) => updateCollection("supportOpportunities", item.id, { amount: event.target.value } as Partial<PlaygroundSupportOpportunity>)} placeholder="Optional" /></Field>
                  <Field label="Description"><textarea rows={3} value={item.description} onChange={(event) => updateCollection("supportOpportunities", item.id, { description: event.target.value } as Partial<PlaygroundSupportOpportunity>)} /></Field>
                  <Field label="Readiness"><select value={item.status} onChange={(event) => updateCollection("supportOpportunities", item.id, { status: event.target.value as PlaygroundSupportOpportunity["status"] } as Partial<PlaygroundSupportOpportunity>)}>{planningStatuses.map((status) => <option value={status} key={status}>{statusLabel(status)}</option>)}</select></Field>
                </article>
              ))}
            </div>
          </section>
          <section className="planner-card">
            <div className="planner-card-heading"><div><p className="eyebrow">Working record</p><h3>General planning notes</h3></div></div>
            <textarea className="planner-notes" rows={14} value={plan.notes} onChange={(event) => change({ ...plan, notes: event.target.value })} placeholder="Decisions, open questions, meeting notes, venue leads, and context that should stay with the event..." />
          </section>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, className = "", children }: { label: string; className?: string; children: React.ReactNode }) {
  return <label className={`planner-field ${className}`}>{label}{children}</label>;
}

function SectionHeading({ eyebrow, title, detail }: { eyebrow: string; title: string; detail: string }) {
  return <div className="planner-section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div><span>{detail}</span></div>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="planner-empty"><strong>{title}</strong><p>{body}</p></div>;
}
