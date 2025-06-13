"use client"

import useResponsive from "@/hooks/useResponsive";
import WorkshopItemNew from "./WorkshopItemNew";
import { WorkshopData } from "@/types/types";
import WorkshopItemOld from "./WorkshopItemOld";

interface WorkshopListProps {
    workshops: WorkshopData[];
}

const WorkshopList = ({ workshops }: WorkshopListProps) => {
    const {isMobile, isTablet} = useResponsive()
    
    return (
        <section className="bg-primary w-full">
            <div className="grid grid-cols-1 gap-8 py-16 px-5">
                {workshops.map((workshop, index) => (
                    isMobile || isTablet ? (
                        <WorkshopItemOld key={index} {...workshop} />
                    ) : (
                        <WorkshopItemNew key={index} {...workshop} index={index} />
                    )
                ))}
            </div>
        </section>
    );
};

export default WorkshopList;
