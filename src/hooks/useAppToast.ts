// src/lib/useAppToast.ts
// --------------------------------------------------------------
// A light‑weight wrapper around Shadcn‑UI’s `useToast` hook that
// gives you one‑liners like `toast.success("Saved!")` anywhere in
// your app. Import it inside any React component:
//
//   const toast = useAppToast();
//   toast.success("הפעולה הושלמה בהצלחה!");
// --------------------------------------------------------------

import { useToast } from "@/hooks/use-toast";
import type { ToastProps } from "@/components/ui/toast";

/**
 * Options you can pass to fine‑tune an individual toast. All keys are optional.
 */
export type AppToastOptions = Partial<Omit<ToastProps, "description">>;

export interface AppToast {
    /** Green success message. */
    success: (message: string, opts?: AppToastOptions) => void;
    /** Red destructive / error message. */
    error: (message: string, opts?: AppToastOptions) => void;
    /** Neutral info message. */
    info: (message: string, opts?: AppToastOptions) => void;
}

/**
 * Hook that returns the simplified toast API.
 */
export function useAppToast(): AppToast {
    const { toast } = useToast();

    /** Internal helper that forwards everything to Shadcn but injects defaults. */
    const push = (
        message: string,
        defaults: ToastProps,
        opts: AppToastOptions | undefined
    ) => toast({ ...defaults, ...opts, description: message });

    return {
        success: (message, opts) =>
            push(
                message,
                {
                    variant: "default",
                    duration: 3000,
                    className: "border border-green-800 bg-green-700 text-white [&_*]:text-white",
                },
                opts
            ),

        error: (message, opts) =>
            push(
                message,
                {
                    variant: "destructive",
                    duration: 5000,
                },
                opts
            ),

        info: (message, opts) =>
            push(
                message,
                {
                    variant: "default",
                    duration: 3000,
                },
                opts
            ),
    };
}
