"use client";

import { signOut } from "next-auth/react";
import styles from "./AdminBar.module.css";

export default function LogoutButton() {
  return (
    <button
      type="button"
      className={styles.logoutButton}
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
    >
      Déconnexion
    </button>
  );
}
