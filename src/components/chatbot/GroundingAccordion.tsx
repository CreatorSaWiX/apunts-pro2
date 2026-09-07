import React from 'react';
import type { TFunction } from 'i18next';
import { Globe, ChevronDown, ExternalLink } from 'lucide-react';

interface GroundingAccordionProps {
  chunks: any[];
  t: TFunction;
}

export const GroundingAccordion: React.FC<GroundingAccordionProps> = React.memo(({ chunks, t }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [displayChunks, setDisplayChunks] = React.useState<any[]>(chunks || []);

  React.useEffect(() => {
    setDisplayChunks(chunks || []);

    const needsResolution = (chunks || []).some((c: any) => {
      const uri = c?.web?.uri;
      return typeof uri === 'string' && (uri.includes('vertexaisearch') || uri.includes('grounding-api-redirect'));
    });

    if (needsResolution) {
      fetch('/api/resolve-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chunks }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && Array.isArray(data.chunks)) {
            setDisplayChunks(data.chunks);
          }
        })
        .catch(() => {});
    }
  }, [chunks]);

  const validChunks = React.useMemo(() => {
    return (displayChunks || []).filter((c: any) => c.web?.uri);
  }, [displayChunks]);

  if (validChunks.length === 0) return null;

  /** Extreu el domini net (ex: "fcbarcelona.cat") tolerant redireccions de Google. */
  const extractDomain = (chunk: any): string => {
    let hostname = '';
    try {
      hostname = new URL(chunk.web?.uri || '').hostname.replace(/^www\./, '');
    } catch {}

    const isGoogleRedirect = hostname.includes('vertexaisearch') || hostname.includes('google');
    const rawTitle = (chunk.web?.title || '').trim();

    if (!isGoogleRedirect && hostname) {
      return hostname;
    }
    const match = rawTitle.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
    if (match) return match[1].toLowerCase();
    if (!rawTitle.includes(' ') && rawTitle.includes('.')) return rawTitle.toLowerCase();
    return rawTitle.toLowerCase();
  };

  /** Extreu el nom real de la pàgina i el domini per a la visualització. */
  const parseSourceInfo = (chunk: any) => {
    let hostname = '';
    let pathname = '';
    try {
      const url = new URL(chunk.web?.uri || '');
      hostname = url.hostname.replace(/^www\./, '');
      pathname = decodeURIComponent(url.pathname).replace(/\/$/, '');
    } catch {}

    const isGoogleRedirect = hostname.includes('vertexaisearch') || hostname.includes('google');
    const rawTitle = (chunk.web?.title || '').trim();

    let domain = '';
    if (!isGoogleRedirect && hostname) {
      domain = hostname;
    } else {
      const match = rawTitle.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
      if (match) domain = match[1].toLowerCase();
      else if (!rawTitle.includes(' ') && rawTitle.includes('.')) domain = rawTitle.toLowerCase();
      else domain = rawTitle.toLowerCase();
    }

    let pageTitle = rawTitle;
    const isDomainTitle =
      !rawTitle ||
      rawTitle.toLowerCase() === domain.toLowerCase() ||
      rawTitle.toLowerCase() === `www.${domain}`.toLowerCase();

    // IMPORTANT: Només extraiem la ruta si NO és un redirect de Google
    // (/grounding-api-redirect/... és un token intern de Google, no una secció web!)
    if (!isGoogleRedirect && isDomainTitle && pathname && pathname !== '/') {
      const segments = pathname
        .split('/')
        .filter(Boolean)
        .filter((s) => !['ca', 'es', 'en', 'cat', 'fr', 'de', 'index', 'default', 'home'].includes(s.toLowerCase()))
        .filter((s) => !/^\d+$/.test(s) && !/^[0-9a-f]{16,}$/i.test(s));

      if (segments.length > 0) {
        pageTitle = segments
          .slice(-2)
          .map((s) => s.replace(/[-_]+/g, ' ').replace(/\.[a-zA-Z0-9]+$/, '').trim())
          .filter(Boolean)
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' › ');
      }
    }

    if (!pageTitle || pageTitle.toLowerCase() === domain.toLowerCase()) {
      pageTitle = domain || 'Pàgina web';
    }

    return {
      domain,
      pageTitle,
      uri: chunk.web?.uri || '#',
    };
  };

  // Favicons únics per a la barra superior resumida
  const uniqueFavicons = React.useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const c of validChunks) {
      const d = extractDomain(c);
      if (d && !seen.has(d)) {
        seen.add(d);
        list.push(d);
      }
    }
    return list;
  }, [validChunks]);

  return (
    <div className="mb-6 w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-3 text-slate-300 hover:bg-white/[0.04] transition-colors focus:outline-none select-none"
      >
        <Globe size={16} className="text-slate-400 shrink-0" />
        <span className="text-sm font-medium text-slate-200">
          {t('chat.searchedWeb', 'Ha cercat a internet')}
        </span>

        <div className="flex items-center gap-1.5 ml-auto">
          {uniqueFavicons.slice(0, 3).map((domain, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full overflow-hidden shrink-0 bg-white/10 flex items-center justify-center shadow-sm"
            >
              <img
                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <span className="text-[11px] font-medium bg-white/10 text-slate-300 px-2 py-0.5 rounded-full shadow-sm">
            {validChunks.length === 1 ? '1 font' : `${validChunks.length} fonts`}
          </span>
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform duration-200 ml-1 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="flex flex-col border-t border-white/5 overflow-y-auto custom-scrollbar max-h-[260px] divide-y divide-white/5">
          {validChunks.map((chunk: any, i: number) => {
            const { domain, pageTitle, uri } = parseSourceInfo(chunk);
            const showDomainSubtitle = domain && pageTitle.toLowerCase() !== domain.toLowerCase();

            return (
              <a
                key={i}
                href={uri}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.07] transition-colors group"
                title={`${pageTitle}${domain ? ` (${domain})` : ''}`}
              >
                <div className="w-5 h-5 rounded overflow-hidden shrink-0 bg-white/10 flex items-center justify-center">
                  {domain ? (
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Globe size={12} className="text-slate-400" />
                  )}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[13px] text-slate-200 font-medium truncate group-hover:text-sky-300 transition-colors">
                    {pageTitle}
                  </span>
                  {showDomainSubtitle && (
                    <span className="text-[11px] text-slate-400 truncate">{domain}</span>
                  )}
                </div>
                <ExternalLink
                  size={13}
                  className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1"
                />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
});

GroundingAccordion.displayName = 'GroundingAccordion';
