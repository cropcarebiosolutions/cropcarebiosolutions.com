import { useMemo, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import type { PageId, Product } from '../types';
import { PRODUCTS } from '../data/products';
import { productPath } from '../lib/routes';
import { RouteLink } from '../components/ui/RouteLink';
import { PageIntro } from '../components/layout/PageIntro';
import { PageHandoff } from '../components/layout/PageHandoff';
import { Figure } from '../components/ui/Figure';
import { Reveal } from '../components/ui/Reveal';

interface ProductsPageProps {
  onNavigate: (page: PageId) => void;
  onOpenProduct: (product: Product) => void;
  onRequestQuote: (productName: string) => void;
}

export function ProductsPage({
  onNavigate,
  onOpenProduct,
  onRequestQuote,
}: ProductsPageProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return PRODUCTS.filter((product) => {
      if (!needle) return true;

      return [
        product.name,
        product.pestCommonName,
        product.scientificName ?? '',
        product.code,
        product.description.join(' '),
        ...product.targetCrops,
      ]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [query]);

  return (
    <>
      <PageIntro
        breadcrumb="Pheromone Lures"
        eyebrow="Pheromone Lures"
        title="Targeted Attraction for Smarter Pest Management"
        onNavigate={onNavigate}
        aside={
          <label className="block">
            <span className="sr-only">Search lures by name, pest or crop</span>
            <span className="relative block">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search a pest or crop"
                className="w-full rounded-full border border-line-strong bg-paper py-3.5 pl-11 pr-11 text-[14px] text-ink placeholder:text-ink-3 focus:border-pine focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-ink-3 transition-colors hover:text-pine"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </span>
          </label>
        }
      />

      <section className="bg-paper pb-8 pt-8">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <p className="tnum font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
            {results.length} {results.length === 1 ? 'Pheromone lure' : 'Pheromone lures'}
          </p>
        </div>
      </section>

      <section className="bg-paper pb-16 lg:pb-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          {results.length === 0 ? (
            <div className="border border-dashed border-line-strong bg-paper-2 px-8 py-20 text-center">
              <p className="font-display text-[22px] text-pine">
                No lure matches &ldquo;{query}&rdquo;.
              </p>
              <p className="mt-3 text-[15px] text-ink-2">
                Try a crop name — tomato, mango, cotton, coconut, paddy or cabbage.
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-6 rounded-full border border-line-strong px-5 py-2.5 text-[13px] text-pine transition-colors hover:border-pine"
              >
                Reset
              </button>
            </div>
          ) : (
            <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((product, index) => (
                <Reveal as="li" key={product.id} delay={(index % 3) * 0.06}>
                  <article className="group flex h-full flex-col">
                    <button
                      type="button"
                      onClick={() => onOpenProduct(product)}
                      className="block text-left"
                      aria-label={`Open the protocol for ${product.name}`}
                    >
                      <div className="relative">
                        <Figure
                          src={product.imageUrl}
                          alt={product.imageAlt}
                          ratio="aspect-[4/5]"
                        />
                        <span className="absolute left-0 top-0 bg-paper px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] text-clay">
                          {product.code}
                        </span>
                      </div>
                    </button>

                    <div className="mt-5 flex flex-1 flex-col border-t border-line pt-4">
                      <p className="eyebrow">{product.pestCommonName}</p>

                      <h2 className="mt-3 font-display text-[22px] leading-tight text-pine">
                        <RouteLink
                          to={{ path: productPath(product) }}
                          onNavigate={() => onOpenProduct(product)}
                          className="link-rule text-left"
                        >
                          {product.name}
                        </RouteLink>
                      </h2>

                      {product.scientificName && (
                        <p className="mt-1 font-display text-[14px] italic text-ink-3">
                          {product.scientificName}
                        </p>
                      )}

                      {/* Heading only, as on the Insect Traps cards; the description,
                          field life, traps and crops open with "View protocol". */}
                      {product.heading && (
                        <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
                          {product.heading}
                        </p>
                      )}

                      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-6">
                        <button
                          type="button"
                          onClick={() => onOpenProduct(product)}
                          className="inline-flex items-center gap-2 rounded-full bg-pine px-5 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-pine-soft"
                        >
                          View protocol
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRequestQuote(product.name)}
                          className="link-rule text-[13px] text-clay"
                        >
                          Request a quote
                        </button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </section>

      <PageHandoff
        nextPage="traps"
        label="Next"
        title="Insect Traps"
        onNavigate={onNavigate}
      />
    </>
  );
}
