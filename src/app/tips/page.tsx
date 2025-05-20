import PageHeader from "@/components/common/PageHeader"
import getTipsData from "@/lib/api/tipsData"

const Tips = () => {
    const data = getTipsData()

    return (
        <section>
        <PageHeader
          title={data.header.title}
          description={data.header.description}
        />
      </section>
    )
}

export default Tips