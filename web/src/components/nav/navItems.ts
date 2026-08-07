export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

// Le 4 sezioni principali dell'app, corrispondenti alle aree reali del
// prodotto (product.md/boundaries.md): dashboard, modelli di allenamento,
// storico, metriche personali. Le impostazioni account sono raggiungibili
// dall'icona nell'header, non fanno parte di questa navigazione principale.
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/templates", label: "Modelli", icon: "fitness_center" },
  { href: "/history", label: "Storico", icon: "history" },
  { href: "/metrics", label: "Metriche", icon: "monitoring" },
];
