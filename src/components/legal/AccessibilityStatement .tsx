import { CONFIG } from "@/config/config";

const AccessibilityStatement = () => {
  const { contactEmail } = CONFIG

  return (
    <div>
      <p>
        אנו מחויבים להנגשת האתר לכלל המשתמשים, כולל אנשים עם מוגבלויות. האתר נבנה בהתאם לתקני נגישות
        המוגדרים בחוק.
      </p>
      <h3 className="text-lg mt-2">תכונות נגישות:</h3>
      <ul>
        <li>תמיכה בקוראי מסך.</li>
        <li>ניווט באמצעות מקלדת.</li>
        <li>תאימות לצבעים ניגודיים.</li>
      </ul>
      <p className="mt-2">
        אם נתקלתם בבעיה, אנא צרו קשר בכתובת: {contactEmail}
      </p>
    </div>
  )
}

export default AccessibilityStatement;
