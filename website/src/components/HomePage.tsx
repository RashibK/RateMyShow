import React from "react";
import { motion } from "framer-motion";
import FirefoxLogo from "../assets/Firefox_logo.svg";
import GithubLogo from "../assets/github.svg";

interface ButtonProps {
  href: string;
  icon: string;
  children: React.ReactNode;
  primary?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  href,
  icon,
  children,
  primary = false,
}) => (
  <motion.a
    href={href}
    className={`inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
      primary
        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
        : "border-2 border-indigo-400/30 text-indigo-200 hover:bg-indigo-900/30 hover:border-indigo-400/50 backdrop-blur-sm"
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    target="_blank"
  >
    <img src={icon} alt="" className={`${primary ? "w-7 h-7" : "w-6 h-6"}`} />
    {children}
  </motion.a>
);

const FooterLink: React.FC<{
  href: string;
  icon: string;
  children: React.ReactNode;
}> = ({ href, icon, children }) => (
  <motion.a
    href={href}
    className="flex items-center gap-2 text-gray-400 hover:text-indigo-300 transition-colors duration-200 text-sm"
    whileHover={{ scale: 1.05 }}
    target="_blank"
  >
    <span className="text-base">{icon}</span>
    {children}
  </motion.a>
);

const HomePage: React.FC = () => {
  return (
    <div className="h-screen w-full relative bg-black flex flex-col">
      {/* Indigo Cosmos Background with Top Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%), #000000",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            RateMyShow
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Auto-sync and rate anime from Crunchyroll to MyAnimeList or AniList
          </motion.p>

          <motion.p
            className="text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Seamlessly track your anime progress across platforms with this
            browser extension
          </motion.p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Button
            href="https://addons.mozilla.org/firefox/addon/ratemyshow/"
            icon={FirefoxLogo}
            primary
          >
            Add to Firefox
          </Button>

          <Button
            href="https://github.com/RashibK/RateMyShow"
            icon={GithubLogo}
          >
            View on GitHub
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-8">
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <span className="text-gray-500 text-sm">© 2025 RateMyShow</span>
          <FooterLink
            href="https://github.com/RashibK/RateMyShow/wiki/Privacy-Policy"
            icon=""
          >
            Privacy Policy
          </FooterLink>
          <FooterLink href="mailto:contact@rashib.dev" icon="">
            Contact Me
          </FooterLink>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
