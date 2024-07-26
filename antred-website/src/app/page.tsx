'use client'
import { Button } from "@/components/system/Button";
import { useTheme } from "next-themes"

export default function Home() {
  const { setTheme } = useTheme()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello world</h1>
      Hello world
      <Button onClick={() => setTheme("dark")}>DarkMode</Button>
      <Button onClick={()=> setTheme("light")}>lightMode</Button>
    </main>
  );
}
