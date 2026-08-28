import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import T from "@/components/T";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact — Ultramaille",
  description:
    "Contactez l'équipe Ultramaille à Antananarivo, Madagascar, pour vos projets de maille, du premier croquis à la production finie.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <Header ctaHref="#form" />

      <section id="top" className={styles.hero}>
        <Image
          src="https://res.cloudinary.com/wzetrnif/image/upload/v1787856491/background-pull-ultramaille_oi1dox.webp"
          alt="Atelier Ultramaille"
          fill
          priority
          className={styles.heroImg}
        />
        <div className={styles.heroGradient} />
        <div className={styles.heroGrid} />
      </section>

      <section id="contact" className={styles.contactSection}>
        <div className={styles.contactGrid}>
          <ContactForm />

          <div className={styles.infoCard}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <T fr="Adresse" en="Address" />
              </div>
              <a
                href="https://maps.app.goo.gl/QCtBagMwiiEZaHzg6"
                target="_blank"
                rel="noopener"
                className={styles.infoAddress}
              >
                Lot II G 55 ter NBA Ambatomaro
                <br />
                BP 3298 — Antananarivo (101)
                <br />
                Madagascar
              </a>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <T fr="Téléphone" en="Phone" />
              </div>
              <a href="tel:+261341185510" className={styles.infoPhone}>
                +261 34 11 855 10
              </a>
              <a href="tel:+261341185522" className={styles.infoPhone}>
                +261 34 11 855 22
              </a>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Email</div>
              <a href="mailto:f.wybo@ultramaille.mg" className={styles.infoEmail}>
                f.wybo@ultramaille.mg
              </a>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <T fr="Coordonnées GPS" en="GPS coordinates" />
              </div>
              <div className={styles.gps}>18°54&apos;13.5&quot;S&nbsp;&nbsp;47°34&apos;07.3&quot;E</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <T fr="Suivez-nous" en="Follow us" />
              </div>
              <div className={styles.socialRow}>
                <a href="https://www.facebook.com/ULTRAMAILLEKNIT" target="_blank" rel="noopener" className={styles.socialLink}>
                  Facebook
                </a>
                <a href="https://www.instagram.com/ultramaille_mg/" target="_blank" rel="noopener" className={styles.socialLink}>
                  Instagram
                </a>
                <a href="https://www.linkedin.com/company/ultramaille" target="_blank" rel="noopener" className={styles.socialLink}>
                  LinkedIn
                </a>
                <a href="https://www.youtube.com/@ultramaillesa5724" target="_blank" rel="noopener" className={styles.socialLink}>
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.mapSection}>
        <div className={styles.mapWrap}>
          <iframe
            title="Carte Ultramaille — Antananarivo"
            src="https://www.openstreetmap.org/export/embed.html?bbox=47.54%2C-18.93%2C47.60%2C-18.88&layer=mapnik&marker=-18.9037%2C47.5687"
            className={styles.mapIframe}
          />
          <div className={styles.mapOverlay} />
          <div className={styles.mapCard}>
            <div className={styles.mapCardEyebrow}>
              <T fr="— Nous trouver" en="— Find us" />
            </div>
            <h3 className={styles.mapCardTitle}>
              <T fr="Au cœur d'Antananarivo." en="At the heart of Antananarivo." />
            </h3>
            <p className={styles.mapCardText}>
              Ambatomaro, Antananarivo (101)
              <br />
              Madagascar
            </p>
            <a
              href="https://maps.app.goo.gl/QCtBagMwiiEZaHzg6"
              target="_blank"
              rel="noopener"
              className={styles.mapCardLink}
            >
              <span>
                <T fr="Ouvrir dans Maps" en="Open in Maps" />
              </span>
              <svg
                className={styles.mapCardLinkIcon}
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
