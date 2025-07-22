import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bot, Gavel, User2Icon, BookOpenText, Scale, FileText, Users, Shield, Award, CheckCircle, Phone, Mail, MessageSquare, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function LawFirmHome() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  
  // نموذج التواصل
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    message: "",
    preferredContact: ""
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  // قاعدة بيانات الأسئلة والأجوبة القانونية
  const legalQA = {
    // أسئلة الشركات والتجارة
    "شركة": "لتأسيس شركة في السعودية، تحتاج إلى: 1) اختيار نوع الشركة (ذات مسؤولية محدودة، مساهمة، إلخ) 2) حجز اسم تجاري من وزارة التجارة 3) إيداع رأس المال في البنك 4) إعداد عقد التأسيس 5) الحصول على السجل التجاري 6) التسجيل في الزكاة والضريبة. ننصح بمراجعة محامٍ مختص لضمان سلامة الإجراءات.",
    "تأسيس": "لتأسيس شركة في السعودية، تحتاج إلى: 1) اختيار نوع الشركة (ذات مسؤولية محدودة، مساهمة، إلخ) 2) حجز اسم تجاري من وزارة التجارة 3) إيداع رأس المال في البنك 4) إعداد عقد التأسيس 5) الحصول على السجل التجاري 6) التسجيل في الزكاة والضريبة. ننصح بمراجعة محامٍ مختص لضمان سلامة الإجراءات.",
    "عقد": "العقد الصحيح يجب أن يتضمن: 1) أطراف العقد وبياناتهم الكاملة 2) موضوع العقد بوضوح 3) الالتزامات والحقوق لكل طرف 4) المدة الزمنية 5) طريقة الدفع 6) شروط الإنهاء والفسخ 7) آلية حل النزاعات. يُنصح بمراجعة محامٍ قبل التوقيع على أي عقد مهم.",
    "عمل": "عقد العمل يجب أن يحدد: 1) طبيعة العمل والمسمى الوظيفي 2) الراتب والبدلات 3) ساعات العمل والإجازات 4) مدة العقد (محدد أو غير محدد) 5) شروط الإنهاء والاستقالة 6) السرية وعدم المنافسة إن وجدت. يحق للموظف الحصول على نسخة من العقد باللغة العربية.",
    
    // أسئلة الأحوال الشخصية
    "طلاق": "إجراءات الطلاق تشمل: 1) تقديم طلب الطلاق للمحكمة المختصة 2) محاولة الصلح من قبل المحكمة 3) تحديد النفقة والحضانة إن وجد أطفال 4) تقسيم الممتلكات المشتركة 5) إصدار صك الطلاق. يُنصح بالاستعانة بمحامٍ مختص في قضايا الأحوال الشخصية.",
    "حضانة": "الحضانة تُمنح للأم حتى سن 7 سنوات للذكر و9 سنوات للأنثى، ثم يحق للطفل الاختيار. يجب على الحاضن توفير: 1) بيئة آمنة ومناسبة 2) الرعاية الصحية والتعليمية 3) التربية الدينية والأخلاقية. للطرف الآخر حق الزيارة والمبيت حسب ما تقرره المحكمة.",
    "ميراث": "تقسيم الميراث يتم وفقاً للشريعة الإسلامية: 1) سداد الديون والوصايا أولاً 2) توزيع الباقي على الورثة حسب الأنصبة الشرعية 3) للذكر مثل حظ الأنثيين في معظم الحالات 4) يُنصح بالحصول على صك حصر الورثة من المحكمة وتقسيم التركة بإشراف قانوني.",
    "نفقة": "النفقة تشمل: 1) نفقة الزوجة أثناء الزواج وفترة العدة 2) نفقة الأطفال حتى سن الرشد أو الزواج للإناث 3) تشمل المأكل والملبس والمسكن والعلاج والتعليم 4) تُقدر حسب حالة الزوج المالية ومستوى المعيشة. يمكن المطالبة بها قضائياً عند الامتناع.",
    
    // أسئلة العقارات
    "عقار": "شراء العقار يتطلب: 1) التأكد من صحة الصك وخلوه من الرهون 2) فحص العقار هندسياً 3) التأكد من المخططات المعتمدة 4) توثيق عقد البيع في كتابة العدل 5) نقل الملكية في الطابو 6) دفع رسوم نقل الملكية. احذر من العقارات المرهونة أو المتنازع عليها.",
    "إيجار": "عقد الإيجار يجب أن يحدد: 1) مدة الإيجار وقيمة الأجرة 2) طريقة الدفع ومواعيده 3) الغرض من الاستئجار 4) التزامات المؤجر والمستأجر 5) شروط التجديد والإنهاء 6) التأمين إن وجد. يُنصح بتوثيق العقد في منصة إيجار الحكومية.",
    
    // أسئلة الديون والالتزامات
    "دين": "استرداد الدين يمكن من خلال: 1) المطالبة الودية أولاً 2) إنذار المدين كتابياً 3) رفع دعوى قضائية مع الأدلة 4) طلب الحجز التحفظي على أموال المدين 5) التنفيذ الجبري عند صدور الحكم. احتفظ بجميع الأدلة والمستندات المثبتة للدين.",
    "شيك": "الشيك المرتد يُعتبر جريمة جنائية: 1) قدم بلاغاً في الشرطة 2) احتفظ بالشيك الأصلي 3) اجمع الأدلة على التعامل 4) يمكن المطالبة بالتعويض 5) قد يُحكم على المُصدر بالسجن والغرامة. لا تتأخر في اتخاذ الإجراءات القانونية.",
    
    // أسئلة عامة
    "محامي": "اختيار المحامي المناسب: 1) تأكد من ترخيصه وعضويته في الهيئة السعودية للمحامين 2) اطلع على خبرته في مجال قضيتك 3) اسأل عن الأتعاب مقدماً 4) تأكد من توفر الوقت الكافي لقضيتك 5) اطلب مراجع من عملاء سابقين. المحامي الجيد يوضح لك خيارات القضية بصراحة.",
    "قانون": "النظام القانوني السعودي يقوم على: 1) الشريعة الإسلامية كمصدر أساسي 2) الأنظمة واللوائح الصادرة من الجهات المختصة 3) المبادئ القضائية المستقرة 4) الاتفاقيات الدولية المصادق عليها. لكل مجال قوانين خاصة به يجب الرجوع إليها.",
    "حقوق": "حقوقك القانونية تشمل: 1) الحق في المحاكمة العادلة 2) الحق في الاستعانة بمحامٍ 3) الحق في الطعن على الأحكام 4) الحق في التعويض عن الأضرار 5) الحق في الحصول على المعلومات. لا تتنازل عن حقوقك دون استشارة قانونية.",
  };

  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // البحث عن الكلمات المفتاحية في السؤال
    for (const [keyword, answer] of Object.entries(legalQA)) {
      if (lowerQuestion.includes(keyword)) {
        return answer;
      }
    }
    
    // إجابة افتراضية إذا لم يتم العثور على كلمة مفتاحية
    return "شكراً لسؤالك. هذا السؤال يتطلب دراسة تفصيلية لظروف حالتك الخاصة. ننصحك بحجز استشارة مع أحد محامينا المختصين للحصول على إجابة دقيقة ومفصلة تناسب وضعك القانوني. يمكنك التواصل معنا لحجز موعد استشارة.";
  };

  const handleContactSubmit = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      return;
    }
    
    setContactLoading(true);
    setTimeout(() => {
      setContactSubmitted(true);
      setContactLoading(false);
      // إعادة تعيين النموذج
      setContactForm({
        name: "",
        email: "",
        phone: "",
        serviceType: "",
        message: "",
        preferredContact: ""
      });
    }, 2000);
  };

  const resetContactForm = () => {
    setContactSubmitted(false);
  };

  const handleAsk = () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setTimeout(() => {
      const aiAnswer = getAIResponse(question);
      setResponse(aiAnswer);
      setLoading(false);
    }, 2000);
  };

  const services = [
    {
      icon: <Scale className="w-6 h-6" />,
      title: "استشارات قانونية مدنية وتجارية",
      description: "نقدم استشارات متخصصة في القانون المدني والتجاري",
      details: {
        overview: "نقدم استشارات شاملة في مجال القانون المدني والتجاري لحماية حقوقك ومصالحك",
        services: [
          "استشارات في عقود البيع والشراء",
          "قضايا التعويضات والأضرار",
          "النزاعات التجارية والشراكات",
          "قانون الشركات والاستثمار",
          "حقوق الملكية الفكرية"
        ],
        duration: "من 30 دقيقة إلى ساعة حسب تعقيد القضية",
        price: "تبدأ من 500 ريال للاستشارة الواحدة"
      }
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "قضايا الأحوال الشخصية والمواريث",
      description: "خبرة واسعة في قضايا الأسرة والمواريث",
      details: {
        overview: "نتعامل مع قضايا الأسرة بحساسية عالية ومهنية تامة",
        services: [
          "قضايا الطلاق والخلع",
          "حضانة الأطفال ونفقة الزوجة",
          "تقسيم المواريث والتركات",
          "إثبات النسب والولاية",
          "عقود الزواج والمهر"
        ],
        duration: "من ساعة إلى ساعتين حسب تعقيد القضية",
        price: "تبدأ من 800 ريال للاستشارة الواحدة"
      }
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "صياغة العقود ومراجعتها",
      description: "صياغة احترافية للعقود بجميع أنواعها",
      details: {
        overview: "نضمن صياغة عقود محكمة قانونياً تحمي مصالح جميع الأطراف",
        services: [
          "عقود العمل والتوظيف",
          "عقود الإيجار والبيع",
          "عقود الشراكة والاستثمار",
          "عقود الخدمات والتوريد",
          "مراجعة وتعديل العقود الموجودة"
        ],
        duration: "من 3 إلى 7 أيام عمل حسب نوع العقد",
        price: "تبدأ من 1000 ريال للعقد الواحد"
      }
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "التقاضي والتحكيم",
      description: "تمثيل قانوني أمام المحاكم والجهات المختصة",
      details: {
        overview: "نمثلك أمام جميع المحاكم والجهات القضائية بخبرة ومهنية عالية",
        services: [
          "التمثيل أمام المحاكم العامة",
          "التحكيم التجاري والمدني",
          "الطعون والاستئنافات",
          "التنفيذ وحجز الأموال",
          "الصلح والوساطة"
        ],
        duration: "حسب مدة القضية (من شهور إلى سنوات)",
        price: "تبدأ من 5000 ريال حسب نوع القضية"
      }
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "خدمة الاستشارة عبر الذكاء الاصطناعي",
      description: "أداة تفاعلية للحصول على إرشادات قانونية أولية",
      details: {
        overview: "احصل على إجابات فورية لأسئلتك القانونية الأساسية على مدار الساعة",
        services: [
          "إجابات فورية على الأسئلة القانونية",
          "توجيه أولي للإجراءات المطلوبة",
          "معلومات عن القوانين واللوائح",
          "نصائح قانونية عامة",
          "إرشاد لنوع الاستشارة المطلوبة"
        ],
        duration: "فوري - متاح 24/7",
        price: "مجاني للاستخدام الأساسي"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4E342E] to-[#3E2723] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        {/* Header Section */}
        <motion.header
          className="text-center space-y-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Gavel size={56} className="text-amber-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
              الناصح القانوني
            </h1>
          </div>
          <motion.p 
            className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            منصة إلكترونية متخصصة تهدف إلى تسهيل الوصول إلى الخدمات القانونية للأفراد والشركات، 
            من خلال تقديم معلومات قانونية دقيقة، وخدمات استشارية احترافية على أيدي نخبة من المحامين المختصين.
          </motion.p>
        </motion.header>

        {/* Services Section */}
        <motion.section 
          className="space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpenText className="text-amber-400" size={32} />
              <h2 className="text-3xl font-bold">خدماتنا المتخصصة</h2>
            </div>
            <p className="text-gray-300 text-lg">نقدم مجموعة شاملة من الخدمات القانونية المتخصصة</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="bg-[#5D4037] border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-full cursor-pointer">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-400 rounded-lg text-[#4E342E]">
                            {service.icon}
                          </div>
                          <h3 className="font-semibold text-lg">{service.title}</h3>
                        </div>
                        <p className="text-gray-200 text-sm leading-relaxed">{service.description}</p>
                        <div className="pt-2">
                          <Button variant="outline" size="sm" className="text-amber-400 border-amber-400 hover:bg-amber-400 hover:text-[#4E342E]">
                            اعرف المزيد
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-white text-black">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-[#4E342E] flex items-center gap-3">
                        <div className="p-2 bg-amber-400 rounded-lg text-[#4E342E]">
                          {service.icon}
                        </div>
                        {service.title}
                      </DialogTitle>
                      <DialogDescription className="text-lg text-gray-700 mt-4">
                        {service.details.overview}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 mt-6">
                      <div>
                        <h4 className="font-semibold text-lg text-[#4E342E] mb-3">الخدمات المتضمنة:</h4>
                        <ul className="space-y-2">
                          {service.details.services.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-[#4E342E] mb-2">المدة المتوقعة:</h5>
                          <p className="text-gray-700">{service.details.duration}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-[#4E342E] mb-2">الأسعار:</h5>
                          <p className="text-gray-700">{service.details.price}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-[#4E342E] hover:bg-[#3E2723] text-white">
                              <Calendar className="w-4 h-4 ml-2" />
                              احجز استشارة
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-white text-black">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold text-[#4E342E] flex items-center gap-3">
                                <MessageSquare className="w-6 h-6" />
                                تواصل مع المحامي
                              </DialogTitle>
                              <DialogDescription className="text-lg text-gray-700 mt-4">
                                املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن
                              </DialogDescription>
                            </DialogHeader>
                            
                            {!contactSubmitted ? (
                              <div className="space-y-6 mt-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="name" className="text-[#4E342E] font-semibold">الاسم الكامل *</Label>
                                    <Input
                                      id="name"
                                      value={contactForm.name}
                                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                                      placeholder="أدخل اسمك الكامل"
                                      className="border-gray-300 focus:border-[#4E342E]"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[#4E342E] font-semibold">البريد الإلكتروني *</Label>
                                    <Input
                                      id="email"
                                      type="email"
                                      value={contactForm.email}
                                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                      placeholder="example@email.com"
                                      className="border-gray-300 focus:border-[#4E342E]"
                                    />
                                  </div>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-[#4E342E] font-semibold">رقم الهاتف</Label>
                                    <Input
                                      id="phone"
                                      value={contactForm.phone}
                                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                                      placeholder="05xxxxxxxx"
                                      className="border-gray-300 focus:border-[#4E342E]"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-[#4E342E] font-semibold">نوع الخدمة المطلوبة</Label>
                                    <Select value={contactForm.serviceType} onValueChange={(value) => setContactForm({...contactForm, serviceType: value})}>
                                      <SelectTrigger className="border-gray-300 focus:border-[#4E342E]">
                                        <SelectValue placeholder="اختر نوع الخدمة" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="civil">استشارات مدنية وتجارية</SelectItem>
                                        <SelectItem value="family">أحوال شخصية ومواريث</SelectItem>
                                        <SelectItem value="contracts">صياغة العقود</SelectItem>
                                        <SelectItem value="litigation">التقاضي والتحكيم</SelectItem>
                                        <SelectItem value="other">أخرى</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label className="text-[#4E342E] font-semibold">طريقة التواصل المفضلة</Label>
                                  <Select value={contactForm.preferredContact} onValueChange={(value) => setContactForm({...contactForm, preferredContact: value})}>
                                    <SelectTrigger className="border-gray-300 focus:border-[#4E342E]">
                                      <SelectValue placeholder="اختر طريقة التواصل المفضلة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="phone">مكالمة هاتفية</SelectItem>
                                      <SelectItem value="email">بريد إلكتروني</SelectItem>
                                      <SelectItem value="whatsapp">واتساب</SelectItem>
                                      <SelectItem value="office">زيارة المكتب</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="message" className="text-[#4E342E] font-semibold">تفاصيل الاستشارة *</Label>
                                  <Textarea
                                    id="message"
                                    rows={4}
                                    value={contactForm.message}
                                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                                    placeholder="اشرح تفاصيل قضيتك أو استشارتك بإيجاز..."
                                    className="border-gray-300 focus:border-[#4E342E] resize-none"
                                  />
                                </div>
                                
                                <div className="flex gap-3 pt-4">
                                  <Button 
                                    onClick={handleContactSubmit}
                                    disabled={contactLoading || !contactForm.name || !contactForm.email || !contactForm.message}
                                    className="bg-[#4E342E] hover:bg-[#3E2723] text-white flex-1"
                                  >
                                    {contactLoading ? (
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        جاري الإرسال...
                                      </div>
                                    ) : (
                                      <>
                                        <Mail className="w-4 h-4 ml-2" />
                                        إرسال الطلب
                                      </>
                                    )}
                                  </Button>
                                </div>
                                
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                  <p className="text-sm text-amber-800">
                                    <strong>ملاحظة:</strong> سيتم التواصل معك خلال 24 ساعة من إرسال الطلب. 
                                    جميع المعلومات المقدمة سرية ومحمية.
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6 py-8"
                              >
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                  <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <div className="space-y-2">
                                  <h3 className="text-2xl font-bold text-green-700">تم إرسال طلبك بنجاح!</h3>
                                  <p className="text-gray-600">
                                    شكراً لتواصلك معنا. سيقوم المحامي بمراجعة طلبك والتواصل معك خلال 24 ساعة.
                                  </p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                  <p className="text-sm text-blue-800">
                                    <strong>الخطوات التالية:</strong><br />
                                    1. سيتم مراجعة طلبك من قبل المحامي المختص<br />
                                    2. سنتواصل معك لتحديد موعد الاستشارة<br />
                                    3. ستحصل على استشارة قانونية مفصلة
                                  </p>
                                </div>
                                <Button 
                                  onClick={resetContactForm}
                                  variant="outline" 
                                  className="border-[#4E342E] text-[#4E342E] hover:bg-[#4E342E] hover:text-white"
                                >
                                  إرسال طلب آخر
                                </Button>
                              </motion.div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="border-[#4E342E] text-[#4E342E] hover:bg-[#4E342E] hover:text-white">
                              <Phone className="w-4 h-4 ml-2" />
                              معلومات التواصل
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg bg-white text-black">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold text-[#4E342E] flex items-center gap-3">
                                <Phone className="w-6 h-6" />
                                معلومات التواصل
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 mt-6">
                              <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                  <Phone className="w-5 h-5 text-[#4E342E]" />
                                  <div>
                                    <p className="font-semibold text-[#4E342E]">الهاتف</p>
                                    <p className="text-gray-700">+966 50 123 4567</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                  <Mail className="w-5 h-5 text-[#4E342E]" />
                                  <div>
                                    <p className="font-semibold text-[#4E342E]">البريد الإلكتروني</p>
                                    <p className="text-gray-700">info@nasehlaw.com</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                  <MessageSquare className="w-5 h-5 text-[#4E342E]" />
                                  <div>
                                    <p className="font-semibold text-[#4E342E]">واتساب</p>
                                    <p className="text-gray-700">+966 50 123 4567</p>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <p className="text-sm text-amber-800">
                                  <strong>ساعات العمل:</strong><br />
                                  الأحد - الخميس: 9:00 ص - 6:00 م<br />
                                  الجمعة - السبت: مغلق
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Lawyer Profile Section */}
        <motion.section 
          className="space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <User2Icon className="text-amber-400" size={32} />
              <h2 className="text-3xl font-bold">عن المحامي</h2>
            </div>
          </div>
          
          <Card className="bg-[#5D4037] border-none shadow-lg">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-amber-400">المحامي فهد بن ناصر</h3>
                  <p className="text-gray-200 leading-relaxed text-lg">
                    حاصل على درجة الماجستير في القانون، ويتمتع بخبرة تزيد عن 10 سنوات في مجالات التقاضي، 
                    وصياغة العقود، والاستشارات القانونية. يحرص على تقديم الحلول القانونية الفعالة والموثوقة للعملاء.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Award className="text-amber-400" size={20} />
                      <span className="text-gray-200">ماجستير في القانون</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-amber-400" size={20} />
                      <span className="text-gray-200">أكثر من 10 سنوات خبرة</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="text-amber-400" size={20} />
                      <span className="text-gray-200">فلسفة عمل مبنية على النزاهة والمهنية</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-2xl">
                    <User2Icon size={96} className="text-[#4E342E]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* AI Assistant Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-[#5D4037] to-[#4E342E] border-none shadow-2xl">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <Bot className="text-blue-400" size={36} />
                  <h2 className="text-3xl font-bold">مساعد الذكاء الاصطناعي للاستشارات</h2>
                </div>
                <p className="text-gray-200 text-lg max-w-3xl mx-auto leading-relaxed">
                  أداة تفاعلية تتيح للمستخدمين طرح أسئلتهم القانونية والحصول على إجابات إرشادية تعتمد على تقنيات الذكاء الاصطناعي.
                  هذا لا يُعد بديلاً عن الاستشارة القانونية الفعلية.
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto space-y-4">
                <Textarea
                  rows={5}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="اكتب سؤالك القانوني هنا... مثال: ما هي الإجراءات المطلوبة لتأسيس شركة؟"
                  className="bg-white text-black border-2 border-gray-300 focus:border-blue-500 resize-none text-lg p-4 rounded-lg"
                />
                <div className="flex gap-3">
                  <Button 
                    onClick={handleAsk} 
                    disabled={loading || !question.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-500 disabled:to-gray-600 transition-all duration-300 text-lg py-3 rounded-lg shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري المعالجة...
                      </div>
                    ) : (
                      <>
                        <Bot className="w-5 h-5 ml-2" />
                        اطرح السؤال
                      </>
                    )}
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="border-2 border-white text-white hover:bg-white hover:text-[#4E342E] transition-all duration-300 text-lg py-3 px-6 rounded-lg"
                      >
                        <MessageSquare className="w-5 h-5 ml-2" />
                        تحدث مع محامي
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white text-black">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-[#4E342E] flex items-center gap-3">
                          <MessageSquare className="w-6 h-6" />
                          تحدث مع المحامي مباشرة
                        </DialogTitle>
                        <DialogDescription className="text-lg text-gray-700 mt-4">
                          هل تحتاج لاستشارة قانونية متخصصة؟ تواصل مع المحامي مباشرة
                        </DialogDescription>
                      </DialogHeader>
                      
                      {!contactSubmitted ? (
                        <div className="space-y-6 mt-6">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name2" className="text-[#4E342E] font-semibold">الاسم الكامل *</Label>
                              <Input
                                id="name2"
                                value={contactForm.name}
                                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                                placeholder="أدخل اسمك الكامل"
                                className="border-gray-300 focus:border-[#4E342E]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email2" className="text-[#4E342E] font-semibold">البريد الإلكتروني *</Label>
                              <Input
                                id="email2"
                                type="email"
                                value={contactForm.email}
                                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                placeholder="example@email.com"
                                className="border-gray-300 focus:border-[#4E342E]"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone2" className="text-[#4E342E] font-semibold">رقم الهاتف</Label>
                            <Input
                              id="phone2"
                              value={contactForm.phone}
                              onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                              placeholder="05xxxxxxxx"
                              className="border-gray-300 focus:border-[#4E342E]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="message2" className="text-[#4E342E] font-semibold">سؤالك أو استشارتك *</Label>
                            <Textarea
                              id="message2"
                              rows={4}
                              value={contactForm.message}
                              onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                              placeholder="اشرح سؤالك أو استشارتك القانونية بالتفصيل..."
                              className="border-gray-300 focus:border-[#4E342E] resize-none"
                            />
                          </div>
                          
                          <div className="flex gap-3 pt-4">
                            <Button 
                              onClick={handleContactSubmit}
                              disabled={contactLoading || !contactForm.name || !contactForm.email || !contactForm.message}
                              className="bg-[#4E342E] hover:bg-[#3E2723] text-white flex-1"
                            >
                              {contactLoading ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  جاري الإرسال...
                                </div>
                              ) : (
                                <>
                                  <Mail className="w-4 h-4 ml-2" />
                                  إرسال للمحامي
                                </>
                              )}
                            </Button>
                          </div>
                          
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-800">
                              <strong>ميزة خاصة:</strong> عند التواصل مع المحامي مباشرة، ستحصل على رد شخصي 
                              ومفصل خلال ساعات قليلة، مع إمكانية حجز استشارة مجانية لمدة 15 دقيقة.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center space-y-6 py-8"
                        >
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-green-700">تم إرسال رسالتك للمحامي!</h3>
                            <p className="text-gray-600">
                              سيقوم المحامي بمراجعة استشارتك والرد عليك شخصياً خلال ساعات قليلة.
                            </p>
                          </div>
                          <Button 
                            onClick={resetContactForm}
                            variant="outline" 
                            className="border-[#4E342E] text-[#4E342E] hover:bg-[#4E342E] hover:text-white"
                          >
                            إرسال استشارة أخرى
                          </Button>
                        </motion.div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              {response && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-2xl mx-auto"
                >
                  <Alert className="bg-gradient-to-r from-blue-50 to-blue-100 text-black border-2 border-blue-300 shadow-lg rounded-lg">
                    <Bot className="h-5 w-5 text-blue-600" />
                    <AlertTitle className="font-bold text-blue-800 text-lg">إجابة المساعد القانوني</AlertTitle>
                    <AlertDescription className="mt-3 text-blue-900 leading-relaxed">
                      {response}
                    </AlertDescription>
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>تنبيه مهم:</strong> هذا الرد إرشادي فقط مقدم من نظام ذكاء اصطناعي، ولا يُعتبر حكمًا قانونيًا نهائيًا. 
                        ننصح بزيارة محامٍ مختص لمراجعة حالتك بدقة.
                      </p>
                    </div>
                  </Alert>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* Footer */}
        <motion.footer 
          className="text-center space-y-4 pt-12 border-t border-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 text-amber-400">
            <Gavel size={24} />
            <span className="font-semibold">الناصح القانوني</span>
          </div>
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} الناصح القانوني - جميع الحقوق محفوظة
          </p>
          <p className="text-xs text-gray-400">
            منصة إلكترونية متخصصة لتسهيل الوصول إلى الخدمات القانونية
          </p>
        </motion.footer>
      </div>
    </div>
  );
}