import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactCta from "@/components/ContactCta";
import WorldMap from "@/components/WorldMap";
import OrgChart from "@/components/OrgChart";
import T from "@/components/T";
import styles from "./page.module.css";

const ENTREPRISE_TAGS = [
  { fr: "Jauge 2.5 à 16", en: "Gauge 2.5 to 16" },
  { fr: "Tricot main", en: "Hand knitting" },
  { fr: "Crochet", en: "Crochet" },
  { fr: "Broderie", en: "Embroidery" },
  { fr: "Teinture écheveaux", en: "Skein dyeing" },
];

const YARN_TAGS: (string | { fr: string; en: string })[] = [
  "Italie",
  { fr: "Europe", en: "Europe" },
  { fr: "Asie", en: "Asia" },
  { fr: "Afrique du Sud", en: "South Africa" },
  { fr: "Océan Indien", en: "Indian Ocean" },
];

export const metadata: Metadata = {
  title: "À propos — Ultramaille",
  description:
    "Manufacture de maille basée à Antananarivo, Madagascar : plus de 25 ans d'expertise en tricot, crochet et broderie au service des plus grandes maisons de mode.",
  alternates: { canonical: "/a-propos" },
};

export default function AProposPage() {
  return (
    <div className={styles.page}>
      <Header />

      <section id="top" className={styles.hero}>
        <Image
          src="https://res.cloudinary.com/wzetrnif/image/upload/v1787848769/remaillage-ultramaille_yorfz9.webp"
          alt="Remaillage Ultramaille"
          fill
          priority
          className={styles.heroImg}
        />
        <div className={styles.heroGradient} />
        <div className={styles.heroGrid} />
      </section>

      <section className={styles.entreprise}>
        <div className={styles.entrepriseGrid}>
          <div className={styles.sticky}>
            <div className={`${styles.eyebrow} ${styles.eyebrowGold}`}>
              <T fr="— Notre entreprise" en="— Our company" />
            </div>
            <h1 className={styles.entrepriseTitle}>
              <T
                fr="Une entreprise experte du tricotage d'excellence."
                en="A company built on excellence in knitting."
              />
            </h1>
            <div className={styles.tagRow}>
              {ENTREPRISE_TAGS.map((tag) => (
                <span key={tag.fr} className={`${styles.tag} ${styles.tagLight}`}>
                  <T fr={tag.fr} en={tag.en} />
                </span>
              ))}
            </div>
          </div>
          <div className={styles.textCol}>
            <p className={styles.paragraph}>
              <T
                fr="Spécialistes de la maille depuis plus de 25 ans, notre manufacture est basée à Antananarivo, à Madagascar. Pour donner vie à vos collections, nous combinons l'efficacité de machines rectilignes de pointe (manuelles et électroniques, de la jauge 2.5 à 16) et l'excellence d'un département entièrement dédié au savoir-faire fait main. Tricot à deux aiguilles, crochet et broderies élaborées : nous valorisons ces techniques artisanales d'exception qui font partie intégrante de la culture malgache."
                en="Knitwear specialists for over 25 years, our manufacture is based in Antananarivo, Madagascar. To bring your collections to life, we combine the efficiency of state-of-the-art flat-bed machines (manual and electronic, from gauge 2.5 to 16) with the excellence of a department entirely dedicated to hand-craft know-how. Two-needle knitting, crochet and elaborate embroidery: we champion these exceptional artisanal techniques that are an integral part of Malagasy culture."
              />
            </p>
            <p className={styles.paragraph}>
              <T
                fr="L'exigence de qualité signe chacune de nos pièces : tous nos pulls sont intégralement remaillés, garantissant des finitions et une confection irréprochables. Notre service de teinture sur mesure s'adapte à tous vos projets, de la teinture en écheveaux sur base Pantone à la teinture en plongée sur produit fini. Cette maîtrise technique, alliée à notre grande diversité de jauges, nous permet de façonner une immense variété de mailles, des pièces les plus créatives et originales aux modèles les plus intemporels."
                en="A demand for quality defines every one of our pieces: all our sweaters are fully remeshed, guaranteeing flawless finishing and construction. We also offer a bespoke dyeing service, whether skein dyeing — to develop your own colours based on the universal Pantone reference — or dip dyeing on finished products. This technical mastery, combined with our wide diversity of gauges, allows us to craft an immense variety of knits, from the most creative and original pieces to the most timeless designs."
              />
            </p>
            <p className={styles.paragraph}>
              <T
                fr="Nous sélectionnons des matières de premier choix auprès de filateurs rigoureusement choisis en Italie, en Europe, en Afrique du Sud, en Asie et dans l'océan Indien. Notre ambition est d'offrir un accompagnement de bout en bout, du développement initial jusqu'à la production finale, en plaçant toujours la créativité et la haute qualité au cœur de nos propositions."
                en="We select premium materials from carefully chosen spinners in Italy, Europe, South Africa, Asia and the Indian Ocean. Our ambition is to offer end-to-end support, from initial development through to final production, always placing creativity and high quality at the heart of our proposals."
              />
            </p>
          </div>
        </div>
      </section>

      <section className={styles.marches}>
        <div className={styles.mapPanel}>
          <div className={styles.mapPanelGrid} />
          <div className={styles.mapPanelInner}>
            <div className={styles.mapHead}>
              <div>
                <div className={`${styles.eyebrow} ${styles.eyebrowGold}`}>
                  <T fr="— Présence mondiale" en="— Global presence" />
                </div>
                <h3 className={styles.mapTitle}>
                  <T
                    fr="Des collections exportées sur trois continents."
                    en="Collections exported across three continents."
                  />
                </h3>
              </div>
              <div className={styles.mapLegend}>
                <div className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: "#E0A338" }} />
                  <span className={styles.legendLabel}>
                    <T fr="Marché principal" en="Principal market" />
                  </span>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: "#9c7a35" }} />
                  <span className={styles.legendLabel}>
                    <T fr="Marchés secondaires" en="Secondary markets" />
                  </span>
                </div>
                <div className={styles.legendItem}>
                  <span
                    className={styles.legendDot}
                    style={{ background: "#F4EFE6", border: "2px solid #E0A338", boxSizing: "border-box" }}
                  />
                  <span className={styles.legendLabel}>
                    <T fr="Origine — Madagascar" en="Origin — Madagascar" />
                  </span>
                </div>
              </div>
            </div>

            <WorldMap />

            <div className={styles.sourcingRow}>
              <span className={styles.sourcingLabel}>
                <T fr="Provenance des fils" en="Yarn sourcing" />
              </span>
              {YARN_TAGS.map((tag) => {
                const key = typeof tag === "string" ? tag : tag.fr;
                const fr = typeof tag === "string" ? tag : tag.fr;
                const en = typeof tag === "string" ? tag : tag.en;
                return (
                  <span key={key} className={`${styles.tag} ${styles.tagDark}`}>
                    <T fr={fr} en={en} />
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.marchesTextWrap}>
          <div className={styles.marchesGrid}>
            <div>
              <h2 className={styles.marchesTitle}>
                <T
                  fr="Une maison d'exportation au service des plus grands noms."
                  en="An export house serving the most prestigious names."
                />
              </h2>
            </div>
            <div className={styles.marchesTextCol}>
              <p className={styles.paragraph}>
                <T
                  fr="ULTRAMAILLE SA travaille essentiellement à l'exportation, en se concentrant sur ses produits finis de haute qualité. Nous avons le privilège de compter parmi nos clients certaines des marques françaises et italiennes les plus prestigieuses."
                  en="ULTRAMAILLE SA works essentially for export, concentrating on high-quality finished products. We have the privilege of counting among our clients some of the most prestigious French and Italian fashion brands."
                />
              </p>
              <p className={styles.paragraph}>
                <T
                  fr="Aujourd'hui, l'Europe représente notre principal marché, absorbant la majeure partie de notre capacité annuelle de production. Nous collaborons également avec des clients aux États-Unis, en Afrique du Sud et dans l'océan Indien. La majorité de nos fils proviennent de filatures situées à proximité des sources de matières premières."
                  en="Today Europe is our principal market, absorbing the major part of our annual production capacity. We also collaborate with clients in the United States, South Africa and the Indian Ocean. The majority of our yarns come from spinning mills located close to the sources of raw materials."
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="equipe" className={styles.equipe}>
        <div className={styles.sectionInner}>
          <div className={styles.equipeHead}>
            <div className={`${styles.eyebrow} ${styles.eyebrowGold}`}>
              <T fr="— Notre équipe" en="— Our team" />
            </div>
            <h2 className={styles.equipeTitle}>
              <T fr="Les femmes et les hommes derrière chaque maille." en="The people behind every stitch." />
            </h2>
          </div>

          <OrgChart />
        </div>
      </section>

      <ContactCta />
      <Footer />
    </div>
  );
}
