import { v4 as uuidv4 } from "uuid";
import type { Quotation } from "@/types/quotation";
import { formatDocumentNumber, dateKeyOf } from "@/lib/numbering/generate-document-number";

/**
 * Storage-agnostic repository contract. Today this is backed by
 * localStorage so the Quotation Engine is fully functional offline.
 * Swapping in Firestore later means writing ONE new class that
 * implements this interface — no call site changes.
 */
export interface QuotationRepository {
  list(options?: { includeArchived?: boolean }): Promise<Quotation[]>;
  get(id: string): Promise<Quotation | null>;
  save(quotation: Quotation): Promise<Quotation>;
  remove(id: string): Promise<void>;
  archive(id: string): Promise<Quotation | null>;
  restore(id: string): Promise<Quotation | null>;
  duplicate(id: string): Promise<Quotation | null>;
  nextDocumentNumber(issueDate: Date): Promise<string>;
}

const STORAGE_KEY = "ai-bos:quotations";

function readAll(): Quotation[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Quotation[];
  } catch {
    return [];
  }
}

function writeAll(quotations: Quotation[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quotations));
}

class LocalStorageQuotationRepository implements QuotationRepository {
  async list(options?: { includeArchived?: boolean }): Promise<Quotation[]> {
    const all = readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    if (options?.includeArchived) return all;
    return all.filter((q) => !q.archivedAt);
  }

  async get(id: string): Promise<Quotation | null> {
    return readAll().find((q) => q.id === id) ?? null;
  }

  async save(quotation: Quotation): Promise<Quotation> {
    const all = readAll();
    const index = all.findIndex((q) => q.id === quotation.id);
    const updated: Quotation = { ...quotation, updatedAt: new Date().toISOString() };

    if (index >= 0) {
      all[index] = updated;
    } else {
      all.push(updated);
    }

    writeAll(all);
    return updated;
  }

  async remove(id: string): Promise<void> {
    writeAll(readAll().filter((q) => q.id !== id));
  }

  async archive(id: string): Promise<Quotation | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    return this.save({ ...existing, archivedAt: new Date().toISOString() });
  }

  async restore(id: string): Promise<Quotation | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    return this.save({ ...existing, archivedAt: null });
  }

  async duplicate(id: string): Promise<Quotation | null> {
    const existing = await this.get(id);
    if (!existing) return null;

    const now = new Date();
    const documentNumber = await this.nextDocumentNumber(now);

    return this.save({
      ...existing,
      id: uuidv4(),
      documentNumber,
      status: "draft",
      archivedAt: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  }

  async nextDocumentNumber(issueDate: Date): Promise<string> {
    const key = dateKeyOf(issueDate);
    const sameDay = readAll().filter((q) => q.documentNumber.includes(`-${key}-`));
    const sequence = sameDay.length + 1;
    return formatDocumentNumber("quotation", issueDate, sequence);
  }
}

export const quotationRepository: QuotationRepository = new LocalStorageQuotationRepository();

export function createBlankQuotationId(): string {
  return uuidv4();
}
