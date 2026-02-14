import { Truck, ShieldCheck, CreditCard, RotateCcw } from "lucide-react";

const features = [
  { icon: <Truck strokeWidth={1.5} className="w-7 h-7" />, title: "توصيل سريع", description: "لكافة المحافظات" },
  { icon: <ShieldCheck strokeWidth={1.5} className="w-7 h-7" />, title: "خامات راقية", description: "جودة تليق بكِ" },
  { icon: <CreditCard strokeWidth={1.5} className="w-7 h-7" />, title: "الدفع عند الاستلام", description: "تسوقي بكل أمان" },
  { icon: <RotateCcw strokeWidth={1.5} className="w-7 h-7" />, title: "استبدال مرن", description: "خلال 14 يوم" },
];

const Features = () => {
  return (
    <section className="py-10 bg-[#F9F4F0]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="mb-3 p-4 rounded-full bg-white text-[#BD8448] transition-transform group-hover:scale-110 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="font-bold text-sm md:text-base text-[#4A4A4A] font-['Tajawal']">{feature.title}</h3>
              <p className="text-xs text-[#8E8E8E] font-['Tajawal'] mt-1">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
