import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactCta from "@/components/ContactCta";
import CountUp from "@/components/CountUp";
import RevealOnScroll from "@/components/RevealOnScroll";
import StitchedQuote from "@/components/StitchedQuote";
import T from "@/components/T";
import styles from "./page.module.css";

const MEDECIN_IMG = "https://res.cloudinary.com/wzetrnif/image/upload/v1787855681/ultramaille-medecin_di2ymt.webp";
const HERO_IMG = "https://res.cloudinary.com/wzetrnif/image/upload/v1787855471/ultramaille-cabinet-medical_mgffws.webp";

const ENV_TAGS = [
  { fr: "Fibres naturelles", en: "Natural fibres" },
  { fr: "Producteurs locaux", en: "Local producers" },
  { fr: "Station d'épuration", en: "Purification plant" },
  { fr: "CO₂ réduit", en: "Reduced CO₂" },
];

export default function NotreEngagementPage() {
  return (
    <div className={styles.page}>
      <Header />

      <section id="top" className={styles.hero}>
        <Image
          src={HERO_IMG}
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
              <div className={`${styles.eyebrow} ${styles.eyebrowBlue}`}>
                <T fr="— Madagascar" en="— Madagascar" />
              </div>
              <h2 className={`${styles.title} ${styles.titleLight}`}>
                <T
                  fr="Madagascar : Investir dans l'emploi stable et déclaré"
                  en="Madagascar: Investing in stable, declared employment"
                />
              </h2>
            </div>
            <div className={styles.headText}>
              <p>
                <T
                  fr="Sur une île de 31 millions d'habitants où 500 000 jeunes intègrent le marché du travail chaque année, le véritable enjeu n'est pas seulement de travailler, mais de travailler dignement."
                  en="On an island of 31 million people where 500,000 young people enter the job market every year, the real challenge isn't just finding work, but working with dignity."
                />
              </p>
              <p>
                <T
                  fr="Aujourd'hui, plus de 90 % des Malgaches évoluent dans l'économie informelle, sans contrat, sans salaire garanti ni protection en cas d'accident ou de maladie."
                  en="Today, more than 90% of Malagasy people work in the informal economy, without a contract, without a guaranteed salary, and without protection in case of accident or illness."
                />
              </p>
              <p>
                <T
                  fr="En confiant votre production à Ultramaille, vous faites un choix engagé : celui d'un partenariat Nord-Sud équitable qui transforme l'artisanat et l'industrie en emplois formels, pérennes et déclarés. Vous contribuez directement à offrir à nos ouvriers et artisans une vraie sécurité de vie et un avenir constructif."
                  en="By entrusting your production to Ultramaille, you're making a committed choice: a fair North–South partnership that turns craftsmanship and industry into formal, lasting, declared jobs. You directly help give our workers and artisans real security and a constructive future."
                />
              </p>
            </div>
          </div>
          <div className={styles.statGrid3}>
            <div className={styles.statCellLight}>
              <div className={styles.statValueLight}>
                <CountUp end={31} />
                <span className={styles.statUnit}>M</span>
              </div>
              <div className={styles.statLabelLight}>
                <T fr="d'habitants" en="people" />
              </div>
            </div>
            <div className={styles.statCellLight}>
              <div className={styles.statValueLight}>
                &gt;<CountUp end={90} />
                <span className={styles.statUnit}>%</span>
              </div>
              <div className={styles.statLabelLight}>
                <T
                  fr="d'emplois informels à Madagascar (absence de protection sociale)"
                  en="informal jobs in Madagascar (no social protection)"
                />
              </div>
            </div>
            <div className={styles.statCellLight}>
              <div className={`${styles.statValueLight} ${styles.statValueGold}`}>
                <CountUp end={100} />
                <span className={styles.statUnit}>%</span>
              </div>
              <div className={styles.statLabelLight}>
                <T
                  fr="d'emplois stables, déclarés et accompagnés chez Ultramaille"
                  en="stable, declared and supported jobs at Ultramaille"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.humain}>
        <div className={styles.sectionInner}>
          <div className={styles.humainGrid}>
            <div>
              <div className={`${styles.eyebrow} ${styles.eyebrowGold}`}>
                <T fr="— L'humain d'abord" en="— People first" />
              </div>
              <h2 className={`${styles.title} ${styles.titleDark}`}>
                <T
                  fr="La santé et la sécurité au cœur de notre atelier."
                  en="Health and safety at the heart of our workshop."
                />
              </h2>
              <p className={`${styles.paragraph} ${styles.paragraphDark}`}>
                <T
                  fr="Garantir des conditions de travail dignes, c'est veiller activement sur la santé de nos équipes. En plus des contrats déclarés et de la couverture sociale, nous avons fait le choix d'intégrer la médecine directement au sein de notre usine."
                  en="Guaranteeing decent working conditions means actively watching over the health of our teams. In addition to declared contracts and social coverage, we chose to bring medical care directly into our factory."
                />
              </p>
              <p className={`${styles.paragraph} ${styles.paragraphDark}`}>
                <T
                  fr="Notre infirmerie accueille nos équipes 8 heures par jour pour des consultations gratuites, un suivi régulier et des soins immédiats assurés par notre médecin et notre infirmière."
                  en="Our infirmary welcomes our teams 8 hours a day for free consultations, regular check-ups and immediate care provided by our doctor and our nurse."
                />
              </p>
            </div>
            <div className={styles.humainImgWrap}>
              <Image src={MEDECIN_IMG} alt="Cabinet médical Ultramaille" fill className={styles.humainImg} />
              <RevealOnScroll className={styles.humainBadge}>
                <div className={styles.humainBadgeValue}>
                  8h<span className={styles.humainBadgeUnit}>/jour</span>
                </div>
                <div className={styles.humainBadgeLabel}>
                  <T fr="médecin & infirmerie sur site" en="on-site doctor & infirmary" />
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.rse}>
        <div className={styles.sectionInner}>
          <div className={styles.rseHead}>
            <div>
              <div className={`${styles.eyebrow} ${styles.eyebrowBlue}`}>
                <T fr="— Responsabilité sociale" en="— Social responsibility" />
              </div>
              <h2 className={`${styles.title} ${styles.titleLight}`}>
                <T fr="Une entreprise auditée, engagée dans la RSE." en="Audited, and committed to CSR." />
              </h2>
            </div>
            <p className={styles.rseHeadText}>
              <T
                fr="Des organismes tels que FSSI, SGS et SEDEX ont mené des audits : tous confirment qu'Ultramaille respecte scrupuleusement les droits sociaux de son personnel et l'ensemble des normes de sécurité."
                en="Bodies such as FSSI, SGS and SEDEX have carried out audits — all confirm that Ultramaille scrupulously respects its staff's social rights and every safety standard."
              />
            </p>
          </div>
          <div className={styles.cardGrid3}>
            <RevealOnScroll className={styles.rseCard}>
              <div className={styles.iconBadge}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C68A2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                  <path d="M7 2v20" />
                  <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                </svg>
              </div>
              <div className={styles.rseValue}>~250&#8239;000</div>
              <h3 className={styles.rseCardTitle}>
                <T fr="repas servis par an" en="meals served each year" />
              </h3>
              <p className={styles.rseCardText}>
                <T
                  fr="Ultramaille offre le repas de midi à l'ensemble de son personnel, chaque jour."
                  en="Ultramaille provides a midday meal to all its staff, every single day."
                />
              </p>
            </RevealOnScroll>
            <RevealOnScroll className={styles.rseCard} delay={150}>
              <div className={styles.iconBadge}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C68A2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 12H3" />
                  <path d="M16 6H3" />
                  <path d="M16 18H3" />
                  <path d="m18 9 3 3-3 3" />
                </svg>
              </div>
              <div className={styles.rseValue}>
                2<span className={styles.rseValueUnit}><T fr="menus" en="menus" /></span>
              </div>
              <h3 className={styles.rseCardTitle}>
                <T fr="au choix chaque jour" en="a daily choice" />
              </h3>
              <p className={styles.rseCardText}>
                <T
                  fr="Préparés par un traiteur externe, avec le choix entre deux menus différents chaque jour."
                  en="Prepared by an external caterer, with a choice between two different menus each day."
                />
              </p>
            </RevealOnScroll>
            <RevealOnScroll className={styles.rseCard} delay={300}>
              <div className={styles.iconBadge}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C68A2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <div className={styles.rseValue}>
                <T fr="Continue" en="Ongoing" />
              </div>
              <h3 className={styles.rseCardTitle}>
                <T fr="formation interne" en="internal training" />
              </h3>
              <p className={styles.rseCardText}>
                <T
                  fr="Ultramaille organise régulièrement des formations internes pour ses ouvriers comme pour ses cadres."
                  en="Ultramaille regularly runs internal training for both its workers and its managers."
                />
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className={styles.environnement}>
        <div className={styles.sectionInner}>
          <div className={styles.environnementGrid}>
            <div>
              <div className={`${styles.eyebrow} ${styles.eyebrowGold}`}>
                <T fr="— Environnement" en="— Environment" />
              </div>
              <h2 className={`${styles.title} ${styles.titleDark}`}>
                <T
                  fr="Particulièrement attentifs à la protection de la nature."
                  en="Especially attentive to protecting nature."
                />
              </h2>
              <p className={`${styles.paragraph} ${styles.paragraphDark}`}>
                <T
                  fr="Très attaché au développement durable, Ultramaille aime tricoter les fibres naturelles et privilégie les producteurs locaux pour éviter les transports polluants. Pour produire la vapeur nécessaire à la teinture et au repassage, nous brûlons des déchets de bois issus de l'industrie locale du meuble et des branches d'eucalyptus, un arbre qui pousse abondamment à Madagascar."
                  en="Deeply committed to sustainable development, Ultramaille loves knitting natural fibres and favours local producers to avoid polluting transport. To produce the steam needed for dyeing and pressing, we burn wood waste from the local furniture industry and eucalyptus branches — a tree that grows abundantly in Madagascar."
                />
              </p>
              <p className={`${styles.paragraph} ${styles.paragraphDark}`}>
                <T
                  fr="L'eau prélevée pour le lavage, la teinture et la finition est retraitée dans notre propre station d'épuration, puis rendue propre à la nature. Les boues sont incinérées à haute température, et nos rejets de CO₂ sont réduits au strict minimum."
                  en="Water drawn for washing, dyeing and finishing is treated in our own purification plant, then returned clean to nature. Sludge is incinerated at high temperature, and our CO₂ emissions are cut to the strict minimum."
                />
              </p>
              <div className={styles.tagRow}>
                {ENV_TAGS.map((tag) => (
                  <span key={tag.fr} className={styles.tag}>
                    <T fr={tag.fr} en={tag.en} />
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.envImgGrid}>
              <div className={styles.envImgCell}>
                <Image
                  src="https://res.cloudinary.com/wzetrnif/image/upload/v1787857484/1-purification-lavage-ultramaille-1024x683_ktvxw4.webp"
                  alt="Station de purification Ultramaille"
                  fill
                  className={styles.envImg}
                />
              </div>
              <div className={styles.envImgCell}>
                <Image
                  src="https://res.cloudinary.com/wzetrnif/image/upload/v1787857485/3-purification-ultramaille-1024x683_wdwmrd.webp"
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
                src="https://res.cloudinary.com/wzetrnif/image/upload/v1787855783/education-tous-droit-reussir-ultramaille_utlb30.webp"
                alt="Éducation — Ultramaille"
                fill
                className={styles.communauteImg}
              />
              <RevealOnScroll className={styles.humainBadge}>
                <div className={styles.humainBadgeValue}>800+</div>
                <div className={styles.humainBadgeLabel}>
                  <T fr="emplois au service de la communauté" en="jobs supporting the community" />
                </div>
              </RevealOnScroll>
            </div>
            <div>
              <div className={`${styles.eyebrow} ${styles.eyebrowBlue}`}>
                <T fr="— Soutenir notre communauté" en="— Supporting our community" />
              </div>
              <h2 className={`${styles.title} ${styles.titleLight}`}>
                <T
                  fr="Derrière chaque emploi, une famille et un avenir."
                  en="Behind every job, a family and a future."
                />
              </h2>
              <p className={`${styles.paragraph} ${styles.paragraphLight}`}>
                <T
                  fr="Chez Ultramaille, nous savons que notre impact ne s'arrête pas aux portes de l'usine. Derrière chacun de nos 800 collaborateurs, il y a une famille, des enfants et tout un tissu local qui dépend de la stabilité de leur revenu."
                  en="At Ultramaille, we know our impact doesn't stop at the factory doors. Behind each of our 800 employees, there is a family, children and a whole local fabric that depends on the stability of their income."
                />
              </p>
              <p className={`${styles.paragraph} ${styles.paragraphLight}`}>
                <T
                  fr="Soutenir notre communauté, c'est s'engager concrètement au quotidien : en garantissant des salaires réguliers, mais aussi en accompagnant les familles et en finançant des actions locales, notamment dans l'éducation."
                  en="Supporting our community means taking concrete action every day: guaranteeing regular salaries, but also supporting families and funding local initiatives, particularly in education."
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.education}>
        <div className={styles.educationGrid} />
        <div className={styles.educationInner}>
          <blockquote className={styles.quote}>
            <StitchedQuote
              labelFr="« La plus petite des graines peut contenir le plus grand des arbres. »"
              labelEn="“The smallest of seeds can hold the tallest of trees.”"
            />
          </blockquote>
        </div>
      </section>

      <ContactCta />
      <Footer />
    </div>
  );
}
