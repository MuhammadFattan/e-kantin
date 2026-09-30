"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DEMO_ACCOUNTS,
  ORDER_TRANSITIONS,
  SEED_CANTEENS,
  SEED_ORDERS,
  SEED_OWNERS,
  SEED_PRODUCTS,
} from "@/lib/data";
import { nextOrderId, nextReservedId } from "@/lib/utils";

const StoreContext = createContext(null);
const STORAGE_KEY = "kantin-raden-fatah-demo-v1";
const DEMO_ACCOUNTS_WITH_PASSWORDS = [
  { ...DEMO_ACCOUNTS.student, password: "demo123" },
  { ...DEMO_ACCOUNTS.admin, password: "demo123" },
  ...SEED_OWNERS.map((owner) => ({ ...owner, password: "demo123" })),
];
const activeDineInOrders = (orders, canteenId) =>
  orders
    .filter(
      (order) =>
        order.canteenId === canteenId &&
        order.fulfillmentMethod === "dine-in" &&
        !["Selesai", "Dibatalkan"].includes(order.status),
    )
    .reduce((total, order) => total + (Number(order.partySize) || 1), 0);
const initial = () => ({
  owners: SEED_OWNERS,
  canteens: SEED_CANTEENS,
  products: SEED_PRODUCTS,
  orders: SEED_ORDERS,
  cart: [],
  currentUser: null,
  accounts: DEMO_ACCOUNTS_WITH_PASSWORDS,
});

export function StoreProvider({ children }) {
  const [owners, setOwners] = useState(initial().owners);
  const [canteens, setCanteens] = useState(initial().canteens);
  const [products, setProducts] = useState(initial().products);
  const [orders, setOrders] = useState(initial().orders);
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [accounts, setAccounts] = useState(initial().accounts);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [confirmation, setConfirmation] = useState(null);
  const confirmResolver = useRef(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data?.version === 1 || data?.version === 2) {
          if (Array.isArray(data.owners)) setOwners(data.owners);
          if (Array.isArray(data.canteens)) setCanteens(data.canteens);
          if (Array.isArray(data.products)) setProducts(data.products);
          if (Array.isArray(data.orders)) setOrders(data.orders);
          if (Array.isArray(data.cart)) setCart(data.cart);
          if (data.version === 2 && data.currentUser)
            setCurrentUser(data.currentUser);
          if (Array.isArray(data.accounts)) setAccounts(data.accounts);
          else if (Array.isArray(data.owners))
            setAccounts([
              ...DEMO_ACCOUNTS_WITH_PASSWORDS.filter(
                (item) => item.role !== "owner",
              ),
              ...data.owners.map((owner) => ({
                ...owner,
                password: "demo123",
              })),
            ]);
        }
      }
    } catch (error) {
      console.warn(
        "Data demo lokal tidak dapat dibaca; memakai data awal.",
        error,
      );
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const state = {
      version: 2,
      owners,
      canteens,
      products,
      orders,
      cart,
      currentUser,
      accounts,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn(
        "Penyimpanan lokal penuh; perubahan hanya berlaku sampai halaman ditutup.",
        error,
      );
    }
  }, [
    owners,
    canteens,
    products,
    orders,
    cart,
    currentUser,
    accounts,
    hydrated,
  ]);

  const notify = useCallback((message, tone = "success") => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((items) => [...items, { id, message, tone }]);
    window.setTimeout(
      () => setToasts((items) => items.filter((item) => item.id !== id)),
      3200,
    );
  }, []);

  const dismissToast = useCallback(
    (id) => setToasts((items) => items.filter((item) => item.id !== id)),
    [],
  );

  const requestConfirmation = useCallback(
    (options) =>
      new Promise((resolve) => {
        confirmResolver.current = resolve;
        setConfirmation(options);
      }),
    [],
  );

  const settleConfirmation = useCallback((value) => {
    setConfirmation(null);
    confirmResolver.current?.(value);
    confirmResolver.current = null;
  }, []);

  const addToCart = useCallback(
    (productId, quantity = 1) => {
      if (currentUser && currentUser.role !== "student") {
        notify("Akun pemilik dan admin tidak dapat membuat pesanan.", "error");
        return false;
      }
      const product = products.find((item) => item.id === productId);
      if (!product || !product.available) {
        notify("Produk sedang tidak tersedia.", "error");
        return false;
      }
      const currentCanteen = cart.length
        ? products.find((item) => item.id === cart[0].productId)?.canteenId
        : null;
      if (currentCanteen && currentCanteen !== product.canteenId) {
        notify(
          "Satu pesanan hanya untuk satu kantin. Selesaikan atau kosongkan keranjang terlebih dahulu.",
          "error",
        );
        return false;
      }
      setCart((items) => {
        const existing = items.find((item) => item.productId === productId);
        if (existing)
          return items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        return [...items, { productId, quantity }];
      });
      notify(`${product.name} ditambahkan ke keranjang.`);
      return true;
    },
    [cart, currentUser, notify, products],
  );

  const setCartQuantity = useCallback((productId, quantity) => {
    const safeQuantity = Math.max(1, Math.min(99, Number(quantity) || 1));
    setCart((items) =>
      items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: safeQuantity }
          : item,
      ),
    );
  }, []);

  const removeCartItem = useCallback(
    (productId) => {
      setCart((items) => items.filter((item) => item.productId !== productId));
      notify("Produk dihapus dari keranjang.");
    },
    [notify],
  );

  const clearCart = useCallback(() => setCart([]), []);

  const placeOrder = useCallback(
    (form) => {
      if (currentUser?.role !== "student") {
        notify(
          "Masuk sebagai mahasiswa atau staf untuk membuat pesanan.",
          "error",
        );
        return null;
      }
      if (!cart.length) return null;
      const cartProducts = cart
        .map((line) => ({
          line,
          product: products.find((product) => product.id === line.productId),
        }))
        .filter((entry) => entry.product);
      if (!cartProducts.length) return null;
      const canteenId = cartProducts[0].product.canteenId;
      const canteen = canteens.find((item) => item.id === canteenId);
      if (!canteen || canteen.status !== "Buka") {
        notify(
          "Kantin sedang tutup dan belum dapat menerima pesanan.",
          "error",
        );
        return null;
      }
      const fulfillmentMethod =
        form.fulfillmentMethod === "delivery" ? "delivery" : "dine-in";
      const partySize = Math.max(1, Math.min(12, Number(form.partySize) || 1));
      const availableSeats = Math.max(
        0,
        (Number(canteen.maxSeats) || 0) - activeDineInOrders(orders, canteenId),
      );
      if (
        fulfillmentMethod === "dine-in" &&
        (!canteen.dineInOpen || partySize > availableSeats)
      ) {
        notify(
          canteen.dineInOpen
            ? `Tempat tersisa ${availableSeats} kursi.`
            : "Pesanan makan di tempat sedang ditutup kantin.",
          "error",
        );
        return null;
      }
      if (fulfillmentMethod === "delivery" && !form.deliveryAddress?.trim()) {
        notify("Alamat pengantaran wajib diisi.", "error");
        return null;
      }
      const items = cartProducts.map(({ line, product }) => ({
        productId: product.id,
        productName: product.name,
        price: Number(product.price),
        quantity: line.quantity,
        subtotal: Number(product.price) * line.quantity,
      }));
      const order = {
        id: nextOrderId(orders),
        userId: currentUser?.id || DEMO_ACCOUNTS.student.id,
        customerName: form.name.trim(),
        phone: form.phone.trim(),
        canteenId,
        fulfillmentMethod,
        deliveryAddress:
          fulfillmentMethod === "delivery" ? form.deliveryAddress.trim() : "",
        partySize: fulfillmentMethod === "dine-in" ? partySize : 0,
        items,
        total: items.reduce((sum, item) => sum + item.subtotal, 0),
        note: form.note.trim(),
        pickupMethod:
          fulfillmentMethod === "delivery" ? "Diantar" : "Makan di tempat",
        status: "Menunggu",
        createdAt: new Date().toISOString(),
      };
      setOrders((list) => [order, ...list]);
      setCart([]);
      notify(`Pesanan ${order.id} berhasil dibuat.`);
      return order;
    },
    [canteens, cart, currentUser, notify, orders, products],
  );

  const updateOrderStatus = useCallback(
    (orderId, status) => {
      const order = orders.find((item) => item.id === orderId);
      if (!order || !ORDER_TRANSITIONS[order.status]?.includes(status)) {
        notify("Perubahan status tidak tersedia untuk pesanan ini.", "error");
        return false;
      }
      setOrders((list) =>
        list.map((item) =>
          item.id === orderId
            ? { ...item, status, updatedAt: new Date().toISOString() }
            : item,
        ),
      );
      notify(`Status ${orderId} diperbarui menjadi ${status}.`);
      return true;
    },
    [notify, orders],
  );

  const addProduct = useCallback(
    (values) => {
      const id = nextReservedId(
        "demo-product",
        products.map((item) => item.id),
      );
      const product = {
        ...values,
        id,
        price: Number(values.price),
        available: Boolean(values.available),
        rating: 4.7,
      };
      setProducts((list) => [product, ...list]);
      notify("Produk berhasil ditambahkan.");
      return product;
    },
    [notify, products],
  );

  const updateProduct = useCallback(
    (id, changes) => {
      setProducts((list) =>
        list.map((item) =>
          item.id === id
            ? {
                ...item,
                ...changes,
                price: Number(changes.price),
                available: Boolean(changes.available),
              }
            : item,
        ),
      );
      notify("Perubahan produk berhasil disimpan.");
    },
    [notify],
  );

  const deleteProduct = useCallback(
    (id) => {
      setProducts((list) => list.filter((item) => item.id !== id));
      setCart((list) => list.filter((item) => item.productId !== id));
      notify("Produk berhasil dihapus.");
    },
    [notify],
  );

  const addOwner = useCallback(
    (values) => {
      const ownerId = nextReservedId(
        "demo-owner",
        owners.map((item) => item.id),
        12,
      );
      const canteenId = nextReservedId(
        "demo-canteen",
        canteens.map((item) => item.id),
        12,
      );
      const canteen = {
        id: canteenId,
        ownerId,
        name: values.canteenName.trim(),
        description:
          values.description.trim() ||
          "Usaha kuliner UMKM di lingkungan UIN Raden Fatah.",
        location: values.location.trim(),
        image:
          "/manus-storage/async-images/eZ8KJnT4wLLdMmRbhyf0Mo/image-1.webp",
        status: "Buka",
        rating: 4.6,
        hours: "08.00–16.00",
      };
      const owner = {
        id: ownerId,
        name: values.name.trim(),
        username: values.username.trim(),
        phone: values.phone.trim(),
        role: "owner",
        status: values.status || "Aktif",
        canteenId,
      };
      setAccounts((list) => [
        ...list,
        {
          id: ownerId,
          name: owner.name,
          username: owner.username,
          password: "demo123",
          phone: owner.phone,
          role: "owner",
          canteenId,
        },
      ]);
      setOwners((list) => [...list, owner]);
      setCanteens((list) => [...list, canteen]);
      notify("Pemilik kantin berhasil ditambahkan.");
      return owner;
    },
    [canteens, notify, owners],
  );

  const authenticate = useCallback(
    (username, password) => {
      const account = accounts.find(
        (item) =>
          item.username.toLowerCase() === username.trim().toLowerCase() &&
          item.password === password,
      );
      if (!account) {
        notify("Username atau kata sandi tidak cocok.", "error");
        return false;
      }
      if (account.role === "owner") {
        const owner = owners.find((item) => item.id === account.id);
        if (!owner || owner.status !== "Aktif") {
          notify(
            owner?.status === "Menunggu Verifikasi"
              ? "Pendaftaran kantin masih menunggu verifikasi admin."
              : "Akun pemilik belum aktif.",
            "error",
          );
          return false;
        }
      }
      setCurrentUser({
        id: account.id,
        name: account.name,
        username: account.username,
        role: account.role,
        phone: account.phone,
        canteenId: account.canteenId,
        studentNumber: account.studentNumber,
      });
      notify(
        `Berhasil masuk sebagai ${account.role === "student" ? "mahasiswa/staf" : account.role === "owner" ? "pemilik kantin" : "admin"}.`,
      );
      return true;
    },
    [accounts, notify, owners],
  );

  const registerStudent = useCallback(
    (values) => {
      const username = values.username.trim().toLowerCase();
      if (
        accounts.some((account) => account.username.toLowerCase() === username)
      ) {
        notify("Username sudah digunakan.", "error");
        return false;
      }
      const account = {
        id: `student-${Date.now()}`,
        name: values.name.trim(),
        username,
        password: values.password,
        role: "student",
        phone: values.phone.trim(),
      };
      setAccounts((list) => [...list, account]);
      setCurrentUser(account);
      notify("Akun mahasiswa/staf berhasil dibuat.");
      return true;
    },
    [accounts, notify],
  );

  const registerOwner = useCallback(
    (values) => {
      const username = values.username.trim().toLowerCase();
      if (
        accounts.some((account) => account.username.toLowerCase() === username)
      ) {
        notify("Username sudah digunakan.", "error");
        return false;
      }
      const ownerId = nextReservedId(
        "demo-owner",
        owners.map((item) => item.id),
        12,
      );
      const canteenId = nextReservedId(
        "demo-canteen",
        canteens.map((item) => item.id),
        12,
      );
      const owner = {
        id: ownerId,
        name: values.name.trim(),
        username,
        phone: values.phone.trim(),
        role: "owner",
        status: "Menunggu Verifikasi",
        canteenId,
        ktpNumber: values.ktpNumber.trim(),
        applicationProducts: values.products.trim(),
      };
      const canteen = {
        id: canteenId,
        ownerId,
        name: values.canteenName.trim(),
        description: values.description.trim(),
        location: values.location.trim(),
        image:
          "/manus-storage/async-images/eZ8KJnT4wLLdMmRbhyf0Mo/image-1.webp",
        status: "Tutup",
        rating: 0,
        hours: "08.00–16.00",
        maxSeats: Number(values.maxSeats) || 0,
        dineInOpen: false,
      };
      const account = {
        id: ownerId,
        name: owner.name,
        username,
        password: values.password,
        phone: owner.phone,
        role: "owner",
        canteenId,
      };
      setOwners((list) => [...list, owner]);
      setCanteens((list) => [...list, canteen]);
      setAccounts((list) => [...list, account]);
      notify(
        "Pendaftaran dikirim. Akun dapat digunakan setelah diverifikasi admin.",
      );
      return true;
    },
    [accounts, canteens, notify, owners],
  );

  const reviewOwner = useCallback(
    (id, approved) => {
      const status = approved ? "Aktif" : "Ditolak";
      const owner = owners.find((item) => item.id === id);
      setOwners((list) =>
        list.map((item) => (item.id === id ? { ...item, status } : item)),
      );
      if (approved)
        setCanteens((list) =>
          list.map((item) =>
            item.ownerId === id
              ? { ...item, status: "Buka", dineInOpen: true }
              : item,
          ),
        );
      if (approved && owner?.applicationProducts) {
        const submittedProducts = owner.applicationProducts
          .split(/\r?\n/)
          .map((line) => {
            const [namePart, pricePart] = line.split(/[-–—]/);
            const name = namePart?.trim();
            const price = Number((pricePart || "").replace(/[^0-9]/g, ""));
            return name && price > 0 ? { name, price } : null;
          })
          .filter(Boolean);
        setProducts((list) => {
          let availableIds = list.map((item) => item.id);
          const additions = submittedProducts.map((item) => {
            const product = {
              id: nextReservedId("demo-product", availableIds),
              canteenId: owner.canteenId,
              name: item.name,
              description: "Menu terdaftar pada pengajuan pemilik kantin.",
              category: "makanan",
              price: item.price,
              image:
                "/manus-storage/async-images/eZ8KJnT4wLLdMmRbhyf0Mo/image-1.webp",
              available: true,
              rating: 4.7,
            };
            availableIds = [...availableIds, product.id];
            return product;
          });
          return [...additions, ...list];
        });
      }
      notify(
        approved
          ? "Pemilik berhasil diverifikasi."
          : "Pendaftaran pemilik ditolak.",
      );
    },
    [notify, owners],
  );

  const updateOwner = useCallback(
    (id, changes) => {
      const owner = owners.find((item) => item.id === id);
      setOwners((list) =>
        list.map((item) =>
          item.id === id
            ? {
                ...item,
                ...changes,
                name: changes.name.trim(),
                username: changes.username.trim(),
                phone: changes.phone.trim(),
              }
            : item,
        ),
      );
      if (owner) {
        setCanteens((list) =>
          list.map((item) =>
            item.ownerId === id
              ? {
                  ...item,
                  name: changes.canteenName?.trim() || item.name,
                  location: changes.location?.trim() || item.location,
                  description: changes.description?.trim() || item.description,
                }
              : item,
          ),
        );
      }
      notify("Data pemilik kantin berhasil diperbarui.");
    },
    [notify, owners],
  );

  const toggleOwner = useCallback(
    (id) => {
      const target = owners.find((item) => item.id === id);
      if (!target || !["Aktif", "Nonaktif"].includes(target.status)) {
        notify(
          "Pengajuan baru harus diputuskan melalui halaman verifikasi.",
          "error",
        );
        return;
      }
      setOwners((list) =>
        list.map((item) =>
          item.id === id
            ? {
                ...item,
                status: item.status === "Aktif" ? "Nonaktif" : "Aktif",
              }
            : item,
        ),
      );
      notify("Status akun pemilik diperbarui.");
    },
    [notify, owners],
  );

  const deleteOwner = useCallback(
    (id) => {
      const owner = owners.find((item) => item.id === id);
      setOwners((list) => list.filter((item) => item.id !== id));
      setAccounts((list) => list.filter((item) => item.id !== id));
      if (owner) {
        setCanteens((list) => list.filter((item) => item.ownerId !== id));
        setProducts((list) =>
          list.filter((item) => item.canteenId !== owner.canteenId),
        );
      }
      notify("Data pemilik kantin dihapus.");
    },
    [notify, owners],
  );

  const updateCanteen = useCallback(
    (id, changes) => {
      setCanteens((list) =>
        list.map((item) => (item.id === id ? { ...item, ...changes } : item)),
      );
      notify("Profil kantin berhasil diperbarui.");
    },
    [notify],
  );

  const chooseDemoUser = useCallback(
    (role, ownerId) => {
      if (role === "student") setCurrentUser(DEMO_ACCOUNTS.student);
      else if (role === "admin") setCurrentUser(DEMO_ACCOUNTS.admin);
      if (role === "owner") {
        const owner = owners.find((item) => item.id === ownerId);
        if (!owner || owner.status !== "Aktif") {
          notify(
            "Akun pemilik ini tidak aktif atau sudah tidak tersedia.",
            "error",
          );
          return false;
        }
        setCurrentUser({
          id: owner.id,
          name: owner.name,
          username: owner.username,
          role: "owner",
          phone: owner.phone,
          canteenId: owner.canteenId,
        });
      } else if (role !== "student" && role !== "admin") {
        return false;
      }
      notify(
        `Mode demo ${role === "owner" ? "pemilik kantin" : role === "admin" ? "admin" : "mahasiswa/staf"} aktif.`,
      );
      return true;
    },
    [notify, owners],
  );

  const signOut = useCallback(() => {
    setCurrentUser(null);
    notify("Anda keluar dari mode demo.");
  }, [notify]);

  const resetDemo = useCallback(() => {
    setOwners(SEED_OWNERS);
    setCanteens(SEED_CANTEENS);
    setProducts(SEED_PRODUCTS);
    setOrders(SEED_ORDERS);
    setCart([]);
    setCurrentUser(null);
    setAccounts(DEMO_ACCOUNTS_WITH_PASSWORDS);
    notify("Data demo dikembalikan ke kondisi awal.");
  }, [notify]);

  const value = useMemo(
    () => ({
      owners,
      canteens,
      products,
      orders,
      cart,
      currentUser,
      accounts,
      hydrated,
      toasts,
      confirmation,
      addToCart,
      setCartQuantity,
      removeCartItem,
      clearCart,
      placeOrder,
      updateOrderStatus,
      addProduct,
      updateProduct,
      deleteProduct,
      addOwner,
      updateOwner,
      toggleOwner,
      deleteOwner,
      updateCanteen,
      chooseDemoUser,
      authenticate,
      registerStudent,
      registerOwner,
      reviewOwner,
      signOut,
      resetDemo,
      notify,
      dismissToast,
      requestConfirmation,
      settleConfirmation,
    }),
    [
      owners,
      canteens,
      products,
      orders,
      cart,
      currentUser,
      accounts,
      hydrated,
      toasts,
      confirmation,
      addToCart,
      setCartQuantity,
      removeCartItem,
      clearCart,
      placeOrder,
      updateOrderStatus,
      addProduct,
      updateProduct,
      deleteProduct,
      addOwner,
      updateOwner,
      toggleOwner,
      deleteOwner,
      updateCanteen,
      chooseDemoUser,
      authenticate,
      registerStudent,
      registerOwner,
      reviewOwner,
      signOut,
      resetDemo,
      notify,
      dismissToast,
      requestConfirmation,
      settleConfirmation,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}
