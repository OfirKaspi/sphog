interface PageHeaderProps {
  title: string;
  description?: string;
  paragraphs?: string[];
  align?: "start" | "center";
}

const PageHeader = ({
  title,
  description,
  paragraphs,
  align = "start",
}: PageHeaderProps) => {
  const bodyAlignClass = align === "center" ? "text-center" : "";

  return (
    <header className="p-5 md:py-10 max-w-screen-lg mx-auto">
      <h1 className="text-4xl md:text-5xl text-primary font-bold text-center">
        {title}
      </h1>
      {paragraphs ? (
        <div className={`mt-5 text-slate-900 md:text-lg ${bodyAlignClass}`}>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-2">
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        description && (
          <p className={`mt-5 text-slate-900 md:text-lg ${bodyAlignClass}`}>
            {description}
          </p>
        )
      )}
    </header>
  );
};

export default PageHeader;
