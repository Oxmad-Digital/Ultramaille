import Header from "@/components/Header";
import Footer from "@/components/Footer";
import T from "@/components/T";
import styles from "./page.module.css";

export default function MentionsLegalesPage() {
  return (
    <div className={styles.page}>
      <Header />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>
            <T fr="— Informations légales" en="— Legal information" />
          </div>
          <h1 className={styles.title}>
            <T fr="Mentions légales" en="Legal notice" />
          </h1>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <T fr="Éditeur du site" en="Site publisher" />
          </h2>
          <p>
            <T
              fr="Le présent site est édité par ULTRAMAILLE S.A, société immatriculée à Madagascar, dont le siège social est situé Lot II G 55 ter NBA Ambatomaro, BP 3298, Antananarivo (101), Madagascar."
              en="This website is published by ULTRAMAILLE S.A, a company registered in Madagascar, with its registered office at Lot II G 55 ter NBA Ambatomaro, BP 3298, Antananarivo (101), Madagascar."
            />
          </p>
          <p className={styles.contactLines}>
            <span>
              <T fr="Téléphone : " en="Phone: " />
              <a href="tel:+261341185510" className={styles.nowrap}>
                +261 34 11 855 10
              </a>{" "}
              /{" "}
              <a href="tel:+261341185522" className={styles.nowrap}>
                +261 34 11 855 22
              </a>
            </span>
            <span>
              <T fr="Email : " en="Email: " />
              <a href="mailto:contact@ultramaille.com">contact@ultramaille.com</a>
            </span>
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <T fr="Directeur de la publication" en="Publication director" />
          </h2>
          <p>
            <T
              fr="La direction de la publication est assurée par la direction générale d'ULTRAMAILLE S.A."
              en="Publication is directed by the general management of ULTRAMAILLE S.A."
            />
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <T fr="Hébergement" en="Hosting" />
          </h2>
          <p>
            <T
              fr="Le site est hébergé par un prestataire d'hébergement cloud garantissant la disponibilité et la sécurité des données hébergées. Les coordonnées de l'hébergeur peuvent être communiquées sur demande auprès de l'éditeur du site."
              en="The website is hosted by a cloud hosting provider ensuring the availability and security of the hosted data. The host's contact details can be provided upon request to the site's publisher."
            />
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <T fr="Propriété intellectuelle" en="Intellectual property" />
          </h2>
          <p>
            <T
              fr="L'ensemble des contenus présents sur ce site (textes, images, photographies, logos, graphismes, vidéos) est protégé par le droit d'auteur et demeure la propriété exclusive d'ULTRAMAILLE S.A ou de ses partenaires, sauf mention contraire. Toute reproduction, représentation, modification ou diffusion, totale ou partielle, sans autorisation préalable écrite, est interdite et constitue une contrefaçon sanctionnée par les textes en vigueur."
              en="All content on this site (text, images, photographs, logos, graphics, videos) is protected by copyright and remains the exclusive property of ULTRAMAILLE S.A or its partners, unless otherwise stated. Any reproduction, representation, modification or distribution, in whole or in part, without prior written authorization is prohibited and constitutes an infringement under applicable law."
            />
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <T fr="Données personnelles" en="Personal data" />
          </h2>
          <p>
            <T
              fr="Les informations recueillies via les formulaires de ce site (notamment le formulaire de contact) sont destinées exclusivement à ULTRAMAILLE S.A et sont utilisées dans le cadre strict du traitement de votre demande. Conformément à la réglementation applicable en matière de protection des données, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant, que vous pouvez exercer en nous contactant à l'adresse : "
              en="Information collected via the forms on this site (in particular the contact form) is intended exclusively for ULTRAMAILLE S.A and is used strictly to process your request. In accordance with applicable data protection regulations, you have the right to access, rectify and delete data concerning you, which you may exercise by contacting us at: "
            />
            <a href="mailto:contact@ultramaille.com">contact@ultramaille.com</a>.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <T fr="Cookies" en="Cookies" />
          </h2>
          <p>
            <T
              fr="Ce site peut utiliser des cookies techniques nécessaires à son bon fonctionnement. Aucun cookie de suivi publicitaire n'est déposé sans votre consentement. Vous pouvez à tout moment configurer votre navigateur pour refuser les cookies."
              en="This site may use technical cookies necessary for its proper functioning. No advertising tracking cookie is placed without your consent. You may configure your browser at any time to refuse cookies."
            />
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <T fr="Liens hypertextes" en="Hyperlinks" />
          </h2>
          <p>
            <T
              fr="Ce site peut contenir des liens vers d'autres sites. ULTRAMAILLE S.A n'exerce aucun contrôle sur ces sites tiers et décline toute responsabilité quant à leur contenu."
              en="This site may contain links to other websites. ULTRAMAILLE S.A exercises no control over these third-party sites and declines all responsibility for their content."
            />
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <T fr="Droit applicable" en="Governing law" />
          </h2>
          <p>
            <T
              fr="Les présentes mentions légales sont soumises au droit malgache. Tout litige relatif à l'utilisation de ce site relève de la compétence exclusive des tribunaux d'Antananarivo, Madagascar."
              en="This legal notice is governed by Malagasy law. Any dispute relating to the use of this site falls under the exclusive jurisdiction of the courts of Antananarivo, Madagascar."
            />
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
