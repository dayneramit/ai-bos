import { v4 as uuidv4 } from "uuid";
import type { Receipt } from "@/types/receipt";
import { formatDocumentNumber, dateKeyOf } from "@/lib/numbering/generate-document-number";

export interface ReceiptRepository {
  list(options?: { includeArchived?: boolean }): Promise<Receipt[]>;
  get(id: string): Promise<Receipt | null>;
  save(receipt: Receipt): Promise<Receipt>;
  remove(id: string): Promise<void>;
  archive(id: string): Promise<Receipt | null>;
  restore(id: string): Promise<Receipt | null>;
  duplicate(id: string): Promise<Receipt | null>;
  nextDocumentNumber(issueDate: Date): Promise<string>;
}

const STORAGE_KEY = "ai-bos:receipts";

function readAll(): Receipt[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Receipt[];
  } catch {
    return [];
  }
}

function writeAll(receipts: Receipt[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
}

class LocalStorageReceiptRepository implements ReceiptRepository {
  async list(options?: { includeArchived?: boolean }): Promise<Receipt[]> {
    const all = readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    if (options?.includeArchived) return all;
    return all.filter((r) => !r.archivedAt);
  }

  async get(id: string): Promise<Receipt | null> {
    return readAll().find((r) => r.id === id) ?? null;
  }

  async save(receipt: Receipt): Promise<Receipt> {
    const all = readAll();
    const index = all.findIndex((r) => r.id === receipt.id);
    const updated: Receipt = { ...receipt, updatedAt: new Date().toISOString() };

    if (index >= 0) {
      all[index] = updated;
    } else {
      all.push(updated);
    }

    writeAll(all);
    return updated;
  }

  async remove(id: string): Promise<void> {
    writeAll(readAll().filter((r) => r.id !== id));
  }

  async archive(id: string): Promise<Receipt | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    return this.save({ ...existing, archivedAt: new Date().toISOString() });
  }

  async restore(id: string): Promise<Receipt | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    return this.save({ ...existing, archivedAt: null });
  }

  async duplicate(id: string): Promise<Receipt | null> {
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
    const sameDay = readAll().filter((r) => r.documentNumber.includes(`-${key}-`));
    const sequence = sameDay.length + 1;
    return formatDocumentNumber("receipt", issueDate, sequence);
  }
}

export const receiptRepository: ReceiptRepository = new LocalStorageReceiptRepository();

export function createBlankReceiptId(): string {
  return uuidv4();
}
