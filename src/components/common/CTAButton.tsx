import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CTAColorType } from '@/types/types'

interface CTAButtonProps {
    children: React.ReactNode
    onClick?: () => void // Optional onClick handler
    color?: CTAColorType
}

const CTAButton = ({ children, onClick, color = CTAColorType.DEFAULT }: CTAButtonProps) => {
    const colorStyles = {
        [CTAColorType.DEFAULT]: "bg-cta hover:bg-cta-foreground",
        [CTAColorType.BLUE]: "bg-sky-500 hover:bg-sky-600",
        [CTAColorType.GREEN]: "bg-green-500 hover:bg-green-600",
    }

    return (
        <Button 
            onClick={onClick}
            className={cn(
                "md:text-base transition-all duration-300 rounded-full px-6 py-3 shadow-md font-bold",
                colorStyles[color]
            )}>
            {children}
        </Button>
    )
}

export default CTAButton