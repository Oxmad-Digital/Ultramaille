"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import styles from "@/app/a-propos/page.module.css";

const DIRECTEURS = [
  { name: "Patricia WALLE", roleFr: "Directrice de Confection", roleEn: "Clothing Director", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849622/Patricia-WALLE-1_syxycn.webp" },
  { name: "Zoltan BIRO", roleFr: "Directeur Industriel", roleEn: "Industrial Director", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849625/Zoltan-BIRO_chilyy.webp" },
  { name: "Pascalle WYBO", roleFr: "Directrice Style & Relations Clients", roleEn: "Style & Client Relations Director", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849239/ultramaille-pascal-wybo_btnyn1.webp" },
  { name: "Marc BOULNOIS", roleFr: "Directeur Administratif et Financier", roleEn: "Administrative & Financial Director", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849619/Marc-BOULNOIS_bncc3b.webp" },
  { name: "RAKOTOMALALA Hary", roleFr: "Directeur Administratif et Financier", roleEn: "Administrative & Financial Director", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849623/RAKOTOMALALA-Hary_bbwdo7.webp" },
  { name: "Mamy RANAIVOSON", roleFr: "Directeur Technique", roleEn: "Technical Director", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849619/Mamy-RANAIVOSON-1_c3lmv3.webp" },
];

const RESPONSABLE_POLES = [
  {
    poleFr: "Confection & Savoir-faire manuel",
    poleEn: "Craftsmanship & Manual Know-how",
    members: [
      { name: "Lantonirina RAKOTOARISOA", roleFr: "Responsable Broderie et Crochet Main", roleEn: "Embroidery & Hand Crochet Manager", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849617/Lantonirina-RAKOTOARISOA_uwo1sg.webp" },
      { name: "Fanjaniaina RASOAZANANAIVO", roleFr: "Responsable Tricotage Manuel", roleEn: "Manual Knitting Manager", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849613/Fanjaniaina-RASOAZANANAIVO-1_c0ebkb.webp" },
      { name: "Hasinavalona RAZAFINJATOVO", roleFr: "Responsable Remaillage et Stitching", roleEn: "Remeshing & Stitching Manager", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849616/Hasinavalona-RAZAFINJATOVO_jfmou6.webp" },
      { name: "Radonirina RASOLOFONIAINA", roleFr: "Responsable Packing", roleEn: "Packing Manager", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849622/Radonirina-RASOLOFONIAINA_sngdke.webp" },
    ],
  },
  {
    poleFr: "Style & Merchandising",
    poleEn: "Style & Merchandising",
    members: [
      { name: "Luce RANAIVO", roleFr: "Merchandiser", roleEn: "Merchandiser", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849618/Luce-RANAIVO-1_miozim.webp" },
      { name: "Fitiavana RAMBELOTIANA", roleFr: "Merchandiser", roleEn: "Merchandiser", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849614/Fitiavana-RAMBELOTIANA_w6jguu.webp" },
      { name: "Joelle RASAMIMANANA", roleFr: "Merchandiser", roleEn: "Merchandiser", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849616/Joelle-RASAMIMANANA-2023-09-25-ultramaille-NB-1_uhrfvm.webp" },
    ],
  },
  {
    poleFr: "Administration, Finance & Logistique",
    poleEn: "Administration, Finance & Logistics",
    members: [
      { name: "Miora RANDRIAHAINGO", roleFr: "Responsable de Trésorerie", roleEn: "Treasury Manager", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849620/Miora-RANDRIAHAINGO-2023-09-25-ultramaille-NB-19_xfkwq7.webp" },
      { name: "Onitiana RATOVAHOAKA", roleFr: "Responsable Comptabilité", roleEn: "Accounting Manager", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849621/Onitiana-RATOVAHOAKA-2023-09-25-ultramaille-NB-17-1_asbruk.webp" },
      { name: "Christian ANDRIAKOTOMALALA", roleFr: "Responsable Approvisionnement", roleEn: "Supply Manager", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849612/Christian-ANDRIAKOTOMALALA_fre0a5.webp" },
      { name: "Ranjanirina RABEMASO", roleFr: "Responsable Transit", roleEn: "Transit Manager", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849624/Ranjanirina-RABEMASO-2023-09-25-ultramaille-NB-23-1_qzaghq.webp" },
    ],
  },
  {
    poleFr: "Digital & IT",
    poleEn: "Digital & IT",
    members: [
      { name: "Tom WYBO", roleFr: "Chargé du Projet Digital", roleEn: "Digital Project Manager", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849239/ultramaille-tom-wybo_lupzbh.webp" },
      { name: "Christophe Ulysse OTONIA", roleFr: "Responsable Informatique et RSE", roleEn: "IT & CSR Manager", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849612/Christophe-Ulysse-OTONIA_rxmnjp.webp" },
    ],
  },
  {
    poleFr: "Industriel & Technique",
    poleEn: "Industrial & Technical",
    members: [
      { name: "Gilbert RAJOELISON", roleFr: "Responsable Machine Électronique", roleEn: "Electronic Machine Manager", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849614/Gilbert-RAJOELISON_nzrzjv.webp" },
    ],
  },
];

const ASSISTANTS = [
  { name: "Harilala RAZAFINDRAKOTO", roleFr: "Coordinatrice", roleEn: "Coordinator", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849615/Harilala-RAZAFINDRAKOTO_pxnkzr.webp" },
  { name: "Dina RATSIMBAZAFY", roleFr: "Assistante Directrice de Confection", roleEn: "Assistant to Sewing Director", img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787849612/Dina-RATSIMBAZAFY-1_urizqk.webp" },
];

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

export default function OrgChart() {
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
            src="https://res.cloudinary.com/wzetrnif/image/upload/v1787849239/ultramaille-frederic-wybo_jyxtbb.webp"
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
  );
}
