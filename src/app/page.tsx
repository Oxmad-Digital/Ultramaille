import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactCta from "@/components/ContactCta";
import CountUp from "@/components/CountUp";
import RevealOnScroll from "@/components/RevealOnScroll";
import T from "@/components/T";
import styles from "./page.module.css";

const CRAFT_CARDS = [
  {
    number: "01",
    img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787846211/tricotage-ultramaille-1_omlcpa.webp",
    alt: "Tricotage",
    titleFr: "Tricotage & maille fine",
    titleEn: "Knitting & fine gauge",
    textFr: "Jacquard, intarsia et remaillage sur les jauges les plus fines.",
    textEn: "Jacquard, intarsia and remeshing on the most advanced gauges.",
  },
  {
    number: "02",
    img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787847770/Broderie-crochet-ultramaille_ah5g5h.webp",
    alt: "Crochet",
    titleFr: "Crochet main & macramé",
    titleEn: "Hand crochet & macramé",
    textFr: "Des pièces entièrement travaillées à la main, signature d'un savoir-faire artisanal.",
    textEn: "Entirely hand-worked pieces, the signature of true artisanal know-how.",
  },
  {
    number: "03",
    img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787846457/broderie1-1024x683-ultramaille_kaelf_vbywpe.webp",
    alt: "Broderie",
    titleFr: "Broderie d'exception",
    titleEn: "Fine embroidery",
    textFr: "Broderie main et machine, ainsi que l'impression, maîtrisées en interne.",
    textEn: "Hand and machine embroidery, plus print, mastered in-house.",
  },
  {
    number: "04",
    img: "https://res.cloudinary.com/wzetrnif/image/upload/v1787843400/pressing-ultramaille-3_b127mz.webp",
    alt: "Teinture et finitions",
    titleFr: "Teinture & finitions",
    titleEn: "Dyeing & finishing",
    textFr: "Teinture du fil et teinture en plongée, pressing et contrôle qualité intégrés.",
    textEn: "In-house yarn and dip dyeing, pressing and quality control.",
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />

      <section id="top" className={styles.hero}>
        <Image
          src="https://res.cloudinary.com/wzetrnif/image/upload/v1787844955/ultramaille-machines-electroniques_vcjn4e.webp"
          alt="Atelier de tricotage électronique Ultramaille"
          fill
          priority
          className={styles.heroImg}
        />
        <div className={styles.heroGradient} />
        <div className={styles.heroGrid} />
        <div className={styles.heroContent}>
          <div className={styles.heroCenter}>
            <h1 className={styles.heroTitle}>Ultramaille</h1>
            <p className={styles.heroSubtitle}>
              <T fr="Une maille d'exception, " en="Exceptional knitwear, " />
              <span className={styles.heroSubtitleAccent}>
                <T fr="façonnée à Madagascar." en="crafted in Madagascar." />
              </span>
            </p>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>
                <CountUp end={25} />
              </div>
              <div className={styles.heroStatLabel}>
                <T fr="ans d'expertise" en="years of expertise" />
              </div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>
                <CountUp end={800} />
              </div>
              <div className={styles.heroStatLabel}>
                <T fr="collaborateurs" en="team members" />
              </div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>
                <CountUp end={400000} />
              </div>
              <div className={styles.heroStatLabel}>
                <T fr="pièces par an" en="pieces per year" />
              </div>
            </div>
            <div className={styles.heroStat}>
              <div className={`${styles.heroStatValue} ${styles.heroStatValueGold}`}>
                SMETA<span style={{ color: "rgba(244,239,230,.3)", fontWeight: 400 }}>·</span>QIMA
              </div>
              <div className={styles.heroStatLabel}>
                <T fr="certifié" en="certified" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="metier" className={styles.metier}>
        <div className={styles.metierGrid}>
          <div>
            <h2 className={styles.metierTitle}>
              <T
                fr="Une usine textile intégrée où la main de l'artisan "
                en="An integrated textile factory where the artisan's hand "
              />
              <span className={styles.metierTitleDim}>
                <T
                  fr="rencontre la précision industrielle."
                  en="meets industrial precision."
                />
              </span>
            </h2>
          </div>
          <div>
            <p className={styles.metierText}>
              <T
                fr="ULTRAMAILLE SA, spécialiste de la maille à Madagascar depuis 25 ans, conjugue passion et expertise pour créer des pièces uniques et sur-mesure en crochet et tricot. Alliant savoir-faire artisanal et mode haut de gamme, nous sublimons chaque création avec un engagement sans compromis envers l'excellence."
                en="ULTRAMAILLE SA, a knitwear specialist in Madagascar for 25 years, combines passion and expertise to create unique, made-to-measure pieces in crochet and knit. Blending artisanal know-how with high-end fashion, we elevate every creation with an uncompromising commitment to excellence."
              />
            </p>
          </div>
        </div>
      </section>

      <section className={styles.videoSection}>
        <div className={styles.videoWrap}>
          <video
            className={styles.video}
            src="https://www.ultramaille.com/wp-content/uploads/video/video-utm.mp4"
            preload="metadata"
            autoPlay
            loop
            muted
            playsInline
            controls
          />
        </div>
      </section>

      <section className={styles.heritage}>
        <div className={styles.heritageGrid}>
          <div className={styles.heritageImgWrap}>
            <Image
              src="https://res.cloudinary.com/wzetrnif/image/upload/v1787845799/ultramaille-tricotage-mecanique_duofdi.webp"
              alt="Tricotage manuel Ultramaille"
              fill
              className={styles.heritageImg}
            />
            <RevealOnScroll className={styles.heritageBadge}>
              <div className={styles.heritageBadgeValue}>1998</div>
              <div className={styles.heritageBadgeLabel}>
                <T fr="fondation de l'atelier" en="founding of the workshop" />
              </div>
            </RevealOnScroll>
          </div>
          <div>
            <div className={`${styles.eyebrow} ${styles.eyebrowBlue}`}>
              <T fr="— Héritage" en="— Heritage" />
            </div>
            <h2 className={styles.heritageTitle}>
              <T fr="De génération en génération." en="From one generation to the next." />
            </h2>
            <p className={styles.heritageText}>
              <T
                fr="Depuis plus de 25 ans, notre entreprise implantée à Antananarivo conjugue un héritage transmis au fil des familles et la maîtrise technique des machines les plus performantes. C'est ce qui nous permet d'accompagner les maisons de mode les plus exigeantes."
                en="For more than 25 years, our company in Antananarivo has combined a heritage handed down through families with technical mastery of the most advanced machines. This is what allows us to support the most demanding fashion houses."
              />
            </p>
            <p className={styles.heritageText}>
              <T
                fr="Une main-d'œuvre qualifiée et fidèle, véritable richesse d'Ultramaille."
                en="A qualified, loyal workforce — the true wealth of Ultramaille."
              />
            </p>
            <a href="#contact" className={styles.heritageLink}>
              <T fr="Lire notre histoire →" en="Read our story →" />
            </a>
          </div>
        </div>
      </section>

      <section id="savoir-faire" className={styles.savoirFaire}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <div>
              <div className={`${styles.eyebrow} ${styles.eyebrowBlue}`}>
                <T fr="— Notre expertise" en="— Our expertise" />
              </div>
              <h2 className={styles.sectionHeadTitleLight}>
                <T
                  fr="Un savoir-faire complet, du fil à la finition."
                  en="Complete know-how, from yarn to finish."
                />
              </h2>
            </div>
            <p className={styles.sectionHeadTextDark}>
              <T
                fr="Cinq ateliers intégrés, une seule et même exigence d'excellence."
                en="Five integrated workshops, one shared standard of excellence."
              />
            </p>
          </div>
          <div className={styles.craftGrid}>
            {CRAFT_CARDS.map((card) => (
              <div key={card.number} className={styles.craftCard}>
                <Image src={card.img} alt={card.alt} fill className={styles.craftImg} />
                <div className={styles.craftShade} />
                <div className={styles.craftCaption}>
                  <div className={styles.craftNumber}>{card.number}</div>
                  <h3 className={styles.craftTitle}>
                    <T fr={card.titleFr} en={card.titleEn} />
                  </h3>
                  <p className={styles.craftText}>
                    <T fr={card.textFr} en={card.textEn} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.capacite}>
        <div className={styles.capaciteGrid}>
          <div className={styles.statGrid}>
            <div className={styles.statCell}>
              <div className={styles.statValue}>
                <CountUp end={400000} />
              </div>
              <div className={styles.statLabel}>
                <T fr="pièces produites par an" en="pieces produced each year" />
              </div>
            </div>
            <div className={styles.statCell}>
              <div className={styles.statValue}>
                <CountUp end={800} />
              </div>
              <div className={styles.statLabel}>
                <T fr="collaborateurs qualifiés" en="skilled employees" />
              </div>
            </div>
            <div className={styles.statCell}>
              <div className={styles.statValue}>
                <CountUp end={25} />
              </div>
              <div className={styles.statLabel}>
                <T fr="années d'expérience" en="years of experience" />
              </div>
            </div>
            <div className={styles.statCell}>
              <div className={`${styles.statValue} ${styles.statValueGold}`}>
                <CountUp end={100} />%
              </div>
              <div className={styles.statLabel}>
                <T fr="production intégrée" en="integrated production" />
              </div>
            </div>
          </div>
          <div>
            <div className={`${styles.eyebrow} ${styles.eyebrowGold}`}>
              <T fr="— Capacité industrielle" en="— Industrial capacity" />
            </div>
            <h2 className={styles.capaciteTitle}>
              <T
                fr="Une chaîne 100% intégrée, du fil au vêtement fini."
                en="A fully integrated chain, from yarn to finished garment."
              />
            </h2>
            <p className={styles.capaciteText}>
              <T
                fr="Chaque étape de la production est gérée en interne — garantissant la maîtrise de la qualité, des délais et de la traçabilité de vos collections."
                en="Every stage of production is handled internally — guaranteeing control over quality, lead times and traceability for your collections."
              />
            </p>
            <div className={styles.tagRow}>
              {[
                "Tricotage",
                "Remaillage",
                "Teinture fil",
                "Teinture plongé",
                "Broderie",
                "Impression",
                "Pressing & finition",
                "Contrôle qualité",
              ].map((tag) => (
                <span key={tag} className={`${styles.tag} ${styles.tagDark}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="durabilite" className={styles.durabilite}>
        <div className={styles.sectionInner}>
          <div className={styles.durabiliteHead}>
            <div className={`${styles.eyebrow} ${styles.eyebrowGold}`}>
              <T fr="— NOTRE ENGAGEMENT" en="— Our commitment" />
            </div>
            <h2 className={styles.durabiliteTitle}>
              <T
                fr="Une entreprise responsable, engagé pour l'humain."
                en="A responsible company, committed to people."
              />
            </h2>
          </div>
          <div className={styles.cardGrid3}>
            <RevealOnScroll className={styles.iconCard}>
              <div className={styles.iconBadge}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E0A338" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6" />
                </svg>
              </div>
              <h3 className={styles.iconCardTitle}>
                <T fr="Respect de l'environnement" en="Environmental respect" />
              </h3>
              <p className={styles.iconCardText}>
                <T
                  fr="Très attachés au développement durable, nous tricotons des fibres naturelles et privilégions les producteurs locaux pour limiter les transports polluants."
                  en="Committed to sustainable development, we knit natural fibres and favour local producers to limit polluting transport."
                />
              </p>
            </RevealOnScroll>
            <RevealOnScroll className={styles.iconCard} delay={150}>
              <div className={styles.iconBadge}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E0A338" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className={styles.iconCardTitle}>
                <T fr="Société impliquée" en="An engaged company" />
              </h3>
              <p className={styles.iconCardText}>
                <T
                  fr="Avec 800 emplois créés, ULTRAMAILLE participe activement au développement local. Nous investissons continuellement dans l'amélioration du quotidien de nos équipes."
                  en="With 800 jobs created, Ultramaille actively contributes to local development. We continually invest in improving the daily lives of our teams."
                />
              </p>
            </RevealOnScroll>
            <RevealOnScroll className={styles.iconCard} delay={300}>
              <div className={styles.iconBadge}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E0A338" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <h3 className={styles.iconCardTitle}>
                <T fr="Éducation" en="Education" />
              </h3>
              <p className={styles.iconCardText}>
                <T
                  fr="En partenariat avec le Rotary Club Mahamasina, nous finançons des classes à Soavimasoandro et Ambolokandrina."
                  en="In partnership with Rotary Club Mahamasina, we fund school classes in Soavimasoandro and Ambolokandrina."
                />
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className={styles.certifications}>
        <div className={styles.certGrid}>
          <div className={styles.certCards}>
            <div className={styles.certCard}>
              <div className={styles.certLogoWrap}>
                <Image
                  src="https://www.ultramaille.com/wp-content/uploads/2024/11/SMETA.png"
                  alt="SMETA"
                  width={160}
                  height={54}
                />
              </div>
              <p className={styles.certCardText}>
                <T
                  fr="Audit des conditions de travail, de la santé-sécurité, de l'environnement et de l'éthique, sur site."
                  en="Audit of labour standards, health & safety, environment and business ethics, on site."
                />
              </p>
            </div>
            <div className={styles.certCard}>
              <div className={styles.certLogoWrap}>
                <img
                  src="https://www.ultramaille.com/wp-content/uploads/2025/02/QIMA-logo.svg"
                  alt="QIMA"
                  width={160}
                  height={54}
                  loading="lazy"
                />
              </div>
              <p className={styles.certCardText}>
                <T
                  fr="Certification produit attestant qualité, gestion responsable des produits chimiques et approvisionnement durable."
                  en="Product certification ensuring quality, responsible chemical management and sustainable sourcing."
                />
              </p>
            </div>
          </div>
          <div>
            <div className={`${styles.eyebrow} ${styles.eyebrowBlue}`}>
              <T fr="— Certifications" en="— Certifications" />
            </div>
            <h2 className={styles.certTitle}>
              <T
                fr="Audités et certifiés aux standards internationaux."
                en="Audited and certified to international standards."
              />
            </h2>
            <p className={styles.certText}>
              <T
                fr="Nos certifications offrent aux marques européennes l'assurance d'une chaîne d'approvisionnement éthique, sûre et traçable."
                en="Our certifications give European brands the assurance of an ethical, safe and traceable supply chain."
              />
            </p>
          </div>
        </div>
      </section>

      <ContactCta />
      <Footer />
    </div>
  );
}
