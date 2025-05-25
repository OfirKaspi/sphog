import { LinkType, Tip } from '@/types/types'
import Link from 'next/link';
import React from 'react'
import TipsGrid from '@/components/pages/tips/TipsGrid';
import { Button } from '@/components/ui/button';

interface TipsSectionProps {
  title: string
  link: LinkType
  tips: Tip[]
}

export default function TipsSection({ tips, link, title }: TipsSectionProps) {
  return (
    <section className="max-w-screen-lg mx-auto py-16 px-5">
      <h2 className="text-3xl md:text-4xl font-bold text-primary mb-10 text-center">{title}</h2>
      <TipsGrid tips={tips} />
      <div className="text-center mt-12">
        <Link href={link.href}>
          <Button className="md:text-base bg-cta hover:bg-cta-foreground transition-all duration-300 rounded-full px-6 py-3 shadow-md">
            {link.text}
          </Button>
        </Link>
      </div>
    </section>
  );
}