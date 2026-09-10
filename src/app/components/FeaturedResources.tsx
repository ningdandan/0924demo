import { Book, FileText, HelpCircle, Users } from "lucide-react";

interface ResourceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
}

function ResourceCard({ icon, title, description, link }: ResourceCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-[16px] p-[24px] shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer">
      <div className="flex flex-col gap-[16px]">
        <div className="flex items-center gap-[12px]">
          <div className="bg-blue-50 p-[12px] rounded-[12px]">
            {icon}
          </div>
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[18px] text-[#364153]">
            {title}
          </h3>
        </div>
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] text-gray-600 leading-[20px]">
          {description}
        </p>
      </div>
    </div>
  );
}

export function FeaturedResources() {
  const resources = [
    {
      icon: <Book className="size-[24px] text-[#066afe]" />,
      title: "Getting Started Guide",
      description: "Learn the basics of our employee portal and discover all available resources."
    },
    {
      icon: <FileText className="size-[24px] text-[#066afe]" />,
      title: "Policy Documents",
      description: "Access company policies, procedures, and important documentation."
    },
    {
      icon: <HelpCircle className="size-[24px] text-[#066afe]" />,
      title: "FAQ",
      description: "Find answers to frequently asked questions about HR, IT, and more."
    },
    {
      icon: <Users className="size-[24px] text-[#066afe]" />,
      title: "Team Directory",
      description: "Connect with colleagues and find contact information for various departments."
    }
  ];

  return (
    <section className="w-full max-w-[1200px] mx-auto py-[60px] px-[40px]">
      <div className="flex flex-col gap-[32px]">
        <div className="flex flex-col gap-[8px]">
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[36px] text-[#364153] tracking-[-0.5px]">
            Featured Resources
          </h2>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[16px] text-gray-600">
            Quick access to commonly used tools and information
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          {resources.map((resource, index) => (
            <ResourceCard 
              key={index}
              icon={resource.icon}
              title={resource.title}
              description={resource.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
