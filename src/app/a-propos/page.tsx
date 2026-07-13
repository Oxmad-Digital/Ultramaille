"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactCta from "@/components/ContactCta";
import WorldMap from "@/components/WorldMap";
import { useLanguage } from "@/lib/language-context";
import styles from "./page.module.css";

const IMG_BASE = "https://www.ultramaille.com/wp-content/uploads/";

const DIRECTEURS = [
  { name: "Patricia WALLE", roleFr: "Directrice de Confection", roleEn: "Clothing Director", img: `${IMG_BASE}2022/10/Patricia-WALLE-1.jpg` },
  { name: "Zoltan BIRO", roleFr: "Directeur Industriel", roleEn: "Industrial Director", img: `${IMG_BASE}2022/10/Zoltan-BIRO.jpg` },
  { name: "Pascalle WYBO", roleFr: "Directrice Style & Relations Clients", roleEn: "Style & Client Relations Director", img: `${IMG_BASE}2022/10/Pascalle-WYBO-1.jpg` },
  { name: "Marc BOULNOIS", roleFr: "Directeur Administratif et Financier", roleEn: "Administrative & Financial Director", img: `${IMG_BASE}2022/10/Marc-BOULNOIS.jpg` },
  { name: "RAKOTOMALALA Hary", roleFr: "Directeur Administratif et Financier", roleEn: "Administrative & Financial Director", img: `${IMG_BASE}2022/10/RAKOTOMALALA-Hary.jpg` },
  { name: "Mamy RANAIVOSON", roleFr: "Directeur Technique", roleEn: "Technical Director", img: `${IMG_BASE}2022/10/Mamy-RANAIVOSON-1.jpg` },
];

const RESPONSABLES = [
  { name: "Tom WYBO", roleFr: "Chargé du Projet Digital", roleEn: "Digital Project Manager", img: `${IMG_BASE}2022/10/Tom-WYBO.jpg` },
  { name: "Christophe Ulysse OTONIA", roleFr: "Responsable Informatique et RSE", roleEn: "IT & CSR Manager", img: `${IMG_BASE}2022/10/Christophe-Ulysse-OTONIA.jpg` },
  { name: "Luce RANAIVO", roleFr: "Merchandiser", roleEn: "Merchandiser", img: `${IMG_BASE}2022/10/Luce-RANAIVO-1.jpg` },
  { name: "Fitiavana RAMBELOTIANA", roleFr: "Merchandiser", roleEn: "Merchandiser", img: `${IMG_BASE}2022/10/Fitiavana-RAMBELOTIANA.jpg` },
  { name: "Ranjanirina RABEMASO", roleFr: "Responsable Transit", roleEn: "Transit Manager", img: `${IMG_BASE}2022/10/Ranjanirina-RABEMASO-2023-09-25-ultramaille-NB-23-1.jpg` },
  { name: "Lantonirina RAKOTOARISOA", roleFr: "Responsable Broderie et Crochet Main", roleEn: "Embroidery & Hand Crochet Manager", img: `${IMG_BASE}2022/10/Lantonirina-RAKOTOARISOA.jpg` },
  { name: "Gilbert RAJOELISON", roleFr: "Responsable Machine Électronique", roleEn: "Electronic Machine Manager", img: `${IMG_BASE}2022/10/Gilbert-RAJOELISON.jpg` },
  { name: "Fanjaniaina RASOAZANANAIVO", roleFr: "Responsable Tricotage Manuel", roleEn: "Manual Knitting Manager", img: `${IMG_BASE}2022/10/Fanjaniaina-RASOAZANANAIVO-1.jpg` },
  { name: "Hasinavalona RAZAFINJATOVO", roleFr: "Responsable Remaillage et Stitching", roleEn: "Remeshing & Stitching Manager", img: `${IMG_BASE}2022/10/Hasinavalona-RAZAFINJATOVO.jpg` },
  { name: "Radonirina RASOLOFONIAINA", roleFr: "Responsable Packing", roleEn: "Packing Manager", img: `${IMG_BASE}2022/10/Radonirina-RASOLOFONIAINA.jpg` },
  { name: "Christian ANDRIAKOTOMALALA", roleFr: "Responsable Approvisionnement", roleEn: "Supply Manager", img: `${IMG_BASE}2022/10/Christian-ANDRIAKOTOMALALA.jpg` },
  { name: "Miora RANDRIAHAINGO", roleFr: "Responsable de Trésorerie", roleEn: "Treasury Manager", img: `${IMG_BASE}2024/04/Miora-RANDRIAHAINGO-2023-09-25-ultramaille-NB-19.jpg` },
  { name: "Joelle RASAMIMANANA", roleFr: "Merchandiser", roleEn: "Merchandiser", img: `${IMG_BASE}2024/04/Joelle-RASAMIMANANA-2023-09-25-ultramaille-NB-1.jpg` },
  { name: "Onitiana RATOVAHOAKA", roleFr: "Responsable Comptabilité", roleEn: "Accounting Manager", img: `${IMG_BASE}2024/04/Onitiana-RATOVAHOAKA-2023-09-25-ultramaille-NB-17-1.jpg` },
];

const ASSISTANTS = [
  { name: "Harilala RAZAFINDRAKOTO", roleFr: "Coordinatrice", roleEn: "Coordinator", img: `${IMG_BASE}2022/10/Harilala-RAZAFINDRAKOTO.jpg` },
  { name: "Dina RATSIMBAZAFY", roleFr: "Assistante Directrice de Confection", roleEn: "Assistant to Sewing Director", img: `${IMG_BASE}2022/10/Dina-RATSIMBAZAFY-1.jpg` },
];

const YARN_TAGS = ["Italie", { fr: "Europe", en: "Europe" }, { fr: "Asie", en: "Asia" }, { fr: "Afrique du Sud", en: "South Africa" }, { fr: "Océan Indien", en: "Indian Ocean" }];

function TeamCard({
  name,
  roleFr,
  roleEn,
  img,
  size,
}: {
  name: string;
  roleFr: string;
  roleEn: string;
  img: string;
  size: "large" | "small";
}) {
  const { t } = useLanguage();
  const isLarge = size === "large";
  return (
    <div className={styles.teamCard}>
      <div className={styles.teamImgWrap}>
        <Image src={img} alt={name} fill sizes="20vw" className={styles.teamImg} />
        <div className={styles.teamShade} />
        <div className={isLarge ? styles.teamCaptionLarge : styles.teamCaptionSmall}>
          <div className={isLarge ? styles.teamNameLarge : styles.teamNameSmall}>{name}</div>
          <div className={isLarge ? styles.teamRoleLarge : styles.teamRoleSmall}>{t(roleFr, roleEn)}</div>
        </div>
      </div>
    </div>
  );
}

export default function AProposPage() {
  const { t } = useLanguage();

  return (
    <div className={styles.page}>
      <Header />

      <section id="top" className={styles.hero}>
        <Image
          src="/images/broderie1-1024x683.jpg"
          alt="Broderie Ultramaille"
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
            <div className={`${styles.eyebrow} ${styles.eyebrowGold}`}>{t("— Notre entreprise", "— Our company")}</div>
            <h2 className={styles.entrepriseTitle}>
              {t(
                "Une entreprise experte du tricotage d'excellence.",
                "A company built on excellence in knitting.",
              )}
            </h2>
            <div className={styles.tagRow}>
              {[
                { fr: "Jauge 2.5 à 16", en: "Gauge 2.5 to 16" },
                { fr: "Tricot main", en: "Hand knitting" },
                { fr: "Crochet", en: "Crochet" },
                { fr: "Broderie", en: "Embroidery" },
                { fr: "Teinture écheveaux", en: "Skein dyeing" },
              ].map((tag) => (
                <span key={tag.fr} className={`${styles.tag} ${styles.tagLight}`}>
                  {t(tag.fr, tag.en)}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.textCol}>
            <p className={styles.paragraph}>
              {t(
                "Spécialistes de la maille depuis plus de 25 ans, nous sommes des tricoteurs situés à Antananarivo, à Madagascar. Tous nos vêtements sont tricotés sur des machines rectilignes manuelles et électroniques les plus performantes, de la jauge 2.5 à la jauge 16. Nous avons également un département entièrement dédié au savoir-faire main — tricot deux aiguilles, crochet, jusqu'à la plus élaborée technique de broderie, qui fait partie intégrante de la culture malgache.",
                "Knitwear specialists for over 25 years, we are knitters based in Antananarivo, Madagascar. All our garments are knitted on the most advanced manual and electronic flat-bed machines, from gauge 2.5 to gauge 16. We also run a department entirely dedicated to hand-craft know-how — two-needle knitting, crochet, through to the most elaborate embroidery techniques, an integral part of Malagasy culture.",
              )}
            </p>
            <p className={styles.paragraph}>
              {t(
                "Tous nos pulls sont remaillés, ce qui garantit une qualité dans la confection. Nous apportons également notre service de teinture, en écheveaux pour développer et teindre vos propres coloris à partir de la gamme Pantone reconnue par l'ensemble du monde du textile, ainsi qu'en plongée sur produit fini. Notre grande diversité de jauges nous permet un très large choix de propositions dans le développement de nos mailles — des plus créatives aux plus originales, sans oublier les intemporelles.",
                "All our sweaters are remeshed, guaranteeing quality in the making. We also provide our dyeing service, in skeins to develop and dye your own colours from the Pantone range recognised across the textile world, as well as dip dyeing on finished products. Our wide diversity of gauges allows a very broad choice of proposals in developing our knits — from the most creative to the most original, without forgetting the timeless.",
              )}
            </p>
            <p className={styles.paragraph}>
              {t(
                "Nous utilisons des matières de qualité auprès de filateurs provenant d'Italie, d'Europe, d'Afrique du Sud, d'Asie et de l'océan Indien. Notre volonté est d'accompagner nos clients du développement jusqu'à la production, en mettant en place les meilleures propositions qualitatives et créatives.",
                "We use quality materials sourced from spinners in Italy, Europe, South Africa, Asia and the Indian Ocean. Our ambition is to support our clients from development through to production, putting forward the best qualitative and creative proposals.",
              )}
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
                  {t("— Présence mondiale", "— Global presence")}
                </div>
                <h3 className={styles.mapTitle}>
                  {t(
                    "Des collections exportées sur quatre continents.",
                    "Collections exported across four continents.",
                  )}
                </h3>
              </div>
              <div className={styles.mapLegend}>
                <div className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: "#E0A338" }} />
                  <span className={styles.legendLabel}>{t("Marché principal", "Principal market")}</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: "#9c7a35" }} />
                  <span className={styles.legendLabel}>{t("Marchés secondaires", "Secondary markets")}</span>
                </div>
                <div className={styles.legendItem}>
                  <span
                    className={styles.legendDot}
                    style={{ background: "#F4EFE6", border: "2px solid #E0A338", boxSizing: "border-box" }}
                  />
                  <span className={styles.legendLabel}>
                    {t("Origine — Antananarivo", "Origin — Antananarivo")}
                  </span>
                </div>
              </div>
            </div>

            <WorldMap />

            <div className={styles.sourcingRow}>
              <span className={styles.sourcingLabel}>{t("Provenance des fils", "Yarn sourcing")}</span>
              {YARN_TAGS.map((tag) => {
                const label = typeof tag === "string" ? tag : t(tag.fr, tag.en);
                return (
                  <span key={label} className={`${styles.tag} ${styles.tagDark}`}>
                    {label}
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
                {t(
                  "Une maison d'exportation au service des plus grands noms.",
                  "An export house serving the most prestigious names.",
                )}
              </h2>
            </div>
            <div className={styles.marchesTextCol}>
              <p className={styles.paragraph}>
                {t(
                  "ULTRAMAILLE SA travaille essentiellement à l'exportation, en se concentrant sur ses produits finis de haute qualité. Nous avons le privilège de compter parmi nos clients certaines des marques françaises et italiennes les plus prestigieuses.",
                  "ULTRAMAILLE SA works essentially for export, concentrating on high-quality finished products. We have the privilege of counting among our clients some of the most prestigious French and Italian fashion brands.",
                )}
              </p>
              <p className={styles.paragraph}>
                {t(
                  "Aujourd'hui, l'Europe représente notre principal marché, absorbant la majeure partie de notre capacité annuelle de production. Nous collaborons également avec des clients aux États-Unis, en Afrique du Sud et dans l'océan Indien. La majorité de nos fils proviennent de filatures situées à proximité des sources de matières premières.",
                  "Today Europe is our principal market, absorbing the major part of our annual production capacity. We also collaborate with clients in the United States, South Africa and the Indian Ocean. The majority of our yarns come from spinning mills located close to the sources of raw materials.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="equipe" className={styles.equipe}>
        <div className={styles.sectionInner}>
          <div className={styles.equipeHead}>
            <div className={`${styles.eyebrow} ${styles.eyebrowGold}`}>{t("— Notre équipe", "— Our team")}</div>
            <h2 className={styles.equipeTitle}>
              {t(
                "Les femmes et les hommes derrière chaque maille.",
                "The people behind every stitch.",
              )}
            </h2>
          </div>

          <div className={styles.ceoCard}>
            <div className={styles.ceoImgWrap}>
              <Image
                src={`${IMG_BASE}2022/10/President-Directeur-General.jpg`}
                alt="Frédéric WYBO"
                fill
                sizes="300px"
                className={styles.ceoImg}
              />
            </div>
            <div>
              <div className={styles.ceoRole}>{t("Président Directeur Général", "Chairman & CEO")}</div>
              <div className={styles.ceoName}>Frédéric WYBO</div>
              <p className={styles.ceoText}>
                {t(
                  "À la tête d'Ultramaille, porteur d'un héritage familial et d'une exigence constante d'excellence textile depuis plus de 25 ans.",
                  "At the helm of Ultramaille, carrying a family heritage and a constant pursuit of textile excellence for over 25 years.",
                )}
              </p>
            </div>
          </div>

          <div className={styles.groupLabel}>{t("Directeurs", "Directors")}</div>
          <div className={styles.teamGridLarge}>
            {DIRECTEURS.map((m) => (
              <TeamCard key={m.name} {...m} size="large" />
            ))}
          </div>

          <div className={styles.groupLabel}>{t("Responsables", "Managers")}</div>
          <div className={styles.teamGridSmall}>
            {RESPONSABLES.map((m) => (
              <TeamCard key={m.name} {...m} size="small" />
            ))}
          </div>

          <div className={styles.groupLabel}>{t("Assistants", "Assistants")}</div>
          <div className={styles.teamGridSmall}>
            {ASSISTANTS.map((m) => (
              <TeamCard key={m.name} {...m} size="small" />
            ))}
          </div>
        </div>
      </section>

      <ContactCta />
      <Footer />
    </div>
  );
}
