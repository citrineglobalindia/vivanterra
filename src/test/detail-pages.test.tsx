import { describe, it, expect, beforeAll, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ProjectDetail from "@/pages/ProjectDetail";
import BlogDetail from "@/pages/BlogDetail";
import NotFound from "@/pages/NotFound";

beforeAll(() => {
  // jsdom doesn't implement these — PageShell calls them on mount, and Swiper
  // pokes ResizeObserver internally.
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  if (!("ResizeObserver" in window)) {
    (window as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
  if (!("IntersectionObserver" in window)) {
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
        root = null;
        rootMargin = "";
        thresholds = [];
      };
  }
});

function renderAt(path: string) {
  return render(
    <HelmetProvider>
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MemoryRouter>
    </HelmetProvider>,
  );
}

describe("ProjectDetail", () => {
  it("renders a known project's title and at least one spec row", () => {
    renderAt("/projects/bare-bespoke-residence");
    // Title appears in the PageShell H1
    expect(screen.getAllByText(/Bare & Bespoke Residence/i).length).toBeGreaterThan(0);
    // Specifications section is present
    expect(screen.getByText(/Specifications/i)).toBeInTheDocument();
    // One of the spec labels we wrote
    expect(screen.getByText(/Typology/i)).toBeInTheDocument();
    // Inline enquiry form is present
    expect(
      screen.getByPlaceholderText(/A short note about the residence/i),
    ).toBeInTheDocument();
  });

  it("redirects to NotFound for an unknown slug", () => {
    renderAt("/projects/this-does-not-exist");
    expect(screen.getAllByText(/404|not found/i).length).toBeGreaterThan(0);
  });
});

describe("BlogDetail", () => {
  it("renders a known post's title and body paragraphs", () => {
    renderAt("/blogs/year-of-materials");
    expect(
      screen.getAllByText(/a year of materials/i).length,
    ).toBeGreaterThan(0);
    // A snippet from the body content we wrote
    expect(
      screen.getByText(/We start each year with a small ritual/i),
    ).toBeInTheDocument();
  });

  it("redirects to NotFound for an unknown slug", () => {
    renderAt("/blogs/no-such-post");
    expect(screen.getAllByText(/404|not found/i).length).toBeGreaterThan(0);
  });
});
