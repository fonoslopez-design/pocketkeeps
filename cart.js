/* PocketKeeps cart: localStorage cart, form-before-payment checkout.
   Online buyers pay once with PayPal (single _cart payment with every
   line item); in-person buyers fill the same form and it posts right
   away. The order email is sent only after the online payment step is
   confirmed ("Ya pagué"), so no unpaid order email. */
(function () {
  var CATALOG = {
    "little-bear": { "en": "Little Bear", "es": "Osito", "price": 2499 },
    "happy-frog": { "en": "Happy Frog", "es": "Ranita", "price": 2299 },
    "cozy-mushroom": { "en": "Cozy Mushroom", "es": "Honguito", "price": 2199 },
    "mini-cat": { "en": "Mini Cat", "es": "Gatito", "price": 2399 },
    "amigurumi-keychain": { "en": "Amigurumi Keychain", "es": "Llavero amigurumi", "price": 999 },
    "pocket-nail-clippers": { "en": "Pocket Nail Clippers", "es": "Cortaúñas de bolsillo", "price": 799 },
    "travel-toothpaste": { "en": "Travel Toothpaste", "es": "Pasta dental de viaje", "price": 499 },
    "travel-toothbrush": { "en": "Travel Toothbrush", "es": "Cepillo de viaje", "price": 599 },
    "bathroom-cleaning": { "en": "Bathroom Cleaning", "es": "Limpieza de baño", "price": 5000 }
  };
  var SERVICE = "bathroom-cleaning";
  var PAYPAL_BUSINESS = "tamarindongo10@gmail.com";
  var KEY = "pk-cart-v1";

  function lang() { return (document.documentElement.lang || "es").slice(0, 2) === "en" ? "en" : "es"; }
  function load() { try { var c = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(c) ? c : []; } catch (e) { return []; } }
  function save(cart) { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }
  function money(cents) { return "$" + (cents / 100).toFixed(2); }
  function prodName(slug) { var c = CATALOG[slug]; return c ? c[lang()] : slug; }
  function priceOf(slug) { var c = CATALOG[slug]; return c ? c.price : 0; }
  function lineTotal(it) { return it.qty * priceOf(it.slug); }
  function cartCount(cart) { var n = 0; cart.forEach(function (it) { n += it.qty; }); return n; }
  function cartTotal(cart) { var t = 0; cart.forEach(function (it) { t += lineTotal(it); }); return t; }
  function hasService(cart) { var found = false; cart.forEach(function (it) { if (it.slug === SERVICE) found = true; }); return found; }
  function itemsText(cart) { return cart.map(function (it) { return it.qty + "x " + prodName(it.slug) + " (" + money(lineTotal(it)) + ")"; }).join(", "); }

  function updateBadges() {
    var n = cartCount(load());
    document.querySelectorAll(".cart-count").forEach(function (el) { el.textContent = n; });
  }

  function add(slug, btn) {
    var cart = load(), found = null;
    cart.forEach(function (it) { if (it.slug === slug) found = it; });
    if (found) found.qty += 1; else cart.push({ slug: slug, qty: 1 });
    save(cart); updateBadges();
    if (btn) {
      var old = btn.textContent;
      btn.textContent = lang() === "en" ? "\u2713 Added" : "\u2713 Agregado";
      btn.disabled = true;
      setTimeout(function () { btn.textContent = old; btn.disabled = false; }, 900);
    }
  }

  /* Cart page rendering (only runs on cart.html). */
  function renderCart() {
    var list = document.getElementById("cart-items");
    if (!list) return;
    var l = lang();
    var cart = load();
    var empty = document.getElementById("cart-empty");
    var formWrap = document.getElementById("cart-checkout");
    var totalEl = document.getElementById("cart-total");
    if (!cart.length) {
      list.innerHTML = "";
      if (empty) empty.style.display = "";
      if (formWrap) formWrap.style.display = "none";
      if (totalEl) totalEl.textContent = money(0);
      refreshCheckout();
      return;
    }
    if (empty) empty.style.display = "none";
    if (formWrap) formWrap.style.display = "";
    var html = "";
    cart.forEach(function (it, i) {
      html += '<div class="cart-line"><div class="cart-line-info"><strong>' + prodName(it.slug) + '</strong><br><span class="small">' + money(priceOf(it.slug)) + (it.slug === SERVICE ? (l === "en" ? " per bathroom" : " por baño") : "") + '</span></div>'
        + '<div class="cart-qty"><button type="button" class="qty-btn" data-i="' + i + '" data-d="-1">\u2212</button><span>' + it.qty + '</span><button type="button" class="qty-btn" data-i="' + i + '" data-d="1">+</button></div>'
        + '<div class="cart-line-total"><strong>' + money(lineTotal(it)) + '</strong><br><button type="button" class="cart-remove" data-i="' + i + '">' + (l === "en" ? "Remove" : "Quitar") + '</button></div></div>';
    });
    list.innerHTML = html;
    if (totalEl) totalEl.textContent = money(cartTotal(cart));
    list.querySelectorAll(".qty-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var c = load(); var it = c[+b.dataset.i]; if (!it) return;
        it.qty += (+b.dataset.d);
        if (it.qty <= 0) c.splice(+b.dataset.i, 1);
        save(c); updateBadges(); renderCart();
      });
    });
    list.querySelectorAll(".cart-remove").forEach(function (b) {
      b.addEventListener("click", function () {
        var c = load(); c.splice(+b.dataset.i, 1);
        save(c); updateBadges(); renderCart();
      });
    });
    refreshCheckout();
  }

  /* Checkout state: "online" (PayPal) or "person" (pay in person). The
     filled form is saved to localStorage, so a reload mid-payment does
     not lose it. */
  function loadPath() { try { var p = localStorage.getItem("pk-pay-path"); return p === "person" ? "person" : "online"; } catch (e) { return "online"; } }
  function savePath(p) { try { localStorage.setItem("pk-pay-path", p); } catch (e) {} }
  function formOpen() { try { return localStorage.getItem("pk-form-open") === "1"; } catch (e) { return false; } }
  function setFormOpen(v) { try { if (v) localStorage.setItem("pk-form-open", "1"); else localStorage.removeItem("pk-form-open"); } catch (e) {} }
  function payStarted() { try { return localStorage.getItem("pk-pay-started") === "1"; } catch (e) { return false; } }
  function setPayStarted(v) { try { if (v) localStorage.setItem("pk-pay-started", "1"); else localStorage.removeItem("pk-pay-started"); } catch (e) {} }
  var PATH = loadPath();

  function saveFormData() {
    var form = document.getElementById("cart-form");
    if (!form) return;
    var d = {};
    ["Name", "Email", "Phone", "Address", "Message"].forEach(function (n) {
      var el = form.querySelector('[name="' + n + '"]');
      if (el) d[n] = el.value;
    });
    try { localStorage.setItem("pk-order-form", JSON.stringify(d)); } catch (e) {}
  }
  function restoreFormData() {
    var form = document.getElementById("cart-form");
    if (!form) return;
    var d = null;
    try { d = JSON.parse(localStorage.getItem("pk-order-form")); } catch (e) {}
    if (!d) return;
    Object.keys(d).forEach(function (n) {
      var el = form.querySelector('[name="' + n + '"]');
      if (el && d[n] !== undefined) el.value = d[n];
    });
  }

  function fillHidden() {
    var cart = load();
    var p = document.getElementById("cart-product");
    var t = document.getElementById("cart-total-input");
    var f = document.getElementById("cart-fulfill");
    if (p) p.value = itemsText(cart);
    if (t) t.value = money(cartTotal(cart));
    if (f) f.value = PATH === "person"
      ? (lang() === "en" ? "In person" : "En persona")
      : (lang() === "en" ? "Online (PayPal)" : "En línea (PayPal)");
  }

  function thanksURL() {
    try { return location.href.replace(/cart\.html.*$/, "thanks.html"); }
    catch (e) { return "thanks.html"; }
  }

  /* Single PayPal payment with the whole cart (Website Payments Standard
     _cart upload). Opens in a new tab so the cart page stays open. */
  function openPayPal(cart) {
    var f = document.createElement("form");
    f.method = "POST";
    f.action = "https://www.paypal.com/cgi-bin/webscr";
    f.target = "_blank";
    var fields = {
      cmd: "_cart",
      upload: "1",
      business: PAYPAL_BUSINESS,
      currency_code: "USD",
      return: thanksURL(),
      cancel_return: location.href
    };
    cart.forEach(function (it, i) {
      var n = i + 1;
      fields["item_name_" + n] = prodName(it.slug);
      fields["amount_" + n] = (priceOf(it.slug) / 100).toFixed(2);
      fields["quantity_" + n] = it.qty;
    });
    Object.keys(fields).forEach(function (k) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = fields[k];
      f.appendChild(input);
    });
    document.body.appendChild(f);
    f.submit();
    document.body.removeChild(f);
  }

  function refreshCheckout() {
    var cart = load();
    var paySec = document.getElementById("cart-pay");
    var formSec = document.getElementById("cart-checkout");
    var stepsSec = document.getElementById("cart-steps");
    var addrWrap = document.getElementById("cart-address-wrap");
    var addrInput = document.getElementById("cart-address");
    var submitBtn = document.getElementById("cart-submit");
    var stepText = document.getElementById("cart-step-text");
    var svcNote = document.getElementById("cart-service-note");
    if (!cart.length) { [paySec, formSec, stepsSec].forEach(function (el) { if (el) el.style.display = "none"; }); return; }
    var online = PATH !== "person";
    var paying = online && payStarted();
    var showForm = PATH === "person" || (online && formOpen() && !paying);
    if (paySec) paySec.style.display = (!showForm && !paying) ? "" : "none";
    if (formSec) formSec.style.display = showForm ? "" : "none";
    if (stepsSec) stepsSec.style.display = paying ? "" : "none";
    /* Address is needed online (delivery) and whenever the cart has the
       cleaning service (that is where the cleaning happens), even when
       paying in person. */
    var needAddr = online || hasService(cart);
    if (addrWrap) addrWrap.style.display = needAddr ? "" : "none";
    if (addrInput) addrInput.required = needAddr;
    if (svcNote) svcNote.style.display = hasService(cart) ? "" : "none";
    if (submitBtn) submitBtn.textContent = online ? submitBtn.getAttribute("data-online") : submitBtn.getAttribute("data-store");
    if (stepText) stepText.textContent = (lang() === "en" ? "Pay " : "Paga ") + money(cartTotal(cart)) + (lang() === "en" ? " with PayPal" : " con PayPal");
    fillHidden();
  }

  function setupCheckout() {
    var form = document.getElementById("cart-form");
    if (!form) return;
    restoreFormData();
    form.addEventListener("input", function () { saveFormData(); });
    var payBtn = document.getElementById("pay-paypal");
    if (payBtn) payBtn.addEventListener("click", function () {
      var cart = load();
      if (!cart.length) return;
      PATH = "online"; savePath(PATH); setFormOpen(true);
      refreshCheckout();
    });
    var personBtn = document.getElementById("pay-person");
    if (personBtn) personBtn.addEventListener("click", function () {
      PATH = "person"; savePath(PATH); setFormOpen(true);
      refreshCheckout();
    });
    document.querySelectorAll(".cart-back").forEach(function (b) {
      b.addEventListener("click", function () {
        setPayStarted(false); setFormOpen(false); PATH = "online"; savePath(PATH);
        refreshCheckout();
      });
    });
    var doneBtn = document.getElementById("cart-step-done");
    if (doneBtn) doneBtn.addEventListener("click", function () {
      setPayStarted(false);
      restoreFormData();
      fillHidden();
      form.submit(); /* normal POST to Web3Forms -> thanks page */
    });
    /* PayPal tab was blocked or closed: open the cart payment again. */
    var payAgain = document.getElementById("cart-step-pay");
    if (payAgain) payAgain.addEventListener("click", function () {
      var cart = load();
      if (cart.length) openPayPal(cart);
    });
    form.addEventListener("submit", function (e) {
      fillHidden();
      if (PATH === "person") return; /* normal POST to Web3Forms */
      if (payStarted()) return; /* already paid, let it post */
      e.preventDefault();
      var cart = load();
      if (!cart.length) return;
      saveFormData();
      setPayStarted(true);
      refreshCheckout();
      openPayPal(cart);
    });
    refreshCheckout();
  }

  window.PK = { add: add, updateBadges: updateBadges };
  document.addEventListener("DOMContentLoaded", function () {
    /* Order completed (thanks page): clear the cart and all checkout state.
       Cancelling on PayPal leaves the cart intact, since PayPal opens in a
       new tab and the cart page stays open. */
    if (/thanks\.html$/.test(location.pathname)) { save([]); try { localStorage.removeItem("pk-order-form"); localStorage.removeItem("pk-pay-path"); localStorage.removeItem("pk-form-open"); localStorage.removeItem("pk-pay-started"); } catch (e) {} }
    updateBadges(); renderCart(); setupCheckout();
  });
})();
