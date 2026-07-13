import { v4 as uuidv4 } from "uuid";
import type { DocumentAsset } from "@/types/document";

/**
 * Asset storage contract. Today, files are held as in-memory object URLs
 * (works fully offline for preview/export within the session). Swapping
 * in Firebase Storage later means implementing this interface against
 * the Storage SDK — no call-site changes elsewhere in the app.
 */
export interface AssetStorage {
  upload(file: File): Promise<DocumentAsset>;
  revoke(asset: DocumentAsset): void;
}

class ObjectUrlAssetStorage implements AssetStorage {
  async upload(file: File): Promise<DocumentAsset> {
    const url = URL.createObjectURL(file);
    return {
      id: uuidv4(),
      url,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      uploadedAt: new Date().toISOString(),
    };
  }

  revoke(asset: DocumentAsset): void {
    URL.revokeObjectURL(asset.url);
  }
}

export const assetStorage: AssetStorage = new ObjectUrlAssetStorage();
