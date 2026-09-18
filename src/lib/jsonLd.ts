// Sérialise des données pour une balise <script type="application/ld+json">.
// JSON.stringify seul laisse passer "</script>" : on échappe "<" pour qu'une valeur
// saisie dans l'admin (titre, extrait…) ne puisse pas fermer la balise.
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
