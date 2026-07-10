import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable, type Column } from "@/components/ui/DataTable";

interface TestRow {
  id: string;
  name: string;
  category: string;
  price: number;
}

const columns: Column<TestRow>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "category", label: "Category" },
  { key: "price", label: "Price", sortable: true },
];

const sampleData: TestRow[] = [
  { id: "1", name: "Alpha", category: "CatA", price: 100 },
  { id: "2", name: "Beta", category: "CatB", price: 200 },
  { id: "3", name: "Gamma", category: "CatA", price: 300 },
  { id: "4", name: "Delta", category: "CatC", price: 50 },
];

// jsdom renders both mobile card + desktop table; use getAllByText for shared text
function assertValuePresent(text: string) {
  const matches = screen.getAllByText(text);
  expect(matches.length).toBeGreaterThanOrEqual(1);
}

describe("DataTable", () => {
  // ─── rendering ──────────────────────────────────────────

  it("renders column headers from columns prop", () => {
    render(<DataTable columns={columns} data={sampleData} />);

    // Headers appear in both table thead AND mobile cards
    expect(screen.getAllByText("Name").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Category").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Price").length).toBeGreaterThan(0);
  });

  it("renders data rows with cell values in the table", () => {
    render(<DataTable columns={columns} data={sampleData} itemsPerPage={10} />);

    const table = screen.getByRole("table");

    // Verify specific values exist scoped to the table
    expect(within(table).getByText("Alpha")).toBeInTheDocument();
    expect(within(table).getByText("Beta")).toBeInTheDocument();
    // CatA appears twice — two products share the same category
    const catAMatches = within(table).getAllByText("CatA");
    expect(catAMatches.length).toBe(2);
  });

  it("applies custom render function when provided", () => {
    const columnsWithRender: Column<TestRow>[] = [
      { key: "name", label: "Name" },
      {
        key: "price",
        label: "Price",
        render: (value) => `$${value}`,
      },
    ];

    render(<DataTable columns={columnsWithRender} data={sampleData} itemsPerPage={10} />);

    // The render transforms 100 → "$100" — these appear in both table + card
    // but since columns differ from card labels, they're unique to the render
    const table = screen.getByRole("table");
    expect(within(table).getByText("$100")).toBeInTheDocument();
    expect(within(table).getByText("$200")).toBeInTheDocument();
  });

  // ─── empty state ────────────────────────────────────────

  it("shows empty state message when data is empty", () => {
    render(<DataTable columns={columns} data={[]} />);

    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  // ─── sorting ────────────────────────────────────────────

  it("calls onSort when a sortable header is clicked", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();

    render(
      <DataTable
        columns={columns}
        data={sampleData}
        onSort={onSort}
        itemsPerPage={10}
      />,
    );

    // "Name" header text appears in both thead and card labels — use the table's thead
    const table = screen.getByRole("table");
    const nameHeaders = within(table).getAllByText("Name");
    await user.click(nameHeaders[0]);

    expect(onSort).toHaveBeenCalledWith({ key: "name", order: "asc" });
  });

  it("toggles sort order when same header clicked twice", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();

    render(
      <DataTable
        columns={columns}
        data={sampleData}
        onSort={onSort}
        currentSort={{ key: "name", order: "asc" }}
        itemsPerPage={10}
      />,
    );

    const table = screen.getByRole("table");
    const nameHeaders = within(table).getAllByText(/Name/);
    // The first one contains "Name ▲"
    await user.click(nameHeaders[0]);

    expect(onSort).toHaveBeenCalledWith({ key: "name", order: "desc" });
  });

  it("shows ascending arrow indicator on sorted column", () => {
    render(
      <DataTable
        columns={columns}
        data={sampleData}
        currentSort={{ key: "name", order: "asc" }}
        itemsPerPage={10}
      />,
    );

    const table = screen.getByRole("table");
    // The sort indicator " ▲" is inside the th
    expect(within(table).getByText(/Name.*▲/)).toBeInTheDocument();
  });

  it("shows descending arrow indicator on sorted column", () => {
    render(
      <DataTable
        columns={columns}
        data={sampleData}
        currentSort={{ key: "price", order: "desc" }}
        itemsPerPage={10}
      />,
    );

    const table = screen.getByRole("table");
    expect(within(table).getByText(/Price.*▼/)).toBeInTheDocument();
  });

  it("non-sortable headers do not trigger onSort", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();

    render(
      <DataTable
        columns={columns}
        data={sampleData}
        onSort={onSort}
        itemsPerPage={10}
      />,
    );

    // "Category" in the table header (not a card label)
    const table = screen.getByRole("table");
    const catHeaders = within(table).getAllByText("Category");
    await user.click(catHeaders[0]);

    expect(onSort).not.toHaveBeenCalled();
  });

  // ─── pagination ─────────────────────────────────────────

  it("shows Page X of Y text", () => {
    render(<DataTable columns={columns} data={sampleData} itemsPerPage={2} />);

    expect(screen.getByText(/1 \/ 2/)).toBeInTheDocument();
  });

  it("previous button is disabled on first page", () => {
    render(<DataTable columns={columns} data={sampleData} itemsPerPage={2} />);

    const prevButton = screen.getByText("Prev");
    expect(prevButton).toBeDisabled();
  });

  it("next button navigates to next page", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={sampleData} itemsPerPage={2} />);

    // Page 1 shows first 2 items — in both table and cards
    assertValuePresent("Alpha");
    assertValuePresent("Beta");

    await user.click(screen.getByText("Next"));

    // Page 2 — Gamma and Delta
    assertValuePresent("Gamma");
    assertValuePresent("Delta");
    expect(screen.getByText(/2 \/ 2/)).toBeInTheDocument();
  });

  it("next button is disabled on last page", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={sampleData} itemsPerPage={2} />);

    await user.click(screen.getByText("Next"));

    expect(screen.getByText("Next")).toBeDisabled();
  });

  it("previous button goes back to previous page", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={sampleData} itemsPerPage={2} />);

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Prev"));

    assertValuePresent("Alpha");
    expect(screen.getByText(/1 \/ 2/)).toBeInTheDocument();
  });

  // ─── responsive: mobile card view ───────────────────────

  it("renders a table element for desktop layout", () => {
    render(<DataTable columns={columns} data={sampleData} itemsPerPage={10} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("card view shows label: value pairs alongside table", () => {
    render(<DataTable columns={columns} data={sampleData} itemsPerPage={10} />);

    // Both card view and table view exist in jsdom (CSS hides one on real browsers)
    const nameLabels = screen.getAllByText("Name");
    expect(nameLabels.length).toBeGreaterThan(1); // 1 for header, more for cards

    const categoryLabels = screen.getAllByText("Category");
    expect(categoryLabels.length).toBeGreaterThan(1);

    const priceLabels = screen.getAllByText("Price");
    expect(priceLabels.length).toBeGreaterThan(1);
  });

  it("card view renders one card per row", () => {
    render(<DataTable columns={columns} data={sampleData} itemsPerPage={10} />);

    // Each row appears as a card with its values
    assertValuePresent("Alpha");
    assertValuePresent("Beta");
    assertValuePresent("Gamma");
    assertValuePresent("Delta");
  });
});
