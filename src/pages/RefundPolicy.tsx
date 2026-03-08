import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";

const RefundPolicy = () => (
  <>
    <SEOHead title="מדיניות ביטולים והחזרים – FilterSmart" description="מדיניות ביטולים והחזרים של FilterSmart פילטר סמארט" path="/refund-policy" />
    <Breadcrumbs items={[{ label: "מדיניות החזרים" }]} />
    <section className="section-padding bg-background">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-8">מדיניות ביטולים והחזרים</h1>
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6 leading-relaxed">
          <p><strong className="text-foreground">FilterSmart (פילטר סמארט)</strong> מספקת שירותי צריבה והתקנה מקצועיים. להלן מדיניות הביטולים וההחזרים שלנו:</p>
          <h2 className="text-xl font-heading font-semibold text-foreground">ביטול לפני ביצוע השירות</h2>
          <p>ניתן לבטל הזמנה ולקבל החזר מלא כל עוד השירות טרם בוצע. יש ליצור קשר איתנו בהקדם האפשרי.</p>
          <h2 className="text-xl font-heading font-semibold text-foreground">לאחר ביצוע השירות</h2>
          <p>לאחר שהשירות בוצע (צריבה, התקנה, סינון), לא ניתן לקבל החזר כספי מאחר שמדובר בשירות דיגיטלי שבוצע בפועל. במקרה של תקלה הנובעת מהשירות שלנו, נתקן אותה ללא עלות נוספת.</p>
          <h2 className="text-xl font-heading font-semibold text-foreground">אחריות</h2>
          <p>אנו מעניקים אחריות על עבודת הצריבה וההתקנה בלבד. תמיכה שוטפת ותחזוקת מערכת הסינון הינן באחריות חברות הסינון (הדרן, עסקן, כושר פליי).</p>
          <h2 className="text-xl font-heading font-semibold text-foreground">יצירת קשר</h2>
          <p>לבירורים בנושא ביטולים והחזרים, ניתן לפנות אלינו בטלפון <a href="tel:0527186881" className="text-primary hover:underline" dir="ltr">052-718-6881</a> או בדוא"ל <a href="mailto:ywldyld@gmail.com" className="text-primary hover:underline">ywldyld@gmail.com</a>.</p>
        </div>
      </div>
    </section>
  </>
);

export default RefundPolicy;
