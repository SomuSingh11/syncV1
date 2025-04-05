import React from "react";

export default function ContactPage() {
  return (
    <div className="p-6">
      <div className="bg-gradient-to-br from-slate-100 via-slate-50 to-white p-8 rounded-3xl shadow-sm max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Contact Us</h1>
        <p className="text-slate-600 mb-8">
          Have questions? We&apos;d love to hear from you. Send us a message and
          we&apos;ll respond as soon as possible.
        </p>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                className="w-full bg-white/70 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-green-500 transition-colors"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                className="w-full bg-white/70 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-green-500 transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-white/70 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-green-500 transition-colors"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Department
            </label>
            <select className="w-full bg-white/70 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-green-500 transition-colors">
              <option value="">Select a department</option>
              <option value="support">Technical Support</option>
              <option value="sales">Sales</option>
              <option value="general">General Inquiry</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Message
            </label>
            <textarea
              rows={4}
              className="w-full bg-white/70 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-green-500 transition-colors"
              placeholder="How can we help you?"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-8 py-2.5 rounded-xl hover:bg-green-700 transition-colors"
            >
              Send Message
            </button>
            <button
              type="reset"
              className="px-8 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
            >
              Clear
            </button>
          </div>
        </form>

        <div className="mt-12 grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-medium">Email</h3>
            <p className="text-slate-600 text-sm mt-1">support@synccity.com</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <h3 className="font-medium">Phone</h3>
            <p className="text-slate-600 text-sm mt-1">+1 (555) 123-4567</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="font-medium">Location</h3>
            <p className="text-slate-600 text-sm mt-1">
              123 Business Ave, Suite 100
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
