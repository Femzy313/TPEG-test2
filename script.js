/* =========================================================
   TPEG KIDDIES STORE
   MAIN JAVASCRIPT

   Features:
   - Package selection
   - Quantity calculation
   - Order validation
   - EmailJS order submission
   - Meta Pixel tracking
   - TikTok Pixel tracking
   - Product gallery
   - Image lightbox
   - Smooth scrolling
   - Order success screen
========================================================= */

"use strict";


/* =========================================================
   1. STORE CONFIGURATION
========================================================= */

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
   2. EMAILJS CONFIGURATION
========================================================= */

const EMAILJS_CONFIG = {
    publicKey: "BpmEAlP0p5CfXByOA",
    serviceId: "service_f876y0m",
    templateId: "template_1kqytul"
};


/* =========================================================
   3. TIKTOK PIXEL CONFIGURATION
========================================================= */

const TIKTOK_PIXEL_ID = "DAMK8UBC77U1ARFV5U8G";


/* =========================================================
   4. DOM HELPERS
========================================================= */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


/* =========================================================
   5. FORMAT CURRENCY
========================================================= */

function formatNaira(amount) {
    return `₦${Number(amount || 0).toLocaleString("en-NG")}`;
}


/* =========================================================
   6. PHONE HELPERS
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
   7. PACKAGE SELECTION
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
   8. ORDER SUMMARY
========================================================= */

function updateOrderSummary() {
    const selectedPackage = getSelectedPackage();
    const quantity = getQuantity();

    if (!selectedPackage) {
        return;
    }

    const total =
        selectedPackage.price * quantity;

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
   9. PACKAGE SELECTION EVENTS
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
   10. PACKAGE CTA BUTTONS
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
   11. QUANTITY
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
   12. FORM MESSAGE
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
   13. FORM VALIDATION
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


    /* Full Name */

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


    /* Delivery Address */

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


    /* Delivery Date */

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
   14. META PIXEL
========================================================= */

function trackMetaPixel(
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
   15. TIKTOK PIXEL
========================================================= */

function trackTikTok(
    eventName,
    data = {}
) {
    if (
        typeof window.ttq !== "undefined" &&
        typeof window.ttq.track === "function"
    ) {
        window.ttq.track(
            eventName,
            data
        );
    }
}


/* =========================================================
   16. VIEW CONTENT TRACKING
========================================================= */

function trackViewContent() {

    const data = {
        content_name: PRODUCT.name,
        content_category: "Kids Educational Product",
        content_type: "product",
        value: PACKAGE_PRICES.Regular,
        currency: PRODUCT.currency
    };


    /* Meta */

    trackMetaPixel(
        "ViewContent",
        data
    );


    /* TikTok */

    trackTikTok(
        "ViewContent",
        {
            content_name: PRODUCT.name,
            content_category: "Kids Educational Product",
            content_type: "product",
            value: PACKAGE_PRICES.Regular,
            currency: PRODUCT.currency
        }
    );
}


/* =========================================================
   17. INITIATE CHECKOUT TRACKING
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


    /* Meta */

    trackMetaPixel(
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


    /* TikTok */

    trackTikTok(
        "InitiateCheckout",
        {
            content_id:
                selectedPackage.name,

            content_name:
                PRODUCT.name,

            content_category:
                "Kids Educational Product",

            content_type:
                "product",

            quantity:
                quantity,

            value:
                total,

            currency:
                PRODUCT.currency
        }
    );
}


/* =========================================================
   18. LEAD TRACKING
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


    /* Meta */

    trackMetaPixel(
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


    /* TikTok */

    trackTikTok(
        "SubmitForm",
        {
            content_id:
                selectedPackage.name,

            content_name:
                PRODUCT.name,

            content_category:
                "Order",

            quantity:
                quantity,

            value:
                total,

            currency:
                PRODUCT.currency
        }
    );
}


/* =========================================================
   19. META PURCHASE
========================================================= */

function trackPurchase() {

    const selectedPackage =
        getSelectedPackage();

    const quantity =
        getQuantity();

    if (!selectedPackage) {
        return;
    }

    const total =
        selectedPackage.price * quantity;


    trackMetaPixel(
        "Purchase",
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
   20. TIKTOK COMPLETE PAYMENT
========================================================= */

function trackTikTokPurchase() {

    const selectedPackage =
        getSelectedPackage();

    const quantity =
        getQuantity();

    if (!selectedPackage) {
        return;
    }

    const total =
        selectedPackage.price * quantity;


    trackTikTok(
        "CompletePayment",
        {
            content_id:
                selectedPackage.name,

            content_name:
                PRODUCT.name,

            content_category:
                "Kids Educational Product",

            content_type:
                "product",

            quantity:
                quantity,

            value:
                total,

            currency:
                PRODUCT.currency
        }
    );
}


/* =========================================================
   21. CHECKOUT TRACKING
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
            {
                once: true
            }
        );

    });
}


/* =========================================================
   22. EMAILJS INITIALISATION
========================================================= */

function initialiseEmailJS() {

    if (
        typeof window.emailjs === "undefined"
    ) {
        console.error(
            "EmailJS SDK was not loaded."
        );

        return false;
    }

    try {

        window.emailjs.init({
            publicKey:
                EMAILJS_CONFIG.publicKey
        });

        return true;

    } catch (error) {

        console.error(
            "EmailJS initialisation failed:",
            error
        );

        return false;
    }
}


/* =========================================================
   23. BUILD EMAILJS ORDER DATA
========================================================= */

function buildEmailJSOrderData() {

    const fullName =
        $("#fullName")?.value.trim() || "";

    const phone =
        normalizePhone(
            $("#phone")?.value
        );

    const whatsappRaw =
        $("#whatsapp")?.value.trim() || "";

    const whatsapp =
        whatsappRaw
            ? normalizePhone(whatsappRaw)
            : "Not provided";

    const state =
        $("#state")?.value || "";

    const deliveryAddress =
        $("#deliveryAddress")?.value.trim() || "";

    const deliveryDate =
        $("#deliveryDate")?.value || "";

    const source =
        $("#source")?.value ||
        "Not specified";

    const selectedPackage =
        getSelectedPackage();

    const quantity =
        getQuantity();

    if (!selectedPackage) {
        return null;
    }

    const total =
        selectedPackage.price * quantity;

    const orderDate =
        new Date().toLocaleString(
            "en-NG",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

    return {

        customer_name:
            fullName,

        phone:
            phone,

        whatsapp:
            whatsapp,

        state:
            state,

        address:
            deliveryAddress,

        delivery_date:
            deliveryDate,

        package:
            selectedPackage.name,

        package_price:
            selectedPackage.price.toLocaleString(
                "en-NG"
            ),

        quantity:
            quantity,

        total:
            total.toLocaleString(
                "en-NG"
            ),

        source:
            source,

        order_date:
            orderDate
    };
}


/* =========================================================
   24. SEND ORDER WITH EMAILJS
========================================================= */

async function sendOrderWithEmailJS() {

    if (
        typeof window.emailjs === "undefined"
    ) {
        throw new Error(
            "EmailJS is not available."
        );
    }

    const orderData =
        buildEmailJSOrderData();

    if (!orderData) {
        throw new Error(
            "Unable to create order data."
        );
    }

    const response =
        await window.emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            orderData
        );

    return response;
}


/* =========================================================
   25. SUBMIT BUTTON LOADING STATE
========================================================= */

function setSubmitButtonLoading(
    isLoading
) {

    const form =
        $("#orderForm");

    if (!form) {
        return;
    }

    const submitButton =
        form.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

    if (!submitButton) {
        return;
    }


    if (isLoading) {

        submitButton.dataset.originalText =
            submitButton.textContent;

        submitButton.disabled = true;

        submitButton.textContent =
            "SUBMITTING ORDER...";

        submitButton.setAttribute(
            "aria-busy",
            "true"
        );

    } else {

        submitButton.disabled = false;

        submitButton.textContent =
            submitButton.dataset.originalText ||
            "ORDER NOW AND GET FREE DELIVERY";

        submitButton.removeAttribute(
            "aria-busy"
        );
    }
}


/* =========================================================
   26. SHOW ORDER SUCCESS
========================================================= */

function showOrderSuccess() {

    const selectedPackage =
        getSelectedPackage();

    const quantity =
        getQuantity();

    if (!selectedPackage) {
        return;
    }

    const total =
        selectedPackage.price * quantity;

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


    /* Hide order form */

    const orderSection =
        $("#order");

    if (orderSection) {

        orderSection.hidden = true;
    }


    /* Show success */

    const orderSuccess =
        $("#orderSuccess");

    if (orderSuccess) {

        orderSuccess.hidden = false;

        orderSuccess.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


/* =========================================================
   27. FORM SUBMISSION
========================================================= */

async function handleOrderSubmit(event) {

    event.preventDefault();


    /* Validate */

    if (!validateOrderForm()) {
        return;
    }


    const selectedPackage =
        getSelectedPackage();

    const quantity =
        getQuantity();


    if (!selectedPackage) {
        return;
    }


    const total =
        selectedPackage.price * quantity;


    /* Prevent accidental duplicate clicks */

    const submitButton =
        event.submitter ||
        $("#orderForm")?.querySelector(
            'button[type="submit"]'
        );

    if (
        submitButton &&
        submitButton.disabled
    ) {
        return;
    }


    /* Show loading */

    setSubmitButtonLoading(true);


    try {

        /* =================================================
           STEP 1 — SEND ORDER TO EMAILJS
        ================================================= */

        await sendOrderWithEmailJS();


        /* =================================================
           STEP 2 — TRACK SUCCESSFUL ORDER
           
           These events happen ONLY after EmailJS
           successfully accepts the order.
        ================================================= */

        trackLead();

        trackPurchase();

        trackTikTokPurchase();


        /* =================================================
           STEP 3 — SHOW SUCCESS SCREEN
        ================================================= */

        showOrderSuccess();


    } catch (error) {

        console.error(
            "Order submission failed:",
            error
        );


        /* IMPORTANT:
           No Purchase event is fired here.
        */

        showFormMessage(
            "We could not submit your order right now. Please check your internet connection and try again.",
            "error"
        );


    } finally {

        setSubmitButtonLoading(false);
    }
}


/* =========================================================
   28. NEW ORDER BUTTON
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


            /* Reset form */

            if (form) {
                form.reset();
            }


            /* Restore Regular package */

            const regularPackage =
                document.querySelector(
                    'input[name="package"][value="Regular"]'
                );

            if (regularPackage) {

                regularPackage.checked =
                    true;

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


            /* Show order form */

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
   29. PRODUCT GALLERY
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
   30. LIGHTBOX
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

        lightbox.hidden =
            false;

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

            lightbox.hidden =
                true;

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
   31. SMOOTH SCROLL
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
   32. IMAGE ERROR HANDLING
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
   33. CTA TRACKING
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
   34. INITIALISE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           EmailJS
        ================================================= */

        initialiseEmailJS();


        /* =================================================
           Package system
        ================================================= */

        setupPackageSelection();

        setupPackageCTAButtons();

        setupQuantity();

        updateOrderSummary();


        /* =================================================
           Order form
        ================================================= */

        const orderForm =
            $("#orderForm");

        if (orderForm) {

            orderForm.addEventListener(
                "submit",
                handleOrderSubmit
            );
        }


        /* =================================================
           New order
        ================================================= */

        setupNewOrderButton();


        /* =================================================
           Product gallery
        ================================================= */

        setupProductGallery();

        setupLightbox();


        /* =================================================
           Navigation
        ================================================= */

        setupSmoothScroll();

        setupCTATracking();


        /* =================================================
           Meta + TikTok Pixel
        ================================================= */

        trackViewContent();

        setupCheckoutTracking();


        /* =================================================
           Images
        ================================================= */

        setupImageFallback();


        console.log(
            "TPEG Kiddies Store — JavaScript loaded successfully."
        );

    }
);