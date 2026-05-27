// src/app/swagger/page.tsx
'use client';

import { useEffect, useRef } from 'react';
import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-bundle.js';
import 'swagger-ui-dist/swagger-ui.css';

export default function SwaggerPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ui = SwaggerUIBundle({
      url: '/api/swagger', // Points to your OpenAPI JSON endpoint
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.presets.standaloneLayout],
    });

    return () => {
      ui?.destroy();
    };
  }, []);

  return <div ref={containerRef} id="swagger-ui" className="w-full" />;
}