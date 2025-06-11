import React from 'react'
import { Button } from '@/components/ui/button'

interface CTAButtonProps {
    children: React.ReactNode
    onClick?: () => void // Optional onClick handler
}

const CTAButton = ({ children, onClick }: CTAButtonProps) => {
    return (
        <Button 
            onClick={onClick}
            className="md:text-base bg-cta hover:bg-cta-foreground transition-all duration-300 rounded-full px-6 py-3 shadow-md font-bold">
            {children}
        </Button>
    )
}

export default CTAButton