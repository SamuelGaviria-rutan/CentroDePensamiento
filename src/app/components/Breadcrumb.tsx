import { Home, ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="bg-[#FAFAF8] border-b border-[#253D36]/10 py-3 relative z-10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12">
        <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-[#253D36]/60" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
          <a href="#" className="flex items-center gap-1.5 hover:text-[#0068FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm px-1">
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Inicio</span>
          </a>
          
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5 sm:gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-[#253D36]/30" aria-hidden="true" />
              {item.href ? (
                <a href={item.href} className="hover:text-[#0068FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm px-1">
                  {item.label}
                </a>
              ) : (
                <span className="text-[#253D36] px-1 font-bold" aria-current="page">
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
