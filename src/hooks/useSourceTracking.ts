import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

const SOURCE_STORAGE_KEY = 'campaign_source';
const SOURCE_EXPIRY_DAYS = 30;
const PAGE_LOAD_TIME_KEY = 'page_load_time';

interface StoredSource {
  code: string;
  timestamp: number;
}

export function useSourceTracking() {
  useEffect(() => {
    if (!sessionStorage.getItem(PAGE_LOAD_TIME_KEY)) {
      sessionStorage.setItem(PAGE_LOAD_TIME_KEY, Date.now().toString());
    }

    const params = new URLSearchParams(window.location.search);
    const sourceCode = params.get('source');

    if (sourceCode) {
      validateAndStoreSource(sourceCode);
    }
  }, []);
}

async function validateAndStoreSource(code: string) {
  const { data } = await supabase
    .from('campaign_links')
    .select('id, unique_code, is_active, expiry_date')
    .eq('unique_code', code)
    .eq('is_active', true)
    .maybeSingle();

  if (data) {
    const isExpired = data.expiry_date && new Date(data.expiry_date) < new Date();
    if (!isExpired) {
      const stored: StoredSource = {
        code: code,
        timestamp: Date.now()
      };
      localStorage.setItem(SOURCE_STORAGE_KEY, JSON.stringify(stored));

      await supabase.rpc('increment_campaign_click', { campaign_code: code });

      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, '', newUrl);
    }
  }
}

export function getStoredSource(): string | null {
  const stored = localStorage.getItem(SOURCE_STORAGE_KEY);
  if (!stored) return null;

  try {
    const data: StoredSource = JSON.parse(stored);
    const expiryTime = SOURCE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    if (Date.now() - data.timestamp > expiryTime) {
      localStorage.removeItem(SOURCE_STORAGE_KEY);
      return null;
    }
    return data.code;
  } catch {
    localStorage.removeItem(SOURCE_STORAGE_KEY);
    return null;
  }
}

export function clearStoredSource() {
  localStorage.removeItem(SOURCE_STORAGE_KEY);
}

export function getTimeSpentOnPage(): number {
  const loadTime = sessionStorage.getItem(PAGE_LOAD_TIME_KEY);
  if (!loadTime) return 0;
  return Math.round((Date.now() - parseInt(loadTime, 10)) / 1000);
}

export function resetPageLoadTime() {
  sessionStorage.setItem(PAGE_LOAD_TIME_KEY, Date.now().toString());
}
