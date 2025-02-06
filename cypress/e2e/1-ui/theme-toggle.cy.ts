describe("Theme Toggle Functionality", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("should have theme toggle button with correct initial state", () => {
    cy.get('[data-test="theme-toggle"]').should("exist");

    // Check if either light or dark icon is present (depends on system theme)
    cy.get('[data-test="theme-toggle"]').then(($button) => {
      cy.wrap($button).find('[data-test^="theme-icon-"]').should("exist");
    });
  });

  it("should toggle between light and dark themes", () => {
    // Get initial theme state
    cy.get("html").then(($html) => {
      const initialIsDark = $html.hasClass("dark");

      // Click theme toggle
      cy.get('[data-test="theme-toggle"]').click();

      // Check if theme changed
      cy.get("html").should(
        initialIsDark ? "not.have.class" : "have.class",
        "dark",
      );

      // Check if correct icon is shown
      cy.get(
        initialIsDark
          ? '[data-test="theme-icon-light"]'
          : '[data-test="theme-icon-dark"]',
      ).should("exist");

      // Toggle back
      cy.get('[data-test="theme-toggle"]').click();

      // Verify original state is restored
      cy.get("html").should(
        initialIsDark ? "have.class" : "not.have.class",
        "dark",
      );
    });
  });

  it("should persist theme preference after page reload", () => {
    // Set to dark theme
    cy.get('[data-test="theme-toggle"]').click();
    cy.get("html").then(($html) => {
      const isDark = $html.hasClass("dark");

      // Reload page
      cy.reload();

      // Check if theme persisted
      cy.get("html").should(isDark ? "have.class" : "not.have.class", "dark");
    });
  });

  it("should apply correct styles in dark mode", () => {
    // Ensure dark mode
    cy.get("html").then(($html) => {
      if (!$html.hasClass("dark")) {
        cy.get('[data-test="theme-toggle"]').click();
      }
    });

    // Check dark mode specific styles
    cy.get('[data-test="nav-controls"]').should(
      "have.class",
      "dark:bg-zinc-900/80",
    );
    cy.get('[data-test="translation-output"]').should(
      "have.class",
      "dark:text-zinc-400",
    );
    cy.get('[data-test="center-divider"]').should(
      "have.class",
      "dark:bg-zinc-800",
    );
  });
});
