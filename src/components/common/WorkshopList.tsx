import WorkshopItem from "./WorkshopItem";
import { WorkshopData } from "@/types/types";

interface WorkshopListProps {
    workshops: WorkshopData[];
}

const WorkshopList = ({ workshops }: WorkshopListProps) => {
    return (
        <section className="bg-primary w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-16 px-5">
                {workshops.map((workshop, index) => (
                    <WorkshopItem key={index} {...workshop} />
                ))}
            </div>
        </section>
    );
};

export default WorkshopList;
