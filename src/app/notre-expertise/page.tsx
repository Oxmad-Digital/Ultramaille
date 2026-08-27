"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactCta from "@/components/ContactCta";
import CountUp from "@/components/CountUp";
import { useLanguage } from "@/lib/language-context";
import styles from "./page.module.css";

const ATELIERS = [
  {
    number: "01",
    titleFr: "Tricotage automatique",
    titleEn: "Automatic knitting",
    textFr: "Métiers rectilignes Stoll, Tong Xiang & Xinlong, des jauges 3 à 16.",
    textEn: "Stoll, Tong Xiang & Xinlong flat-knitting machines across gauges 3 to 16.",
    statNum: 68,
    statSuffix: "",
    unitFr: "métiers",
    unitEn: "machines",
  },
  {
    number: "02",
    titleFr: "Tricotage manuel",
    titleEn: "Hand knitting",
    textFr: "Machines à tricoter main, des jauges 2,5 à 16 — le cœur de notre métier.",
    textEn: "Hand-operated machines on gauges 2.5 to 16 — the heart of our craft.",
    statNum: 327,
    statSuffix: "",
    unitFr: "machines",
    unitEn: "machines",
  },
  {
    number: "03",
    titleFr: "Remaillage",
    titleEn: "Remeshing",
    textFr: "Postes Flying Tiger, Golden Eagle & Tong Xiang, des jauges 6 à 20.",
    textEn: "Flying Tiger, Golden Eagle & Tong Xiang stations, gauges 6 to 20.",
    statNum: 190,
    statSuffix: "",
    unitFr: "postes",
    unitEn: "stations",
  },
  {
    number: "04",
    titleFr: "Finition & confection",
    titleEn: "Finishing & making-up",
    textFr: "Boutonnière, surjet, piquage, sérigraphie et pressing intégrés.",
    textEn: "Buttonholing, overlocking, linking, screen printing and pressing.",
    statNum: 90,
    statSuffix: "+",
    unitFr: "machines",
    unitEn: "machines",
  },
  {
    number: "05",
    titleFr: "Packing & contrôle",
    titleEn: "Packing & control",
    textFr: "Nettoyage, détection de métaux, soudure plastique et feuillard avant expédition.",
    textEn: "Cleaning, metal detection, plastic sealing and strapping before dispatch.",
    statNum: 100,
    statSuffix: "%",
    unitFr: "contrôlé",
    unitEn: "controlled",
    gold: true,
  },
];

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

export default function NotreExpertisePage() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<GalerieFilterId | null>(null);

  const filteredSwatches = useMemo(
    () => (activeFilter ? SWATCHES.filter((s) => s.category === activeFilter) : SWATCHES),
    [activeFilter],
  );

  return (
    <div className={styles.page}>
      <Header />

      <section id="top" className={styles.hero}>
        <Image
          src="https://res.cloudinary.com/wzetrnif/image/upload/v1787850551/teinture-ultramaille_jzz3ea.webp"
          alt="Teinture Ultramaille"
          fill
          priority
          className={styles.heroImg}
        />
        <div className={styles.heroGradient} />
        <div className={styles.heroGrid} />
      </section>

      <section className={styles.usine}>
        <div className={styles.sectionInner}>
          <div className={styles.usineIntro}>
            <div>
              <div className={`${styles.eyebrow} ${styles.eyebrowBlue}`}>
                {t("— Usine en zone franche", "— Free-trade-zone factory")}
              </div>
              <h2 className={styles.usineTitle}>
                {t(
                  "Une usine de maille entièrement intégrée, sous un même toit.",
                  "A knitwear factory entirely integrated under one roof.",
                )}
              </h2>
            </div>
            <div>
              <p className={styles.paragraph}>
                {t(
                  "ULTRAMAILLE SA est une usine de textile située en zone franche à Antananarivo, Madagascar. Nous sommes spécialisés dans le vêtement en maille — tricoté sur métiers rectilignes ou crocheté à la main — ainsi que dans les accessoires et les « vêtements cosmétiques ».",
                  "ULTRAMAILLE SA is a textile factory located in a free-trade zone in Antananarivo, Madagascar. We specialise in knitted garments — produced on flat-knitting machines or worked by hand in crochet — as well as accessories and cosmetic garments.",
                )}
              </p>
              <p className={styles.paragraph}>
                {t(
                  "Nous tricotons sur les jauges 2,5 – 5 – 7 – 12 et 16. La majorité de nos pièces sont remaillées et lavées. Nous maîtrisons la broderie main et machine ainsi que l'impression, et avons intégré au cycle de fabrication notre propre teinture fil et teinture en plongé.",
                  "We knit on gauges 2.5, 5, 7, 12 and 16. Most of our pieces are remeshed and washed. We have fully mastered hand and machine embroidery and printing, and we have integrated our own yarn and dip dyeing into the production cycle.",
                )}
              </p>
            </div>
          </div>
          <div className={styles.statGrid4}>
            <div className={styles.statCellLight}>
              <div className={`${styles.statValueLight} ${styles.statValueGold}`}>
                <CountUp end={400000} />
              </div>
              <div className={styles.statLabelLight}>{t("pull-overs produits par an", "pullovers produced each year")}</div>
            </div>
            <div className={styles.statCellLight}>
              <div className={styles.statValueLight}>
                <CountUp end={3000} />
                <span className={styles.statUnit}>m²</span>
              </div>
              <div className={styles.statLabelLight}>{t("d'unité de production intégrée", "of integrated production space")}</div>
            </div>
            <div className={styles.statCellLight}>
              <div className={styles.statValueLight}>
                <CountUp end={930} />
              </div>
              <div className={styles.statLabelLight}>{t("salariés qualifiés", "skilled employees")}</div>
            </div>
            <div className={styles.statCellLight}>
              <div className={styles.statValueLight}>
                <CountUp end={5} />
              </div>
              <div className={styles.statLabelLight}>
                {t("jauges : 2,5 · 5 · 7 · 12 · 16", "gauges: 2.5 · 5 · 7 · 12 · 16")}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ateliers}>
        <div className={styles.sectionInner}>
          <div className={styles.ateliersHead}>
            <div>
              <div className={`${styles.eyebrow} ${styles.eyebrowGold}`}>
                {t("— Ateliers & parc machines", "— Workshops & machine park")}
              </div>
              <h2 className={styles.ateliersTitle}>
                {t("Cinq ateliers, une seule chaîne d'excellence.", "Five workshops, a single chain of excellence.")}
              </h2>
            </div>
            <p className={styles.ateliersText}>
              {t(
                "Du tricotage automatique et manuel au remaillage, à la finition et au packing, chaque étape est gérée en interne — garantissant la maîtrise de la qualité, des délais et de la traçabilité.",
                "From automatic and hand knitting to remeshing, finishing and packing, every stage runs in-house — guaranteeing control over quality, lead times and traceability.",
              )}
            </p>
          </div>
          <div className={styles.ateliersGrid}>
            {ATELIERS.map((a) => (
              <div key={a.number} className={styles.atelierCard}>
                <div className={styles.atelierNumber}>{a.number}</div>
                <h3 className={styles.atelierTitle}>{t(a.titleFr, a.titleEn)}</h3>
                <p className={styles.atelierText}>{t(a.textFr, a.textEn)}</p>
                <div className={`${styles.atelierStat} ${a.gold ? styles.atelierStatGold : ""}`}>
                  <CountUp end={a.statNum} />
                  {a.statSuffix}
                  <span className={styles.atelierStatUnit}>{t(a.unitFr, a.unitEn)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.bee}>
        <div className={styles.sectionInner}>
          <div className={styles.beeGrid}>
            <div className={styles.beeText}>
              <div className={`${styles.eyebrow} ${styles.eyebrowBlue}`}>
                {t("— Conception & prototypage", "— Design & prototyping")}
              </div>
              <h2 className={styles.beeTitle}>
                {t(
                  "Le bureau d'étude, là où chaque collection prend forme avant l'atelier.",
                  "The design studio, where every collection takes shape before the workshop.",
                )}
              </h2>
              <p className={styles.paragraph}>
                {t(
                  "Nos techniciens digitalisent chaque patronage sur logiciel de tricot avant de le confier à l'atelier échantillon, qui monte le premier prototype à la main — boutons, finitions et coupe compris.",
                  "Our technicians digitise every pattern on knitting software before handing it to the sample workshop, which builds the first prototype by hand — buttons, finishing and cut included.",
                )}
              </p>
              <p className={styles.paragraph}>
                {t(
                  "Cet aller-retour entre écran et table de coupe garantit que chaque modèle validé est déjà industrialisable, sans surprise en production.",
                  "This back-and-forth between screen and cutting table ensures every approved model is already production-ready, with no surprises on the line.",
                )}
              </p>
            </div>
            <div className={styles.beePhotos}>
              <div className={styles.beePhotoMain}>
                <Image
                  src="https://res.cloudinary.com/wzetrnif/image/upload/v1787850772/bureau-etude-ultramaille-logiciel_u5bpnc.webp"
                  alt="Patronage digital sur logiciel de tricot"
                  fill
                  sizes="(max-width: 900px) 100vw, 40vw"
                  className={styles.beePhotoImg}
                />
              </div>
              <div className={styles.beePhotoSecondary}>
                <Image
                  src="https://res.cloudinary.com/wzetrnif/image/upload/v1787851263/ultramaille-echantillon-machine-a-coudre_xiuiu4.webp"
                  alt="Montage d'un échantillon à la main"
                  fill
                  sizes="(max-width: 900px) 100vw, 24vw"
                  className={styles.beePhotoImg}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.showroom}>
        <div className={styles.sectionInner}>
          <div className={styles.showroomGrid}>
            <div className={styles.showroomPhoto}>
              <Image
                src="https://res.cloudinary.com/wzetrnif/image/upload/v1787851410/show-room-ultramaille_ktbqfw.webp"
                alt="Show room Ultramaille"
                fill
                sizes="(max-width: 900px) 100vw, 48vw"
                className={styles.showroomPhotoImg}
              />
            </div>
            <div className={styles.showroomText}>
              <div className={`${styles.eyebrow} ${styles.eyebrowGold}`}>{t("— Show room", "— Show room")}</div>
              <h2 className={styles.showroomTitle}>
                {t(
                  "Un show room sur site pour toucher la matière avant de décider.",
                  "An on-site show room to feel the fabric before deciding.",
                )}
              </h2>
              <p className={styles.showroomText2}>
                {t(
                  "Toutes nos gammes de maille, coloris et finitions sont exposés en un même lieu, à Antananarivo — un point de passage obligé pour nos clients avant validation de collection.",
                  "All our knit ranges, colourways and finishes are displayed in one place in Antananarivo — an essential stop for our clients before a collection is approved.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.fil}>
        <div className={styles.sectionInner}>
          <div className={styles.filHead}>
            <div>
              <div className={`${styles.eyebrow} ${styles.eyebrowBlue}`}>{t("— Proposition de fil", "— Yarn proposal")}</div>
              <h2 className={styles.filTitle}>
                {t("Une palette choisie de fibres naturelles et nobles.", "A curated palette of natural and noble fibres.")}
              </h2>
            </div>
            <p className={styles.filHeadText}>
              {t(
                "Du coton bio et de la soie au cachemire, mohair, mérinos et alpaga — nous sourçons et teignons les fils selon les besoins de chaque collection, saison après saison.",
                "From organic cotton and silk to cashmere, mohair, merino and alpaca — we source and dye yarns to match the needs of every collection, season by season.",
              )}
            </p>
          </div>
          <div className={styles.filGrid}>
            <div className={`${styles.filCard} ${styles.filCardLight}`}>
              <div className={styles.filCardHead}>
                <h3 className={`${styles.filCardTitle} ${styles.filCardTitleLight}`}>
                  {t("Fil été / printemps", "Summer / Spring")}
                </h3>
                <span className={styles.filCardTag}>{t("légèreté", "lightweight")}</span>
              </div>
              <div className={styles.filTagRow}>
                {[
                  { fr: "Coton bio", en: "Organic cotton" },
                  { fr: "Coton crêpe", en: "Crêpe cotton" },
                  { fr: "Coton / lin", en: "Cotton / linen" },
                  { fr: "Coton / chanvre", en: "Cotton / hemp" },
                  { fr: "Coton / angora", en: "Cotton / angora" },
                  { fr: "Coton / polyamide", en: "Cotton / polyamide" },
                  { fr: "Viscose", en: "Viscose" },
                  { fr: "Soie 100%", en: "100% silk" },
                ].map((tag) => (
                  <span key={tag.fr} className={`${styles.filTag} ${styles.filTagLight}`}>
                    {t(tag.fr, tag.en)}
                  </span>
                ))}
              </div>
            </div>
            <div className={`${styles.filCard} ${styles.filCardDark}`}>
              <div className={styles.filCardHead}>
                <h3 className={`${styles.filCardTitle} ${styles.filCardTitleDark}`}>
                  {t("Fil hiver / automne", "Winter / Autumn")}
                </h3>
                <span className={styles.filCardTag}>{t("chaleur", "warmth")}</span>
              </div>
              <div className={styles.filTagRow}>
                {[
                  { fr: "Cachemire 100%", en: "100% cashmere" },
                  { fr: "Mohair / soie", en: "Mohair / silk" },
                  { fr: "Mérinos extra-fin", en: "Superfine merino" },
                  { fr: "Alpaga 100%", en: "100% alpaca" },
                  { fr: "Angora 100%", en: "100% angora" },
                  { fr: "Mélange yack", en: "Yak blend" },
                  { fr: "Laine d'agneau", en: "Lambswool" },
                  { fr: "Cachemire / soie", en: "Cashmere / silk" },
                ].map((tag) => (
                  <span key={tag.fr} className={`${styles.filTag} ${styles.filTagDark}`}>
                    {t(tag.fr, tag.en)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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

      <ContactCta />
      <Footer />
    </div>
  );
}
