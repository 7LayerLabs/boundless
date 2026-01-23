import type { Metadata, Viewport } from 'next';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import {
  // Neat & Tidy
  Caveat,
  Patrick_Hand,
  Kalam,
  Coming_Soon,
  // Messy & Quick
  Shadows_Into_Light,
  Reenie_Beanie,
  Just_Another_Hand,
  Indie_Flower,
  Covered_By_Your_Grace,
  // Elegant Script
  Dancing_Script,
  Great_Vibes,
  Alex_Brush,
  Allura,
  Tangerine,
  // Bold & Expressive
  Permanent_Marker,
  Architects_Daughter,
  Amatic_SC,
  // Childlike & Playful
  Gloria_Hallelujah,
  Short_Stack,
  Gochi_Hand,
  Annie_Use_Your_Telescope,
  // Vintage & Classic
  Homemade_Apple,
  Nothing_You_Could_Do,
  Satisfy,
  Marck_Script,
  // UI Font
  Playfair_Display,
} from 'next/font/google';
import './globals.css';

// Neat & Tidy fonts
const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
});

const patrickHand = Patrick_Hand({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-patrick',
  display: 'swap',
});

const kalam = Kalam({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-kalam',
  display: 'swap',
});

const comingSoon = Coming_Soon({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-comingsoon',
  display: 'swap',
});

// Messy & Quick fonts
const shadowsIntoLight = Shadows_Into_Light({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-shadows',
  display: 'swap',
});

const reenieBeanie = Reenie_Beanie({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-reenie',
  display: 'swap',
});

const justAnotherHand = Just_Another_Hand({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-justanotherhand',
  display: 'swap',
});

const indieFlower = Indie_Flower({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-indieflower',
  display: 'swap',
});

const coveredByYourGrace = Covered_By_Your_Grace({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-coveredbyyourgrace',
  display: 'swap',
});

// Elegant Script fonts
const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-greatvibes',
  display: 'swap',
});

const alexBrush = Alex_Brush({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-alexbrush',
  display: 'swap',
});

const allura = Allura({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-allura',
  display: 'swap',
});

const tangerine = Tangerine({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-tangerine',
  display: 'swap',
});

// Bold & Expressive fonts
const permanentMarker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marker',
  display: 'swap',
});

const architectsDaughter = Architects_Daughter({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-architects',
  display: 'swap',
});

const amaticSC = Amatic_SC({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-amatic',
  display: 'swap',
});

// Childlike & Playful fonts
const gloriaHallelujah = Gloria_Hallelujah({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-gloria',
  display: 'swap',
});

const shortStack = Short_Stack({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-shortstack',
  display: 'swap',
});

const gochiHand = Gochi_Hand({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-gochihand',
  display: 'swap',
});

const annieUseYourTelescope = Annie_Use_Your_Telescope({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-annie',
  display: 'swap',
});

// Vintage & Classic fonts
const homemadeApple = Homemade_Apple({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-homemadeapple',
  display: 'swap',
});

const nothingYouCouldDo = Nothing_You_Could_Do({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-nothingyoucoulddo',
  display: 'swap',
});

const satisfy = Satisfy({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-satisfy',
  display: 'swap',
});

const marckScript = Marck_Script({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marckscript',
  display: 'swap',
});

// UI font for engraved logo
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Boundless - Digital Leather-Bound Journal',
  description: 'A private digital journal for people who want to write honestly. Your thoughts deserve a space that\'s secure, personal, and distraction-free.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Boundless',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#1a1714',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${caveat.variable}
          ${patrickHand.variable}
          ${kalam.variable}
          ${comingSoon.variable}
          ${shadowsIntoLight.variable}
          ${reenieBeanie.variable}
          ${justAnotherHand.variable}
          ${indieFlower.variable}
          ${coveredByYourGrace.variable}
          ${dancingScript.variable}
          ${greatVibes.variable}
          ${alexBrush.variable}
          ${allura.variable}
          ${tangerine.variable}
          ${permanentMarker.variable}
          ${architectsDaughter.variable}
          ${amaticSC.variable}
          ${gloriaHallelujah.variable}
          ${shortStack.variable}
          ${gochiHand.variable}
          ${annieUseYourTelescope.variable}
          ${homemadeApple.variable}
          ${nothingYouCouldDo.variable}
          ${satisfy.variable}
          ${marckScript.variable}
          ${playfairDisplay.variable}
          antialiased
        `}
      >
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
