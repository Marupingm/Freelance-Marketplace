"use client";

import React from 'react';
import { Hexagon, Github, Twitter } from "lucide-react"
import { Footer as FooterComponent } from "@/components/ui/footer"

export default function Footer() {
  return (
    <FooterComponent
      logo={<Hexagon className="h-10 w-10" />}
      brandName="Marketplace"
      socialLinks={[
        {
          icon: <Twitter className="h-5 w-5" />,
          href: "https://twitter.com",
          label: "Twitter",
        },
        {
          icon: <Github className="h-5 w-5" />,
          href: "https://github.com",
          label: "GitHub",
        },
      ]}
      mainLinks={[
        { href: "/products", label: "Products" },
        { href: "/about", label: "About" },
        { href: "/blog", label: "Blog" },
        { href: "/contact", label: "Contact" },
      ]}
      legalLinks={[
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
      ]}
      copyright={{
        text: "© 2024 Marketplace",
        license: "All rights reserved",
      }}
    />
  );
} //  
//  
