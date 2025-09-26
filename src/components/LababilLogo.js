import React, { useState } from 'react';
import { COMPANY_INFO } from '../lib/constants';

export default function LababilLogo({
  size = 24,
  className = "",
  showText = false,
  variant = "default" // "default", "gradient", "white"
}) {
  const [imageError, setImageError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  const logoColors = {
    default: "text-blue-600",
    gradient: "text-white",
    white: "text-white"
  };

  const colorClass = logoColors[variant] || logoColors.default;

  // Use logo from constants, fallback to PNG if SVG fails
  const logoSrc = imageError ? '/logo.png' : COMPANY_INFO.logo;

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
    } else {
      setFallbackError(true);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo Image - Clean, no border/frame */}
      <div
        className="flex-shrink-0 overflow-hidden"
        style={{
          width: size,
          height: size * 0.75,
          backgroundColor: 'transparent', // Remove any background color
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {!fallbackError ? (
          <img
            src={logoSrc}
            alt="Lababil Solution Logo"
            onError={handleImageError}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              filter: variant === 'white' ? 'brightness(0) invert(1)' : 'none'
            }}
            className="drop-shadow-none" // Remove any drop shadow
          />
        ) : (
          // Fallback text logo if both images fail
          <div className={`text-center ${colorClass}`}>
            <div className="font-bold text-lg leading-tight">LABABIL</div>
            <div className="text-sm leading-tight opacity-80">solution</div>
          </div>
        )}
      </div>

      {/* Text Logo */}
      {showText && (
        <div className="ml-3">
          <div className={`font-bold text-lg leading-tight ${colorClass}`}>
            LABABIL
          </div>
          <div className={`text-sm leading-tight ${colorClass} opacity-80`}>
            solution
          </div>
        </div>
      )}
    </div>
  );
}

// Watermark version for print
export function LababilWatermark({ opacity = 0.05, size = 200 }) {
  return (
    <div
      style={{
        width: size,
        height: size * 0.75,
        backgroundImage: `url("${COMPANY_INFO.logo}")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        opacity: opacity
      }}
    />
  );
}

// Logo variations for different uses
export const LogoVariants = {
  Header: (props) => <LababilLogo size={24} showText={true} variant="gradient" {...props} />,
  Print: (props) => <LababilLogo size={48} showText={true} variant="default" {...props} />,
  Footer: (props) => <LababilLogo size={32} showText={false} variant="default" {...props} />,
  Watermark: (props) => <LababilWatermark {...props} />
};
