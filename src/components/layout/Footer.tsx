import LegalInfo from "@/components/legal/LegalInfo";
import Contact from "@/components/layout/Contact";
import SocialMedia from "@/components/layout/SocialMedia";
import Logo from "@/components/common/Logo";
import { Separator } from "@/components/ui/separator";
import { CONFIG } from "@/config/config";
import FooterNavigation from "@/components/layout/FooterNavigation";

export default function Footer() {
  const year = CONFIG.year
  return (
    <footer className="p-5 space-y-5 lg:space-y-10 lg:pt-10 border-t-[1px] border-white bg-primary text-white">
      <div className="grid grid-cols-1 gap-5 lg:gap-0 lg:grid-cols-[1fr_auto_1fr] justify-center items-center w-full ">
        <div className="border-b-[1px] border-white lg:border-none pb-5 lg:pb-0 lg:flex">
          <Logo isLogoWhite={true} isTextShow={false} size={80} />
        </div>
        <FooterNavigation />
        <SocialMedia />
      </div>
      <Separator className="hidden lg:flex" />
      <div className="flex flex-col gap-5 lg:flex-row lg:justify-between lg:items-center">
        <Contact />
        <LegalInfo />
      </div>
      <p className="text-sm text-center">
        All Rights Reserved &copy; {year}{" "}
        <a href="https://thelevelupagency.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
          LevelUp
        </a>
      </p>
    </footer>
  );
}
