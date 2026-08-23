"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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

const RESPONSABLE_POLES = [
  {
    poleFr: "Confection & Savoir-faire manuel",
    poleEn: "Craftsmanship & Manual Know-how",
    members: [
      { name: "Lantonirina RAKOTOARISOA", roleFr: "Responsable Broderie et Crochet Main", roleEn: "Embroidery & Hand Crochet Manager", img: `${IMG_BASE}2022/10/Lantonirina-RAKOTOARISOA.jpg` },
      { name: "Fanjaniaina RASOAZANANAIVO", roleFr: "Responsable Tricotage Manuel", roleEn: "Manual Knitting Manager", img: `${IMG_BASE}2022/10/Fanjaniaina-RASOAZANANAIVO-1.jpg` },
      { name: "Hasinavalona RAZAFINJATOVO", roleFr: "Responsable Remaillage et Stitching", roleEn: "Remeshing & Stitching Manager", img: `${IMG_BASE}2022/10/Hasinavalona-RAZAFINJATOVO.jpg` },
      { name: "Radonirina RASOLOFONIAINA", roleFr: "Responsable Packing", roleEn: "Packing Manager", img: `${IMG_BASE}2022/10/Radonirina-RASOLOFONIAINA.jpg` },
    ],
  },
  {
    poleFr: "Style & Merchandising",
    poleEn: "Style & Merchandising",
    members: [
      { name: "Luce RANAIVO", roleFr: "Merchandiser", roleEn: "Merchandiser", img: `${IMG_BASE}2022/10/Luce-RANAIVO-1.jpg` },
      { name: "Fitiavana RAMBELOTIANA", roleFr: "Merchandiser", roleEn: "Merchandiser", img: `${IMG_BASE}2022/10/Fitiavana-RAMBELOTIANA.jpg` },
      { name: "Joelle RASAMIMANANA", roleFr: "Merchandiser", roleEn: "Merchandiser", img: `${IMG_BASE}2024/04/Joelle-RASAMIMANANA-2023-09-25-ultramaille-NB-1.jpg` },
    ],
  },
  {
    poleFr: "Administration, Finance & Logistique",
    poleEn: "Administration, Finance & Logistics",
    members: [
      { name: "Miora RANDRIAHAINGO", roleFr: "Responsable de Trésorerie", roleEn: "Treasury Manager", img: `${IMG_BASE}2024/04/Miora-RANDRIAHAINGO-2023-09-25-ultramaille-NB-19.jpg` },
      { name: "Onitiana RATOVAHOAKA", roleFr: "Responsable Comptabilité", roleEn: "Accounting Manager", img: `${IMG_BASE}2024/04/Onitiana-RATOVAHOAKA-2023-09-25-ultramaille-NB-17-1.jpg` },
      { name: "Christian ANDRIAKOTOMALALA", roleFr: "Responsable Approvisionnement", roleEn: "Supply Manager", img: `${IMG_BASE}2022/10/Christian-ANDRIAKOTOMALALA.jpg` },
      { name: "Ranjanirina RABEMASO", roleFr: "Responsable Transit", roleEn: "Transit Manager", img: `${IMG_BASE}2022/10/Ranjanirina-RABEMASO-2023-09-25-ultramaille-NB-23-1.jpg` },
    ],
  },
  {
    poleFr: "Digital & IT",
    poleEn: "Digital & IT",
    members: [
      { name: "Tom WYBO", roleFr: "Chargé du Projet Digital", roleEn: "Digital Project Manager", img: `${IMG_BASE}2022/10/Tom-WYBO.jpg` },
      { name: "Christophe Ulysse OTONIA", roleFr: "Responsable Informatique et RSE", roleEn: "IT & CSR Manager", img: `${IMG_BASE}2022/10/Christophe-Ulysse-OTONIA.jpg` },
    ],
  },
  {
    poleFr: "Industriel & Technique",
    poleEn: "Industrial & Technical",
    members: [
      { name: "Gilbert RAJOELISON", roleFr: "Responsable Machine Électronique", roleEn: "Electronic Machine Manager", img: `${IMG_BASE}2022/10/Gilbert-RAJOELISON.jpg` },
    ],
  },
];

const ASSISTANTS = [
  { name: "Harilala RAZAFINDRAKOTO", roleFr: "Coordinatrice", roleEn: "Coordinator", img: `${IMG_BASE}2022/10/Harilala-RAZAFINDRAKOTO.jpg` },
  { name: "Dina RATSIMBAZAFY", roleFr: "Assistante Directrice de Confection", roleEn: "Assistant to Sewing Director", img: `${IMG_BASE}2022/10/Dina-RATSIMBAZAFY-1.jpg` },
];

const YARN_TAGS = ["Italie", { fr: "Europe", en: "Europe" }, { fr: "Asie", en: "Asia" }, { fr: "Afrique du Sud", en: "South Africa" }, { fr: "Océan Indien", en: "Indian Ocean" }];

const ORG_AVATAR_SIZE = {
  md: "112px",
  sm: "80px",
};

function OrgAvatar({
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
  size: "md" | "sm";
}) {
  const { t } = useLanguage();
  return (
    <div className={styles.orgCard}>
      <div className={`${styles.orgAvatarWrap} ${size === "md" ? styles.orgAvatarMd : styles.orgAvatarSm}`}>
        <Image src={img} alt={name} fill sizes={ORG_AVATAR_SIZE[size]} className={styles.orgAvatarImg} />
      </div>
      <div className={styles.orgName}>{name}</div>
      <div className={styles.orgRole}>{t(roleFr, roleEn)}</div>
    </div>
  );
}

function addOrgFan(
  cRect: DOMRect,
  rowEl: HTMLUListElement | null,
  nodeEls: (HTMLLIElement | null)[],
  paths: string[],
) {
  if (!rowEl) return;
  const nodes = nodeEls.filter((el): el is HTMLLIElement => el !== null);
  if (!nodes.length) return;

  const rowRect = rowEl.getBoundingClientRect();
  const sx = rowRect.left + rowRect.width / 2 - cRect.left;
  const sy = rowRect.top - cRect.top;
  const busY = Math.min(...nodes.map((el) => el.getBoundingClientRect().top - cRect.top));

  nodes.forEach((el) => {
    const r = el.getBoundingClientRect();
    const tx = r.left + r.width / 2 - cRect.left;
    const padTop = parseFloat(getComputedStyle(el).paddingTop) || 0;
    const ty = r.top - cRect.top + padTop;
    paths.push(`M ${sx} ${sy} V ${busY} H ${tx} V ${ty}`);
  });
}

export default function AProposPage() {
  const { t, lang } = useLanguage();

  const orgChartRef = useRef<HTMLDivElement>(null);
  const treeRef = useRef<HTMLUListElement>(null);
  const treeNodeRefs = useRef<(HTMLLIElement | null)[]>([]);
  const branchRowRefs = useRef<Map<string, HTMLUListElement>>(new Map());
  const branchNodeRefs = useRef<Map<string, (HTMLLIElement | null)[]>>(new Map());

  const [orgPaths, setOrgPaths] = useState<string[]>([]);
  const [orgViewBox, setOrgViewBox] = useState({ width: 0, height: 0 });

  const computeOrgPaths = useCallback(() => {
    const container = orgChartRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const paths: string[] = [];

    addOrgFan(cRect, treeRef.current, treeNodeRefs.current, paths);
    branchRowRefs.current.forEach((rowEl, key) => {
      addOrgFan(cRect, rowEl, branchNodeRefs.current.get(key) ?? [], paths);
    });

    setOrgPaths(paths);
    setOrgViewBox({ width: cRect.width, height: cRect.height });
  }, []);

  useEffect(() => {
    const container = orgChartRef.current;
    if (!container) return;

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(computeOrgPaths);
    };

    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(container);
    document.fonts?.ready?.then(schedule).catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [computeOrgPaths, lang]);

  return (
    <div className={styles.page}>
      <Header />

      <section id="top" className={styles.hero}>
        <Image
          src="https://res.cloudinary.com/wzetrnif/image/upload/v1785696846/broderie1-1024x683-ultramaille_kaelf8.jpg"
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
                "Spécialistes de la maille depuis plus de 25 ans, notre manufacture est basée à Antananarivo, à Madagascar. Pour donner vie à vos collections, nous combinons l'efficacité de machines rectilignes de pointe (manuelles et électroniques, de la jauge 2.5 à 16) et l'excellence d'un département entièrement dédié au savoir-faire fait main. Tricot à deux aiguilles, crochet et broderies élaborées : nous valorisons ces techniques artisanales d'exception qui font partie intégrante de la culture malgache.",
                "Knitwear specialists for over 25 years, our manufacture is based in Antananarivo, Madagascar. To bring your collections to life, we combine the efficiency of state-of-the-art flat-bed machines (manual and electronic, from gauge 2.5 to 16) with the excellence of a department entirely dedicated to hand-craft know-how. Two-needle knitting, crochet and elaborate embroidery: we champion these exceptional artisanal techniques that are an integral part of Malagasy culture.",
              )}
            </p>
            <p className={styles.paragraph}>
              {t(
                "L'exigence de qualité signe chacune de nos pièces : tous nos pulls sont intégralement remaillés, garantissant des finitions et une confection irréprochables. Notre service de teinture sur mesure s'adapte à tous vos projets, de la teinture en écheveaux sur base Pantone à la teinture en plongée sur produit fini. Cette maîtrise technique, alliée à notre grande diversité de jauges, nous permet de façonner une immense variété de mailles, des pièces les plus créatives et originales aux modèles les plus intemporels.",
                "A demand for quality defines every one of our pieces: all our sweaters are fully remeshed, guaranteeing flawless finishing and construction. We also offer a bespoke dyeing service, whether skein dyeing — to develop your own colours based on the universal Pantone reference — or dip dyeing on finished products. This technical mastery, combined with our wide diversity of gauges, allows us to craft an immense variety of knits, from the most creative and original pieces to the most timeless designs.",
              )}
            </p>
            <p className={styles.paragraph}>
              {t(
                "Nous sélectionnons des matières de premier choix auprès de filateurs rigoureusement choisis en Italie, en Europe, en Afrique du Sud, en Asie et dans l'océan Indien. Notre ambition est d'offrir un accompagnement de bout en bout, du développement initial jusqu'à la production finale, en plaçant toujours la créativité et la haute qualité au cœur de nos propositions.",
                "We select premium materials from carefully chosen spinners in Italy, Europe, South Africa, Asia and the Indian Ocean. Our ambition is to offer end-to-end support, from initial development through to final production, always placing creativity and high quality at the heart of our proposals.",
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
                    "Des collections exportées sur trois continents.",
                    "Collections exported across three continents.",
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

          <div className={styles.orgChart} ref={orgChartRef}>
            <svg
              className={styles.orgConnectors}
              width={orgViewBox.width}
              height={orgViewBox.height}
              viewBox={`0 0 ${orgViewBox.width} ${orgViewBox.height}`}
              aria-hidden="true"
            >
              {orgPaths.map((d, i) => (
                <g key={i}>
                  <path d={d} className={styles.orgConnectorBase} />
                  <path d={d} pathLength={100} className={styles.orgConnectorFlow} />
                </g>
              ))}
            </svg>

            <div className={styles.orgCeoNode}>
              <div className={`${styles.orgAvatarWrap} ${styles.orgAvatarLg}`}>
                <Image
                  src={`${IMG_BASE}2022/10/President-Directeur-General.jpg`}
                  alt="Frédéric WYBO"
                  fill
                  sizes="168px"
                  className={styles.orgAvatarImg}
                />
              </div>
              <div className={styles.orgName}>Frédéric WYBO</div>
              <div className={styles.orgRole}>{t("Président Directeur Général", "Chairman & CEO")}</div>
              <p className={styles.orgCeoText}>
                {t(
                  "Une direction portée par 25 ans d'héritage familial et un savoir-faire textile d'exception.",
                  "At the helm of Ultramaille, carrying a family heritage and a constant pursuit of textile excellence for over 25 years.",
                )}
              </p>
            </div>

            <ul ref={treeRef} className={styles.orgTree}>
              {DIRECTEURS.map((m, i) => (
                <li
                  key={m.name}
                  ref={(el) => {
                    treeNodeRefs.current[i] = el;
                  }}
                  className={styles.orgTreeNode}
                >
                  <OrgAvatar {...m} size="md" />
                </li>
              ))}
            </ul>

            <div className={styles.orgGroup}>
              <div className={styles.orgTrunk} />
              <div className={styles.orgGroupLabel}>{t("Responsables", "Managers")}</div>
              <div className={styles.orgPoleStack}>
                {RESPONSABLE_POLES.map((pole, pi) => {
                  const rowKey = `pole-${pi}`;
                  return (
                    <div key={pole.poleFr} className={styles.orgPole}>
                      <div className={styles.orgTrunk} />
                      <div className={styles.orgPoleLabel}>{t(pole.poleFr, pole.poleEn)}</div>
                      <ul
                        ref={(el) => {
                          if (el) branchRowRefs.current.set(rowKey, el);
                          else branchRowRefs.current.delete(rowKey);
                        }}
                        className={styles.orgBranch}
                      >
                        {pole.members.map((m, mi) => (
                          <li
                            key={m.name}
                            ref={(el) => {
                              const arr = branchNodeRefs.current.get(rowKey) ?? [];
                              arr[mi] = el;
                              branchNodeRefs.current.set(rowKey, arr);
                            }}
                            className={styles.orgBranchNode}
                          >
                            <OrgAvatar {...m} size="sm" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.orgGroup}>
              <div className={styles.orgTrunk} />
              <div className={styles.orgGroupLabel}>{t("Assistants", "Assistants")}</div>
              <ul
                ref={(el) => {
                  if (el) branchRowRefs.current.set("assistants", el);
                  else branchRowRefs.current.delete("assistants");
                }}
                className={styles.orgBranch}
              >
                {ASSISTANTS.map((m, mi) => (
                  <li
                    key={m.name}
                    ref={(el) => {
                      const arr = branchNodeRefs.current.get("assistants") ?? [];
                      arr[mi] = el;
                      branchNodeRefs.current.set("assistants", arr);
                    }}
                    className={styles.orgBranchNode}
                  >
                    <OrgAvatar {...m} size="sm" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ContactCta />
      <Footer />
    </div>
  );
}
