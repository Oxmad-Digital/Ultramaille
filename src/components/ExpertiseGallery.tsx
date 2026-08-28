"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import styles from "@/app/notre-expertise/page.module.css";

const GALERIE_FILTERS = [
  { id: "ajouree", fr: "Maille ajourée", en: "Openwork" },
  { id: "fantaisie", fr: "Maille fantaisie", en: "Fancy knit" },
  { id: "main", fr: "Maille main", en: "Hand knit" },
  { id: "crochet", fr: "Crochet & macramé", en: "Crochet & macramé" },
] as const;

type GalerieFilterId = (typeof GALERIE_FILTERS)[number]["id"];

const SWATCHES: {
  img: string;
  alt: string;
  labelFr: string;
  labelEn: string;
  category: GalerieFilterId;
}[] = [
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854802/Societe-Ultramaille-30-Swatch-Husky-2200-50p-WV-50p-Pe-Motif-100p-coton-scaled_rt3tiw.webp", alt: "Swatch Husky motif coton", labelFr: "Motif · Coton", labelEn: "Pattern · Cotton", category: "fantaisie" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854801/Societe-Ultramaille-29-Swatch-Paola-Tricotin-80p-WU-20p-PA-scaled_wkl4wb.webp", alt: "Swatch tricotin Paola", labelFr: "Tricotin · Paola", labelEn: "Tricotin · Paola", category: "main" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854800/Societe-Ultramaille-28-Swatch-Ravinda-Perlee-Paola-avec-Perle-Crochet-scaled_epmvob.webp", alt: "Swatch perlé crochet", labelFr: "Perlé · Crochet", labelEn: "Beaded · Crochet", category: "crochet" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854800/Societe-Ultramaille-27-Swatch-Coussin-100p-coton-Tricotin-scaled_xbbnkt.webp", alt: "Swatch tricotin coussin coton", labelFr: "Tricotin · Coussin", labelEn: "Tricotin · Cushion", category: "main" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854799/Societe-Ultramaille-24-Swatch-Carreaux-Paola-80p-WV-20p-PA-scaled_cy1shk.webp", alt: "Swatch carreaux Paola", labelFr: "Carreaux · Paola", labelEn: "Check · Paola", category: "fantaisie" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854798/Societe-Ultramaille-23-Swatch-Rayee-Belone-900-Husky-950-scaled_tbaymh.webp", alt: "Swatch rayé Husky", labelFr: "Rayé · Husky", labelEn: "Striped · Husky", category: "ajouree" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854797/Societe-Ultramaille-22-Swatch-Bellone-900-Paola-Velvet-crochet-Rayure-Triangle-scaled_iwwdbx.webp", alt: "Swatch crochet rayure triangle", labelFr: "Crochet · Triangle", labelEn: "Crochet · Triangle", category: "crochet" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854796/Societe-Ultramaille-21-Swatch-Tresse-appliquee-Paola-80p-WV-20p-PA-Crochet-scaled_shbf9x.webp", alt: "Swatch tressé crochet", labelFr: "Tressé · Crochet", labelEn: "Braided · Crochet", category: "crochet" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854794/Societe-Ultramaille-20-Swatch-Paola-80p-WU-20p-PA-scaled_rppg7l.webp", alt: "Swatch uni Paola", labelFr: "Uni · Paola", labelEn: "Solid · Paola", category: "fantaisie" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854793/Societe-Ultramaille-19-Swatch-Paola-Dive-Husky-Fine-scaled_a5n6xu.webp", alt: "Swatch Dive Husky fine", labelFr: "Dive · Husky", labelEn: "Dive · Husky", category: "ajouree" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854792/Societe-Ultramaille-18-Swatch-Fleur-Feutre-Husky-Fine-Broderie-scaled_dogoba.webp", alt: "Swatch fleur feutre broderie", labelFr: "Fleur feutre · Broderie", labelEn: "Felt flower · Embroidery", category: "fantaisie" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854791/Societe-Ultramaille-16-Swatch-Chine-Lurex-Paola-80p-WV-20p-PA-scaled_l4vmim.webp", alt: "Swatch chiné lurex Paola", labelFr: "Chiné · Lurex", labelEn: "Heather · Lurex", category: "fantaisie" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854790/Societe-Ultramaille-15-Swatch-MSV-Husky-50p-WU-50p-PC-scaled_ztvezc.webp", alt: "Swatch Husky laine", labelFr: "Husky · Laine", labelEn: "Husky · Wool", category: "ajouree" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854789/Societe-Ultramaille-14-Swatch-MS-Rayure-Paola-80p-WV-20PA-scaled_uxvxwh.webp", alt: "Swatch rayure Paola", labelFr: "Rayure · Paola", labelEn: "Stripe · Paola", category: "fantaisie" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854788/Societe-Ultramaille-13-Swatch-Chine-Lurex-Paola-80p-WV-20PA-scaled_jm7thw.webp", alt: "Swatch chiné lurex Paola", labelFr: "Chiné · Lurex", labelEn: "Heather · Lurex", category: "fantaisie" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854787/Societe-Ultramaille-11-Swatch-PAOLA-80p-WA-20p-PA-scaled_nyaggy.webp", alt: "Swatch Paola laine", labelFr: "Paola · Laine", labelEn: "Paola · Wool", category: "fantaisie" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854787/Societe-Ultramaille-10-Swatch-Dire-2200-Paolo-80p-WU-20p-PA-scaled_iobik1.webp", alt: "Swatch Dire Paola", labelFr: "Dire · Paola", labelEn: "Dire · Paola", category: "fantaisie" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854785/Societe-Ultramaille-8-Swatch-Paola-80p-WU-20p-PX-scaled_ng9jiz.webp", alt: "Swatch uni Paola", labelFr: "Uni · Paola", labelEn: "Solid · Paola", category: "fantaisie" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854784/Societe-Ultramaille-7-Swatch-Tricotin-100p-cotton-scaled_hfhcxa.webp", alt: "Swatch tricotin coton", labelFr: "Tricotin · Coton", labelEn: "Tricotin · Cotton", category: "main" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854783/Societe-Ultramaille-5-Swatch-Dire-50p-WU-50p-PA-scaled_wknrcp.webp", alt: "Swatch Dire Paola", labelFr: "Dire · Paola", labelEn: "Dire · Paola", category: "fantaisie" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854782/Societe-Ultramaille-4-Swatch-Tricotin-100p-cotton-scaled_psgj13.webp", alt: "Swatch tricotin coton", labelFr: "Tricotin · Coton", labelEn: "Tricotin · Cotton", category: "main" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854781/Societe-Ultramaille-3-Swatch-RVE-50p-WV-50p-avec-Ruban-scaled_ztnr0z.webp", alt: "Swatch ruban RVE", labelFr: "Ruban · RVE", labelEn: "Ribbon · RVE", category: "fantaisie" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854781/Societe-Ultramaille-2-Swatch-macrame-100p-coton-scaled_slk00s.webp", alt: "Swatch macramé coton", labelFr: "Macramé · Coton", labelEn: "Macramé · Cotton", category: "crochet" },
  { img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787854780/Societe-Ultramaille-1-Swatch-rayee-Paola-1-scaled_it6pzb.webp", alt: "Swatch rayé Paola", labelFr: "Rayé · Paola", labelEn: "Striped · Paola", category: "fantaisie" },
];

export default function ExpertiseGallery() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<GalerieFilterId | null>(null);

  const filteredSwatches = useMemo(
    () => (activeFilter ? SWATCHES.filter((s) => s.category === activeFilter) : SWATCHES),
    [activeFilter],
  );

  return (
    <section className={styles.galerie}>
      <div className={styles.sectionInner}>
        <div className={styles.galerieHead}>
          <div>
            <div className={`${styles.eyebrow} ${styles.eyebrowGold}`}>{t("— Galerie maille", "— Knit gallery")}</div>
            <h2 className={styles.galerieTitle}>
              {t(
                "Mailles, structures et associations développées en interne.",
                "Stitches, structures and matches developed in-house.",
              )}
            </h2>
          </div>
          <div className={styles.galerieTagRow}>
            <button
              type="button"
              onClick={() => setActiveFilter(null)}
              className={`${styles.tag} ${activeFilter === null ? styles.tagActive : ""}`}
              aria-pressed={activeFilter === null}
            >
              {t("Tout", "All")}
            </button>
            {GALERIE_FILTERS.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => setActiveFilter((current) => (current === tag.id ? null : tag.id))}
                className={`${styles.tag} ${activeFilter === tag.id ? styles.tagActive : ""}`}
                aria-pressed={activeFilter === tag.id}
              >
                {t(tag.fr, tag.en)}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.swatchGrid}>
          {filteredSwatches.map((s) => (
            <div key={s.img} className={styles.swatchCard}>
              <Image src={s.img} alt={s.alt} fill sizes="25vw" className={styles.swatchImg} />
              <div className={styles.swatchLabel}>{t(s.labelFr, s.labelEn)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
