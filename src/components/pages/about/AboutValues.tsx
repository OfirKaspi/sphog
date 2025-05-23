import { Value } from '@/types/types'

interface AboutValuesProps {
    title: string
    values: Value[]
}

const AboutValues = ({ title, values }: AboutValuesProps) => {
    return (
        <section className="max-w-screen-lg space-y-10 mx-auto p-5">
            <h2 className="text-3xl md:text-4xl text-primary text-center">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {values.map((value, idx) => (
                    <div key={idx} className="border rounded-xl p-5 shadow-lg bg-white">
                        <h3 className="text-xl md:text-2xl mb-2 text-primary">{value.title}</h3>
                        <p className="text-slate-900 text-sm md:text-base leading-relaxed">
                            {value.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default AboutValues