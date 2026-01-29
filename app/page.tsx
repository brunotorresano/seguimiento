import Calendar from "@/components/Calendar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafbfc]">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/50 to-transparent -z-10" />
      <Calendar />
    </main>
  );
}
