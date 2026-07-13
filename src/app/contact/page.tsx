"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/language-context";
import styles from "./page.module.css";

export default function ContactPage() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.page}>
      <Header ctaHref="#form" />

      <section id="top" className={styles.hero}>
        <Image
          src="/images/broderie1-1024x683.jpg"
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
          <div id="form">
            <div className={styles.eyebrow}>{t("— Écrivez-nous", "— Send us a message")}</div>
            <h2 className={styles.title}>{t("Parlez-nous de votre projet.", "Tell us about your project.")}</h2>
            <p className={styles.intro}>
              {t(
                "Une équipe dédiée à vos projets de maille, du premier croquis jusqu'à la production finie — basée à Antananarivo, Madagascar.",
                "A team dedicated to your knitwear projects, from first sketch to finished production — based in Antananarivo, Madagascar.",
              )}
            </p>

            {sent ? (
              <div className={styles.sentCard}>
                <div className={styles.sentEyebrow}>{t("Message envoyé", "Message sent")}</div>
                <div className={styles.sentTitle}>
                  {t("Merci — nous revenons vers vous sous 24h.", "Thank you — we'll get back to you within 24h.")}
                </div>
                <p className={styles.sentText}>
                  {t(
                    "Notre équipe étudie attentivement chaque demande afin de vous apporter la proposition la plus adaptée.",
                    "Our team carefully reviews every request to provide the most suitable proposal.",
                  )}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>{t("Nom complet", "Full name")}</span>
                    <input
                      className={styles.input}
                      type="text"
                      name="nom"
                      required
                      placeholder="Jeanne Dupont"
                    />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>{t("Société", "Company")}</span>
                    <input
                      className={styles.input}
                      type="text"
                      name="societe"
                      placeholder={t("Maison de mode", "Fashion house")}
                    />
                  </label>
                </div>
                <div className={styles.formRow}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Email</span>
                    <input
                      className={styles.input}
                      type="email"
                      name="email"
                      required
                      placeholder="jeanne@maison.com"
                    />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>{t("Téléphone", "Phone")}</span>
                    <input
                      className={styles.input}
                      type="tel"
                      name="tel"
                      placeholder="+33 6 00 00 00 00"
                    />
                  </label>
                </div>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{t("Votre projet", "Your project")}</span>
                  <textarea
                    className={styles.input}
                    name="message"
                    required
                    rows={5}
                    placeholder={t(
                      "Type de maille, jauges, volumes, délais souhaités…",
                      "Knit type, gauges, volumes, desired lead times…",
                    )}
                  />
                </label>
                <label className={styles.consentField}>
                  <input type="checkbox" name="consent" required className={styles.consentCheckbox} />
                  <span className={styles.consentText}>
                    {t(
                      "En soumettant ce formulaire, j'accepte que les informations saisies soient exploitées dans le cadre strict de ma demande, conformément au RGPD.",
                      "By submitting this form, I agree that the information entered will be used solely to process my request, in accordance with the GDPR.",
                    )}
                  </span>
                </label>
                <button type="submit" className={styles.submitButton}>
                  {t("Envoyer →", "Send →")}
                </button>
              </form>
            )}
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>{t("Adresse", "Address")}</div>
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
              <div className={styles.infoLabel}>{t("Téléphone", "Phone")}</div>
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
              <div className={styles.infoLabel}>{t("Coordonnées GPS", "GPS coordinates")}</div>
              <div className={styles.gps}>18°54&apos;13.5&quot;S&nbsp;&nbsp;47°34&apos;07.3&quot;E</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>{t("Suivez-nous", "Follow us")}</div>
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
            <div className={styles.mapCardEyebrow}>{t("— Nous trouver", "— Find us")}</div>
            <h3 className={styles.mapCardTitle}>{t("Au cœur d'Antananarivo.", "At the heart of Antananarivo.")}</h3>
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
              {t("Ouvrir dans Maps →", "Open in Maps →")}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
