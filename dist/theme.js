/**
 * Shared design tokens for the stonecode.ai portal family.
 *
 * `tokens` is the TypeScript/JS-facing source of truth.
 * `theme.css` mirrors it as CSS custom properties for Tailwind + global use.
 * Keep the two files in sync when editing — they're intentionally redundant
 * so both styled-inline and utility-class consumers get the same values.
 */
export const tokens = {
    color: {
        accent: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
        },
        bg: {
            dark: '#020617',
            darkSurface: '#0a0502',
            light: '#f8fafc',
        },
        text: {
            darkPrimary: '#ffffff',
            darkSecondary: '#94a3b8',
            lightPrimary: '#0f172a',
            lightSecondary: '#475569',
        },
    },
    radius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
    },
    shadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.12)',
        accent: '0 8px 32px rgba(234, 88, 12, 0.35)',
    },
    font: {
        display: "'Space Grotesk', system-ui, sans-serif",
        body: "'Inter', system-ui, sans-serif",
    },
    duration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
    },
};
export const theme = {
    tokens,
    cssUrl: '@stonecode/portal-sdk/theme.css',
};
//# sourceMappingURL=theme.js.map