/* =========================================================
   TPEG KIDDIES STORE
   MAIN JAVASCRIPT
   WhatsApp Orders + Packages + Gallery + Meta Pixel
========================================================= */

"use strict";

/* =========================================================
   1. STORE CONFIGURATION
========================================================= */

const STORE_WHATSAPP_NUMBER = "2349064206119";

const PRODUCT = {
    name: "Talking Flash Cards + 10-inch LCD Writing Tablet",
    currency: "NGN"
};

const PACKAGE_PRICES = {
    Regular: 29500,
    Smart: 55000,
    School: 82000
};

/* =========================================================
   2. DOM HELPERS
========================================================= */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

/* =========================================================
   3. FORMAT CURRENCY
========================================================= */

function formatNaira(amount) {
    return `₦${Number(amount || 0).toLocaleString("en-NG")}`;
}

/* =========================================================
   4. PHONE HELPERS
========================================================= */

function normalizePhone(phone) {
    let value = String(phone || "")
        .trim()
        .replace(/[\s\-().]/g, "");

    if (value.startsWith("+234")) {
        value = "0" + value.substring(4);
    } else if (value.startsWith("234")) {
        value = "0" + value.substring(3);
    }

    return value;
}

function isValidNigerianPhone(phone) {
    const normalized = normalizePhone(phone);

    return /^0[789][01]\d{8}$/.test(normalized);
}

/* =========================================================
   5. PACKAGE SELECTION
========================================================= */

function getSelectedPackage() {
    const selected = $(
        'input[name="package"]:checked'
    );

    if (!selected) {
        return null;
    }

    const price =
        Number(selected.dataset.price) ||
        PACKAGE_PRICES[selected.value] ||
        0;

    return {
        name: selected.value,
        price
    };
}

function getQuantity() {
    const quantityInput = $("#quantity");

    if (!quantityInput) {
        return 1;
    }

    const quantity = Number(quantityInput.value);

    if (!Number.isInteger(quantity) || quantity < 1) {
        return 1;
    }

    return Math.min(quantity, 5);
}

/* =========================================================
   6. ORDER SUMMARY
========================================================= */

function updateOrderSummary() {
    const selectedPackage = getSelectedPackage();
    const quantity = getQuantity();

    if (!selectedPackage) {
        return;
    }

    const total = selectedPackage.price * quantity;

    const summaryPackage =
        $("#summaryPackage");

    const summaryPackageName =
        $("#summaryPackageName");

    const summaryQuantity =
        $("#summaryQuantity");

    const summaryPrice =
        $("#summaryPrice");

    const summaryTotal =
        $("#summaryTotal");

    if (summaryPackage) {
        summaryPackage.textContent =
            `${selectedPackage.name} Package`;
    }

    if (summaryPackageName) {
        summaryPackageName.textContent =
            selectedPackage.name;
    }

    if (summaryQuantity) {
        summaryQuantity.textContent =
            quantity;
    }

    if (summaryPrice) {
        summaryPrice.textContent =
            formatNaira(selectedPackage.price);
    }

    if (summaryTotal) {
        summaryTotal.textContent =
            formatNaira(total);
    }
}

/* =========================================================
   7. PACKAGE SELECTION EVENTS
========================================================= */

function setupPackageSelection() {
    const packageInputs =
        $$('input[name="package"]');

    packageInputs.forEach((input) => {
        input.addEventListener(
            "change",
            updateOrderSummary
        );
    });
}

/* =========================================================
   8. PACKAGE CTA BUTTONS
========================================================= */

function setupPackageCTAButtons() {
    const buttons =
        $$(".package-order-btn");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const packageName =
                button.dataset.package;

            if (!packageName) {
                return;
            }

            const packageInput =
                document.querySelector(
                    `input[name="package"][value="${packageName}"]`
                );

            if (!packageInput) {
                return;
            }

            packageInput.checked = true;

            packageInput.dispatchEvent(
                new Event("change", {
                    bubbles: true
                })
            );

            const orderSection =
                $("#order");

            if (orderSection) {
                orderSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
}

/* =========================================================
   9. QUANTITY
========================================================= */

function setupQuantity() {
    const quantity =
        $("#quantity");

    if (!quantity) {
        return;
    }

    quantity.addEventListener(
        "input",
        updateOrderSummary
    );

    quantity.addEventListener(
        "change",
        updateOrderSummary
    );
}

/* =========================================================
   10. FORM MESSAGE
========================================================= */

function showFormMessage(
    message,
    type = "error"
) {
    const formMessage =
        $("#formMessage");

    if (!formMessage) {
        return;
    }

    formMessage.textContent =
        message;

    formMessage.classList.remove(
        "error",
        "success"
    );

    formMessage.classList.add(type);

    formMessage.hidden = false;

    formMessage.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

function hideFormMessage() {
    const formMessage =
        $("#formMessage");

    if (!formMessage) {
        return;
    }

    formMessage.hidden = true;

    formMessage.textContent = "";

    formMessage.classList.remove(
        "error",
        "success"
    );
}

/* =========================================================
   11. FORM VALIDATION
========================================================= */

function validateOrderForm() {
    const form =
        $("#orderForm");

    if (!form) {
        return false;
    }

    hideFormMessage();

    const fullName =
        $("#fullName");

    const phone =
        $("#phone");

    const whatsapp =
        $("#whatsapp");

    const state =
        $("#state");

    const deliveryAddress =
        $("#deliveryAddress");

    const deliveryDate =
        $("#deliveryDate");

    const confirmOrder =
        $("#confirmOrder");

    const selectedPackage =
        getSelectedPackage();

    /* Full name */

    if (
        !fullName ||
        fullName.value.trim().length < 2
    ) {
        showFormMessage(
            "Please enter your full name."
        );

        fullName?.focus();

        return false;
    }

    /* Phone */

    if (
        !phone ||
        !phone.value.trim()
    ) {
        showFormMessage(
            "Please enter your phone number."
        );

        phone?.focus();

        return false;
    }

    if (
        !isValidNigerianPhone(
            phone.value
        )
    ) {
        showFormMessage(
            "Please enter a valid Nigerian phone number."
        );

        phone?.focus();

        return false;
    }

    /* Optional WhatsApp */

    if (
        whatsapp &&
        whatsapp.value.trim() &&
        !isValidNigerianPhone(
            whatsapp.value
        )
    ) {
        showFormMessage(
            "Please enter a valid WhatsApp number or leave it blank."
        );

        whatsapp.focus();

        return false;
    }

    /* State */

    if (
        !state ||
        !state.value
    ) {
        showFormMessage(
            "Please select your state."
        );

        state?.focus();

        return false;
    }

    /* Delivery address */

    if (
        !deliveryAddress ||
        deliveryAddress.value.trim().length < 5
    ) {
        showFormMessage(
            "Please enter your complete delivery address."
        );

        deliveryAddress?.focus();

        return false;
    }

    /* Delivery date */

    if (
        !deliveryDate ||
        !deliveryDate.value
    ) {
        showFormMessage(
            "Please select when you want your order delivered."
        );

        deliveryDate?.focus();

        return false;
    }

    /* Package */

    if (!selectedPackage) {
        showFormMessage(
            "Please select a package."
        );

        return false;
    }

    /* Quantity */

    const quantity =
        getQuantity();

    if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 5
    ) {
        showFormMessage(
            "Please select a valid quantity."
        );

        $("#quantity")?.focus();

        return false;
    }

    /* Confirmation */

    if (
        !confirmOrder ||
        !confirmOrder.checked
    ) {
        showFormMessage(
            "Please confirm that your order details are correct."
        );

        confirmOrder?.focus();

        return false;
    }

    return true;
}

/* =========================================================
   12. BUILD WHATSAPP ORDER MESSAGE
========================================================= */

function buildWhatsAppOrderMessage() {
    const fullName =
        $("#fullName")?.value.trim() || "";

    const phone =
        normalizePhone(
            $("#phone")?.value
        );

    const whatsapp =
        normalizePhone(
            $("#whatsapp")?.value
        );

    const state =
        $("#state")?.value || "";

    const deliveryAddress =
        $("#deliveryAddress")?.value.trim() || "";

    const deliveryDate =
        $("#deliveryDate")?.value || "";

    const source =
        $("#source")?.value || "";

    const selectedPackage =
        getSelectedPackage();

    const quantity =
        getQuantity();

    if (!selectedPackage) {
        return "";
    }

    const total =
        selectedPackage.price * quantity;

    let message = "";

    message +=
        `*NEW ORDER - TPEG KIDDIES STORE*\n`;

    message +=
        `━━━━━━━━━━━━━━━━━━━━\n\n`;

    message +=
        `*PRODUCT*\n`;

    message +=
        `${PRODUCT.name}\n\n`;

    message +=
        `*ORDER DETAILS*\n`;

    message +=
        `Package: ${selectedPackage.name}\n`;

    message +=
        `Package Price: ${formatNaira(selectedPackage.price)}\n`;

    message +=
        `Quantity: ${quantity}\n`;

    message +=
        `Total: ${formatNaira(total)}\n`;

    message +=
        `Delivery: FREE\n\n`;

    message +=
        `*CUSTOMER INFORMATION*\n`;

    message +=
        `Name: ${fullName}\n`;

    message +=
        `Phone: ${phone}\n`;

    if (whatsapp) {
        message +=
            `WhatsApp: ${whatsapp}\n`;
    }

    message +=
        `\n`;

    message +=
        `*DELIVERY INFORMATION*\n`;

    message +=
        `State: ${state}\n`;

    message +=
        `Address: ${deliveryAddress}\n`;

    message +=
        `Preferred Delivery: ${deliveryDate}\n`;

    if (source) {
        message +=
            `How they heard about us: ${source}\n`;
    }

    message +=
        `\n━━━━━━━━━━━━━━━━━━━━\n`;

    message +=
        `Payment Method: *Payment on Delivery*\n`;

    message +=
        `Customer confirmed order details: *YES*\n`;

    message +=
        `━━━━━━━━━━━━━━━━━━━━`;

    return message;
}

/* =========================================================
   13. META PIXEL
========================================================= */

function trackPixel(
    eventName,
    data = {}
) {
    if (
        typeof window.fbq === "function"
    ) {
        window.fbq(
            "track",
            eventName,
            data
        );
    }
}

/* =========================================================
   14. VIEW CONTENT
========================================================= */

function trackViewContent() {
    trackPixel(
        "ViewContent",
        {
            content_name:
                PRODUCT.name,

            content_category:
                "Kids Educational Product",

            content_type:
                "product",

            value:
                PACKAGE_PRICES.Regular,

            currency:
                PRODUCT.currency
        }
    );
}

/* =========================================================
   15. INITIATE CHECKOUT
========================================================= */

function trackInitiateCheckout() {
    const selectedPackage =
        getSelectedPackage();

    const quantity =
        getQuantity();

    if (!selectedPackage) {
        return;
    }

    const total =
        selectedPackage.price * quantity;

    trackPixel(
        "InitiateCheckout",
        {
            content_name:
                PRODUCT.name,

            content_category:
                "Kids Educational Product",

            content_ids: [
                selectedPackage.name
            ],

            content_type:
                "product",

            value:
                total,

            currency:
                PRODUCT.currency,

            num_items:
                quantity
        }
    );
}

/* =========================================================
   16. LEAD
========================================================= */

function trackLead() {
    const selectedPackage =
        getSelectedPackage();

    const quantity =
        getQuantity();

    if (!selectedPackage) {
        return;
    }

    const total =
        selectedPackage.price * quantity;

    trackPixel(
        "Lead",
        {
            content_name:
                PRODUCT.name,

            content_category:
                "Order",

            package:
                selectedPackage.name,

            value:
                total,

            currency:
                PRODUCT.currency
        }
    );
}

/* =========================================================
   17. CHECKOUT TRACKING
========================================================= */

function setupCheckoutTracking() {
    const orderForm =
        $("#orderForm");

    if (!orderForm) {
        return;
    }

    let checkoutTracked = false;

    const checkoutFields =
        $$(
            "input, select, textarea",
            orderForm
        );

    checkoutFields.forEach((field) => {
        field.addEventListener(
            "focus",
            () => {
                if (checkoutTracked) {
                    return;
                }

                checkoutTracked = true;

                trackInitiateCheckout();
            },
            { once: true }
        );
    });
}

/* =========================================================
   18. FORM SUBMISSION
========================================================= */

function handleOrderSubmit(event) {
    event.preventDefault();

    if (!validateOrderForm()) {
        return;
    }

    const selectedPackage =
        getSelectedPackage();

    const quantity =
        getQuantity();

    const total =
        selectedPackage.price * quantity;

    /* Track checkout */

    trackInitiateCheckout();

    /* Build WhatsApp message */

    const message =
        buildWhatsAppOrderMessage();

    if (!message) {
        showFormMessage(
            "Unable to create the order message. Please try again."
        );

        return;
    }

    /* Track Lead */

    trackLead();

    /* Success information */

    const fullName =
        $("#fullName")?.value.trim() || "";

    const deliveryDate =
        $("#deliveryDate")?.value || "";

    const successCustomerName =
        $("#successCustomerName");

    const successProduct =
        $("#successProduct");

    const successTotal =
        $("#successTotal");

    const successDelivery =
        $("#successDelivery");

    if (successCustomerName) {
        successCustomerName.textContent =
            fullName;
    }

    if (successProduct) {
        successProduct.textContent =
            `${selectedPackage.name} × ${quantity}`;
    }

    if (successTotal) {
        successTotal.textContent =
            formatNaira(total);
    }

    if (successDelivery) {
        successDelivery.textContent =
            deliveryDate;
    }

    /* Hide order section */

    const orderSection =
        $("#order");

    if (orderSection) {
        orderSection.hidden = true;
    }

    /* Show success section */

    const orderSuccess =
        $("#orderSuccess");

    if (orderSuccess) {
        orderSuccess.hidden = false;

        orderSuccess.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    /* Create WhatsApp URL */

    const whatsappURL =
        `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
            message
        )}`;

    /*
       Open WhatsApp.

       The customer still needs to
       press SEND inside WhatsApp.
    */

    setTimeout(() => {
        const whatsappWindow =
            window.open(
                whatsappURL,
                "_blank",
                "noopener,noreferrer"
            );

        /*
           If popup is blocked,
           navigate directly.
        */

        if (!whatsappWindow) {
            window.location.href =
                whatsappURL;
        }
    }, 300);
}

/* =========================================================
   19. NEW ORDER BUTTON
========================================================= */

function setupNewOrderButton() {
    const button =
        $("#newOrderButton");

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        () => {
            const form =
                $("#orderForm");

            const orderSection =
                $("#order");

            const orderSuccess =
                $("#orderSuccess");

            if (form) {
                form.reset();
            }

            /* Restore Regular package */

            const regularPackage =
                document.querySelector(
                    'input[name="package"][value="Regular"]'
                );

            if (regularPackage) {
                regularPackage.checked = true;

                regularPackage.dispatchEvent(
                    new Event("change", {
                        bubbles: true
                    })
                );
            }

            /* Hide success */

            if (orderSuccess) {
                orderSuccess.hidden = true;
            }

            /* Show order section */

            if (orderSection) {
                orderSection.hidden = false;

                orderSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            hideFormMessage();

            updateOrderSummary();
        }
    );
}

/* =========================================================
   20. PRODUCT GALLERY
========================================================= */

function setupProductGallery() {
    const mainImage =
        $("#mainProductImage");

    const thumbnails =
        $$(".thumbnail");

    if (
        !mainImage ||
        thumbnails.length === 0
    ) {
        return;
    }

    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener(
            "click",
            () => {
                const image =
                    thumbnail.dataset.image;

                const alt =
                    thumbnail.dataset.alt ||
                    "Talking Flash Cards and LCD Writing Tablet";

                if (!image) {
                    return;
                }

                mainImage.src =
                    image;

                mainImage.alt =
                    alt;

                thumbnails.forEach(
                    (item) => {
                        item.classList.remove(
                            "active"
                        );
                    }
                );

                thumbnail.classList.add(
                    "active"
                );
            }
        );
    });
}

/* =========================================================
   21. LIGHTBOX
========================================================= */

function setupLightbox() {
    const lightbox =
        $("#imageLightbox");

    const lightboxImage =
        $("#lightboxImage");

    const closeButton =
        $("#closeLightbox");

    const mainImage =
        $("#mainProductImage");

    const mainImageButton =
        $("#mainProductImageButton");

    if (
        !lightbox ||
        !lightboxImage ||
        !mainImage
    ) {
        return;
    }

    function openLightbox() {
        lightboxImage.src =
            mainImage.src;

        lightboxImage.alt =
            mainImage.alt;

        lightbox.hidden = false;

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "lightbox-open"
        );

        requestAnimationFrame(() => {
            lightbox.classList.add(
                "is-visible"
            );
        });
    }

    function closeLightbox() {
        lightbox.classList.remove(
            "is-visible"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "lightbox-open"
        );

        setTimeout(() => {
            lightbox.hidden = true;
        }, 200);
    }

    if (mainImageButton) {
        mainImageButton.addEventListener(
            "click",
            openLightbox
        );
    } else {
        mainImage.addEventListener(
            "click",
            openLightbox
        );
    }

    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closeLightbox
        );
    }

    lightbox.addEventListener(
        "click",
        (event) => {
            if (
                event.target === lightbox
            ) {
                closeLightbox();
            }
        }
    );

    document.addEventListener(
        "keydown",
        (event) => {
            if (
                event.key === "Escape" &&
                !lightbox.hidden
            ) {
                closeLightbox();
            }
        }
    );
}

/* =========================================================
   22. SMOOTH SCROLL
========================================================= */

function setupSmoothScroll() {
    document.addEventListener(
        "click",
        (event) => {
            const link =
                event.target.closest(
                    'a[href^="#"]'
                );

            if (!link) {
                return;
            }

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(
                    targetId
                );

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    );
}

/* =========================================================
   23. IMAGE ERROR HANDLING
========================================================= */

function setupImageFallback() {
    const images =
        $$("img");

    images.forEach((image) => {
        image.addEventListener(
            "error",
            () => {
                image.classList.add(
                    "image-error"
                );
            }
        );
    });
}

/* =========================================================
   24. META PIXEL — CTA TRACKING
========================================================= */

function setupCTATracking() {
    const orderLinks =
        $$('a[href="#order"]');

    orderLinks.forEach((link) => {
        link.addEventListener(
            "click",
            () => {
                trackInitiateCheckout();
            }
        );
    });
}

/* =========================================================
   25. INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* Package system */

        setupPackageSelection();

        setupPackageCTAButtons();

        setupQuantity();

        updateOrderSummary();

        /* Order form */

        const orderForm =
            $("#orderForm");

        if (orderForm) {
            orderForm.addEventListener(
                "submit",
                handleOrderSubmit
            );
        }

        /* New order */

        setupNewOrderButton();

        /* Product gallery */

        setupProductGallery();

        setupLightbox();

        /* Navigation */

        setupSmoothScroll();

        setupCTATracking();

        /* Meta Pixel */

        trackViewContent();

        setupCheckoutTracking();

        /* Images */

        setupImageFallback();

        console.log(
            "TPEG Kiddies Store — JavaScript loaded successfully."
        );
    }
);