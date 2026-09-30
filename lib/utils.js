export function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function makeSlug(value) {
  return (
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "item"
  );
}

export function nextReservedId(prefix, existingIds, max = 60) {
  const used = new Set(existingIds);
  for (let index = 1; index <= max; index += 1) {
    const id = `${prefix}-${String(index).padStart(2, "0")}`;
    if (!used.has(id)) return id;
  }
  return `${prefix}-${Date.now()}`;
}

export function nextOrderId(orders) {
  const maxId = orders.reduce((max, order) => {
    const value = Number(String(order.id).replace(/^ORD-/, "")) || 0;
    return Math.max(max, value);
  }, 0);
  return `ORD-${String(maxId + 1).padStart(3, "0")}`;
}
