import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";

const RefundPolicy = () => (
  <>
    <SEOHead title="מדיניות ביטולים והחזרים – FilterPhone" description="מדיניות ביטולים והחזרים של FilterPhone פילטר פון" path="/refund-policy" />
    <Breadcrumbs items={[{ label: "מדיניות החזרים" }]} />
    <section className="section-padding">
      <div className="container-custom max-w-3xl">
        <h1 className="text-display-lg mb-8">מדיניות ביטולים והחזרים</h1>
        <div className="prose-fp">
          <p><strong>FilterPhone (פילטר פון)</strong> מספקת שירותי צריבה והתקנה מקצועיים. להלן מדיניות הביטולים וההחזרים שלנו:</p>
          <h2 className="text-xl">ביטול לפני ביצוע השירות</h2>
          <p>ניתן לבטל הזמנה ולקבל החזר מלא כל עוד השירות טרם בוצע. יש ליצור קשר איתנו בהקדם האפשרי.</p>
          <h2 className="text-xl">לאחר ביצוע השירות</h2>
          <p>לאחר שהשירות בוצע (צריבה, התקנה, סינון), לא ניתן לקבל החזר כספי מאחר שמדובר בשירות דיגיטלי שבוצע בפועל. במקרה של תקלה הנובעת מהשירות שלנו, נתקן אותה ללא עלות נוספת.</p>
          <h2 className="text-xl">אחריות</h2>
          <p>אנו מעניקים אחריות על עבודת הצריבה וההתקנה בלבד. תמיכה שוטפת ותחזוקת מערכת הסינון הינן באחריות חברות הסינון (הדרן, עסקן, כושר פליי).</p>
          <h2 className="text-xl">יצירת קשר</h2>
          <p>לבירורים בנושא ביטולים והחזרים, ניתן לפנות אלינו בטלפון <a href="tel:0527186881" className="font-semibold text-primary underline underline-offset-4" dir="ltr">052-718-6881</a> או בדוא"ל <a href="mailto:ywldyld@gmail.com" className="font-semibold text-primary underline underline-offset-4">ywldyld@gmail.com</a>.</p>
        </div>
      </div>
    </section>
  </>
);

export default RefundPolicy;