"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Archive, ArchiveRestore, Copy, Plus, Search, Trash2 } from "lucide-react";
import { warrantyRepository } from "@/services/warranty.service";
import type { WarrantyCertificate } from "@/types/warranty";
import type { DocumentStatus } from "@/types/document";
import { formatThaiBuddhistDate } from "@/lib/thai-calendar/thai-calendar";

type StatusFilter = "all" | DocumentStatus;
type ArchiveFilter = "active" | "archived";

export default function WarrantyListPage() {
  const [warranties, setWarranties] = useState<WarrantyCertificate[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [archiveFilter, setArchiveFilter] = useState<ArchiveFilter>("active");

  async function reload() {
    const all = await warrantyRepository.list({ includeArchived: true });
    setWarranties(all);
  }

  useEffect(() => {
    reload();
  }, []);

  const filtered = useMemo(() => {
    return warranties
      .filter((w) => (archiveFilter === "archived" ? Boolean(w.archivedAt) : !w.archivedAt))
      .filter((w) => statusFilter === "all" || w.status === statusFilter)
      .filter((w) => {
        if (!query.trim()) return true;
        const haystack = `${w.documentNumber} ${w.customer.name}`.toLowerCase();
        return haystack.includes(query.trim().toLowerCase());
      });
  }, [warranties, query, statusFilter, archiveFilter]);

  return (
    <div className="min-h-screen bg-doc-paper-muted">
      <div className="border-b border-doc-border bg-doc-ink px-8 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/50">AI-BOS Document Studio</p>
            <h1 className="font-heading text-2xl font-bold text-white">ใบรับประกัน</h1>
          </div>
          <Link
            href="/warranty/new"
            className="flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-doc-ink"
            style={{ background: "var(--doc-gold-gradient)" }}
          >
            <Plus className="h-4 w-4" />
            สร้างใบรับประกันใหม่
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-8 py-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex flex-1 min-w-[240px] items-center gap-2 rounded-md border border-doc-border bg-white px-3 py-2">
            <Search className="h-4 w-4 text-doc-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาเลขที่เอกสาร หรือชื่อลูกค้า"
              className="w-full text-sm outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-md border border-doc-border bg-white px-3 py-2 text-sm"
          >
            <option value="all">ทุกสถานะ</option>
            <option value="draft">ฉบับร่าง</option>
            <option value="approved">อนุมัติแล้ว</option>
            <option value="cancelled">ยกเลิก</option>
          </select>

          <div className="flex overflow-hidden rounded-md border border-doc-border">
            <button
              onClick={() => setArchiveFilter("active")}
              className={`px-3 py-2 text-sm ${archiveFilter === "active" ? "bg-doc-ink text-white" : "bg-white text-doc-text-muted"}`}
            >
              ใช้งานอยู่
            </button>
            <button
              onClick={() => setArchiveFilter("archived")}
              className={`px-3 py-2 text-sm ${archiveFilter === "archived" ? "bg-doc-ink text-white" : "bg-white text-doc-text-muted"}`}
            >
              เก็บถาวร
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-doc-border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-doc-paper-muted text-left text-xs uppercase text-doc-text-muted">
              <tr>
                <th className="px-4 py-3">เลขที่เอกสาร</th>
                <th className="px-4 py-3">ลูกค้า</th>
                <th className="px-4 py-3">วันที่</th>
                <th className="px-4 py-3">สิ้นสุดความคุ้มครอง</th>
                <th className="px-4 py-3">สถานะ</th>
                <th className="px-4 py-3 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w) => (
                <tr key={w.id} className="border-t border-doc-border">
                  <td className="px-4 py-3">
                    <Link href={`/warranty/${w.id}`} className="font-medium text-doc-ink hover:underline">
                      {w.documentNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-doc-ink/80">{w.customer.name || "-"}</td>
                  <td className="px-4 py-3 text-doc-text-muted">{formatThaiBuddhistDate(w.issueDate)}</td>
                  <td className="px-4 py-3 text-doc-text-muted">
                    {formatThaiBuddhistDate(w.warrantyEndDate)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-doc-paper-muted px-2.5 py-1 text-xs text-doc-ink/70">
                      {w.status === "draft" ? "ฉบับร่าง" : w.status === "approved" ? "อนุมัติแล้ว" : "ยกเลิก"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title="ทำสำเนา"
                        onClick={async () => {
                          await warrantyRepository.duplicate(w.id);
                          reload();
                        }}
                        className="rounded p-1.5 text-doc-text-muted hover:bg-doc-paper-muted"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      {w.archivedAt ? (
                        <button
                          title="กู้คืน"
                          onClick={async () => {
                            await warrantyRepository.restore(w.id);
                            reload();
                          }}
                          className="rounded p-1.5 text-doc-text-muted hover:bg-doc-paper-muted"
                        >
                          <ArchiveRestore className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          title="เก็บถาวร"
                          onClick={async () => {
                            await warrantyRepository.archive(w.id);
                            reload();
                          }}
                          className="rounded p-1.5 text-doc-text-muted hover:bg-doc-paper-muted"
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        title="ลบถาวร"
                        onClick={async () => {
                          if (confirm(`ลบเอกสาร ${w.documentNumber} ถาวร?`)) {
                            await warrantyRepository.remove(w.id);
                            reload();
                          }
                        }}
                        className="rounded p-1.5 text-doc-text-muted hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-doc-text-muted">
                    ไม่พบเอกสาร
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
