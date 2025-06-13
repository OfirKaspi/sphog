import { CONFIG } from "@/config/config";

const AccessibilityStatement = () => {
  const { contactEmail } = CONFIG

  return (
    <div>
      <p>
          אנו מחויבים להנגשת האתר לכלל המשתמשים, כולל אנשים עם מוגבלות.
        <b>האתר נבנה בהתאם להנחיות תקן WCAG 2.0, ככל האפשר.</b>
      </p>
      <h3 className="text-lg mt-2">תכונות נגישות באתר:</h3>
      <ul>
        <li>תמיכה בקוראי מסך.</li>
        <li>ניווט באמצעות מקלדת.</li>
        <li>התאמות לניגודיות צבעים.</li>
      </ul>
      <p className="mt-2">
        אם נתקלתם בבעיה, אנא צרו קשר: {contactEmail}
      </p>
    </div>
  )
}

export default AccessibilityStatement;
