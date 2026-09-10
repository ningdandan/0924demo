import { MessageSquare, Mail, Phone, Calendar } from "lucide-react";

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick?: () => void;
}

function QuickAction({ icon, label, description, onClick }: QuickActionProps) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-[12px] p-[24px] bg-white border border-gray-200 rounded-[16px] hover:border-[#066afe] hover:shadow-md transition-all group"
    >
      <div className="bg-blue-50 p-[16px] rounded-full group-hover:bg-[#066afe] transition-colors">
        <div className="[&>svg]:group-hover:text-white [&>svg]:transition-colors">
          {icon}
        </div>
      </div>
      <div className="flex flex-col items-center gap-[4px]">
        <span className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[16px] text-[#364153]">
          {label}
        </span>
        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-gray-600 text-center">
          {description}
        </span>
      </div>
    </button>
  );
}

export function QuickActions() {
  const actions = [
    {
      icon: <MessageSquare className="size-[28px] text-[#066afe]" />,
      label: "Live Chat",
      description: "Chat with support"
    },
    {
      icon: <Mail className="size-[28px] text-[#066afe]" />,
      label: "Email Support",
      description: "Send us a message"
    },
    {
      icon: <Phone className="size-[28px] text-[#066afe]" />,
      label: "Call Us",
      description: "Speak to an agent"
    },
    {
      icon: <Calendar className="size-[28px] text-[#066afe]" />,
      label: "Book Meeting",
      description: "Schedule a session"
    }
  ];

  return (
    <section className="w-full bg-gray-50 py-[80px]">
      <div className="max-w-[1200px] mx-auto px-[40px]">
        <div className="flex flex-col gap-[40px]">
          <div className="flex flex-col items-center gap-[12px] text-center">
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[36px] text-[#364153] tracking-[-0.5px]">
              Need More Help?
            </h2>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[16px] text-gray-600 max-w-[600px]">
              Our support team is here to assist you. Choose your preferred method of contact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
            {actions.map((action, index) => (
              <QuickAction 
                key={index}
                icon={action.icon}
                label={action.label}
                description={action.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
