import { createReader } from '@keystatic/core/reader';
import fs from 'node:fs/promises';
import path from 'node:path';
import keystaticConfig from '../../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

async function getFallbackSettings() {
  const settingsPath = path.resolve(process.cwd(), 'src/content/settings.yaml');

  try {
    const text = await fs.readFile(settingsPath, 'utf8');
    const result = {};

    for (const line of text.split(/\r?\n/)) {
      if (!line.trim() || line.trim().startsWith('#')) continue;

      const match = line.match(/^([^:]+):\s*(.*)$/);
      if (!match) continue;

      const [, key, rawValue] = match;
      const value = rawValue.trim();
      const parsedValue = value === '' ? '' : value.replace(/^['"]|['"]$/g, '');
      result[key.trim()] = parsedValue;
    }

    return Object.keys(result).length ? result : null;
  } catch {
    return null;
  }
}

/**
 * Помощна функция за почистване на номера
 */
function formatPhone(phone, type) {
  if (!phone) return "";
  
  // Премахваме всичко, което не е цифра
  const cleanNumber = phone.replace(/\D/g, '');

  // Ако искаме формат за тел. обаждане или Viber (+359...)
  if (type === 'international') {
    if (cleanNumber.startsWith('0')) {
      return '+359' + cleanNumber.substring(1);
    }
    if (cleanNumber.startsWith('359')) {
      return '+' + cleanNumber;
    }
    return '+' + cleanNumber;
  }

  // Ако искаме изчистен формат без символи (359899...)
  if (type === 'viber') {
    if (cleanNumber.startsWith('0')) {
      return '359' + cleanNumber.substring(1);
    }
    return cleanNumber;
  }

  return phone;
}

export async function getBusinessData() {
  const settings = (await reader.singletons.settings.read()) || (await getFallbackSettings());
  
  if (!settings) {
    console.warn("Внимание: Не са намерени бизнес настройки в Keystatic.");
    return {
      businessName: 'GOK Studio',
      businessEIK: '',
      businessMOL: '',
      phone: '',
      email: '',
      address: '',
      workingHours: '',
      socialFacebook: '',
      displayPhone: '',
      telHref: '',
      viberHref: '',
      whatsappHref: '',
    };
  }

  // Добавяме мапнати версии на номера за различни нужди
  const mappedSettings = {
    ...settings,
    // Формат за изписване в сайта: 0899 213 213 (както е въведен)
    displayPhone: settings.phone,
    // Формат за tel:+359899213213
    telHref: `tel:${formatPhone(settings.phone, 'international')}`,
    // Формат за viber://add?number=359899213213
    viberHref: `viber://add?number=${formatPhone(settings.phone, 'viber')}`,
    // Формат за https://wa.me/359899213213
    whatsappHref: `https://wa.me/${formatPhone(settings.phone, 'viber')}`
  };

  return mappedSettings;
}