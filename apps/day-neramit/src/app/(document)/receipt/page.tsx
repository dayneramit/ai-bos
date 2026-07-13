"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Archive, ArchiveRestore, Copy, Plus, Search, Trash2 } from "lucide-react";
import { receiptRepository } from "@/services/receipt.service";
import type { Receipt } from "@/types/receipt";
import { RECEIPT_KIND_LABEL } from "@/types/receipt";
import type { DocumentStatus } from "@/types/document";
import { formatThaiBuddhistDate } from "@/lib/thai-calendar/thai-calendar";
import { formatThb } from "@/lib/utils";
import { calculateQuotationTotals } from "@/lib/calculations/quotation-calculations";

type StatusFilter = "all" | DocumentStatus;
type ArchiveFilter = "active" | "archived";

export default function ReceiptListPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [archiveFilter, setArchiveFilter] = useState<ArchiveFilter>("active");

  async function reload() {
    const all = await receiptRepository.list({ includeArchived: true });
    setReceipts(all);
  }

  useEffect(() => {
    reload();
  }, []);

  const filtered = useMemo(() => {
    return receipts
      .filter((r) => (archiveFilter === "archived" ? Boolean(r.archivedAt) : !r.archivedAt))
      .filter((r) => statusFilter === "all" || r.status === statusFilter)
      .filter((r) => {
        if (!query.trim()) return true;
        const haystack = `${r.documentNumber} ${r.customer.name}`.toLowerCase();
        return haystack.includes(query.trim().toLowerCase());
      });
  }, [receipts, query, statusFilter, archiveFilter]);

  return (
    <div className="min-h-screen bg-doc-paper-muted">
      <div className="border-b border-doc-border bg-doc-ink px-8 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/50">AI-BOS Document Studio</p>
            <h1 className="font-heading text-2xl font-bold text-white">ใบเสร็จ / ใบรับเงิน</h1>
          </div>
          <Link
            href="/receipt/new"
            className="flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-doc-ink"
            style={{ background: "var(--doc-gold-gradient)" }}
          >
            <Plus className="h-4 w-4" />
            สร้างใบเสร็จ/ใบรับเงินใหม่
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
                <th className="px-4 py-3">ประเภท</th>
                <th className="px-4 py-3">ลูกค้า</th>
                <th className="px-4 py-3">วันที่</th>
                <th className="px-4 py-3">สถานะ</th>
                <th className="px-4 py-3 text-right">ยอดรวม</th>
                <th className="px-4 py-3 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const totals = calculateQuotationTotals(r.items, {
                  vatEnabled: r.vatEnabled,
                  vatRate: r.vatRate,
                  withholdingTaxEnabled: r.withholdingTaxEnabled,
                  withholdingTaxRate: r.withholdingTaxRate,
                });
                return (
                  <tr key={r.id} className="border-t border-doc-border">
                    <td className="px-4 py-3">
                      <Link href={`/receipt/${r.id}`} className="font-medium text-doc-ink hover:underline">
                        {r.documentNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-doc-ink/80">{RECEIPT_KIND_LABEL[r.receiptKind]}</td>
                    <td className="px-4 py-3 text-doc-ink/80">{r.customer.name || "-"}</td>
                    <td className="px-4 py-3 text-doc-text-muted">{formatThaiBuddhistDate(r.issueDate)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-doc-paper-muted px-2.5 py-1 text-xs text-doc-ink/70">
                        {r.status === "draft" ? "ฉบับร่าง" : r.status === "approved" ? "อนุมัติแล้ว" : "ยกเลิก"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-doc-ink">
                      {formatThb(totals.grandTotal)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="ทำสำเนา"
                          onClick={async () => {
                            await receiptRepository.duplicate(r.id);
                            reload();
                          }}
                          className="rounded p-1.5 text-doc-text-muted hover:bg-doc-paper-muted"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        {r.archivedAt ? (
                          <button
                            title="กู้คืน"
                            onClick={async () => {
                              await receiptRepository.restore(r.id);
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
                              await receiptRepository.archive(r.id);
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
                            if (confirm(`ลบเอกสาร ${r.documentNumber} ถาวร?`)) {
                              await receiptRepository.remove(r.id);
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
                );
              })}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-doc-text-muted">
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
