/**
 * Shared design tokens for the stonecode.ai portal family.
 *
 * `tokens` is the TypeScript/JS-facing source of truth.
 * `theme.css` mirrors it as CSS custom properties for Tailwind + global use.
 * Keep the two files in sync when editing — they're intentionally redundant
 * so both styled-inline and utility-class consumers get the same values.
 */
export declare const tokens: {
    readonly color: {
        readonly accent: {
            readonly 50: "#fff7ed";
            readonly 100: "#ffedd5";
            readonly 200: "#fed7aa";
            readonly 300: "#fdba74";
            readonly 400: "#fb923c";
            readonly 500: "#f97316";
            readonly 600: "#ea580c";
            readonly 700: "#c2410c";
            readonly 800: "#9a3412";
            readonly 900: "#7c2d12";
        };
        readonly bg: {
            readonly dark: "#020617";
            readonly darkSurface: "#0a0502";
            readonly light: "#f8fafc";
        };
        readonly text: {
            readonly darkPrimary: "#ffffff";
            readonly darkSecondary: "#94a3b8";
            readonly lightPrimary: "#0f172a";
            readonly lightSecondary: "#475569";
        };
    };
    readonly radius: {
        readonly sm: "0.5rem";
        readonly md: "0.75rem";
        readonly lg: "1rem";
        readonly xl: "1.25rem";
        readonly '2xl': "1.5rem";
    };
    readonly shadow: {
        readonly glass: "0 8px 32px rgba(0, 0, 0, 0.12)";
        readonly accent: "0 8px 32px rgba(234, 88, 12, 0.35)";
    };
    readonly font: {
        readonly display: "'Space Grotesk', system-ui, sans-serif";
        readonly body: "'Inter', system-ui, sans-serif";
    };
    readonly duration: {
        readonly fast: "150ms";
        readonly normal: "300ms";
        readonly slow: "500ms";
    };
};
export type ThemeTokens = typeof tokens;
export declare const theme: {
    readonly tokens: {
        readonly color: {
            readonly accent: {
                readonly 50: "#fff7ed";
                readonly 100: "#ffedd5";
                readonly 200: "#fed7aa";
                readonly 300: "#fdba74";
                readonly 400: "#fb923c";
                readonly 500: "#f97316";
                readonly 600: "#ea580c";
                readonly 700: "#c2410c";
                readonly 800: "#9a3412";
                readonly 900: "#7c2d12";
            };
            readonly bg: {
                readonly dark: "#020617";
                readonly darkSurface: "#0a0502";
                readonly light: "#f8fafc";
            };
            readonly text: {
                readonly darkPrimary: "#ffffff";
                readonly darkSecondary: "#94a3b8";
                readonly lightPrimary: "#0f172a";
                readonly lightSecondary: "#475569";
            };
        };
        readonly radius: {
            readonly sm: "0.5rem";
            readonly md: "0.75rem";
            readonly lg: "1rem";
            readonly xl: "1.25rem";
            readonly '2xl': "1.5rem";
        };
        readonly shadow: {
            readonly glass: "0 8px 32px rgba(0, 0, 0, 0.12)";
            readonly accent: "0 8px 32px rgba(234, 88, 12, 0.35)";
        };
        readonly font: {
            readonly display: "'Space Grotesk', system-ui, sans-serif";
            readonly body: "'Inter', system-ui, sans-serif";
        };
        readonly duration: {
            readonly fast: "150ms";
            readonly normal: "300ms";
            readonly slow: "500ms";
        };
    };
    readonly cssUrl: "@stonecode/portal-sdk/theme.css";
};
//# sourceMappingURL=theme.d.ts.map