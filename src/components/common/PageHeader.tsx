interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <header className="p-6 md:p-10">
      <div className="max-w-screen-lg mx-auto text-center">
        <h1 className="text-4xl md:text-5xl text-primary font-bold">{title}</h1>
        <p className="mt-3 md:mt-4 text-slate-900 md:text-lg">{description}</p>
      </div>
    </header>
  );
};

export default PageHeader