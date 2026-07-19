"use server";

import { createInquiry, inquiryTopics, type InquiryTopic } from "@/lib/nova-data";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

function text(formData: FormData, key: string, max: number) {
  return String(formData.get(key) ?? "").trim().slice(0, max);
}

export async function submitContactInquiry(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (text(formData, "website", 200)) {
    return {
      status: "success",
      message: "Thank you. Your message has been received.",
    };
  }

  const name = text(formData, "name", 100);
  const email = text(formData, "email", 254).toLowerCase();
  const organization = text(formData, "organization", 160);
  const topic = text(formData, "topic", 80) as InquiryTopic;
  const message = text(formData, "message", 4000);
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (
    name.length < 2 ||
    !emailIsValid ||
    !inquiryTopics.includes(topic) ||
    message.length < 20
  ) {
    return {
      status: "error",
      message:
        "Please provide your name, a valid email address, a topic, and a message of at least 20 characters.",
    };
  }

  try {
    await createInquiry({ topic, name, email, organization, message });
    return {
      status: "success",
      message:
        "Thank you. Your message is now with NOVA, and we will follow up using the email address you provided.",
    };
  } catch {
    return {
      status: "error",
      message:
        "The inquiry system is not available yet. Please try again after NOVA finishes connecting its secure data service.",
    };
  }
}
