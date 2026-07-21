"use client";

import { useActionState, useMemo, useState } from "react";
import {
  saveRelationshipDirectory,
  type RelationshipDirectorySaveState,
} from "@/app/hub/actions";
import {
  preferredContactMethods,
  relationshipPriorities,
  relationshipStatuses,
  relationshipStrengths,
  relationshipTypes,
  type RelationshipDirectory,
  type RelationshipRecord,
} from "@/lib/relationship-directory";

const initialSaveState: RelationshipDirectorySaveState = {
  status: "idle",
  message: "",
};

const uid = () =>
  `relationship-${
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Date.now()
  }`;

function todayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(value: string) {
  if (!value) return "Not scheduled";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function statusClass(value: string) {
  return value.toLowerCase().replaceAll(" ", "-");
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`planner-field ${className}`.trim()}>
      {label}
      {children}
    </label>
  );
}

export function RelationshipManager({
  initialDirectory,
  storageConfigured,
}: {
  initialDirectory: RelationshipDirectory;
  storageConfigured: boolean;
}) {
  const [directory, setDirectory] = useState(initialDirectory);
  const [dirty, setDirty] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [sort, setSort] = useState("Follow-up date");
  const [expandedContactIds, setExpandedContactIds] = useState<Set<string>>(
    new Set(),
  );
  const [saveState, saveAction, saving] = useActionState(
    saveRelationshipDirectory,
    initialSaveState,
  );
  const today = todayString();

  function changeContacts(contacts: RelationshipRecord[]) {
    setDirectory({ ...directory, contacts });
    setDirty(true);
  }

  function updateContact(id: string, patch: Partial<RelationshipRecord>) {
    const updatedAt = new Date().toISOString();
    changeContacts(
      directory.contacts.map((contact) =>
        contact.id === id ? { ...contact, ...patch, updatedAt } : contact,
      ),
    );
  }

  function addContact() {
    const timestamp = new Date().toISOString();
    const contact: RelationshipRecord = {
      id: uid(),
      name: "",
      organization: "",
      role: "",
      email: "",
      phone: "",
      type: "Other",
      status: "Not contacted",
      priority: "Standard",
      strength: "New",
      preferredContactMethod: "Not specified",
      relationshipOwner: "",
      connectionSource: "",
      lastContactDate: "",
      nextFollowUpDate: "",
      nextAction: "",
      tags: "",
      notes: "",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    changeContacts([contact, ...directory.contacts]);
    setExpandedContactIds((current) => new Set(current).add(contact.id));
    setSearch("");
    setTypeFilter("All types");
    setStatusFilter("All statuses");
  }

  function removeContact(contact: RelationshipRecord) {
    const label = contact.name || "this new relationship";
    if (!window.confirm(`Remove ${label} from the organization directory?`)) return;
    changeContacts(directory.contacts.filter((item) => item.id !== contact.id));
    setExpandedContactIds((current) => {
      const next = new Set(current);
      next.delete(contact.id);
      return next;
    });
  }

  const metrics = useMemo(() => {
    const current = directory.contacts.filter(
      (contact) => contact.status !== "Closed",
    );
    const due = current.filter(
      (contact) =>
        contact.status !== "On hold" &&
        contact.nextFollowUpDate &&
        contact.nextFollowUpDate <= today,
    ).length;
    const conversations = current.filter((contact) =>
      ["Conversation active", "Follow-up needed"].includes(contact.status),
    ).length;
    const highPriority = current.filter(
      (contact) => contact.priority === "High",
    ).length;
    return {
      total: directory.contacts.length,
      due,
      conversations,
      highPriority,
    };
  }, [directory.contacts, today]);

  const visibleContacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const contacts = directory.contacts.filter((contact) => {
      const matchesSearch =
        !query ||
        [
          contact.name,
          contact.organization,
          contact.role,
          contact.email,
          contact.phone,
          contact.tags,
          contact.relationshipOwner,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesType =
        typeFilter === "All types" || contact.type === typeFilter;
      const matchesStatus =
        statusFilter === "All statuses" || contact.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });

    return [...contacts].sort((a, b) => {
      if (sort === "Name") return a.name.localeCompare(b.name);
      if (sort === "Recently updated") {
        return b.updatedAt.localeCompare(a.updatedAt);
      }
      if (!a.nextFollowUpDate && !b.nextFollowUpDate) {
        return a.name.localeCompare(b.name);
      }
      if (!a.nextFollowUpDate) return 1;
      if (!b.nextFollowUpDate) return -1;
      return a.nextFollowUpDate.localeCompare(b.nextFollowUpDate);
    });
  }, [directory.contacts, search, sort, statusFilter, typeFilter]);

  const hasUnsavedChanges = dirty || saveState.status === "error";

  function exportDirectory() {
    const headings = [
      "Name",
      "Organization",
      "Role",
      "Email",
      "Phone",
      "Relationship type",
      "Status",
      "Priority",
      "Relationship strength",
      "Preferred contact method",
      "Relationship owner",
      "Connection source",
      "Last contact",
      "Next follow-up",
      "Next action",
      "Tags",
      "Notes",
    ];
    const rows = directory.contacts.map((contact) => [
      contact.name,
      contact.organization,
      contact.role,
      contact.email,
      contact.phone,
      contact.type,
      contact.status,
      contact.priority,
      contact.strength,
      contact.preferredContactMethod,
      contact.relationshipOwner,
      contact.connectionSource,
      contact.lastContactDate,
      contact.nextFollowUpDate,
      contact.nextAction,
      contact.tags,
      contact.notes,
    ]);
    const csv = [headings, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\n");
    const href = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = href;
    link.download = "nova-organization-relationships.csv";
    link.click();
    URL.revokeObjectURL(href);
  }

  return (
    <div className="planner relationship-manager">
      <div className="planner-command-bar">
        <div>
          <span
            className={`planner-unsaved ${hasUnsavedChanges ? "visible" : ""}`}
          >
            {hasUnsavedChanges
              ? "Unsaved changes"
              : saveState.status === "success"
                ? "All changes saved"
                : "Directory loaded"}
          </span>
          {directory.updatedAt ? (
            <small>
              Last saved {new Date(directory.updatedAt).toLocaleString()}
            </small>
          ) : null}
        </div>
        <form action={saveAction} onSubmit={() => setDirty(false)}>
          <input
            type="hidden"
            name="directory"
            value={JSON.stringify(directory)}
          />
          <button
            className="hub-save-button"
            type="submit"
            disabled={!storageConfigured || saving || !hasUnsavedChanges}
          >
            {saving ? "Saving..." : "Save relationships"}
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

      <section className="planner-metrics" aria-label="Relationship metrics">
        <article>
          <span>Relationships</span>
          <strong>{metrics.total}</strong>
          <p>Organization-wide records</p>
        </article>
        <article>
          <span>Follow-up due</span>
          <strong>{metrics.due}</strong>
          <p>Due today or overdue</p>
        </article>
        <article>
          <span>Conversations</span>
          <strong>{metrics.conversations}</strong>
          <p>Active or awaiting follow-up</p>
        </article>
        <article>
          <span>High priority</span>
          <strong>{metrics.highPriority}</strong>
          <p>Open relationships</p>
        </article>
      </section>

      <section className="planner-card relationship-directory-card">
        <div className="planner-card-heading">
          <div>
            <p className="eyebrow">Organization network</p>
            <h2>Relationship directory</h2>
          </div>
          <div className="relationship-heading-actions">
            <button
              className="planner-secondary-button"
              type="button"
              onClick={exportDirectory}
              disabled={!directory.contacts.length}
            >
              Export CSV
            </button>
            <button
              className="planner-secondary-button accent"
              type="button"
              onClick={addContact}
            >
              Add relationship
            </button>
          </div>
        </div>

        <div className="relationship-toolbar">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search people, organizations, tags..."
            aria-label="Search relationships"
          />
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            aria-label="Filter by relationship type"
          >
            <option>All types</option>
            {relationshipTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option>All statuses</option>
            {relationshipStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort relationships"
          >
            <option>Follow-up date</option>
            <option>Name</option>
            <option>Recently updated</option>
          </select>
        </div>

        <div className="relationship-results-heading">
          <span>
            {visibleContacts.length} shown · {directory.contacts.length} total
          </span>
          {(search ||
            typeFilter !== "All types" ||
            statusFilter !== "All statuses") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setTypeFilter("All types");
                setStatusFilter("All statuses");
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="relationship-list">
          {visibleContacts.map((contact) => {
            const followUpDue =
              contact.status !== "Closed" &&
              contact.status !== "On hold" &&
              contact.nextFollowUpDate &&
              contact.nextFollowUpDate <= today;
            return (
              <details
                className={`relationship-record ${
                  followUpDue ? "follow-up-due" : ""
                }`}
                key={contact.id}
                open={expandedContactIds.has(contact.id)}
                onToggle={(event) => {
                  const isOpen = event.currentTarget.open;
                  setExpandedContactIds((current) => {
                    const next = new Set(current);
                    if (isOpen) next.add(contact.id);
                    else next.delete(contact.id);
                    return next;
                  });
                }}
              >
                <summary>
                  <span className="relationship-person">
                    <strong>{contact.name || "New relationship"}</strong>
                    <small>
                      {[contact.role, contact.organization]
                        .filter(Boolean)
                        .join(" · ") || "Details not yet entered"}
                    </small>
                  </span>
                  <span>
                    <small>Type</small>
                    <strong>{contact.type}</strong>
                  </span>
                  <span>
                    <small>Status</small>
                    <strong
                      className={`relationship-status status-${statusClass(
                        contact.status,
                      )}`}
                    >
                      {contact.status}
                    </strong>
                  </span>
                  <span>
                    <small>Next follow-up</small>
                    <strong className={followUpDue ? "date-due" : ""}>
                      {formatDate(contact.nextFollowUpDate)}
                    </strong>
                  </span>
                  <span
                    className={`relationship-priority priority-${contact.priority.toLowerCase()}`}
                  >
                    {contact.priority}
                  </span>
                </summary>

                <div className="relationship-record-details">
                  <section className="planner-detail-section">
                    <h3>Contact</h3>
                    <div className="planner-detail-grid">
                      <Field label="Name">
                        <input
                          value={contact.name}
                          onChange={(event) =>
                            updateContact(contact.id, { name: event.target.value })
                          }
                          maxLength={180}
                          placeholder="Full name"
                        />
                      </Field>
                      <Field label="Organization">
                        <input
                          value={contact.organization}
                          onChange={(event) =>
                            updateContact(contact.id, {
                              organization: event.target.value,
                            })
                          }
                          maxLength={180}
                        />
                      </Field>
                      <Field label="Role or title">
                        <input
                          value={contact.role}
                          onChange={(event) =>
                            updateContact(contact.id, { role: event.target.value })
                          }
                          maxLength={160}
                        />
                      </Field>
                      <Field label="Email">
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(event) =>
                            updateContact(contact.id, { email: event.target.value })
                          }
                          maxLength={240}
                        />
                      </Field>
                      <Field label="Phone">
                        <input
                          type="tel"
                          value={contact.phone}
                          onChange={(event) =>
                            updateContact(contact.id, { phone: event.target.value })
                          }
                          maxLength={80}
                        />
                      </Field>
                      <Field label="Preferred contact method">
                        <select
                          value={contact.preferredContactMethod}
                          onChange={(event) =>
                            updateContact(contact.id, {
                              preferredContactMethod: event.target
                                .value as RelationshipRecord["preferredContactMethod"],
                            })
                          }
                        >
                          {preferredContactMethods.map((method) => (
                            <option key={method}>{method}</option>
                          ))}
                        </select>
                      </Field>
                    </div>
                    {contact.email || contact.phone ? (
                      <div className="relationship-contact-actions">
                        {contact.email ? (
                          <a href={`mailto:${contact.email}`}>Email contact</a>
                        ) : null}
                        {contact.phone ? (
                          <a href={`tel:${contact.phone}`}>Call contact</a>
                        ) : null}
                      </div>
                    ) : null}
                  </section>

                  <section className="planner-detail-section">
                    <h3>Relationship</h3>
                    <div className="planner-detail-grid">
                      <Field label="Relationship type">
                        <select
                          value={contact.type}
                          onChange={(event) =>
                            updateContact(contact.id, {
                              type: event.target.value as RelationshipRecord["type"],
                            })
                          }
                        >
                          {relationshipTypes.map((type) => (
                            <option key={type}>{type}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Status">
                        <select
                          value={contact.status}
                          onChange={(event) =>
                            updateContact(contact.id, {
                              status: event.target
                                .value as RelationshipRecord["status"],
                            })
                          }
                        >
                          {relationshipStatuses.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Priority">
                        <select
                          value={contact.priority}
                          onChange={(event) =>
                            updateContact(contact.id, {
                              priority: event.target
                                .value as RelationshipRecord["priority"],
                            })
                          }
                        >
                          {relationshipPriorities.map((priority) => (
                            <option key={priority}>{priority}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Relationship strength">
                        <select
                          value={contact.strength}
                          onChange={(event) =>
                            updateContact(contact.id, {
                              strength: event.target
                                .value as RelationshipRecord["strength"],
                            })
                          }
                        >
                          {relationshipStrengths.map((strength) => (
                            <option key={strength}>{strength}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Relationship owner">
                        <input
                          value={contact.relationshipOwner}
                          onChange={(event) =>
                            updateContact(contact.id, {
                              relationshipOwner: event.target.value,
                            })
                          }
                          maxLength={120}
                          placeholder="Who at NOVA owns this relationship?"
                        />
                      </Field>
                      <Field label="How we are connected">
                        <input
                          value={contact.connectionSource}
                          onChange={(event) =>
                            updateContact(contact.id, {
                              connectionSource: event.target.value,
                            })
                          }
                          maxLength={240}
                          placeholder="Referral, event, school, introduction..."
                        />
                      </Field>
                    </div>
                  </section>

                  <section className="planner-detail-section relationship-follow-up-section">
                    <h3>Follow-up</h3>
                    <div className="planner-detail-grid">
                      <Field label="Last contact">
                        <input
                          type="date"
                          value={contact.lastContactDate}
                          onChange={(event) =>
                            updateContact(contact.id, {
                              lastContactDate: event.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Next follow-up">
                        <input
                          type="date"
                          value={contact.nextFollowUpDate}
                          onChange={(event) =>
                            updateContact(contact.id, {
                              nextFollowUpDate: event.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field className="wide" label="Next action">
                        <textarea
                          rows={3}
                          value={contact.nextAction}
                          onChange={(event) =>
                            updateContact(contact.id, {
                              nextAction: event.target.value,
                            })
                          }
                          maxLength={500}
                          placeholder="What should happen next?"
                        />
                      </Field>
                      <Field className="wide" label="Tags">
                        <input
                          value={contact.tags}
                          onChange={(event) =>
                            updateContact(contact.id, { tags: event.target.value })
                          }
                          maxLength={500}
                          placeholder="Austin, arts education, warm introduction"
                        />
                      </Field>
                      <Field className="wide" label="Relationship notes">
                        <textarea
                          rows={5}
                          value={contact.notes}
                          onChange={(event) =>
                            updateContact(contact.id, { notes: event.target.value })
                          }
                          maxLength={5000}
                          placeholder="Conversation history, interests, context, and useful details"
                        />
                      </Field>
                    </div>
                  </section>

                  <div className="relationship-record-footer">
                    <small>
                      {contact.updatedAt
                        ? `Updated ${new Date(contact.updatedAt).toLocaleString()}`
                        : "Not yet saved"}
                    </small>
                    <button
                      className="planner-delete-button"
                      type="button"
                      onClick={() => removeContact(contact)}
                    >
                      Remove relationship
                    </button>
                  </div>
                </div>
              </details>
            );
          })}

          {!visibleContacts.length ? (
            <div className="planner-empty">
              <strong>
                {directory.contacts.length
                  ? "No relationships match these filters"
                  : "No organization relationships yet"}
              </strong>
              <p>
                {directory.contacts.length
                  ? "Clear the filters to return to the full directory."
                  : "Add educators, prospective members, vendors, supporters, and other contacts here."}
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
