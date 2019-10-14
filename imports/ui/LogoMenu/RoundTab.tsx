import React from 'react';

interface IRoundTabProps {
  className: string;
}
export const RoundTab: React.FC<IRoundTabProps> = ({
  className,
}) => (
  <svg
    className={className}
    viewBox="0 0 53 26.5"
    height={100}
    width={200}
  >
    <defs>
      <filter id="f1" x="0" y="0">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1 1" />
      </filter>
    </defs>
    <path d="M0 0a53 53 0 0 0 7.09 26.5L53 0z" filter="url(#f1)" />
  </svg>
);

export default RoundTab;
