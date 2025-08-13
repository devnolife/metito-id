"use client"

import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SocialMediaButtons() {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ]

  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-2 z-40">
      {socialLinks.map((social, index) => (
        <Button
          key={index}
          size="icon"
          className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          style={{ backgroundColor: "#092D74" }}
          asChild
        >
          <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
            <social.icon className="w-5 h-5 text-white" />
          </a>
        </Button>
      ))}
    </div>
  )
}
