import LegalInfo from "@/components/legal/LegalInfo";
import Contact from "@/components/layout/Contact";
import SocialMedia from "@/components/layout/SocialMedia";
import Logo from "@/components/common/Logo";
import { Separator } from "@/components/ui/separator";
import { CONFIG } from "@/config/config";

export default function Footer() {
  const year = CONFIG.year
  return (
    <footer className="p-5 space-y-5 lg:space-y-10 lg:pt-10 border-t-2 bg-slate-100">
      <div className="grid grid-cols-1 gap-5 lg:gap-0 lg:grid-cols-[1fr_auto_1fr] justify-center items-center w-full ">
        <div className="border-b-2 lg:border-none pb-5 lg:pb-0 lg:flex">
          <Logo />
        </div>
        {/* <FooterNavigation /> // NOT RELEVANT FOR SINGLE PAGE (LP) */}
        <SocialMedia />
      </div>
      <Separator className="hidden lg:flex" />
      <div className="flex flex-col gap-5 lg:flex-row lg:justify-between lg:items-center">
        <Contact />
        <LegalInfo />
      </div>
      <p className="text-sm text-muted-foreground text-center">All Rights Reserved &copy; {year} LevelUp</p>
    </footer>
  );
}
