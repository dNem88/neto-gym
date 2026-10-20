'use client'
import React, { useState, useEffect, useRef } from 'react'
import Button3 from './Button3'
import styles from './OditForm.module.css'

/* Validating inputs */
export function formClientValidator(formdata) {
  let { siteurl, email, consent } = formdata
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/

  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Моля въведете валиден имейл адрес.' }
  }
  if (!urlRegex.test(siteurl)) {
    return { isValid: false, message: 'Моля въведете валиден URL адрес.' }
  }
  if (!consent) {
    return { isValid: false, message: 'Моля дайте съгласие за обработка на данни.' }
  }
  return { isValid: true, message: 'Успешно валидиране на данни.' }
}

/* Success Message Box (Replaced Framer Motion with CSS) */
export function AnimatedMessageBox({ message, type = 'success' }) {
  return (
    <div className={`${styles['message-box-wrapper']} ${styles['animate-pop']}`}>
      <div className={`${styles['message-box']} ${styles[type]}`}>
        <div className={styles['circle-icon-container']}>
          <svg viewBox="0 0 24 24" className={styles['check-icon']}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
          </svg>
        </div>
        <p className={`${styles['message-text']} body1`}>
          {message}
        </p>
      </div>
    </div>
  )
}

export default function OditForm({ title }) {
  const [formData, setFormData] = useState({ siteurl: '', email: '', consent: false })
  const [err, setErr] = useState('')
  const [submitResponse, setSubmitResponse] = useState(null)
  const [submitButtonStatus, setSubmitButtonStatus] = useState(false)
  
  const [showTurnstile, setShowTurnstile] = useState(false)
  const [turnstileLoaded, setTurnstileLoaded] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState(null)
  const [widgetId, setWidgetId] = useState(null)
  const turnstileRef = useRef(null)
  const formRef = useRef(null)

  // Use Astro's way of accessing public environment variables
  const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    let interactionTriggered = false;
    const handleInteraction = () => {
      if (!interactionTriggered) {
        interactionTriggered = true;
        setShowTurnstile(true);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !interactionTriggered) {
        setShowTurnstile(true);
      }
    }, { rootMargin: '300px' });

    const events = ['mousemove', 'touchstart', 'scroll', 'keydown'];
    events.forEach(event => window.addEventListener(event, handleInteraction, { once: true, passive: true }));

    if (formRef.current) observer.observe(formRef.current);

    return () => {
      events.forEach(event => window.removeEventListener(event, handleInteraction));
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (showTurnstile && !turnstileLoaded) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => setTurnstileLoaded(true);
      document.body.appendChild(script);
    }
  }, [showTurnstile, turnstileLoaded]);

  useEffect(() => {
    if (turnstileLoaded && turnstileRef.current && window.turnstile && !widgetId) {
      const id = window.turnstile.render(turnstileRef.current, {
        sitekey: SITE_KEY, 
        callback: (token) => setTurnstileToken(token),
        'error-callback': () => setErr('Възникна проблем с верификацията.'),
        'expired-callback': () => setTurnstileToken(null),
      });
      setWidgetId(id);
    }
  }, [turnstileLoaded, widgetId, SITE_KEY]);

  function changeHandler(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
    setErr('')
  }
 
  async function submitHandler(e) {
    e.preventDefault()
    setSubmitButtonStatus(true)
    
    const validationResponse = formClientValidator(formData)
    if (!validationResponse.isValid) {
      setErr(validationResponse.message)
      setSubmitButtonStatus(false)
      return
    }

    if (!turnstileToken) {
      setErr('Моля изчакайте верификацията.');
      setSubmitButtonStatus(false)
      return
    }
   
    try {
      const response = await fetch('/api/site-odit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, turnstileToken }),
      });
      
      const actionResponse = await response.json();
      
      if (response.ok && actionResponse.type === 'success') {
        setSubmitResponse(actionResponse);
      } else {
        setErr(actionResponse.message || 'Грешка при изпращане');
        setSubmitButtonStatus(false);
        if (widgetId && window.turnstile) window.turnstile.reset(widgetId);
      }
    } catch (error) {
      setErr('Грешка при връзката със сървъра');
      setSubmitButtonStatus(false);
    }
  }

  if (submitResponse) {
    return <AnimatedMessageBox message={submitResponse.message} type={submitResponse.type} />
  }

  return (
    <form className={styles.form} onSubmit={submitHandler} ref={formRef}>
      <h3 className="h5" style={{ color: "black", fontWeight: "350", paddingLeft: ".5rem" }}>
        {title || 'Безплатен сайт одит'}
      </h3>

      <div className={styles["inputs-container"]}>
        <label className={styles.label} htmlFor="siteurl">АДРЕС НА САЙТ *</label>
        <input onChange={changeHandler} type="text" id="siteurl" name="siteurl" required placeholder="example.com" className={styles.input} />
      </div>

      <div className={styles["inputs-container"]}>
        <label className={styles.label} htmlFor="email">ИМЕЙЛ АДРЕС *</label>
        <input type="email" id="email" name="email" required placeholder="вашият имейл адрес" onChange={changeHandler} className={styles.input} />
      </div>

      {err && <p className={`${styles["error-message"]} body1`}>{err}</p>}

      <div className={styles["checkbox-wrapper"]}>
        <input type='checkbox' id="consent-site-odit" name="consent" required onChange={changeHandler} className={styles["consent-checkbox"]} />
        <label htmlFor="consent-site-odit" className={styles['body2']}>
          Съгласен съм с обработването на личните ми данни
        </label>
      </div>

      <div ref={turnstileRef} style={{ minHeight: '65px', marginBottom: '1rem' }} />

      <Button3
        variant="black"
        content="ЗAЯВЕТЕ БЕЗПЛАТЕН ОДИТ"
        type="submit"
        disabled={submitButtonStatus || !turnstileToken}
        sx={{
          border: "1px solid transparent",
          width: "100%",
          height: "3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "6px",
        
          opacity: (submitButtonStatus || !turnstileToken) ? 0.6 : 1,
        }}
      />
    </form>
  );
}