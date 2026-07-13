"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactCta from "@/components/ContactCta";
import { useLanguage } from "@/lib/language-context";
import styles from "./page.module.css";

const IMG_BASE = "https://www.ultramaille.com/wp-content/uploads/";
const MEDECIN_IMG = `${IMG_BASE}2022/10/ultramaille-medecin.jpg`;

export default function NotreEngagementPage() {
  const { t } = useLanguage();

  return (
    <div className={styles.page}>
      <Header />

      <section id="top" className={styles.hero}>
        <Image
          src={MEDECIN_IMG}
          alt="Cabinet médical Ultramaille"
          fill
          priority
          className={styles.heroImg}
        />
        <div className={styles.heroGradient} />
        <div className={styles.heroGrid} />
      </section>

      <section className={styles.contexte}>
        <div className={styles.sectionInner}>
          <div className={styles.contexteHead}>
            <div>
              <div className={`${styles.eyebrow} ${styles.eyebrowBlue}`}>{t("— Madagascar", "— Madagascar")}</div>
              <h2 className={`${styles.title} ${styles.titleLight}`}>
                {t(
                  "Faire travailler les Malgaches, c'est investir dans le pays.",
                  "Giving work to Malagasy people means investing in the country.",
                )}
              </h2>
            </div>
            <p className={styles.headText}>
              {t(
                "Madagascar est une île aussi grande que la France et le Benelux réunis, peuplée de 18,7 millions d'habitants, et fait partie des dix pays les plus pauvres de la planète. En favorisant l'échange Nord-Sud, vous nous aidez à améliorer le niveau de vie des ouvriers qui façonnent pour vous.",
                "Madagascar is an island as large as France and Benelux combined, home to 18.7 million people, and one of the ten poorest countries on the planet. By favouring North–South exchange, you help us raise the standard of living of the workers who craft for you.",
              )}
            </p>
          </div>
          <div className={styles.statGrid3}>
            <div className={styles.statCellLight}>
              <div className={styles.statValueLight}>
                18,7<span className={styles.statUnit}>M</span>
              </div>
              <div className={styles.statLabelLight}>{t("habitants à Madagascar", "people living in Madagascar")}</div>
            </div>
            <div className={styles.statCellLight}>
              <div className={styles.statValueLight}>600&#8239;000</div>
              <div className={styles.statLabelLight}>
                {t("emplois salariés, dont 200 000 publics", "salaried jobs in the country, 200,000 of them public")}
              </div>
            </div>
            <div className={styles.statCellLight}>
              <div className={`${styles.statValueLight} ${styles.statValueGold}`}>700&#8239;000</div>
              <div className={styles.statLabelLight}>
                {t("jeunes sur le marché du travail / an", "young people entering the job market every year")}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.humain}>
        <div className={styles.sectionInner}>
          <div className={styles.humainGrid}>
            <div>
              <div className={`${styles.eyebrow} ${styles.eyebrowGold}`}>{t("— L'humain d'abord", "— People first")}</div>
              <h2 className={`${styles.title} ${styles.titleDark}`}>
                {t("Toute notre équipe dirigeante vit à Madagascar.", "Our entire management team lives in Madagascar.")}
              </h2>
              <p className={`${styles.paragraph} ${styles.paragraphDark}`}>
                {t(
                  "Nous partageons tous la même passion pour ce pays magnifique. Chaque employé bénéficie d'un contrat de travail donnant accès à une couverture sociale complète : accident du travail, assurance maladie, congé de maternité, congés payés et retraite — et un accès facilité aux hôpitaux.",
                  "We all share the same passion for this magnificent country. Every employee has an employment contract granting full social coverage: workplace accident, health insurance, maternity leave, paid holidays and pension — and easier access to hospitals.",
                )}
              </p>
              <p className={`${styles.paragraph} ${styles.paragraphDark}`}>
                {t(
                  "Un médecin est à disposition du personnel chaque jour, huit heures durant, dans l'infirmerie d'Ultramaille, où il est assisté d'Émilie, notre infirmière.",
                  "A doctor is available to staff every day, eight hours a day, in the Ultramaille infirmary, assisted by Émilie, our nurse.",
                )}
              </p>
            </div>
            <div className={styles.humainImgWrap}>
              <Image src={MEDECIN_IMG} alt="Cabinet médical Ultramaille" fill className={styles.humainImg} />
              <div className={styles.humainBadge}>
                <div className={styles.humainBadgeValue}>
                  8h<span className={styles.humainBadgeUnit}>/jour</span>
                </div>
                <div className={styles.humainBadgeLabel}>
                  {t("médecin & infirmerie sur site", "on-site doctor & infirmary")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.rse}>
        <div className={styles.sectionInner}>
          <div className={styles.rseHead}>
            <div>
              <div className={`${styles.eyebrow} ${styles.eyebrowBlue}`}>
                {t("— Responsabilité sociale", "— Social responsibility")}
              </div>
              <h2 className={`${styles.title} ${styles.titleLight}`}>
                {t("Une entreprise auditée, engagée dans la RSE.", "Audited, and committed to CSR.")}
              </h2>
            </div>
            <p className={styles.rseHeadText}>
              {t(
                "Des organismes tels que FSSI, SGS et SEDEX ont mené des audits : tous confirment qu'Ultramaille respecte scrupuleusement les droits sociaux de son personnel et l'ensemble des normes de sécurité.",
                "Bodies such as FSSI, SGS and SEDEX have carried out audits — all confirm that Ultramaille scrupulously respects its staff's social rights and every safety standard.",
              )}
            </p>
          </div>
          <div className={styles.cardGrid3}>
            <div className={styles.rseCard}>
              <div className={styles.iconBadge}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C68A2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                  <path d="M7 2v20" />
                  <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                </svg>
              </div>
              <div className={styles.rseValue}>~250&#8239;000</div>
              <h3 className={styles.rseCardTitle}>{t("repas servis par an", "meals served each year")}</h3>
              <p className={styles.rseCardText}>
                {t(
                  "Ultramaille offre le repas de midi à l'ensemble de son personnel, chaque jour.",
                  "Ultramaille provides a midday meal to all its staff, every single day.",
                )}
              </p>
            </div>
            <div className={styles.rseCard}>
              <div className={styles.iconBadge}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C68A2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 12H3" />
                  <path d="M16 6H3" />
                  <path d="M16 18H3" />
                  <path d="m18 9 3 3-3 3" />
                </svg>
              </div>
              <div className={styles.rseValue}>
                2<span className={styles.rseValueUnit}>{t("menus", "menus")}</span>
              </div>
              <h3 className={styles.rseCardTitle}>{t("au choix chaque jour", "a daily choice")}</h3>
              <p className={styles.rseCardText}>
                {t(
                  "Préparés par un traiteur externe, avec le choix entre deux menus différents chaque jour.",
                  "Prepared by an external caterer, with a choice between two different menus each day.",
                )}
              </p>
            </div>
            <div className={styles.rseCard}>
              <div className={styles.iconBadge}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C68A2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <div className={styles.rseValue}>{t("Continue", "Ongoing")}</div>
              <h3 className={styles.rseCardTitle}>{t("formation interne", "internal training")}</h3>
              <p className={styles.rseCardText}>
                {t(
                  "Ultramaille organise régulièrement des formations internes pour ses ouvriers comme pour ses cadres.",
                  "Ultramaille regularly runs internal training for both its workers and its managers.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.environnement}>
        <div className={styles.sectionInner}>
          <div className={styles.environnementGrid}>
            <div>
              <div className={`${styles.eyebrow} ${styles.eyebrowGold}`}>{t("— Environnement", "— Environment")}</div>
              <h2 className={`${styles.title} ${styles.titleDark}`}>
                {t("Particulièrement attentifs à la protection de la nature.", "Especially attentive to protecting nature.")}
              </h2>
              <p className={`${styles.paragraph} ${styles.paragraphDark}`}>
                {t(
                  "Très attaché au développement durable, Ultramaille aime tricoter les fibres naturelles et privilégie les producteurs locaux pour éviter les transports polluants. Pour produire la vapeur nécessaire à la teinture et au repassage, nous brûlons des déchets de bois issus de l'industrie locale du meuble et des branches d'eucalyptus — un arbre qui pousse abondamment à Madagascar.",
                  "Deeply committed to sustainable development, Ultramaille loves knitting natural fibres and favours local producers to avoid polluting transport. To produce the steam needed for dyeing and pressing, we burn wood waste from the local furniture industry and eucalyptus branches — a tree that grows abundantly in Madagascar.",
                )}
              </p>
              <p className={`${styles.paragraph} ${styles.paragraphDark}`}>
                {t(
                  "L'eau prélevée pour le lavage, la teinture et la finition est retraitée dans notre propre station d'épuration, puis rendue propre à la nature. Les boues sont incinérées à haute température, et nos rejets de CO₂ sont réduits au strict minimum.",
                  "Water drawn for washing, dyeing and finishing is treated in our own purification plant, then returned clean to nature. Sludge is incinerated at high temperature, and our CO₂ emissions are cut to the strict minimum.",
                )}
              </p>
              <div className={styles.tagRow}>
                {[
                  { fr: "Fibres naturelles", en: "Natural fibres" },
                  { fr: "Producteurs locaux", en: "Local producers" },
                  { fr: "Vapeur renouvelable", en: "Renewable steam" },
                  { fr: "Station d'épuration", en: "Purification plant" },
                  { fr: "CO₂ réduit", en: "Reduced CO₂" },
                ].map((tag) => (
                  <span key={tag.fr} className={styles.tag}>
                    {t(tag.fr, tag.en)}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.envImgGrid}>
              <div className={styles.envImgCell}>
                <Image
                  src={`${IMG_BASE}2017/05/1-purification-lavage-ultramaille-1024x683.jpg`}
                  alt="Station de purification Ultramaille"
                  fill
                  className={styles.envImg}
                />
              </div>
              <div className={styles.envImgCell}>
                <Image
                  src={`${IMG_BASE}2017/05/3-purification-ultramaille-1024x683.jpg`}
                  alt="Traitement de l'eau Ultramaille"
                  fill
                  className={styles.envImg}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.communaute}>
        <div className={styles.sectionInner}>
          <div className={styles.communauteGrid}>
            <div className={styles.communauteImgWrap}>
              <Image
                src={`${IMG_BASE}2022/10/education-tous-droit-reussir-1024x683.jpg`}
                alt="Éducation — Ultramaille"
                fill
                className={styles.communauteImg}
              />
              <div className={styles.humainBadge}>
                <div className={styles.humainBadgeValue}>800+</div>
                <div className={styles.humainBadgeLabel}>
                  {t("emplois au service de la communauté", "jobs supporting the community")}
                </div>
              </div>
            </div>
            <div>
              <div className={`${styles.eyebrow} ${styles.eyebrowBlue}`}>
                {t("— Soutenir notre communauté", "— Supporting our community")}
              </div>
              <h2 className={`${styles.title} ${styles.titleLight}`}>
                {t("Tisser des liens forts avec la communauté.", "Weaving strong ties with the community.")}
              </h2>
              <p className={styles.paragraphLight}>
                {t(
                  "Née de la volonté de valoriser les compétences locales, Ultramaille a, dès l'origine, intégré le développement durable à son modèle économique. Au-delà de plus de 800 emplois, l'entreprise participe activement à l'amélioration de la vie sociale de ses concitoyens.",
                  "Born from a desire to develop local skills, Ultramaille has integrated sustainable development into its business model from the very start. Beyond providing more than 800 jobs, the company actively contributes to improving the social life of its fellow citizens.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.education}>
        <div className={styles.educationGrid} />
        <div className={styles.educationInner}>
          <div className={`${styles.eyebrow} ${styles.eyebrowGold}`}>{t("— L'éducation", "— Education")}</div>
          <blockquote className={styles.quote}>
            {t(
              "« La plus petite des graines peut contenir le plus grand des arbres. »",
              "“The smallest of seeds can hold the tallest of trees.”",
            )}
          </blockquote>
          <p className={styles.quoteText}>
            {t(
              "L'éducation est le socle de l'Homme — une lumière qui guide chacun dans sa vie, personnelle comme professionnelle. Elle demeure un défi permanent pour Madagascar, et un engagement de tous les instants pour Ultramaille.",
              "Education is the foundation of every person — a light that guides each of us through life, both personal and professional. It remains an ongoing challenge for Madagascar, and a constant commitment for Ultramaille.",
            )}
          </p>
        </div>
      </section>

      <ContactCta />
      <Footer />
    </div>
  );
}
