import React from 'react';
import { Icon } from '@iconify/react';

interface MDXIconProps {
  icon: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * MDXIcon - A simple wrapper for Iconify icons in MDX files
 *
 * Usage in .md files:
 * <MDXIcon icon="mdi:check-circle" />
 * <MDXIcon icon="simple-icons:react" size={20} />
 * <MDXIcon icon="mdi:alert" color="#ff0000" />
 */
export default function MDXIcon({
  icon,
  size = 16,
  color,
  style = {},
  className = ''
}: MDXIconProps) {
  return (
    <Icon
      icon={icon}
      width={size}
      height={size}
      color={color}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        marginRight: '4px',
        ...style
      }}
      className={className}
    />
  );
}
