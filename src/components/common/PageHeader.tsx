interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <header className="p-6 md:p-10">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800">{title}</h1>
        <p className="mt-2 text-gray-600 text-sm md:text-base">{description}</p>
      </div>
    </header>
  );
};

export default PageHeader