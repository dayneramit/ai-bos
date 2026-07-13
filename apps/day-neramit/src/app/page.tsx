import Link from "next/link";
import { FileCheck2, FileText, ShieldCheck } from "lucide-react";

const MODULES = [
  {
    href: "/quotation",
    icon: FileText,
    title: "ใบเสนอราคา",
    subtitle: "Quotation",
    description: "จัดทำใบเสนอราคางานติดตั้ง ซ่อมบำรุง และบริการทุกประเภท",
  },
  {
    href: "/receipt",
    icon: FileCheck2,
    title: "ใบเสร็จ / ใบรับเงิน",
    subtitle: "Receipt / Payment Voucher",
    description: "ออกใบเสร็จรับเงินหรือใบรับเงินมัดจำ พร้อม PromptPay QR",
  },
  {
    href: "/warranty",
    icon: ShieldCheck,
    title: "ใบรับประกัน",
    subtitle: "Warranty Certificate",
    description: "ออกใบรับประกันสินค้าและงานบริการ พร้อมเงื่อนไขความคุ้มครอง",
  },
];

export default function RootPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050505]">
      <div className="relative overflow-hidden border-b border-white/10 px-6 py-14 sm:py-20">
        <div
          className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 opacity-20"
          style={{ background: "var(--doc-gold-gradient)", clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
          aria-hidden
        />
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/day-neramit-logo.svg"
            alt="Day Neramit"
            width={96}
            height={96}
            className="mb-6"
          />
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/50">
            AI-BOS Document Studio
          </p>
          <h1
            className="font-heading text-3xl font-bold sm:text-4xl"
            style={{
              background: "var(--doc-gold-gradient)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Day Neramit
          </h1>
          <p className="mt-3 max-w-lg text-sm text-white/60">
            ระบบออกเอกสารธุรกิจครบวงจร ธีม Luxury Gold-Black ใช้งานได้ทั้งบนมือถือและคอมพิวเตอร์
            พร้อมโหมดออฟไลน์ (PWA)
          </p>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-5xl flex-1 gap-5 px-6 py-12 sm:grid-cols-3">
        {MODULES.map(({ href, icon: Icon, title, subtitle, description }) => (
          <Link
            key={href}
            href={href}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[var(--doc-gold-400)]/60 hover:bg-white/[0.06]"
          >
            <span
              className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-doc-ink"
              style={{ background: "var(--doc-gold-gradient)" }}
            >
              <Icon className="h-5 w-5" />
            </span>
            <h2 className="font-heading text-lg font-semibold text-white">{title}</h2>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-white/40">{subtitle}</p>
            <p className="text-sm leading-relaxed text-white/55">{description}</p>
            <span
              className="mt-4 inline-block text-xs font-medium"
              style={{ color: "var(--doc-gold-400)" }}
            >
              เปิดใช้งาน →
            </span>
          </Link>
        ))}
      </div>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-[11px] text-white/30">
        Day Neramit • ช่างเดย์ เนรมิต — สร้างด้วย AI-BOS Document Engine
      </footer>
    </div>
  );
}
