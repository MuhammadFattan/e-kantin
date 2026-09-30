'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Building2, Edit3, Plus, Search, Trash2, UserRound, UserRoundX } from 'lucide-react';
import ConsoleShell from '@/components/ConsoleShell';
import { Button, IconButton, PageHeading, StatusBadge } from '@/components/ui';
import { useStore } from '@/context/StoreContext';

export default function AdminOwnersPage() {
  const { owners, canteens, toggleOwner, deleteOwner, requestConfirmation } = useStore();
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => owners.filter((owner) => {
    const canteen = canteens.find((item) => item.ownerId === owner.id);
    return `${owner.name} ${owner.username} ${canteen?.name || ''} ${canteen?.location || ''}`.toLowerCase().includes(query.toLowerCase());
  }), [canteens, owners, query]);
  async function removeOwner(owner) {
    const confirmed = await requestConfirmation({ title: 'Hapus pemilik kantin?', description: `Akun ${owner.name} beserta kantin dan produknya akan dihapus dari data demo. Pesanan lama tetap tersimpan.`, confirmLabel: 'Hapus pemilik', danger: true });
    if (confirmed) deleteOwner(owner.id);
  }
  return <ConsoleShell type="admin" title="Pemilik Kantin"><PageHeading eyebrow="Akun usaha" title="Pemilik kantin" description="Kelola data pemilik dan informasi UMKM yang terhubung." action={<Link href="/admin/owners/create" className="button button-primary button-md"><Plus size={16} />Tambah pemilik</Link>} /><div className="stat-grid"><div className="stat-card"><span className="stat-icon"><UsersRoundIcon /></span><span><small>Total pemilik</small><strong>{owners.length}</strong></span></div><div className="stat-card"><span className="stat-icon green"><UserRound size={19} /></span><span><small>Akun aktif</small><strong>{owners.filter((owner) => owner.status === 'Aktif').length}</strong></span></div><div className="stat-card"><span className="stat-icon coral"><Building2 size={19} /></span><span><small>Kantin terdaftar</small><strong>{canteens.length}</strong></span></div></div><section className="console-panel"><div className="console-panel-head"><div><h2>Daftar akun pemilik</h2><p>Data akun demo dikelola oleh admin.</p></div></div><div className="console-filter-row"><Search size={16} color="#8993a3" /><input className="field-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama, kantin, username..." aria-label="Cari pemilik kantin" /><span className="table-secondary">{filtered.length} akun</span></div>{filtered.length ? <div className="console-table-wrap"><table className="console-table"><thead><tr><th>NAMA PEMILIK</th><th>KANTIN / UMKM</th><th>USERNAME</th><th>STATUS</th><th>AKSI</th></tr></thead><tbody>{filtered.map((owner) => { const canteen = canteens.find((item) => item.ownerId === owner.id); return <tr key={owner.id}><td><span className="table-primary">{owner.name}</span><div className="table-secondary">{owner.phone}</div></td><td><span className="table-primary">{canteen?.name || 'Belum terhubung'}</span><div className="table-secondary">{canteen?.location || '—'}</div></td><td>@{owner.username}</td><td><button className="table-status-button" type="button" aria-label={`Ubah status ${owner.name}`} onClick={() => toggleOwner(owner.id)}><StatusBadge status={owner.status} /></button></td><td><div className="table-actions"><Link className="table-icon-button" href={`/admin/owners/${owner.id}/edit`} aria-label={`Edit ${owner.name}`}><Edit3 size={14} /></Link><button className="table-icon-button" type="button" aria-label={`${owner.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'} ${owner.name}`} onClick={() => toggleOwner(owner.id)}>{owner.status === 'Aktif' ? <UserRoundX size={14} /> : <UserRound size={14} />}</button><IconButton className="table-icon-button danger" label={`Hapus ${owner.name}`} onClick={() => removeOwner(owner)}><Trash2 size={14} /></IconButton></div></td></tr>; })}</tbody></table></div> : <div className="table-empty">Tidak ada pemilik yang cocok dengan pencarian.</div>}</section></ConsoleShell>;
}

function UsersRoundIcon() { return <UserRound size={19} />; }
