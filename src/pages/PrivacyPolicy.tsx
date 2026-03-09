import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";

const PrivacyPolicy = () => (
  <>
    <SEOHead title="מדיניות פרטיות – FilterPhone" description="מדיניות הפרטיות של FilterPhone פילטר פון" path="/privacy" />
    <Breadcrumbs items={[{ label: "מדיניות פרטיות" }]} />
    <section className="section-padding bg-background">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-8">מדיניות פרטיות</h1>
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6 leading-relaxed">
          <p><strong className="text-foreground">FilterPhone (פילטר פון)</strong> מחויבת להגן על פרטיות המשתמשים באתר שלנו.</p>
          <h2 className="text-xl font-heading font-semibold text-foreground">איסוף מידע</h2>
          <p>אנו אוספים מידע שאתם מספקים לנו באופן ישיר בעת יצירת קשר, כגון שם, מספר טלפון וכתובת דוא"ל. אנו לא אוספים מידע אישי ללא הסכמתכם.</p>
          <h2 className="text-xl font-heading font-semibold text-foreground">שימוש במידע</h2>
          <p>המידע שנאסף משמש אך ורק לצורך מתן שירות, יצירת קשר חוזרת, ושיפור השירותים שלנו. איננו מעבירים מידע אישי לצדדים שלישיים ללא הסכמתכם.</p>
          <h2 className="text-xl font-heading font-semibold text-foreground">עוגיות (Cookies)</h2>
          <p>האתר עשוי להשתמש בעוגיות לצורך שיפור חוויית המשתמש וניתוח סטטיסטי. ניתן לחסום עוגיות דרך הגדרות הדפדפן.</p>
          <h2 className="text-xl font-heading font-semibold text-foreground">אבטחת מידע</h2>
          <p>אנו נוקטים באמצעי אבטחה סבירים כדי להגן על המידע האישי שלכם מפני גישה בלתי מורשית, שינוי או מחיקה.</p>
          <h2 className="text-xl font-heading font-semibold text-foreground">יצירת קשר</h2>
          <p>לשאלות בנושא מדיניות הפרטיות, ניתן לפנות אלינו בטלפון <a href="tel:0527186881" className="text-primary hover:underline" dir="ltr">052-718-6881</a> או בדוא"ל <a href="mailto:ywldyld@gmail.com" className="text-primary hover:underline">ywldyld@gmail.com</a>.</p>
        </div>
      </div>
    </section>
  </>
);

export default PrivacyPolicy;