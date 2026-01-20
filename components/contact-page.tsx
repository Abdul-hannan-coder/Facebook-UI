'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Send, CheckCircle2, Loader2, X } from 'lucide-react';

const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const WEBHOOK_URL = 'https://n8n.engrsquad.com/webhook/8b719698-6d50-4946-8343-11858460d30d';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      });

      if (response.status === 200 || response.status === 201) {
        setShowSuccessDialog(true);
        reset();
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(
        'Failed to send your message. Please try again later or contact us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-6 shadow-lg shadow-purple-300/40">
              <Mail className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="text-gray-900">Get in</span>{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4 leading-relaxed">
              Have a question or want to work together? We'd love to hear from you.
              Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-gray-100 max-w-2xl mx-auto mb-12 sm:mb-16">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-7">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-base font-semibold text-gray-900">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full h-12 bg-gray-50 rounded-lg px-4 sm:px-5 py-3 placeholder-gray-500 text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 border border-gray-200 focus:border-purple-500 transition text-base"
                  {...register('name')}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-base font-semibold text-gray-900">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  className="w-full h-12 bg-gray-50 rounded-lg px-4 sm:px-5 py-3 placeholder-gray-500 text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 border border-gray-200 focus:border-purple-500 transition text-base"
                  {...register('email')}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label className="text-base font-semibold text-gray-900">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Tell us about your project, question, or how we can help..."
                  className="w-full min-h-32 max-h-96 bg-gray-50 rounded-lg px-4 sm:px-5 py-3 placeholder-gray-500 text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 border border-gray-200 focus:border-purple-500 transition text-base resize-y overflow-y-auto"
                  {...register('message')}
                  disabled={isSubmitting}
                />
                {errors.message && (
                  <p className="text-sm text-red-500">{errors.message.message}</p>
                )}
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600 font-medium">{submitError}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="w-full flex justify-center pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto min-w-40 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-purple-300/40 transition font-semibold text-base flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Additional Info Section */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-4 shadow-md">
                <Mail className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Quick Response</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We typically respond within 24 hours
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-4 shadow-md">
                <CheckCircle2 className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Secure & Private</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your information is kept confidential
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-4 shadow-md">
                <Send className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Easy Communication</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Simple and straightforward process
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl border border-gray-100">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowSuccessDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition"
                aria-label="Close dialog"
              >
                <X size={24} />
              </button>
            </div>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent Successfully!</h3>
              <p className="text-base text-gray-600 mb-6 leading-relaxed">
                Thank you for reaching out. We've received your message and will
                get back to you as soon as possible. We appreciate your patience!
              </p>
              <button
                onClick={() => setShowSuccessDialog(false)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-purple-300/40 transition font-semibold min-w-32"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

