import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactCta from "@/components/ContactCta";
import CountUp from "@/components/CountUp";
import ExpertiseGallery from "@/components/ExpertiseGallery";
import T from "@/components/T";
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

const FIL_ETE = [
  { fr: "Coton bio", en: "Organic cotton" },
  { fr: "Coton crêpe", en: "Crêpe cotton" },
  { fr: "Coton / lin", en: "Cotton / linen" },
  { fr: "Coton / chanvre", en: "Cotton / hemp" },
  { fr: "Coton / angora", en: "Cotton / angora" },
  { fr: "Coton / polyamide", en: "Cotton / polyamide" },
  { fr: "Viscose", en: "Viscose" },
  { fr: "Soie 100%", en: "100% silk" },
];

const FIL_HIVER = [
  { fr: "Cachemire 100%", en: "100% cashmere" },
  { fr: "Mohair / soie", en: "Mohair / silk" },
  { fr: "Mérinos extra-fin", en: "Superfine merino" },
  { fr: "Alpaga 100%", en: "100% alpaca" },
  { fr: "Angora 100%", en: "100% angora" },
  { fr: "Mélange yack", en: "Yak blend" },
  { fr: "Laine d'agneau", en: "Lambswool" },
  { fr: "Cachemire / soie", en: "Cashmere / silk" },
];

export const metadata: Metadata = {
  title: "Notre expertise — Ultramaille",
  description:
    "Usine de maille intégrée en zone franche à Antananarivo : tricotage automatique et manuel, remaillage, broderie, teinture et finitions, sous un même toit.",
  alternates: { canonical: "/notre-expertise" },
};

export default function NotreExpertisePage() {
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
                <T fr="— Usine en zone franche" en="— Free-trade-zone factory" />
              </div>
              <h1 className={styles.usineTitle}>
                <T
                  fr="Une usine de maille entièrement intégrée, sous un même toit."
                  en="A knitwear factory entirely integrated under one roof."
                />
              </h1>
            </div>
            <div>
              <p className={styles.paragraph}>
                <T
                  fr="ULTRAMAILLE SA est une usine de textile située en zone franche à Antananarivo, Madagascar. Nous sommes spécialisés dans le vêtement en maille — tricoté sur métiers rectilignes ou crocheté à la main — ainsi que dans les accessoires et les « vêtements cosmétiques »."
                  en="ULTRAMAILLE SA is a textile factory located in a free-trade zone in Antananarivo, Madagascar. We specialise in knitted garments — produced on flat-knitting machines or worked by hand in crochet — as well as accessories and cosmetic garments."
                />
              </p>
              <p className={styles.paragraph}>
                <T
                  fr="Nous tricotons sur les jauges 2,5 – 5 – 7 – 12 et 16. La majorité de nos pièces sont remaillées et lavées. Nous maîtrisons la broderie main et machine ainsi que l'impression, et avons intégré au cycle de fabrication notre propre teinture fil et teinture en plongé."
                  en="We knit on gauges 2.5, 5, 7, 12 and 16. Most of our pieces are remeshed and washed. We have fully mastered hand and machine embroidery and printing, and we have integrated our own yarn and dip dyeing into the production cycle."
                />
              </p>
            </div>
          </div>
          <div className={styles.statGrid4}>
            <div className={styles.statCellLight}>
              <div className={`${styles.statValueLight} ${styles.statValueGold}`}>
                <CountUp end={400000} />
              </div>
              <div className={styles.statLabelLight}>
                <T fr="pull-overs produits par an" en="pullovers produced each year" />
              </div>
            </div>
            <div className={styles.statCellLight}>
              <div className={styles.statValueLight}>
                <CountUp end={3000} />
                <span className={styles.statUnit}>m²</span>
              </div>
              <div className={styles.statLabelLight}>
                <T fr="d'unité de production intégrée" en="of integrated production space" />
              </div>
            </div>
            <div className={styles.statCellLight}>
              <div className={styles.statValueLight}>
                <CountUp end={930} />
              </div>
              <div className={styles.statLabelLight}>
                <T fr="salariés qualifiés" en="skilled employees" />
              </div>
            </div>
            <div className={styles.statCellLight}>
              <div className={styles.statValueLight}>
                <CountUp end={5} />
              </div>
              <div className={styles.statLabelLight}>
                <T fr="jauges : 2,5 · 5 · 7 · 12 · 16" en="gauges: 2.5 · 5 · 7 · 12 · 16" />
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
                <T fr="— Ateliers & parc machines" en="— Workshops & machine park" />
              </div>
              <h2 className={styles.ateliersTitle}>
                <T fr="Cinq ateliers, une seule chaîne d'excellence." en="Five workshops, a single chain of excellence." />
              </h2>
            </div>
            <p className={styles.ateliersText}>
              <T
                fr="Du tricotage automatique et manuel au remaillage, à la finition et au packing, chaque étape est gérée en interne — garantissant la maîtrise de la qualité, des délais et de la traçabilité."
                en="From automatic and hand knitting to remeshing, finishing and packing, every stage runs in-house — guaranteeing control over quality, lead times and traceability."
              />
            </p>
          </div>
          <div className={styles.ateliersGrid}>
            {ATELIERS.map((a) => (
              <div key={a.number} className={styles.atelierCard}>
                <div className={styles.atelierNumber}>{a.number}</div>
                <h3 className={styles.atelierTitle}>
                  <T fr={a.titleFr} en={a.titleEn} />
                </h3>
                <p className={styles.atelierText}>
                  <T fr={a.textFr} en={a.textEn} />
                </p>
                <div className={`${styles.atelierStat} ${a.gold ? styles.atelierStatGold : ""}`}>
                  <CountUp end={a.statNum} />
                  {a.statSuffix}
                  <span className={styles.atelierStatUnit}>
                    <T fr={a.unitFr} en={a.unitEn} />
                  </span>
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
                <T fr="— Conception & prototypage" en="— Design & prototyping" />
              </div>
              <h2 className={styles.beeTitle}>
                <T
                  fr="Le bureau d'étude, là où chaque collection prend forme avant l'atelier."
                  en="The design studio, where every collection takes shape before the workshop."
                />
              </h2>
              <p className={styles.paragraph}>
                <T
                  fr="Nos techniciens digitalisent chaque patronage sur logiciel de tricot avant de le confier à l'atelier échantillon, qui monte le premier prototype à la main — boutons, finitions et coupe compris."
                  en="Our technicians digitise every pattern on knitting software before handing it to the sample workshop, which builds the first prototype by hand — buttons, finishing and cut included."
                />
              </p>
              <p className={styles.paragraph}>
                <T
                  fr="Cet aller-retour entre écran et table de coupe garantit que chaque modèle validé est déjà industrialisable, sans surprise en production."
                  en="This back-and-forth between screen and cutting table ensures every approved model is already production-ready, with no surprises on the line."
                />
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
              <div className={`${styles.eyebrow} ${styles.eyebrowGold}`}>
                <T fr="— Show room" en="— Show room" />
              </div>
              <h2 className={styles.showroomTitle}>
                <T
                  fr="Un show room sur site pour toucher la matière avant de décider."
                  en="An on-site show room to feel the fabric before deciding."
                />
              </h2>
              <p className={styles.showroomText2}>
                <T
                  fr="Toutes nos gammes de maille, coloris et finitions sont exposés en un même lieu, à Antananarivo — un point de passage obligé pour nos clients avant validation de collection."
                  en="All our knit ranges, colourways and finishes are displayed in one place in Antananarivo — an essential stop for our clients before a collection is approved."
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.fil}>
        <div className={styles.sectionInner}>
          <div className={styles.filHead}>
            <div>
              <div className={`${styles.eyebrow} ${styles.eyebrowBlue}`}>
                <T fr="— Proposition de fil" en="— Yarn proposal" />
              </div>
              <h2 className={styles.filTitle}>
                <T fr="Une palette choisie de fibres naturelles et nobles." en="A curated palette of natural and noble fibres." />
              </h2>
            </div>
            <p className={styles.filHeadText}>
              <T
                fr="Du coton bio et de la soie au cachemire, mohair, mérinos et alpaga — nous sourçons et teignons les fils selon les besoins de chaque collection, saison après saison."
                en="From organic cotton and silk to cashmere, mohair, merino and alpaca — we source and dye yarns to match the needs of every collection, season by season."
              />
            </p>
          </div>
          <div className={styles.filGrid}>
            <div className={`${styles.filCard} ${styles.filCardLight}`}>
              <div className={styles.filCardHead}>
                <h3 className={`${styles.filCardTitle} ${styles.filCardTitleLight}`}>
                  <T fr="Fil été / printemps" en="Summer / Spring" />
                </h3>
                <span className={styles.filCardTag}>
                  <T fr="légèreté" en="lightweight" />
                </span>
              </div>
              <div className={styles.filTagRow}>
                {FIL_ETE.map((tag) => (
                  <span key={tag.fr} className={`${styles.filTag} ${styles.filTagLight}`}>
                    <T fr={tag.fr} en={tag.en} />
                  </span>
                ))}
              </div>
            </div>
            <div className={`${styles.filCard} ${styles.filCardDark}`}>
              <div className={styles.filCardHead}>
                <h3 className={`${styles.filCardTitle} ${styles.filCardTitleDark}`}>
                  <T fr="Fil hiver / automne" en="Winter / Autumn" />
                </h3>
                <span className={styles.filCardTag}>
                  <T fr="chaleur" en="warmth" />
                </span>
              </div>
              <div className={styles.filTagRow}>
                {FIL_HIVER.map((tag) => (
                  <span key={tag.fr} className={`${styles.filTag} ${styles.filTagDark}`}>
                    <T fr={tag.fr} en={tag.en} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ExpertiseGallery />

      <ContactCta />
      <Footer />
    </div>
  );
}
