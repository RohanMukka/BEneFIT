import React from "react";
import styles from "./ChoicePage.module.css";

export default function ChoicePage({ onSelect }) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>🏋️ BEneFIT Fitness Challenge</h2>
        <p className={styles.subtext}>Choose your next step to stay on track!</p>
        <div className={styles.buttonGroup}>
          <button onClick={() => onSelect("start")} className={styles.button}>
            🚀 Start New Goal
          </button>
          <button onClick={() => onSelect("validate")} className={styles.button}>
            ✅ Validate Existing Goal
          </button>
        </div>
      </div>
    </div>
  );
}
