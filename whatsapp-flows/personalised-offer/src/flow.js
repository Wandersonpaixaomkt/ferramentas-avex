/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Licensed under the MIT license.
 *
 * Base adaptada do exemplo oficial WhatsApp/WhatsApp-Flows-Tools.
 */

const SCREEN_RESPONSES = {
  PRODUCT_SELECTOR: {
    screen: "PRODUCT_SELECTOR",
    data: {
      products: [
        { id: "0_mobile_phones", title: "Mobile phones" },
        { id: "1_ebook_readers", title: "eBook readers" },
        { id: "2_cameras", title: "Cameras" },
      ],
    },
  },
  OPTIONS: {
    screen: "OPTIONS",
    data: {
      selected_product: "phone",
      cta_label: "View phones",
      screen_heading: "Let's find the perfect phone offer for you",
      phone_use_case: false,
      preferred_brands: [
        { id: "0_TechWave", title: "TechWave" },
        { id: "1_Apex", title: "Apex" },
      ],
      phone_uses: [
        { id: "0_Social_networking", title: "Social networking" },
        { id: "1_Video_streaming", title: "Video streaming" },
        { id: "2_Gaming", title: "Gaming" },
        { id: "3_Productivity", title: "Productivity" },
        { id: "4_Work_communication", title: "Work communication" },
      ],
      preferred_budget: [
        { id: "0_100_250", title: "£100 - £250" },
        { id: "1_250_500", title: "£250 - £500" },
        { id: "2_500_1000", title: "£500 - £1000" },
        { id: "3_above_1000", title: "Above £1000" },
      ],
    },
  },
  OFFER: {
    screen: "OFFER",
    data: {
      selected_product: "phone",
      offer_label: "Here are 4 shortlisted phones",
      shortlisted_devices: [
        { id: "0_TechWave_TW14_Pro", title: "TechWave TW14 Pro" },
        { id: "1_Apex_Aura", title: "Apex Aura" },
        { id: "2_VirtuVision_VX2", title: "VirtuVision VX2" },
        { id: "3_Nova_N1", title: "Nova N1" },
      ],
    },
  },
  PRODUCT_DETAIL: {
    screen: "PRODUCT_DETAIL",
    data: {
      selected_device: "0_TechWave_TW14_Pro",
      image_src: "",
      product_name: "TechWave TW14 Pro",
      product_properties: "£500 · 6.2 inches · 128GB · 20 MP",
      detail_1: "Replace this text with the real product description.",
      detail_2: "Replace this text with commercial conditions and next steps.",
    },
  },
  SUCCESS: {
    screen: "SUCCESS",
    data: {
      extension_message_response: {
        params: {
          flow_token: "REPLACE_FLOW_TOKEN",
          selected_product: "REPLACE_SELECTED_PRODUCT",
        },
      },
    },
  },
};

export const getNextScreen = async (decryptedBody) => {
  const { screen, data, action, flow_token } = decryptedBody;

  if (action === "ping") {
    return { data: { status: "active" } };
  }

  if (data?.error) {
    console.warn("Received client error:", data);
    return { data: { acknowledged: true } };
  }

  if (action === "INIT") {
    return { ...SCREEN_RESPONSES.PRODUCT_SELECTOR };
  }

  if (action === "data_exchange") {
    switch (screen) {
      case "PRODUCT_SELECTOR": {
        const selected = data.product_selection || "0_mobile_phones";
        const productType = selected.split("_").slice(1).join(" ");
        return {
          ...SCREEN_RESPONSES.OPTIONS,
          data: {
            ...SCREEN_RESPONSES.OPTIONS.data,
            phone_use_case: selected === "0_mobile_phones",
            cta_label: `View ${productType}`,
            screen_heading: `Let's find the perfect ${productType} offer for you`,
            selected_product: productType,
          },
        };
      }

      case "OPTIONS":
        // TODO: substituir por regras reais de recomendação.
        return {
          ...SCREEN_RESPONSES.OFFER,
          data: {
            ...SCREEN_RESPONSES.OFFER.data,
            offer_label: `Here are shortlisted ${data.selected_product || "products"}`,
            selected_product: data.selected_product || "product",
          },
        };

      case "OFFER": {
        const selectedDevice = data.device;
        const device = SCREEN_RESPONSES.OFFER.data.shortlisted_devices.find(
          (item) => item.id === selectedDevice
        );
        return {
          ...SCREEN_RESPONSES.PRODUCT_DETAIL,
          data: {
            ...SCREEN_RESPONSES.PRODUCT_DETAIL.data,
            product_name: device?.title || "Selected product",
            selected_device: selectedDevice,
          },
        };
      }

      case "PRODUCT_DETAIL":
      case "SUMMARY":
        return {
          ...SCREEN_RESPONSES.SUCCESS,
          data: {
            extension_message_response: {
              params: {
                flow_token,
                selected_product:
                  data.selected_device || data.selected_product || "not_informed",
              },
            },
          },
        };

      default:
        break;
    }
  }

  console.error("Unhandled request body:", decryptedBody);
  throw new Error(
    "Unhandled endpoint request. Handle the received action and screen."
  );
};
