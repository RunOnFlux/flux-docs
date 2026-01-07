import React from 'react';
import { Icon } from '@iconify/react';
import styles from './ArchitectureDiagram.module.css';

interface DiagramItem {
  label: string;
  icon?: string;
  status?: 'good' | 'bad' | 'neutral';
  note?: string;
}

interface ArchitectureDiagramProps {
  type: 'good' | 'bad';
  title: string;
  items: DiagramItem[];
  externalService?: {
    name: string;
    icon?: string;
  };
  description?: string[];
}

/**
 * ArchitectureDiagram - Visual architecture diagrams with icons
 *
 * Usage:
 * <ArchitectureDiagram
 *   type="bad"
 *   title="Application with Local Storage"
 *   items={[
 *     { label: 'SQLite DB', icon: 'simple-icons:sqlite', status: 'bad', note: 'Data lost on redeploy!' },
 *     { label: 'Local files', icon: 'mdi:folder', status: 'bad', note: 'Uploads lost!' }
 *   ]}
 * />
 */
export default function ArchitectureDiagram({
  type,
  title,
  items,
  externalService,
  description
}: ArchitectureDiagramProps) {
  const borderColor = type === 'good' ? '#22c55e' : '#ef4444';
  const iconColor = type === 'good' ? '#22c55e' : '#ef4444';

  return (
    <div className={styles.diagram}>
      <div className={styles.container} style={{ borderColor }}>
        <div className={styles.header}>
          <Icon
            icon={type === 'good' ? 'mdi:docker' : 'mdi:alert-circle'}
            width={24}
            color={iconColor}
          />
          <span className={styles.title}>{title}</span>
        </div>

        <div className={styles.items}>
          {items.map((item, idx) => (
            <div key={idx} className={styles.item}>
              <div className={styles.itemContent}>
                {item.icon && (
                  <Icon
                    icon={item.icon}
                    width={20}
                    color={
                      item.status === 'good' ? '#22c55e' :
                      item.status === 'bad' ? '#ef4444' :
                      undefined
                    }
                  />
                )}
                <span className={styles.itemLabel}>{item.label}</span>
              </div>
              {item.note && (
                <span className={styles.note}>
                  {item.status === 'bad' && '← '}
                  {item.note}
                </span>
              )}
            </div>
          ))}
        </div>

        {externalService && (
          <div className={styles.connection}>
            <div className={styles.arrow}>→</div>
            <div className={styles.externalService}>
              {externalService.icon && (
                <Icon icon={externalService.icon} width={20} />
              )}
              <span>{externalService.name}</span>
            </div>
          </div>
        )}
      </div>

      {description && description.length > 0 && (
        <div className={styles.description}>
          <strong>Example:</strong>
          <ul>
            {description.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
