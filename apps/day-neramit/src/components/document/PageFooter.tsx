interface PageFooterProps {
  pageNumber: number;
  pageCount: number;
  documentNumber: string;
}

export function PageFooter({ pageNumber, pageCount, documentNumber }: PageFooterProps) {
  return (
    <div className="flex items-center justify-between px-10 py-2 text-[10px] text-doc-text-muted">
      <span>{documentNumber}</span>
      <span>
        หน้า {pageNumber} จาก {pageCount}
      </span>
    </div>
  );
}
