const API = {
  BASE: "https://norma.nomoreparties.space/api",
  ENDPOINTS: {
    INGREDIENTS: "/ingredients",
    LOGIN: "/auth/login",
    USER: "/auth/user",
    ORDERS: "/orders"
  }
};

const INGREDIENTS = {
  FIRST_BUN: "643d69a5c3f7b9001cfa093c",
  SECOND_BUN: "643d69a5c3f7b9001cfa093d",
  FILLING: "643d69a5c3f7b9001cfa093e"
};

const SELECTORS = {
  ingredient: (id: string) => `[data-cy=${id}]`,
  orderButton: `[data-cy='order-button']`,
  loginButton: `[data-cy='login-button']`,
  overlay: `[data-cy='overlay']`,
  modal: "#modals"
};

beforeEach(() => {
  cy.intercept("GET", `${API.BASE}${API.ENDPOINTS.INGREDIENTS}`, {
    fixture: "ingredients.json"
  });
  cy.intercept("POST", `${API.BASE}${API.ENDPOINTS.LOGIN}`, {
    fixture: "user.json"
  });
  cy.intercept("GET", `${API.BASE}${API.ENDPOINTS.USER}`, {
    fixture: "user.json"
  });
  cy.intercept("POST", `${API.BASE}${API.ENDPOINTS.ORDERS}`, {
    fixture: "orderResponse.json"
  });

  cy.visit("/");
  cy.viewport(1440, 800);
  cy.get(SELECTORS.modal).as("modal");
});

describe("Конструктор бургеров", () => {
  describe("Добавление ингредиентов", () => {
    it("Счетчик ингредиента увеличивается при добавлении", () => {
      cy.get(SELECTORS.ingredient(INGREDIENTS.FILLING))
        .find("button")
        .click();
      cy.get(SELECTORS.ingredient(INGREDIENTS.FILLING))
        .find(".counter__num")
        .should("contain", "1");
    });

    it("Можно добавить булку и начинку в любом порядке", () => {
      cy.get(SELECTORS.ingredient(INGREDIENTS.FIRST_BUN))
        .find("button")
        .click();
      cy.get(SELECTORS.ingredient(INGREDIENTS.FILLING))
        .find("button")
        .click();

      cy.reload();
      cy.get(SELECTORS.ingredient(INGREDIENTS.FILLING))
        .find("button")
        .click();
      cy.get(SELECTORS.ingredient(INGREDIENTS.FIRST_BUN))
        .find("button")
        .click();
    });
  });

  describe("Работа с булками", () => {
    it("Можно заменить булку без начинок", () => {
      cy.get(SELECTORS.ingredient(INGREDIENTS.FIRST_BUN))
        .find("button")
        .click();
      cy.get(SELECTORS.ingredient(INGREDIENTS.SECOND_BUN))
        .find("button")
        .click();
    });

    it("Можно заменить булку при наличии начинок", () => {
      cy.get(SELECTORS.ingredient(INGREDIENTS.FIRST_BUN))
        .find("button")
        .click();
      cy.get(SELECTORS.ingredient(INGREDIENTS.FILLING))
        .find("button")
        .click();
      cy.get(SELECTORS.ingredient(INGREDIENTS.SECOND_BUN))
        .find("button")
        .click();
    });
  });
});

describe("Оформление заказа", () => {
  beforeEach(() => {
    window.localStorage.clear();
    cy.clearAllCookies();
    window.localStorage.setItem("refreshToken", "test-token");
    cy.setCookie("accessToken", "test-access-token");
  });

  afterEach(() => {
    window.localStorage.clear();
    cy.clearAllCookies();
  });

  it("Корректное оформление и отображение заказа", () => {
    cy.get(SELECTORS.ingredient(INGREDIENTS.FIRST_BUN))
      .find("button")
      .click();
    cy.get(SELECTORS.ingredient(INGREDIENTS.FILLING))
      .find("button")
      .click();

    cy.get(SELECTORS.orderButton).click();
    cy.get(SELECTORS.loginButton).click();
    cy.get(SELECTORS.orderButton).click();

    cy.get("@modal").within(() => {
      cy.contains("h2", "12345").should("exist");
      cy.get("button").click();
    });
    cy.get("@modal").should("be.empty");
  });
});

describe("Модальные окна", () => {
  const testModalInteraction = (action: () => void) => {
    cy.get("@modal").should("be.empty");
    cy.get(SELECTORS.ingredient(INGREDIENTS.FILLING))
      .find("a")
      .click();
    cy.get("@modal").should("be.not.empty");
    action();
    cy.get("@modal").should("be.empty");
  };

  it("Закрытие через крестик", () => {
    testModalInteraction(() => {
      cy.get("@modal").find("button").click();
    });
  });

	it("Открытие и проверка данных ингредиента", () => {
    testModalInteraction(() => {
			cy.get("@modal").should("be.not.empty");
      cy.url().should("include", INGREDIENTS.FILLING);
			cy.get("@modal").find("button").click();
    });
  });

  it("Закрытие через оверлей", () => {
    testModalInteraction(() => {
      cy.get(SELECTORS.overlay).click({ force: true });
    });
  });

  it("Закрытие через Escape", () => {
    testModalInteraction(() => {
      cy.get("body").trigger("keydown", { key: "Escape" });
    });
  });
});