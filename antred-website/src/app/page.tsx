'use client'
import { setUserLocale } from "@/locales/i18n";
import { Locale } from "@/locales/localesConfig";
import {  useTranslations } from "next-intl";
import { ChangeEvent } from "react";

export default function Home() {
  const t = useTranslations('homepage')
 const onSelectChange = (e:ChangeEvent<HTMLSelectElement>) => setUserLocale(e.target.value as Locale)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>{t("hero.title")}</h1>
      Hello world
      <label >
        <select onChange={onSelectChange}>  
          <option value="fr">fr</option>
          <option value="en">en</option>
        </select>
      </label>
    </main>
  );
}
