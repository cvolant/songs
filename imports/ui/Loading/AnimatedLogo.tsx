/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import theme from '../../client/theme';

interface IAnimatedLogo {
  className: string;
}

export const AnimatedLogo: React.FC<IAnimatedLogo> = ({
  className,
}) => {
  const duration = 2;
  const delayed = ` + ${duration / 4}s`;
  const animateProps = {
    dur: `${duration}s`,
    repeatCount: 'indefinite',
    calcMode: 'spline',
    values: '4; -4; 4;',
    keyTimes: '0; 0.5; 1',
    keySplines: '.44,.05,.55,.95; .44,.05,.55,.95;',
  };

  return (
    <svg viewBox="-43 -40 187 190" className={className}>
      <defs>
        <filter id="insetShadow">
          <feFlood result="flood" />
          <feComposite in="flood" in2="SourceGraphic" operator="out" result="composite1" />
          <feGaussianBlur in="composite1" result="blur" stdDeviation="3" />
          <feOffset dx="4" dy="4" result="offset">
            <animate attributeName="dx" {...animateProps} id="xShadow" />
            <animate attributeName="dy" {...animateProps} begin={`xShadow.begin${delayed}`} />
          </feOffset>
          <feComposite in="offset" in2="SourceGraphic" operator="atop" result="composite2" />
        </filter>
        <filter id="dropShadow">
          <feFlood result="flood" />
          <feComposite in="flood" in2="SourceGraphic" operator="in" result="composite1" />
          <feGaussianBlur in="composite1" stdDeviation="3" result="blur" />
          <feOffset dx="4" dy="4" result="offset">
            <animate attributeName="dx" {...animateProps} begin="xShadow.begin" />
            <animate attributeName="dy" {...animateProps} begin={`xShadow.begin${delayed}`} />
          </feOffset>
          <feComposite in="SourceGraphic" in2="offset" operator="over" result="composite2" />
        </filter>
        <linearGradient id="linearGradient">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#aeaeae" />
          <stop offset="0.8" stopColor="#565656" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
        <radialGradient
          xlinkHref="#linearGradient"
          id="radialGradient"
          cx="35"
          cy="40"
          fx="35"
          fy="40"
          r="80"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(1,0,0,1,-4,-4)"
        >
          <animate attributeName="cx" {...animateProps} values="35; 65; 35" begin="xShadow.begin" />
          <animate attributeName="cy" {...animateProps} values="40; 70; 40" begin={`xShadow.begin${delayed}`} />
          <animate attributeName="fx" {...animateProps} values="35; 65; 35" begin="xShadow.begin" />
          <animate attributeName="fy" {...animateProps} values="40; 70; 40" begin={`xShadow.begin${delayed}`} />
        </radialGradient>
      </defs>
      <g>
        <circle fill={theme.palette.primary.main} id="circle" r="80" cx="50" cy="55" filter="url(#dropShadow)" />
        <circle id="circle" r="80" cx="50" cy="55" fill="url(#radialGradient)" opacity="0.25" />
        <g fill={theme.palette.secondary.main}>
          <path d="m83.82 59.30c5.66 10.29 8.46 17.35 13.92 27.74 1.85 3.52 3.64 8.05 0.64 9.96-5.83 3.71-7.83-0.21-11.20-7.10-13.58-27.70-8.35-17.78-12.67-26.83-1.65-3.46 7.07-7.85 9.31-3.77zm-17.67-11.42c-3.88-7.46-8.34-17.85-14.13-29.74-0.73-1.50-2.29-1.72-2.96-0.37-5.86 11.79-11.50 22.51-14.98 30.08-1.85 4.03-11.51 0.88-9.43-3.13l21.75-42.11c1.98-3.40 6.46-3.38 8.20-0.27 21.69 41.59 14.81 28.29 21.69 41.59 1.99 3.85-7.81 8.42-10.13 3.97zm-40.07 16.1c-5.35 10.30-9.47 19.55-14.26 28.92-2.05 4.00-5.45 6.74-10.30 4.36-2.91-1.42-1.03-5.39 0.90-9.09 14.50-27.7-2.08 4.11 14.50-27.7 2.12-4.08 11.02-0.23 9.16 3.50z" filter="url(#insetShadow)" />
          <path d="m50.04 22.53c-2.65 0-4.49 0.71-5.02 11.33-0.72 14.45-0.54 32.46 0.18 46.81 0.62 12.25 1.37 19.32 4.84 19.32 3.47 0 4.22-7.06 4.84-19.32 0.72-14.34 0.90-32.36 0.18-46.81-0.53-10.62-2.36-11.33-5.02-11.33z" filter="url(#insetShadow)" />
          <g transform="matrix(.5 0 0 .5 86 8.7)" filter="url(#insetShadow)">
            <path d="m-115.88 79.89c-19.61-2.55-22.12-3.78-22.12 3.08s7.49 12.35 22.12 15.25c35.70 7.08 60.87 7.46 91.58 0.13 23.35-5.57 24.62-8.82 24.62-15.39-4e-6 -6.56-0.78-5.59-24.62-2.68-33.73 4.11-54.51 4.44-91.58-0.39z" />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default AnimatedLogo;
