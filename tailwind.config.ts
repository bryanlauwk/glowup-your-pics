import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Romantic color palette for SwipeBoost
        "love-pink": "hsl(var(--love-pink))",
        "romance-rose": "hsl(var(--romance-rose))",
        "blush-soft": "hsl(var(--blush-soft))",
        "passionate-pink": "hsl(var(--passionate-pink))",
        "tender-pink": "hsl(var(--tender-pink))",
        "enchanting-purple": "hsl(var(--enchanting-purple))",
        "dreamy-lavender": "hsl(var(--dreamy-lavender))",
        "magic-pink": "hsl(var(--magic-pink))",
        "cupid-glow": "hsl(var(--cupid-glow))",
        // Legacy colors for backward compatibility
        "violet-purple": "hsl(270 80% 75%)",
        "hot-pink": "hsl(320 90% 70%)",
        "magenta-glow": "hsl(300 85% 80%)",
        "lavender-soft": "hsl(280 65% 88%)",
        "deep-purple": "hsl(260 90% 65%)",
        "bright-pink": "hsl(330 95% 75%)",
        "dark-surface": "hsl(260 15% 10%)",
        "rose-gold": "hsl(15 85% 75%)",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-accent": "var(--gradient-accent)", 
        "gradient-dark": "var(--gradient-dark)",
        "gradient-sunset": "var(--gradient-sunset)",
        "gradient-glow": "var(--gradient-glow)",
      },
      boxShadow: {
        "glow-violet": "0 0 40px hsl(270 80% 75% / 0.5)",
        "glow-pink": "0 0 40px hsl(320 90% 70% / 0.5)",
        "dark": "var(--shadow-dark)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        '50': '200px',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        "spin-slow": {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
