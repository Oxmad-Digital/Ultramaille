import styles from "./MagnitudeBarList.module.css";

type Item = { label: string; value: number };

export default function MagnitudeBarList({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return <p className={styles.empty}>Aucune donnée pour le moment.</p>;
  }

  const max = Math.max(1, ...items.map((i) => i.value));

  return (
    <div className={styles.list}>
      {items.map((item) => (
        <div key={item.label} className={styles.row}>
          <span className={styles.label} title={item.label}>
            {item.label}
          </span>
          <div className={styles.track}>
            <div className={styles.bar} style={{ width: `${Math.max(2, (item.value / max) * 100)}%` }} />
          </div>
          <span className={styles.value}>{item.value.toLocaleString("fr-FR")}</span>
        </div>
      ))}
    </div>
  );
}
