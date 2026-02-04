import WelcomeTooltip from "@/components/pages/WelcomeTooltip";

export default function Home() {
  return (
    <div className="absolute top-8 right-8 z-10 flex flex-col items-end gap-4">
      <WelcomeTooltip />
    </div>
  );
}
