"use client";

import { useState } from "react";
import {
  BadgeCheck,
  ClipboardCheck,
  MapPin,
  Phone,
  ShieldX,
  Store,
  UserRound,
} from "lucide-react";
import ConsoleShell from "@/components/ConsoleShell";
import { Button, EmptyState, PageHeading, StatusBadge } from "@/components/ui";
import { useStore } from "@/context/StoreContext";

export default function OwnerApplicationsPage() {
  const { owners, canteens, reviewOwner, requestConfirmation } = useStore();
  const [showReviewed, setShowReviewed] = useState(false);
  const applications = owners.filter((owner) =>
    showReviewed
      ? ["Aktif", "Ditolak"].includes(owner.status)
      : owner.status === "Menunggu Verifikasi",
  );

  async function review(owner, approved) {
    const yes = await requestConfirmation({
      title: approved ? "Setujui pendaftaran?" : "Tolak pendaftaran?",
      description: approved
        ? `${owner.name} dapat masuk dan kantinnya dibuka.`
        : `Pendaftaran ${owner.name} akan ditandai ditolak.`,
      confirmLabel: approved ? "Setujui" : "Tolak",
      danger: !approved,
    });
    if (yes) reviewOwner(owner.id, approved);
  }

  return (
    <ConsoleShell type="admin" title="Verifikasi Pemilik">
      <PageHeading
        eyebrow="Pemeriksaan pendaftaran"
        title="Verifikasi pemilik kantin"
        description="Periksa kecocokan data pemilik, nomor KTP, produk, dan lokasi sebelum aktivasi."
      />
      <div className="console-filter-row">
        <label className="check-row">
          <input
            type="checkbox"
            checked={showReviewed}
            onChange={(event) => setShowReviewed(event.target.checked)}
          />
          Tampilkan pengajuan yang sudah diputuskan
        </label>
        <span className="table-secondary">{applications.length} pengajuan</span>
      </div>
      {applications.length ? (
        <div className="application-list">
          {applications.map((owner) => {
            const canteen = canteens.find((item) => item.ownerId === owner.id);
            return (
              <article className="application-card" key={owner.id}>
                <div className="application-card-head">
                  <div>
                    <span className="eyebrow">
                      {owner.status === "Menunggu Verifikasi"
                        ? "Menunggu pemeriksaan"
                        : "Sudah diputuskan"}
                    </span>
                    <h2>{owner.name}</h2>
                    <StatusBadge status={owner.status} />
                  </div>
                  {owner.status === "Menunggu Verifikasi" && (
                    <div className="application-actions">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => review(owner, false)}
                      >
                        <ShieldX size={15} />
                        Tolak
                      </Button>
                      <Button size="sm" onClick={() => review(owner, true)}>
                        <BadgeCheck size={15} />
                        Setujui pemilik
                      </Button>
                    </div>
                  )}
                </div>
                <div className="application-details">
                  <div className="application-person">
                    <p>
                      <UserRound size={15} />
                      <b>{owner.name}</b>
                    </p>
                    <p>
                      <Phone size={15} />
                      {owner.phone}
                    </p>
                    <p>Username: @{owner.username}</p>
                    <p>Nomor KTP: {owner.ktpNumber || "Tidak disediakan"}</p>
                    <p>
                      <Store size={15} />
                      <b>{canteen?.name || "Nama usaha belum tersedia"}</b>
                    </p>
                    <p>
                      <MapPin size={15} />
                      {canteen?.location || "Lokasi belum tersedia"}
                    </p>
                    <p>Kapasitas: {canteen?.maxSeats || 0} kursi</p>
                    <h3>Produk yang didaftarkan</h3>
                    <p className="application-products">
                      {owner.applicationProducts || "Tidak ada data produk."}
                    </p>
                  </div>
                  <div className="application-document">
                    {owner.ktpPreview ? (
                      <a
                        href={owner.ktpPreview}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={owner.ktpPreview}
                          alt={`Foto KTP ${owner.name}`}
                        />
                      </a>
                    ) : (
                      <div className="application-no-document">
                        <ClipboardCheck size={24} />
                        <span>Foto identitas tidak tersedia</span>
                      </div>
                    )}
                    <small>{owner.ktpFileName || "Bukti identitas"}</small>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={ClipboardCheck}
          title={
            showReviewed
              ? "Belum ada keputusan verifikasi"
              : "Tidak ada pengajuan menunggu"
          }
          description={
            showReviewed
              ? "Pengajuan yang sudah disetujui atau ditolak akan tampil di sini."
              : "Pendaftaran pemilik baru akan muncul di antrean ini."
          }
        />
      )}
    </ConsoleShell>
  );
}
