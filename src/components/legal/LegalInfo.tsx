import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import AccessibilityStatement from "./AccessibilityStatement ";

const LegalInfo = () => {
  const data = {
    items: [
      {
        _id: "1",
        title: "מדיניות פרטיות",
        desc: <PrivacyPolicy />
      },
      {
        _id: "2",
        title: "תנאי שירות",
        desc: <TermsOfService />
      },
      {
        _id: "3",
        title: "הצהרת נגישות",
        desc: <AccessibilityStatement />
      },
    ]
  }

  return (
    <ul className="flex items-center justify-center gap-2">
      {data.items.map((item) => (
        <Dialog key={item._id}>
          <DialogTrigger asChild>
            <li className="text-sm underline cursor-pointer">{item.title}</li>
          </DialogTrigger>
          <DialogContent className="max-w-[350px] sm:max-w-[450px] rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-center">
                {item.title}
              </DialogTitle>
            </DialogHeader>
            <DialogDescription asChild className="text-start">
              {item.desc}
            </DialogDescription>
          </DialogContent>
        </Dialog>
      ))}
    </ul>)
}

export default LegalInfo