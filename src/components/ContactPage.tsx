import { ArrowLeft, CheckCircle2, Mail, MapPin, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { submitContactInquiry } from '../services/careerApi.ts';
import type { PageView } from '../types/career.ts';

interface ContactPageProps {
  onNavigate: (page: PageView) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Student & Graduate Support');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setConfirmation(null);

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (message.trim().length < 10) {
      setError('Please write a message of at least 10 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await submitContactInquiry({
        name: name.trim(),
        email: email.trim(),
        topic,
        message: message.trim(),
      });
      setConfirmation(response.acknowledgement);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Unable to send your message right now.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-[#F3F1EB] text-[#14253D] py-12 sm:py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#14253D]/75 hover:text-[#14253D] transition-colors cursor-pointer mb-6"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Homepage</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-wider uppercase text-[#B89450]">
                Contact Us
              </p>
              <h1
                className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#14253D]"
                style={{ textWrap: 'balance' }}
              >
                Get in touch with The Graduate Advantage
              </h1>
              <p className="text-base text-[#14253D]/80 leading-relaxed">
                Have feedback on our career tools, questions about university
                partnerships, or suggestions for future graduate resources? Send us a
                note below.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#14253D]/12 p-6 space-y-5">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#B89450] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-[#14253D]">General Inquiries</p>
                  <p className="text-sm text-[#14253D]/75">
                    hello@thegraduateadvantage.org
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-4 border-t border-[#14253D]/10">
                <MapPin className="w-5 h-5 text-[#B89450] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-[#14253D]">
                    University &amp; Careers Teams
                  </p>
                  <p className="text-sm text-[#14253D]/75">
                    Supporting students, recent graduates, and early-career advisors
                    across campus workshops and digital preparation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-xl border border-[#14253D]/12 p-6 sm:p-8 shadow-[0_1px_3px_rgba(20,37,61,0.04)]">
            <h2 className="font-display text-2xl font-semibold text-[#14253D] mb-6">
              Send an inquiry
            </h2>

            {error && (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {error}
              </div>
            )}

            {confirmation && (
              <div
                role="status"
                className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 flex items-start gap-2.5"
              >
                <CheckCircle2
                  className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{confirmation}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-[#14253D] mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Taylor"
                    className="w-full rounded-md border border-[#14253D]/20 bg-white px-3.5 py-2.5 text-sm text-[#14253D] placeholder:text-[#14253D]/40 focus:border-[#B89450] focus:outline-none focus:ring-2 focus:ring-[#B89450]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-[#14253D] mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu"
                    className="w-full rounded-md border border-[#14253D]/20 bg-white px-3.5 py-2.5 text-sm text-[#14253D] placeholder:text-[#14253D]/40 focus:border-[#B89450] focus:outline-none focus:ring-2 focus:ring-[#B89450]/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-topic"
                  className="block text-sm font-medium text-[#14253D] mb-1.5"
                >
                  Topic
                </label>
                <select
                  id="contact-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-md border border-[#14253D]/20 bg-white px-3.5 py-2.5 text-sm text-[#14253D] focus:border-[#B89450] focus:outline-none focus:ring-2 focus:ring-[#B89450]/20"
                >
                  <option value="Student & Graduate Support">
                    Student &amp; Graduate Support
                  </option>
                  <option value="University Career Service Partnership">
                    University Career Service Partnership
                  </option>
                  <option value="Tool Feedback & Suggestions">
                    Tool Feedback &amp; Suggestions
                  </option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-[#14253D] mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your question or feedback..."
                  className="w-full rounded-md border border-[#14253D]/20 bg-white px-3.5 py-2.5 text-sm text-[#14253D] placeholder:text-[#14253D]/40 focus:border-[#B89450] focus:outline-none focus:ring-2 focus:ring-[#B89450]/20"
                />
              </div>

              <div className="flex items-center justify-end pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#14253D] text-white text-sm font-medium hover:bg-[#1C3352] disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Send className="w-4 h-4 text-[#DFCCA6]" aria-hidden="true" />
                  <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
