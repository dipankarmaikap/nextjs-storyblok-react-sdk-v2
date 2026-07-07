/**
 * SDK v2 Test Page
 *
 * This page demonstrates the new SDK architecture where:
 * - Server components (with DB access) can be nested inside client components
 * - The "children" pattern is built into the resolver
 * - Users can't make the mistake of importing the registry in client components
 */

import {
  StoryblokServerStory,
  StoryblokServerComponent,
  type Story,
  type ComponentsMap,
} from "../SDK";
import { exampleComponents } from "../SDK/example-bloks";

// Mock story data that demonstrates the nested server/client pattern
const mockStory: Story = {
  id: 1,
  uuid: "test-uuid",
  name: "SDK v2 Test",
  slug: "sdk-v2-test",
  full_slug: "sdk-v2-test",
  created_at: "2024-01-01",
  published_at: "2024-01-01",
  content: {
    _uid: "page-1",
    component: "page",
    title: "SDK v2 Architecture Demo",
    body: [
      // Direct server component
      {
        _uid: "feature-1",
        component: "feature",
        title: "Direct Server Component",
        description: "This renders directly in the page - simple case.",
      },

      // Client component (accordion) with nested server component (product_list)
      // This is the KEY test case - it would fail with the old registry approach!
      {
        _uid: "accordion-1",
        component: "accordion",
        title: "🔥 Click to see Server Component inside Client Component",
        default_open: false,
        body: [
          {
            _uid: "product-list-1",
            component: "product_list",
            title: "Products from Database",
            category: "electronics",
          },
        ],
      },

      // Deeply nested: Client > Server > Client > Server
      {
        _uid: "accordion-2",
        component: "accordion",
        title: "Deep Nesting: Client → Server → Client → Server",
        default_open: false,
        body: [
          {
            _uid: "feature-2",
            component: "feature",
            title: "Server Component (Level 1)",
            description: "Inside first accordion",
            body: [
              {
                _uid: "accordion-3",
                component: "accordion",
                title: "Another Accordion (Client, Level 2)",
                body: [
                  {
                    _uid: "product-list-2",
                    component: "product_list",
                    title: "More Products (Server, Level 3)",
                    category: "sports",
                  },
                ],
              },
            ],
          },
        ],
      },

      // Tabs with multiple server components
      {
        _uid: "tabs-1",
        component: "tabs",
        tabs: [
          { _uid: "tab-1", label: "Electronics" },
          { _uid: "tab-2", label: "Sports" },
          { _uid: "tab-3", label: "Home" },
        ],
        body: [
          {
            _uid: "product-list-3",
            component: "product_list",
            title: "Electronics Tab",
            category: "electronics",
          },
          {
            _uid: "product-list-4",
            component: "product_list",
            title: "Sports Tab",
            category: "sports",
          },
          {
            _uid: "product-list-5",
            component: "product_list",
            title: "Home Tab",
            category: "home",
          },
        ],
      },
    ],
  },
};

// Type for searchParams in Next.js 15+
type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SDKTestPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const livePreview = sp._storyblok !== undefined || sp.lp === "1";

  // The render server action - this is where the magic happens
  async function render(story: Story) {
    "use server";
    return (
      <StoryblokServerComponent
        blok={story.content}
        components={exampleComponents}
        story={story}
      />
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <header
          style={{
            marginBottom: "32px",
            paddingBottom: "16px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <h1 style={{ margin: "0 0 8px 0", color: "#0f172a" }}>
            SDK v2 Architecture Test
          </h1>
          <p style={{ margin: 0, color: "#64748b" }}>
            Live Preview: <code>{String(livePreview)}</code> (add{" "}
            <code>?lp=1</code> to enable)
          </p>
        </header>

        {/* Explanation */}
        <section
          style={{
            marginBottom: "24px",
            padding: "16px",
            background: "#ecfdf5",
            borderRadius: "8px",
            border: "1px solid #6ee7b7",
          }}
        >
          <h2 style={{ margin: "0 0 12px 0", color: "#065f46", fontSize: "1rem" }}>
            ✅ What This Demonstrates
          </h2>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "#047857" }}>
            <li>Server components with DB access nested inside client components</li>
            <li>Accordion (client) containing ProductList (server with async DB query)</li>
            <li>Deep nesting: Client → Server → Client → Server</li>
            <li>Tabs (client) with server components as tab content</li>
            <li>All without the registry import problem!</li>
          </ul>
        </section>

        {/* The actual story content */}
        <StoryblokServerStory
          story={mockStory}
          render={render}
          livePreview={livePreview}
        />

        {/* Architecture explanation */}
        <section
          style={{
            marginTop: "32px",
            padding: "16px",
            background: "#f1f5f9",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ margin: "0 0 12px 0", color: "#334155", fontSize: "1rem" }}>
            🏗️ How It Works
          </h2>
          <pre
            style={{
              margin: 0,
              padding: "12px",
              background: "#1e293b",
              color: "#e2e8f0",
              borderRadius: "6px",
              fontSize: "0.85rem",
              overflow: "auto",
            }}
          >
{`// The resolver pre-renders nested bloks as children
function StoryblokServerComponent({ blok, components }) {
  const Component = components[blok.component];
  
  // Pre-render body as children BEFORE passing to component
  const children = blok.body?.map(child => 
    <StoryblokServerComponent blok={child} components={components} />
  );
  
  // Component receives already-rendered children
  return <Component blok={blok}>{children}</Component>;
}

// Client components just render {children}
'use client';
function AccordionBlok({ blok, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)}>{blok.title}</button>
      {open && children}  {/* Already rendered on server! */}
    </div>
  );
}`}
          </pre>
        </section>
      </div>
    </main>
  );
}
