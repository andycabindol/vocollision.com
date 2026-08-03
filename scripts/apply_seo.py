#!/usr/bin/env python3
"""Apply SEO meta, canonicals, and JSON-LD across Vocollision pages."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://vocollision.com"

ORG_SAME_AS = [
    "https://www.instagram.com/nyu.vocollision/",
    "https://open.spotify.com/artist/",  # filled loosely; keep real ones only if known
]

SAME_AS = [
    "https://www.instagram.com/nyu.vocollision/",
    "https://www.instagram.com/nyuvocollision/",
]

PAGE_SEO = {
    "index.html": {
        "title": "Vocollision | Competitive NYU A Cappella Group in NYC",
        "description": "Vocollision is a premier competitive a cappella group at NYU in New York City. ICCA-recognized, available for booking, collaborations, and auditions.",
        "canonical": f"{BASE}/",
        "og_type": "website",
    },
    "about/index.html": {
        "title": "About Vocollision | NYU Competitive A Cappella Since 2008",
        "description": "Learn about Vocollision — NYU’s inventive, diverse competitive a cappella group. Diversity, creativity, family, and humility since 2008.",
        "canonical": f"{BASE}/about/",
        "og_type": "website",
    },
    "contact/index.html": {
        "title": "Book Vocollision | Hire an NYU / NYC A Cappella Group",
        "description": "Book Vocollision for events, shows, and collaborations in NYC. Contact NYU’s competitive a cappella group for hire and booking inquiries.",
        "canonical": f"{BASE}/contact/",
        "og_type": "website",
    },
    "audition/index.html": {
        "title": "Audition for Vocollision | NYU A Cappella Tryouts",
        "description": "Audition for Vocollision at NYU. All voice parts, beatboxers, and majors welcome. Join one of NYU’s top competitive a cappella groups.",
        "canonical": f"{BASE}/audition/",
        "og_type": "website",
    },
    "nyu-acapella/index.html": {
        "title": "NYU A Cappella Groups | Why Vocollision Stands Out",
        "description": "Looking for NYU a cappella groups? Meet Vocollision — a competitive, ICCA-recognized a cappella group at New York University known for inventive sets.",
        "canonical": f"{BASE}/nyu-acapella/",
        "og_type": "article",
    },
    "book-us/index.html": {
        "title": "Book an NYC A Cappella Group | Vocollision for Hire",
        "description": "Book Vocollision for your NYC event. Competitive NYU a cappella available for corporate events, campus shows, weddings, and private bookings.",
        "canonical": f"{BASE}/book-us/",
        "og_type": "website",
    },
    "404.html": {
        "title": "Page Not Found | Vocollision NYU A Cappella",
        "description": "This page doesn’t exist. Get back to Vocollision — NYU’s competitive a cappella group in New York City.",
        "canonical": f"{BASE}/404.html",
        "og_type": "website",
        "noindex": True,
    },
}


def music_group_jsonld() -> dict:
    return {
        "@context": "https://schema.org",
        "@type": ["MusicGroup", "PerformingGroup", "Organization"],
        "@id": f"{BASE}/#organization",
        "name": "Vocollision",
        "alternateName": [
            "NYU Vocollision",
            "Vocollision NYU",
            "NYU Vocollision A Cappella",
        ],
        "url": f"{BASE}/",
        "logo": f"{BASE}/assets/images/38HdREl23Aw8tVYkkYGrmM.svg",
        "image": f"{BASE}/assets/images/z30teL0Z4uAwjrPyTYiwMwH2w.jpg",
        "description": (
            "Vocollision is a premier competitive a cappella group at New York University (NYU) "
            "in New York City. Founded in 2008, the group is known for inventive, diverse sets "
            "and recognition from the International Championships of Collegiate A Cappella (ICCA)."
        ),
        "foundingDate": "2008",
        "genre": ["A Cappella", "Collegiate A Cappella", "Pop", "R&B"],
        "email": "nyu.vocollision@gmail.com",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "New York",
            "addressRegion": "NY",
            "addressCountry": "US",
        },
        "areaServed": ["New York City", "NYU", "New York"],
        "memberOf": {
            "@type": "CollegeOrUniversity",
            "name": "New York University",
            "url": "https://www.nyu.edu/",
        },
        "sameAs": SAME_AS,
        "contactPoint": [
            {
                "@type": "ContactPoint",
                "contactType": "booking",
                "email": "nyu.vocollision@gmail.com",
                "url": f"{BASE}/book-us/",
                "availableLanguage": ["English"],
            },
            {
                "@type": "ContactPoint",
                "contactType": "auditions",
                "email": "nyu.vocollision@gmail.com",
                "url": f"{BASE}/audition/",
                "availableLanguage": ["English"],
            },
        ],
        "knowsAbout": [
            "NYU a cappella",
            "competitive collegiate a cappella",
            "ICCA",
            "NYC a cappella booking",
            "a cappella performances",
        ],
    }


def webpage_jsonld(seo: dict, page_name: str) -> dict:
    return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": seo["canonical"] + "#webpage",
        "url": seo["canonical"],
        "name": seo["title"],
        "description": seo["description"],
        "isPartOf": {"@id": f"{BASE}/#website"},
        "about": {"@id": f"{BASE}/#organization"},
        "inLanguage": "en-US",
    }


def website_jsonld() -> dict:
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": f"{BASE}/#website",
        "url": f"{BASE}/",
        "name": "Vocollision",
        "description": "Official website of Vocollision, a competitive NYU a cappella group in NYC.",
        "publisher": {"@id": f"{BASE}/#organization"},
        "inLanguage": "en-US",
    }


def faq_jsonld(faqs: list[tuple[str, str]]) -> dict:
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": a},
            }
            for q, a in faqs
        ],
    }


NYU_FAQS = [
    (
        "What are the best NYU a cappella groups?",
        "NYU has several a cappella groups. Vocollision is a premier competitive group known for inventive, "
        "diverse sets and ICCA recognition, blending classic pop with lesser-known artists.",
    ),
    (
        "Is Vocollision a competitive NYU a cappella group?",
        "Yes. Vocollision is a competitive collegiate a cappella group at New York University and has been "
        "recognized by the International Championships of Collegiate A Cappella (ICCA).",
    ),
    (
        "How do I join an NYU a cappella group?",
        "Vocollision holds auditions for all voice parts and beatboxers. Visit the audition page on vocollision.com "
        "to apply or learn about upcoming audition seasons.",
    ),
    (
        "Where is Vocollision based?",
        "Vocollision is based at New York University in New York City and performs across NYC and collegiate a cappella circuits.",
    ),
]

BOOK_FAQS = [
    (
        "Can I book an NYU a cappella group for an event in NYC?",
        "Yes. Vocollision is available for booking for campus events, corporate shows, private events, and collaborations in New York City.",
    ),
    (
        "How do I book Vocollision?",
        "Use the booking form on vocollision.com/book-us/ or vocollision.com/contact/, or email nyu.vocollision@gmail.com with your event date, location, and details.",
    ),
    (
        "What types of events does Vocollision perform at?",
        "Vocollision performs at collegiate competitions, concerts, campus events, and private or brand bookings when schedules allow.",
    ),
    (
        "Is Vocollision available for hire outside NYU?",
        "Yes. While Vocollision is an NYU group, booking inquiries from NYC organizations and events are welcome subject to availability.",
    ),
]


def replace_meta(html: str, name: str, content: str) -> str:
    pattern = rf'(<meta\s+name="{re.escape(name)}"\s+content=")[^"]*(">)'
    if re.search(pattern, html, flags=re.I):
        return re.sub(pattern, rf"\g<1>{content}\g<2>", html, count=1, flags=re.I)
    return html.replace(
        "</head>",
        f'    <meta name="{name}" content="{content}">\n</head>',
        1,
    )


def replace_property(html: str, prop: str, content: str) -> str:
    pattern = rf'(<meta\s+property="{re.escape(prop)}"\s+content=")[^"]*(">)'
    if re.search(pattern, html, flags=re.I):
        return re.sub(pattern, rf"\g<1>{content}\g<2>", html, count=1, flags=re.I)
    return html.replace(
        "</head>",
        f'    <meta property="{prop}" content="{content}">\n</head>',
        1,
    )


def replace_link(html: str, rel: str, href: str) -> str:
    pattern = rf'(<link\s+rel="{re.escape(rel)}"\s+href=")[^"]*(">)'
    if re.search(pattern, html, flags=re.I):
        return re.sub(pattern, rf"\g<1>{href}\g<2>", html, count=1, flags=re.I)
    # framer sometimes uses href before rel
    pattern2 = rf'(<link\s+href=")[^"]*("\s+rel="{re.escape(rel)}")'
    if re.search(pattern2, html, flags=re.I):
        return re.sub(pattern2, rf"\g<1>{href}\g<2>", html, count=1, flags=re.I)
    return html.replace(
        "</head>",
        f'    <link rel="{rel}" href="{href}">\n</head>',
        1,
    )


def replace_title(html: str, title: str) -> str:
    if re.search(r"<title>.*?</title>", html, flags=re.I | re.S):
        return re.sub(r"<title>.*?</title>", f"<title>{title}</title>", html, count=1, flags=re.I | re.S)
    return html.replace("</head>", f"    <title>{title}</title>\n</head>", 1)


def strip_existing_jsonld(html: str) -> str:
    return re.sub(
        r'<script type="application/ld\+json">[\s\S]*?</script>\s*',
        "",
        html,
        flags=re.I,
    )


def inject_jsonld(html: str, blocks: list[dict]) -> str:
    html = strip_existing_jsonld(html)
    scripts = []
    for block in blocks:
        scripts.append(
            '<script type="application/ld+json">\n'
            + json.dumps(block, ensure_ascii=False, indent=2)
            + "\n</script>"
        )
    return html.replace("</head>", "\n".join(scripts) + "\n</head>", 1)


def apply_seo(path: Path, seo: dict, extra_jsonld: list[dict] | None = None) -> None:
    html = path.read_text(errors="ignore")
    html = replace_title(html, seo["title"])
    html = replace_meta(html, "description", seo["description"])
    if seo.get("noindex"):
        html = replace_meta(html, "robots", "noindex, follow")
    else:
        # preserve max-image-preview if present, else set index
        if 'name="robots"' not in html:
            html = replace_meta(html, "robots", "index, follow, max-image-preview:large")
        else:
            html = replace_meta(html, "robots", "index, follow, max-image-preview:large")

    html = replace_link(html, "canonical", seo["canonical"])
    html = replace_property(html, "og:type", seo.get("og_type", "website"))
    html = replace_property(html, "og:title", seo["title"])
    html = replace_property(html, "og:description", seo["description"])
    html = replace_property(html, "og:url", seo["canonical"])
    html = replace_property(html, "og:site_name", "Vocollision")
    html = replace_property(html, "og:locale", "en_US")

    # Twitter
    if 'name="twitter:card"' in html or 'name="twitter:title"' in html:
        html = replace_meta(html, "twitter:title", seo["title"])
        html = replace_meta(html, "twitter:description", seo["description"])
    else:
        html = html.replace(
            "</head>",
            "    <meta name=\"twitter:card\" content=\"summary_large_image\">\n"
            f"    <meta name=\"twitter:title\" content=\"{seo['title']}\">\n"
            f"    <meta name=\"twitter:description\" content=\"{seo['description']}\">\n</head>",
            1,
        )

    # Keywords helpful for some engines (light touch)
    keywords = (
        "NYU a cappella, NYU acapella groups, best NYU a cappella, NYC a cappella, "
        "book a cappella NYC, competitive a cappella, Vocollision, ICCA, New York University"
    )
    html = replace_meta(html, "keywords", keywords)

    blocks = [music_group_jsonld(), website_jsonld(), webpage_jsonld(seo, path.name)]
    if extra_jsonld:
        blocks.extend(extra_jsonld)
    html = inject_jsonld(html, blocks)

    # Marker so we can re-run safely
    if 'name="voco-seo"' not in html:
        html = html.replace(
            "</head>",
            '    <meta name="voco-seo" content="1">\n</head>',
            1,
        )

    path.write_text(html)
    print(f"SEO applied: {path}")


def main() -> None:
    for rel, seo in PAGE_SEO.items():
        path = ROOT / rel
        if not path.exists():
            print(f"skip missing {rel}")
            continue
        extra: list[dict] = []
        if rel == "nyu-acapella/index.html":
            extra.append(faq_jsonld(NYU_FAQS))
        if rel == "book-us/index.html":
            extra.append(faq_jsonld(BOOK_FAQS))
        if rel == "contact/index.html":
            extra.append(faq_jsonld(BOOK_FAQS[:2]))
        apply_seo(path, seo, extra)


if __name__ == "__main__":
    main()
