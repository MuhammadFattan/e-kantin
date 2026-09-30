"use client";

import { useEffect } from "react";
import {
  AlertCircle,
  Check,
  ChevronRight,
  Info,
  LoaderCircle,
  X,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`button button-${variant} button-${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconButton({ children, label, className = "", ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`icon-button ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action && <div className="page-heading-action">{action}</div>}
    </div>
  );
}

export function SectionHeading({
  title,
  description,
  href,
  actionLabel = "Lihat semua",
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && (
        <a className="text-link" href={href}>
          {actionLabel}
          <ChevronRight size={16} />
        </a>
      )}
    </div>
  );
}

export function StatusBadge({ status }) {
  const tone =
    status === "Buka" ||
    status === "Aktif" ||
    status === "Selesai" ||
    status === "Tersedia"
      ? "green"
      : status === "Diproses" ||
          (typeof status === "string" && status.startsWith("Menunggu")) ||
          status === "Siap Diambil" ||
          status === "Siap Diantar" ||
          status === "Dalam Pengantaran"
        ? "amber"
        : status === "Dibatalkan" || status === "Nonaktif" || status === "Tutup"
          ? "red"
          : "neutral";
  return (
    <span className={`status-badge status-${tone}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

export function EmptyState({ icon: Icon = Info, title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={23} />
      </div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

export function LoadingState({ label = "Memuat data…" }) {
  return (
    <div className="loading-state">
      <LoaderCircle className="spin" size={20} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function FormField({
  label,
  hint,
  error,
  id,
  children,
  required = false,
}) {
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={id}>
          {label}
          {required && <span className="required-mark"> *</span>}
        </label>
      )}
      {children}
      {hint && !error && <small className="field-hint">{hint}</small>}
      {error && <small className="field-error">{error}</small>}
    </div>
  );
}

export function ConfirmHost() {
  const { confirmation, settleConfirmation } = useStore();
  useEffect(() => {
    if (!confirmation) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") settleConfirmation(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [confirmation, settleConfirmation]);
  if (!confirmation) return null;
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && settleConfirmation(false)
      }
    >
      <section
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <div className="confirm-icon">
          <AlertCircle size={22} />
        </div>
        <h2 id="confirm-title">
          {confirmation.title || "Konfirmasi tindakan"}
        </h2>
        <p>
          {confirmation.description || "Apakah Anda yakin ingin melanjutkan?"}
        </p>
        <div className="dialog-actions">
          <Button variant="secondary" onClick={() => settleConfirmation(false)}>
            Kembali
          </Button>
          <Button
            variant={confirmation.danger ? "danger" : "primary"}
            onClick={() => settleConfirmation(true)}
          >
            {confirmation.confirmLabel || "Ya, lanjutkan"}
          </Button>
        </div>
      </section>
    </div>
  );
}

export function ToastHost() {
  const { toasts, dismissToast } = useStore();
  if (!toasts.length) return null;
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.tone}`}>
          <span className="toast-icon">
            {toast.tone === "error" ? (
              <AlertCircle size={17} />
            ) : (
              <Check size={17} />
            )}
          </span>
          <span>{toast.message}</span>
          <button
            aria-label="Tutup notifikasi"
            onClick={() => dismissToast(toast.id)}
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
