describe("Error Handling", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("should handle network errors gracefully", () => {
    // Intercept API calls and force a network error
    cy.intercept(
      {
        method: "POST",
        pathname: "/api/translate",
      },
      {
        forceNetworkError: true,
      },
    ).as("translateRequest");

    // Attempt translation
    cy.get('[data-test="source-input"]').type("Test text{enter}");

    // Wait for the failed request
    cy.wait("@translateRequest");

    // Check error state
    cy.get('[data-test="loading-overlay"]').should("not.exist");
    cy.get('[data-test="translation-output"]').should("be.empty");
  });

  it("should handle API errors gracefully", () => {
    // Intercept API calls and return an error
    cy.intercept(
      {
        method: "POST",
        pathname: "/api/translate",
      },
      {
        statusCode: 500,
        body: "Internal Server Error",
      },
    ).as("translateRequest");

    // Attempt translation
    cy.get('[data-test="source-input"]').type("Test text{enter}");

    // Wait for the failed request
    cy.wait("@translateRequest");

    // Check error state
    cy.get('[data-test="loading-overlay"]').should("not.exist");
    cy.get('[data-test="translation-output"]').should("be.empty");
  });

  it("should handle model switching during error states", () => {
    let isFirstRequest = true;

    // Intercept all translation requests
    cy.intercept(
      {
        method: "POST",
        pathname: "/api/translate",
      },
      (req) => {
        if (isFirstRequest) {
          isFirstRequest = false;
          req.reply({
            statusCode: 500,
            body: "Internal Server Error",
            delay: 100,
          });
        } else {
          // Create a ReadableStream for streaming response
          const encoder = new TextEncoder();
          const stream = new ReadableStream({
            start(controller) {
              controller.enqueue(
                encoder.encode(
                  'data: {"content":"测试文本","role":"assistant"}\n\n',
                ),
              );
              controller.close();
            },
          });

          req.reply({
            statusCode: 200,
            headers: {
              "content-type": "text/event-stream",
              "cache-control": "no-cache",
              connection: "keep-alive",
            },
            body: stream,
          });
        }
      },
    ).as("translationRequest");

    // Attempt first translation
    cy.get('[data-test="source-input"]').type("Test text{enter}");

    // Wait for the failed request
    cy.wait("@translationRequest").its("response.statusCode").should("eq", 500);

    // Switch model and try again
    cy.get('[data-test="model-select"]').select("google");
    cy.get('[data-test="source-input"]').clear().type("Another test{enter}");

    // Wait for successful request
    cy.wait("@translationRequest").its("response.statusCode").should("eq", 200);
  });

  it("should handle rapid input during error states", () => {
    // Intercept API calls and force errors
    cy.intercept(
      {
        method: "POST",
        pathname: "/api/translate",
      },
      (req) => {
        req.reply({
          statusCode: 500,
          body: "Internal Server Error",
          delay: 100,
        });
      },
    ).as("translateRequest");

    // Type rapidly during error state
    cy.get('[data-test="source-input"]')
      .type("First test{enter}")
      .wait(100)
      .type("{selectall}{backspace}Second test{enter}")
      .wait(100)
      .type("{selectall}{backspace}Third test{enter}");

    // System should remain responsive
    cy.get('[data-test="source-input"]').should("be.enabled");
    cy.get('[data-test="model-select"]').should("be.enabled");
  });

  it("should recover after error resolution", () => {
    let isFirstRequest = true;

    // Intercept all translation requests
    cy.intercept(
      {
        method: "POST",
        pathname: "/api/translate",
      },
      (req) => {
        if (isFirstRequest) {
          isFirstRequest = false;
          req.reply({
            statusCode: 500,
            body: "Internal Server Error",
            delay: 100,
          });
        } else {
          // Create a ReadableStream for streaming response
          const encoder = new TextEncoder();
          const stream = new ReadableStream({
            start(controller) {
              controller.enqueue(
                encoder.encode(
                  'data: {"content":"测试文本","role":"assistant"}\n\n',
                ),
              );
              controller.close();
            },
          });

          req.reply({
            statusCode: 200,
            headers: {
              "content-type": "text/event-stream",
              "cache-control": "no-cache",
              connection: "keep-alive",
            },
            body: stream,
          });
        }
      },
    ).as("translationRequest");

    // First attempt fails
    cy.get('[data-test="source-input"]').type("Test text{enter}");
    cy.wait("@translationRequest").its("response.statusCode").should("eq", 500);

    // Second attempt should succeed
    cy.get('[data-test="source-input"]').clear().type("Another test{enter}");
    cy.wait("@translationRequest").its("response.statusCode").should("eq", 200);
  });
});
