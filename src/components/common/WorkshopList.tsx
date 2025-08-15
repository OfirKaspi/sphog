import WorkshopItemNew from "./WorkshopItemNew";
import { WorkshopData } from "@/types/types";
import WorkshopItemOld from "./WorkshopItemOld";

interface WorkshopListProps {
    workshops: WorkshopData[];
}

const WorkshopList = ({ workshops }: WorkshopListProps) => {

    return (
        <section className="bg-primary w-full">
            <div className="grid grid-cols-1 gap-8 py-16 px-5">
                {workshops.map((workshop, index) => (
                    <div key={index}>
                        <div className="md:hidden"><WorkshopItemOld  {...workshop} /></div>
                        
                        <div className="hidden md:block">
                            <WorkshopItemNew key={index} {...workshop} index={index} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WorkshopList;
