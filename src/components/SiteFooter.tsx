import { Link } from "react-router-dom";

const footerLinks = {
  shop: ["New In", "Dresses", "Bags", "Shoes"],
  support: ["Shipping", "Returns", "FAQ", "Contact"],
};

export default function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.3fr,0.8fr,0.8fr,1fr] sm:px-6 lg:px-8">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-stone-500">
            K Shop
          </p>
          <h2 className="max-w-sm text-2xl font-semibold text-stone-900">
            Modern fashion essentials curated for everyday statement dressing.
          </h2>
          <p className="max-w-md text-sm leading-7 text-stone-600">
            Inspired by editorial storefronts and elevated styling, this demo
            keeps the full shopping flow while shifting the brand into a premium
            fashion boutique.
          </p>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
            Shop
          </p>
          <ul className="space-y-3 text-sm text-stone-600">
            {footerLinks.shop.map((item) => (
              <li key={item}>
                <Link to="/" className="transition hover:text-stone-950">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
            Support
          </p>
          <ul className="space-y-3 text-sm text-stone-600">
            {footerLinks.support.map((item) => (
              <li key={item}>
                <Link to="/" className="transition hover:text-stone-950">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
            Visit
          </p>
          <div className="space-y-2 text-sm leading-7 text-stone-600">
            <p>28 Bartholomeo Street, Bangkok Atelier</p>
            <p>Mon — Sat / 10:00 — 20:00</p>
            <p>hello@kshop.com</p>
            <p>+66 98 765 4321</p>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs uppercase tracking-[0.25em] text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 K Shop</p>
          <p>Crafted with fashion-forward motion & shopping flow</p>
        </div>
      </div>
    </footer>
  );
}
