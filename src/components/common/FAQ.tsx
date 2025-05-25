import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQProps {
    title: string;
    questions: FAQItem[];
}

export default function FAQ({ questions, title }: FAQProps) {
    return (
        <section className="bg-primary">
            <div className="max-w-screen-sm mx-auto py-16 px-5">
                <h2 className="text-3xl md:text-4xl font-bold mb-10 text-white text-center">{title}</h2>

                <Accordion type="single" collapsible className="space-y-4">
                    {questions.map((question, index) => (
                        <AccordionItem key={index} value={`question-${index}`} className="border bg-white rounded-lg">
                            <AccordionTrigger className="text-lg md:text-xl font-semibold text-primary px-4 py-3">
                                {question.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm md:text-base px-4 pb-4 leading-relaxed">
                                {question.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
