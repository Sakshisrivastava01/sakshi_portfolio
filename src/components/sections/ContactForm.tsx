"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { Send, Loader2 } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

      if (!serviceId || !templateId || !publicKey) {
        console.error("EmailJS credentials are not configured in .env.local");
        toast.error("Failed to send message. EmailJS is not configured.");
        setIsSubmitting(false);
        return;
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: data.fullName,
          reply_to: data.email,
          subject: data.subject,
          message: data.message,
          to_email: "sakshisrivastava200306@gmail.com",
        },
        publicKey
      );

      toast.success("Message sent successfully. I'll get back to you soon!");
      reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
          Full Name
        </label>
        <input
          id="fullName"
          {...register("fullName")}
          disabled={isSubmitting}
          className={`w-full bg-black/40 border ${errors.fullName ? 'border-red-500' : 'border-white/10 focus:border-accent-pink'} rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors disabled:opacity-50`}
          placeholder="John Doe"
        />
        {errors.fullName && (
          <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          disabled={isSubmitting}
          className={`w-full bg-black/40 border ${errors.email ? 'border-red-500' : 'border-white/10 focus:border-accent-pink'} rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors disabled:opacity-50`}
          placeholder="john@example.com"
        />
        {errors.email && (
          <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
          Subject
        </label>
        <input
          id="subject"
          {...register("subject")}
          disabled={isSubmitting}
          className={`w-full bg-black/40 border ${errors.subject ? 'border-red-500' : 'border-white/10 focus:border-accent-pink'} rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors disabled:opacity-50`}
          placeholder="Portfolio Inquiry"
        />
        {errors.subject && (
          <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
          Message
        </label>
        <textarea
          id="message"
          {...register("message")}
          disabled={isSubmitting}
          rows={5}
          className={`w-full bg-black/40 border ${errors.message ? 'border-red-500' : 'border-white/10 focus:border-accent-pink'} rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors resize-none disabled:opacity-50`}
          placeholder="How can I help you?"
        />
        {errors.message && (
          <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-accent-pink hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,182,193,0.5)] disabled:opacity-70 disabled:hover:bg-white disabled:hover:text-black disabled:hover:shadow-none flex items-center justify-center space-x-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Send Message</span>
          </>
        )}
      </button>
    </form>
  );
}
