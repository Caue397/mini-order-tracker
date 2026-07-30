import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const columns = [
  {
    title: "Mini Order Tracker",
    links: [
      { label: "Início", href: "/" },
      { label: "Pedidos", href: "/orders" },
    ],
  },
  {
    title: "Conta",
    links: [
      { label: "Entrar", href: "/login" },
      { label: "Criar conta", href: "/register" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-12">
        <Link href="/">
          <Logo />
        </Link>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-foreground">{column.title}</h3>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-6 text-xs text-muted">
          © {new Date().getFullYear()} Mini Order Tracker
        </div>
      </div>
    </footer>
  );
}
