import { ChevronRight } from "lucide-react";

interface TopicItemProps {
  title: string;
  views?: string;
}

function TopicItem({ title, views }: TopicItemProps) {
  return (
    <button className="w-full flex items-center justify-between p-[16px] bg-white hover:bg-gray-50 border-b border-gray-100 transition-colors group">
      <div className="flex flex-col items-start gap-[4px]">
        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[15px] text-[#364153] group-hover:text-[#066afe] transition-colors">
          {title}
        </span>
        {views && (
          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-gray-500">
            {views} views
          </span>
        )}
      </div>
      <ChevronRight className="size-[20px] text-gray-400 group-hover:text-[#066afe] transition-colors" />
    </button>
  );
}

export function PopularTopics() {
  const topics = [
    { title: "How to submit time off requests", views: "1.2k" },
    { title: "Setting up VPN access", views: "950" },
    { title: "Accessing payroll statements", views: "890" },
    { title: "Benefits enrollment guide", views: "780" },
    { title: "Project management tools", views: "650" },
    { title: "Training course catalog", views: "540" },
    { title: "IT support ticket system", views: "420" },
    { title: "Company holidays and PTO policy", views: "380" }
  ];

  return (
    <section className="w-full max-w-[1200px] mx-auto py-[60px] px-[40px]">
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col gap-[8px]">
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[36px] text-[#364153] tracking-[-0.5px]">
            Popular Topics
          </h2>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[16px] text-gray-600">
            Most viewed help articles this month
          </p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-[16px] overflow-hidden shadow-sm">
          {topics.map((topic, index) => (
            <TopicItem 
              key={index}
              title={topic.title}
              views={topic.views}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
