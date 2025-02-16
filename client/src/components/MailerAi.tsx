/* eslint-disable prettier/prettier */
import { useState } from "react";
import { Button } from "@heroui/react";
import { Mail } from "lucide-react";

const MailerAI = () => {
  const [email, setEmail] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const sendEmail = async () => {
    if (!email || !context) {
      setError("Please enter both email and context.");

      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:5000/send_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient: email, context }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail("");
        setContext("");
      } else {
        setError(data.error || "Failed to send email.");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 w-full">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-2">
            <Mail className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Mailer AI</h2>
          </div>
          <p className="text-gray-500 mb-6">
            Send AI-powered emails quickly and efficiently
          </p>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4">
              Email sent successfully!
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="recipient-email"
              >
                Recipient Email
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                id="recipient-email"
                placeholder="recipient@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="email-content"
            >
              Email Content
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              id="email-content"
              placeholder="Enter your email content..."
              rows={4}
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={loading}
            onClick={sendEmail}
          >
            <span className="flex items-center justify-center">
              {loading && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
              )}
              {loading ? "Sending..." : "Send Email"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MailerAI;
