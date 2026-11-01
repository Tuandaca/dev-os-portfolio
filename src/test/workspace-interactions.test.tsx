import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Desktop } from "@/components/os/desktop";

describe("DEV.OS workspace interactions", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/workspace?app=about");
  });

  it("opens an app from the keyboard-accessible launcher and restores a minimized window", async () => {
    render(<Desktop initialSelection={{ appId: "about" }} />);
    const appsButton = screen.getByRole("button", { name: "Apps" });

    fireEvent.click(appsButton);
    const launcher = screen.getByRole("navigation", { name: "Application launcher" });
    fireEvent.keyDown(window, { key: "Escape" });
    expect(appsButton).toHaveFocus();
    expect(launcher).not.toBeVisible();

    fireEvent.click(appsButton);
    fireEvent.click(within(launcher).getByRole("button", { name: "Contact" }));
    expect(window.location.search).toBe("?app=contact");
    expect(screen.getByRole("region", { name: "Contact" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Minimize Contact" }));
    await waitFor(() => expect(window.location.search).toBe("?app=about"));
    fireEvent.click(screen.getByRole("button", { name: "Contact, minimized" }));
    expect(window.location.search).toBe("?app=contact");
    expect(screen.getByRole("region", { name: "Contact" })).toBeInTheDocument();
  });

  it("restores a known project deep link with a canonical case-study path", () => {
    window.history.replaceState(null, "", "/workspace?app=projects&project=cinema");
    render(<Desktop initialSelection={{ appId: "projects", projectSlug: "cinema" }} />);

    expect(screen.getByRole("region", { name: "Projects" })).toHaveTextContent("Cinema — Movie Ticket Booking Platform");
    expect(screen.getByRole("link", { name: /Open case study/ })).toHaveAttribute("href", "/projects/cinema");
  });

  it("keeps the Travel AI repository link withheld in the workspace", () => {
    render(<Desktop initialSelection={{ appId: "projects", projectSlug: "travel-ai" }} />);
    const projectWindow = screen.getByRole("region", { name: "Projects" });
    expect(projectWindow).toHaveTextContent("Travel AI — RAG & Knowledge Graph QA");
    expect(within(projectWindow).queryByRole("link", { name: /View repository/ })).not.toBeInTheDocument();
  });

  it("opens the command palette by keyboard and returns focus on Escape", () => {
    render(<Desktop initialSelection={{ appId: "about" }} />);
    const searchButton = screen.getByRole("button", { name: /Search Ctrl K/ });
    searchButton.focus();

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    const palette = screen.getByRole("dialog", { name: "Command palette" });
    const input = within(palette).getByRole("textbox", { name: "Open an app" });
    expect(input).toHaveFocus();

    fireEvent.keyDown(input, { key: "Escape" });
    expect(palette).not.toBeInTheDocument();
    expect(searchButton).toHaveFocus();
  });
});
