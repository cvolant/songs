import React from 'react';

const Logo = props => (
  <svg
    viewBox="0 0 60.854 60.854"
    height={230}
    width={230}
    enableBackground="new"
    {...props}
  >
    <defs>
      <filter id="prefix__a" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity={0.498} floodColor="#000" result="flood" />
        <feComposite
          in="flood"
          in2="SourceGraphic"
          operator="out"
          result="composite1"
        />
        <feGaussianBlur in="composite1" stdDeviation={3} result="blur" />
        <feOffset dx={2} dy={2} result="offset" />
        <feComposite
          in="offset"
          in2="SourceGraphic"
          operator="atop"
          result="composite2"
        />
      </filter>
    </defs>
    <g
      transform="translate(-4.796 -231.39)"
      opacity={1}
      fill="#ff8b00"
      filter="url(#prefix__a)"
    >
      <flowroot
        style={{
          lineHeight: 1.25,
        }}
        xmlSpace="preserve"
        fontStyle="normal"
        fontWeight={400}
        fontSize={40}
        fontFamily="sans-serif"
        letterSpacing={0}
        wordSpacing={0}
        fill="#ff8b00"
        fillOpacity={1}
        stroke="none"
      >
        <flowregion fill="#ff8b00" fillOpacity={1}>
          <path d="M-1034.286-40.337h17.143V8.234h-17.143z" />
        </flowregion>
        <flowpara />
      </flowroot>
      <path
        d="M54.99 267.374c3.32 6.227 4.963 10.491 8.163 16.774 1.086 2.13 2.137 4.872.38 6.028-3.418 2.248-4.59-.131-6.57-4.296-7.96-16.752-4.897-10.753-7.432-16.224-.97-2.097 4.146-4.747 5.46-2.282zm-10.363-6.91c-2.276-4.515-4.893-10.794-8.284-17.985-.428-.909-1.344-1.042-1.737-.226-3.436 7.134-6.742 13.616-8.782 18.188-1.087 2.438-6.748.535-5.53-1.899l12.75-25.468c1.167-2.059 3.791-2.045 4.807-.164 12.715 25.153 8.684 17.11 12.715 25.153 1.169 2.33-4.582 5.092-5.939 2.401zM21.14 270.2c-3.141 6.229-5.555 11.821-8.361 17.49-1.203 2.419-3.199 4.076-6.042 2.638-1.706-.863-.605-3.262.53-5.5 8.502-16.75-1.22 2.487 8.502-16.75 1.248-2.47 6.464-.142 5.37 2.122z"
        style={{
          lineHeight: 1.25,
          InkscapeFontSpecification: 'HanWangYenHeavy',
        }}
        fontWeight={400}
        fontSize={50.8}
        fontFamily="HanWangYenHeavy"
        letterSpacing={0}
        wordSpacing={0}
        opacity={1}
        strokeWidth={0.403}
      />
      <path
        d="M35.188 245.138c-1.558 0-2.633.432-2.946 6.854-.426 8.737-.32 19.632.106 28.305.363 7.411.805 11.683 2.84 11.683 2.036 0 2.477-4.272 2.84-11.683.426-8.673.532-19.568.107-28.305-.313-6.422-1.388-6.854-2.947-6.854z"
        opacity={1}
        strokeWidth={2.341}
      />
      <path
        d="M20.25 261.468c-6.076-.79-6.853-1.169-6.853.954 0 2.122 2.322 3.817 6.853 4.714 11.062 2.189 18.857 2.306 28.373.042 7.234-1.722 7.627-2.726 7.627-4.757 0-2.03-.244-1.729-7.627-.83-10.451 1.27-16.887 1.371-28.373-.123z"
        opacity={1}
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default Logo;