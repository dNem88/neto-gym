import React, { useState, useEffect } from 'react';
import styles from './mailForm.module.css';
import Button3  from './Button3';

export function formClientValidator(formdata) {
  const { name, phone, question, consent } = formdata;
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁїЇіІєЄґҐ\s-]+$/;
  const phoneRegex = /^(\+|0)\d{9,}$/;

  if (!nameRegex.test(name)) return { isValid: false, message: 'Името трябва да съдържа само букви.' };
  if (!phoneRegex.test(phone)) return { isValid: false, message: 'Невалиден телефонен номер.' };
  if (!question) return { isValid: false, message: 'Моля, въведете запитване.' };
  if (!consent) return { isValid: false, message: 'Моля, потвърдете съгласието.' };

  return { isValid: true };
}

export default function MailForm({ title='' }) {
  const [formData, setFormData] = useState({ consent: false });
  const [err, setErr] = useState('');
  const [submitResponse, setSubmitResponse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (submitResponse?.type === 'success') {
      const timer = setTimeout(() => setSubmitResponse(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [submitResponse]);

  const changeHandler = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setErr('');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = formClientValidator(formData);
    if (!validation.isValid) {
      setErr(validation.message);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // Just sending the form data now
      });

      const result = await response.json();
      if (response.ok) {
        setSubmitResponse({ message: result.message, type: 'success' });
      } else {
        setErr(result.message || 'Грешка при изпращане');
      }
    } catch (error) {
      setErr('Сървърна грешка. Опитайте пак.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitResponse?.type === 'success') {
    return (
      <div className={styles['message-box']}>
        <div className={styles['circle-icon-container']}>
          <svg viewBox="0 0 24 24" className={styles['check-icon']}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <p className={styles['message-text']}>{submitResponse.message}</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submitHandler}>
      <p style={{ color: "black", fontWeight: "350", paddingLeft: ".5rem", fontSize: '1.25rem' }}>
        {title}
      </p>

      <div className={styles["inputs-container"]}>
        <label className={styles.label} htmlFor="name">ИМЕ *</label>
        <input className={styles.input} type="text" id="name" name="name" required placeholder="име" onChange={changeHandler} />
      </div>

      <div className={styles["inputs-container"]}>
        <label className={styles.label} htmlFor="phone">ТЕЛЕФОН ЗА КОНТАКТ *</label>
        <input className={styles.input} type="text" id="phone" name="phone" required placeholder="телефон за контакт" onChange={changeHandler} />
      </div>

      <div className={styles["inputs-container"]}>
        <label className={styles.label} htmlFor="question">ЗАПИТВАНЕ *</label>
        <textarea className={styles.textarea} id="question" name="question" required placeholder="С какво можем да сме Ви полезни?" onChange={changeHandler} />
      </div>

      {err && <p className={styles["error-message"]}>{err}</p>}

      <div className={styles["inputs-container"]} style={{ flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
        <input type="checkbox" id="consent" name="consent" required onChange={changeHandler} style={{ width: '20px', height: '20px' }} />
        <label className={styles.label} htmlFor="consent" style={{ paddingLeft: 0, fontSize: '0.85rem' }}>
          Съгласен съм с <a href="/privacy-policy" style={{ color: '#0070f3' }}>обработването на личните ми данни</a>
        </label>
      </div>

      <Button3
        variant={"secondary"}
        content={"Изпратете запитване"}
        type="submit"
        href={"/"}
        sx={{
          border: "1px solid transparent",
          width: "min(100%,418px)",
          height: "3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "black",
          borderRadius: "12px",
          background:
            "linear-gradient(90deg,rgb(170, 247, 236) 0%,rgb(237, 188, 247) 100%)",
        }}
      />
    </form>
  );
}