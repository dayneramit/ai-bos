import { v4 as uuidv4 } from "uuid";
import type { WarrantyCertificate } from "@/types/warranty";
import { formatDocumentNumber, dateKeyOf } from "@/lib/numbering/generate-document-number";

export interface WarrantyRepository {
  list(options?: { includeArchived?: boolean }): Promise<WarrantyCertificate[]>;
  get(id: string): Promise<WarrantyCertificate | null>;
  save(warranty: WarrantyCertificate): Promise<WarrantyCertificate>;
  remove(id: string): Promise<void>;
  archive(id: string): Promise<WarrantyCertificate | null>;
  restore(id: string): Promise<WarrantyCertificate | null>;
  duplicate(id: string): Promise<WarrantyCertificate | null>;
  nextDocumentNumber(issueDate: Date): Promise<string>;
}

const STORAGE_KEY = "ai-bos:warranties";

function readAll(): WarrantyCertificate[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as WarrantyCertificate[];
  } catch {
    return [];
  }
}

function writeAll(warranties: WarrantyCertificate[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(warranties));
}

class LocalStorageWarrantyRepository implements WarrantyRepository {
  async list(options?: { includeArchived?: boolean }): Promise<WarrantyCertificate[]> {
    const all = readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    if (options?.includeArchived) return all;
    return all.filter((w) => !w.archivedAt);
  }

  async get(id: string): Promise<WarrantyCertificate | null> {
    return readAll().find((w) => w.id === id) ?? null;
  }

  async save(warranty: WarrantyCertificate): Promise<WarrantyCertificate> {
    const all = readAll();
    const index = all.findIndex((w) => w.id === warranty.id);
    const updated: WarrantyCertificate = { ...warranty, updatedAt: new Date().toISOString() };

    if (index >= 0) {
      all[index] = updated;
    } else {
      all.push(updated);
    }

    writeAll(all);
    return updated;
  }

  async remove(id: string): Promise<void> {
    writeAll(readAll().filter((w) => w.id !== id));
  }

  async archive(id: string): Promise<WarrantyCertificate | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    return this.save({ ...existing, archivedAt: new Date().toISOString() });
  }

  async restore(id: string): Promise<WarrantyCertificate | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    return this.save({ ...existing, archivedAt: null });
  }

  async duplicate(id: string): Promise<WarrantyCertificate | null> {
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
    const sameDay = readAll().filter((w) => w.documentNumber.includes(`-${key}-`));
    const sequence = sameDay.length + 1;
    return formatDocumentNumber("warranty_certificate", issueDate, sequence);
  }
}

export const warrantyRepository: WarrantyRepository = new LocalStorageWarrantyRepository();

export function createBlankWarrantyId(): string {
  return uuidv4();
}
