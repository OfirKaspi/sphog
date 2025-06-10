interface PageHeaderProps {
  title: string;
  description?: string;
  paragraphs?: string[];
}

const PageHeader = ({ title, description, paragraphs }: PageHeaderProps) => {
  return (
    <header className="p-6 md:p-10">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl text-primary font-bold">{title}</h1>
        {paragraphs ? (
          <div className="mt-3 md:mt-4 text-slate-900 md:text-lg">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-2">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          description && (
            <p className="mt-3 md:mt-4 text-slate-900 md:text-lg">{description}</p>
          )
        )}
      </div>
    </header>
  );
};

export default PageHeader;